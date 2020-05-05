import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Article, View } from './types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { filterArticles } from './types';
import * as _ from 'lodash';

@Component({
    selector: 'ngx-storyline-detail',
    templateUrl: './storyline-detail.component.html',
    styleUrls: ['./storyline-detail.component.css']
})
export class StorylineDetailComponent implements AfterViewInit {

    displayedStorylineColumns: string[] = ['title', 'date', 'desc'];
    detailDatasource: MatTableDataSource<Article>;
    @Input() articles: Article[];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    _view: View;

    @Input()
    set filter(x: View) {
        this._view = x;
        this.applyCurrentFilter();
    }

    applyCurrentFilter() {
        this.detailDatasource = new MatTableDataSource<Article>(_.isNil(this._view) ? this.articles : filterArticles(this.articles, this._view));
        if(this.paginator) {
            this.paginator.pageIndex = 0;
            this.detailDatasource.paginator = this.paginator;
        }
    }

    ngAfterViewInit() {
        this.applyCurrentFilter();
    }
}