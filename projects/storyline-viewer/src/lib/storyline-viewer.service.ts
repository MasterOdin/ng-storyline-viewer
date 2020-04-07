import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Article, Storyline, Storylines } from './types';

@Injectable()
export class StorylineViewerService {
  url: string;

  constructor(
    private http: HttpClient
  ) {
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getStorylines(start: number, count: number): Observable<Storyline[]> {
    // console.log(`Getting storylines (${start}, ${count}) from ${this.url}`);
    return this.http.get<Storylines>(this.url, {
      params: {
        start: start.toString(),
        count: count.toString()
      }
    }).pipe(
      // tap(console.log),
      catchError(this.handleError),
      map((res) => {
        const storylines: Storyline[] = [];
        for (const shortCluster of res.shortClusters) {
          const articles: Article[] = [];
          for (const id of shortCluster) {
            for (const article of res.articles) {
              if (id === article.id) {
                articles.push(article);
                break;
              }
            }
          }
          storylines.push({
            articles,
            shortCluster
          });
        }
        return storylines;
      })
    );
  }

  getStoryline(start: number): Observable<Storyline> {
    return this.getStorylines(start, 1).pipe(
      map((res) => {
        return res[0];
      })
    );
  }
}
