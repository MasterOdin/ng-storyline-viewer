import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { StorylineViewerService } from './storyline-viewer.service';
import { Storyline, Article, StorylineTableElement, View } from './types';

@Component({
  selector: 'ngx-storyline-viewer',
  templateUrl: './storyline-viewer.component.html',
  styleUrls: ['./storyline-viewer.component.css'],
})
export class StorylineViewerComponent implements OnInit {
  displayedColumns: string[] = ['count', 'concepts', 'drivers', 'articles'];

  filters: View = {
    people: new Set<string>(),
    companies: new Set<string>(),
    organizations: new Set<string>()
  };

  storylines: StorylineTableElement[] = [];
  @ViewChild('storylinesTable') storylinesTable: MatTable<StorylineTableElement>;
  @ViewChild('storylines') storylinesElem: ElementRef;

  storylinesDataSource = new MatTableDataSource();

  displayedStorylineColumns: string[] = ['title', 'desc'];
  articles: Article[] = [];
  @ViewChild('storylineArticles') storylineArticlesElem: ElementRef;

  @ViewChild('viewsElem') viewElem: ElementRef;
  @ViewChild('filtersElem') filtersElem: ElementRef;

  @Input() currentView = 'all';

  @Input() serviceUrl: string;

  @Input() count = 10;

  @Input() views: {[key: string]: View} = {};

  constructor(
    private storylineViewerService: StorylineViewerService,
    private element: ElementRef
  ) {
  }

  ngOnInit() {
    this.storylineViewerService.url = this.serviceUrl;
    this.storylinesDataSource.filterPredicate = ((data: StorylineTableElement, filter): boolean => {
      if (this.currentView === 'all') {
        return true;
      }

      if (
        this.views[this.currentView].people.size === 0
        && this.views[this.currentView].companies.size === 0
        && this.views[this.currentView].organizations.size === 0
      ) {
        return true;
      }
      for (let concept of data.concepts) {
        for (let filter in this.filters) {
          if (this.views[this.currentView][filter].has(concept)) {
            return true;
          }
        }
      }

      return false;
    });

    this.getStorylines();
  }

  getStorylines() {
    this.storylineViewerService.getStorylines(
      this.storylines.length,
      this.count
    ).subscribe((storylines: Storyline[]) => {
      for (let storyline of storylines) {
        const concepts: {[key: string]: number} = {};
        const drivers: {[key: string]: number} = {};
        for (let article of storyline.articles) {
          for (let filter in this.filters) {
            for (let concept of article[filter === 'people' ? 'persons' : filter]) {
              if (!concepts[concept.name]) {
                concepts[concept.name] = 0;
              }
              concepts[concept.name] += concepts.count;
              this.filters[filter].add(concept.name);
            }
          }
          for (let driver of article.drivers) {
            if (!drivers[driver]) {
              drivers[driver] = 0;
            }
            drivers[driver]++;
          }
        }

        this.storylines.push({
          position: this.storylines.length,
          articles: storyline.articles,
          concepts: this.flattenObjectCount(concepts),
          drivers: this.flattenObjectCount(drivers)
        });
      }
      this.storylinesDataSource.data = this.storylines;
      if (this.storylinesTable) {
        this.storylinesTable.renderRows();
      }
    });
  }

  flattenObjectCount(obj: {[key: string]: number}): string[] {
    return Object.keys(obj).map((key: string) => [key, obj[key]]).sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      else if (a[1] < b[1]) {
        return 1;
      }
      else {
        return 0;
      }
    }).map((val: [string, number]) => val[0]);
  }

  onScroll() {
    this.getStorylines();
  }

  openStoryline(position: number) {
    this.storylineViewerService.getStoryline(position).subscribe((storyline: Storyline) => {
      this.articles = storyline.articles;
      //this.storylinesElem.nativeElement.style.display = 'none';
      this.storylineArticlesElem.nativeElement.style.display = 'block';
      //this.storylinesElem.nativeElement.style.overflowY = 'hidden';
    });
  }

  closeStoryline() {
    this.articles = [];
    //this.storylinesElem.nativeElement.style.display = 'block';
    //this.storylinesElem.nativeElement.style.overflowY = '';
    this.storylineArticlesElem.nativeElement.style.display = 'none';
  }

  sortSet(set: Set<string>) {
    return Array.from(set).sort();
  }

  getObjectKeys(obj: object) {
    return Object.keys(obj);
  }

  applyFilter(event: InputEvent, type: string, value: string) {
    if ((event.target as HTMLInputElement).checked) {
      this.views[this.currentView][type].add(value);
    }
    else {
      this.views[this.currentView][type].delete(value);
    }
    this.storylinesDataSource.filter = JSON.stringify(this.views[this.currentView]);
    this.dispatchViewEvent();
  }

  addView() {
    const viewName = `View ${this.viewElem.nativeElement.children.length - 1}`;
    this.currentView = viewName;
    this.views[viewName] = {
      people: new Set(),
      companies: new Set(),
      organizations: new Set()
    };
    this.selectView(null, this.currentView);
    this.dispatchViewEvent();
  }

  selectView(event: MouseEvent | null, view: string) {
    this.currentView = view;
    this.filtersElem.nativeElement.style.display = (this.currentView !== 'all') ? 'flex' : 'none';
    this.storylinesDataSource.filter = JSON.stringify(this.views[this.currentView] || {});
    if (document.querySelector('.view-selected')) {
      document.querySelector('.view-selected').classList.remove('view-selected');
    }
    if (event) {
      (event.target as Element).classList.add('view-selected');
      this.dispatchViewEvent();
    }
  }

  dispatchViewEvent() {
    this.element.nativeElement.dispatchEvent(new CustomEvent('storyline-views', {
      detail: {
        views: this.views,
        currentView: this.currentView
      }
    }));
  }

  selectAll(category: string) {
    for (let concept of this.filters[category]) {
      this.views[this.currentView][category].add(concept);
    }
    this.storylinesDataSource.filter = JSON.stringify(this.views[this.currentView]);
    this.dispatchViewEvent();
  }

  driverSelect(driver: string) {
    this.element.nativeElement.dispatchEvent(new CustomEvent('storyline-driver', {
      detail: {
        driver
      }
    }));
  }
}
