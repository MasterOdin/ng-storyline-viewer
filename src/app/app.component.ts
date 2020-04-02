import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { StorylinesService } from './storylines.service';
import { Storyline, Article, Concept, Filter } from './types';

export interface StorylineTableElement {
  position: number;
  articles: Article[],
  concepts: string[],
  drivers: string[]
}

export interface View {
  persons: Set<string>;
  companies: Set<string>;
  organizations: Set<string>;
  locations: Set<string>;
}

@Component({
  selector: 'ng-storyline-viewer',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class StorylineViewerComponent implements OnInit {
  displayedColumns: string[] = ['count', 'concepts', 'drivers', 'articles'];

  storylinesFilter: Filter = {
    persons: new Set<string>(),
    companies: new Set<string>(),
    organizations: new Set<string>(),
    locations: new Set<string>()
  };

  storylines: StorylineTableElement[] = [];
  @ViewChild('storylinesTable') storylinesTable: MatTable<StorylineTableElement>;
  @ViewChild('storylines') storylinesElem: ElementRef;

  storylinesDataSource = new MatTableDataSource();

  displayedStorylineColumns: string[] = ['title', 'desc'];
  articles: Article[] = [];
  @ViewChild('storylineArticles') storylineArticlesElem: ElementRef;

  @ViewChild('views') viewElem: ElementRef;
  @ViewChild('filters') filtersElem: ElementRef;

  createdViews: {[key: string]: View} = {
  };

  currentView = 'all';

  //displayedColumns: ['count'];

  constructor(
    private storylinesService: StorylinesService,
    private element: ElementRef
  ) {
  }

  ngOnInit() {
    this.storylinesDataSource.filterPredicate = ((data: StorylineTableElement, filter): boolean => {
      if (this.currentView === 'all') {
        return true;
      }

      if (
        this.createdViews[this.currentView].persons.size === 0
        && this.createdViews[this.currentView].companies.size === 0
        && this.createdViews[this.currentView].organizations.size === 0
      ) {
        return true;
      }
      for (let concept of data.concepts) {
        for (let type of ['persons', 'companies', 'organizations']) {
          if (this.createdViews[this.currentView][type].has(concept)) {
            return true;
          }
        }
      }

      return false;
    });

    this.getStorylines('getLoadedStorylines');
  }

  getStorylines(method: string) {
    this.storylinesService[method]().subscribe((storylines: Storyline[]) => {
      for (let storyline of storylines) {
        const concepts: {[key: string]: number} = {};
        const drivers: {[key: string]: number} = {};
        for (let article of storyline.articles) {
          for (let key of ['companies', 'persons', 'organizations', 'locations']) {
            for (let concept of article[key]) {
              if (!concepts[concept.name]) {
                concepts[concept.name] = 0;
              }
              concepts[concept.name] += concepts.count;
              this.storylinesFilter[key].add(concept.name);
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
    }).unsubscribe();
  }

  flattenObjectCount(object: {[key: string]: number}): string[] {
    return Object.entries(object).sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      else if (a[1] < b[1]) {
        return 1;
      }
      else {
        return 0;
      }
    }).map(val => val[0])
  }

  onScroll() {
    this.getStorylines('getMoreStorylines');
  }

  openStoryline(position: number) {
    this.storylinesService.getStoryline(position).subscribe((storyline: Storyline) => {
      this.articles = storyline.articles;
      this.storylinesElem.nativeElement.style.display = 'none';
      this.storylineArticlesElem.nativeElement.style.display = 'block';
    });
  }

  closeStoryline() {
    this.articles = [];
    this.storylinesElem.nativeElement.style.display = 'block';
    this.storylineArticlesElem.nativeElement.style.display = 'none';
  }

  sortSet(set: Set<string>) {
    return Array.from(set).sort();
  }

  applyFilter(event: InputEvent, type: string, value: string) {
    if ((event.target as HTMLInputElement).checked) {
      this.createdViews[this.currentView][type].add(value);
    }
    else {
      this.createdViews[this.currentView][type].delete(value);
    }
    this.storylinesDataSource.filter = JSON.stringify(this.createdViews[this.currentView]);
    this.dispatchViewEvent();
  }

  addView() {
    const viewName = `View ${this.viewElem.nativeElement.children.length - 1}`;
    this.currentView = viewName;
    this.createdViews[viewName] = {
      persons: new Set(),
      companies: new Set(),
      organizations: new Set(),
      locations: new Set()
    };
    this.selectView(null, this.currentView);
    this.dispatchViewEvent();
  }

  selectView(event: MouseEvent | null, view: string) {
    this.currentView = view;
    this.filtersElem.nativeElement.style.display = (this.currentView !== 'all') ? 'flex' : 'none';
    this.storylinesDataSource.filter = JSON.stringify(this.createdViews[this.currentView] || {});
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
        filters: this.createdViews,
        currentView: this.currentView
      }
    }));
  }

  selectAll(category: string) {
    for (let concept of this.storylinesFilter[category]) {
      this.createdViews[this.currentView][category].add(concept);
    }
    this.storylinesDataSource.filter = JSON.stringify(this.createdViews[this.currentView]);
    this.dispatchViewEvent();
  }
}
