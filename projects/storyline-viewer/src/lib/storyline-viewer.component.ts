import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { StorylineViewerService } from './storyline-viewer.service';
import { Storyline, Article, StorylineTableElement, View, filterArticleCount } from './types';
import { MatTabGroup} from '@angular/material/tabs';
import { MatSelectionListChange } from '@angular/material/list';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DriversSheet } from './drivers-sheet.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

export interface FilterScrollStatus {
    offset: number;
    total: number;
    subject: BehaviorSubject<string[]>;
    pipeline$: Observable<string[]>;
    basis: string[];
}

@Component({
  selector: 'ngx-storyline-viewer',
  templateUrl: './storyline-viewer.component.html',
  styleUrls: ['./storyline-viewer.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StorylineViewerComponent implements OnInit, AfterViewInit {

  _LABEL_ALL_STORYLINES = "All storylines";
  _BATCH_SIZE = 100;
  /** Array of view keys to ensure the same order of keys. */
  _viewKeys: string[] = [];
  _hasFirstStorylines = false;
  _loadingStorylines = false;
  _allSelected = true;
  _componentsLoaded = false;
  expandedElement: StorylineTableElement;
  expandedDataSource: MatTableDataSource<Article>;
  
  displayedColumns: string[] = ['count', 'concepts', 'drivers', 'articles'];

  filters: View = {
    people: new Set<string>(),
    companies: new Set<string>(),
    organizations: new Set<string>(),
    categories: new Set<string>()
  };

  filterOptions: {[key: string]: FilterScrollStatus};

  storylines: StorylineTableElement[] = [];
  @ViewChild('storyViews') storyViews: MatTabGroup;
  @ViewChild('storylinesTable') storylinesTable: MatTable<StorylineTableElement>;
  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

  storylinesDataSource = new MatTableDataSource();

  articles: Article[] = [];

  @Input() serviceUrl: string;
  @Input() count = 10;
  @Input() currentView = 'all';
  @Input() views: {[key: string]: View} = {};

  @Output() viewEvent: EventEmitter<{currentView: string, views: {[key: string]: View}}> = new EventEmitter();
  @Output() driverEvent: EventEmitter<string> = new EventEmitter();

  constructor(private storylineViewerService: StorylineViewerService, private _bottomSheet: MatBottomSheet) {
  }

  onSelectView(evidx: number) {
    this.expandedElement = undefined;
    if(evidx === 0) {
      // this is the 'all storylines view'
      this._allSelected = true;
      this.currentView = 'all';
      this.storylinesDataSource.filter = '';
    } else if(evidx == (this.storyViews._allTabs.length - 1)) {
      this._allSelected = false;
      // this is the 'add view'
      this.addView();
      // set a timeout to flip to this view from the add
      setTimeout(() => { this.storyViews.selectedIndex = this.storyViews._allTabs.length - 2; }, 1000)
    } else {
      // this is a custom view
      this._allSelected = false;
      const label = this.storyViews._allTabs.toArray()[evidx].textLabel;
      this.currentView = label;
      this.storylinesDataSource.filter = JSON.stringify(this.views[this.currentView] || {});
    }
    this.dispatchViewEvent();
  }

  onChangeSelection(filter: string, event: MatSelectionListChange) {
    if (event.option.selected) {
      this.views[this.currentView][filter].add(event.option.value);
    }
    else {
      this.views[this.currentView][filter].delete(event.option.value);
    }
    this.storylinesDataSource.filter = JSON.stringify(this.views[this.currentView]);
    this.dispatchViewEvent();    
  }

  initializeOrUpdateFilterOptions() {
    if(!this.filterOptions) { this.filterOptions = {}; }
    for(const k in this.filters) {
      const crset = this.sortSet(this.filters[k]);
      const bsubj = new BehaviorSubject<string[]>([]); 
      if(!(k in this.filterOptions) || ((k in this.filterOptions) && (this.filterOptions[k].total != crset.length))) {
        this.filterOptions[k] = {
          offset: 0,
          total: crset.length,
          basis: crset,
          subject: bsubj,
          pipeline$: bsubj.asObservable().pipe(scan((acc, curr) => [...acc, ...curr], []))
        };
        this.getNextBatch(k);
      }
    }
  }

  resetFilterOptions(filter: string) {
    const crset = this.sortSet(this.filters[filter]);
    const bsubj = new BehaviorSubject<string[]>([]); 
    this.filterOptions[filter] = {
      offset: 0,
      total: crset.length,
      basis: crset,
      subject: bsubj,
      pipeline$: bsubj.asObservable().pipe(scan((acc, curr) => [...acc, ...curr], []))
    };
    this.getNextBatch(filter);
  }

  resetAllFilters() {
    this.filterOptions = undefined;
    this.initializeOrUpdateFilterOptions();
  }

  getNextBatch(filter) {
    if(!(filter in this.filterOptions)) { return; }
    const batchSize = Math.min(this._BATCH_SIZE, this.filterOptions[filter].total - this.filterOptions[filter].offset);
    const results = this.filterOptions[filter].basis.slice(this.filterOptions[filter].offset, this.filterOptions[filter].offset + batchSize);
    this.filterOptions[filter].subject.next(results);
    this.filterOptions[filter].offset += batchSize;
  }

  ngOnInit() {
    this.storylineViewerService.url = this.serviceUrl;
    for (const key in this.views) {
      this._viewKeys.push(key);
      for (const filter in this.filters) {
        if (Array.isArray(this.views[key][filter])) {
          this.views[key][filter] = new Set(this.views[key][filter]);
        }
        else if (!this.views[key][filter]) {
          this.views[key][filter] = new Set();
        }
        this.filters[filter] = new Set([...this.filters[filter], ...this.views[key][filter]]);
      }
    }
    this.resetAllFilters();

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

  ngAfterViewInit() {
    this._componentsLoaded = true;
    this.storyViews.selectedIndex = 0;
  }

  getStorylines() {
    this._loadingStorylines = true;
    this.storylineViewerService.getStorylines(
      this.storylines.length,
      this.count
    ).subscribe((storylines: Storyline[]) => {
      for (let storyline of storylines) {
        const concepts: {[key: string]: number} = {};
        const drivers: {[key: string]: number} = {};
        let lastUpdate = new Date(1950, 1, 1);
        for (let article of storyline.articles) {
          for (let filter in this.filters) {
            for (let concept of article[(filter === 'people') ? 'persons' : filter]) {
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
          const crdate = new Date(article.date);
          if(lastUpdate.getTime() < crdate.getTime()) {
            lastUpdate = crdate;
          }
        }

        this.initializeOrUpdateFilterOptions();

        this.storylines.push({
          position: this.storylines.length,
          articles: storyline.articles,
          concepts: this.flattenObjectCount(concepts),
          drivers: this.flattenObjectCount(drivers),
          update: lastUpdate
        });
      }
      this.storylinesDataSource.data = this.storylines;
      if (this.storylinesTable) {
        this.storylinesTable.renderRows();
      }

      this._hasFirstStorylines = true;
      this._loadingStorylines = false;
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

  sortSet(set: Set<string>) {
    return Array.from(set).sort();
  }

  getObjectKeys(obj: object) {
    return Object.keys(obj);
  }

  addView() {
    let found = false;
    let idx = 1;
    while(!found) {
      if(!(('View ' + idx) in this.views)) { found = true; }
      else { idx++; }
    }
    const viewName = 'View ' + idx;
    this.currentView = viewName;
    this.views[viewName] = {
      people: new Set(),
      companies: new Set(),
      organizations: new Set(),
      categories: new Set()
    };
    this.dispatchViewEvent();
  }

  setExpandedElement(elem: StorylineTableElement, idx: number) {
    if(this.expandedElement === elem) {
      this.expandedElement = undefined;
    } else { this.expandedElement = elem; }
  }

  dispatchViewEvent() {
    this.viewEvent.emit({
      views: this.views,
      currentView: this.currentView
    });
  }

  selectAll(category: string) {
    for (let concept of this.filters[category]) {
      this.views[this.currentView][category].add(concept);
    }
    this.storylinesDataSource.filter = JSON.stringify(this.views[this.currentView]);
    this.dispatchViewEvent();
  }

  driverSelect(driver: string) {
    this.driverEvent.emit(driver);
  }

  getFilteredArticleCount(data: StorylineTableElement) {
    return (this.currentView === 'all') ? data.articles.length : filterArticleCount(data, this.views[this.currentView]);
  }

  showMore(drivers) {
    const bsref = this._bottomSheet.open(DriversSheet, {data: drivers});
    const devent = this.driverEvent;
    bsref.afterDismissed().subscribe(result => {
      if(result) {
        devent.emit(result);
      }
    });
  }

  renameView() {
    const ret = window.prompt('What would you like to call this view?', this.currentView);
    if(ret) {
      this.views[ret] = this.views[this.currentView];
      delete this.views[this.currentView];
      const idx = this._viewKeys.indexOf(this.currentView);
      if(idx >= 0) {
        this._viewKeys.splice(idx, 1, ret);
      }
      this.currentView = ret;
      this.dispatchViewEvent();
    }
  }

  deleteView() {
    if(window.confirm('Are you certain you want to delete this view? This operation cannot be undone.')) {
      // delete current view
      delete this.views[this.currentView];
      this.currentView = 'all';
      this.storyViews.selectedIndex = 0;
      this.dispatchViewEvent();
    }
  }

  currentViewHasFilter(filter: string): boolean {
    if(this.views[this.currentView]) {
      return Array.from(this.views[this.currentView][filter]).length > 0;
    } else { return false; }
  }

  currentViewFilterDescription(filter: string): string {
    if(this.views[this.currentView]) {
      return Array.from(this.views[this.currentView][filter]).join(', ');
    } else { return ''; }
  }
}
