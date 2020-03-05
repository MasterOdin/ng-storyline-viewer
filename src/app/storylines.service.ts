import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Storyline } from './types';
import sample_data_small from '../assets/sample_data_small';

@Injectable()
export class StorylinesService {
  haveLoaded = 0;
  count = 5;
  loadedStorylines: Storyline[] = [];

  constructor() {
  }

  getLoadedStorylines(): Observable<Storyline[]> {
    if (this.haveLoaded === 0) {
      return this.getMoreStorylines();
    }
    return of(this.loadedStorylines);
  }

  getMoreStorylines(): Observable<Storyline[]> {
    const storylines = sample_data_small.slice(
        this.haveLoaded,
        this.haveLoaded + this.count
    );
    this.loadedStorylines.push(
      ...storylines
    );
    this.haveLoaded += this.count;

    return of(storylines);
  }

  getStoryline(num: number): Observable<Storyline> {
    if (!this.loadedStorylines[num]) {
      of(sample_data_small.slice(num, num + 1));
    }
    return of(this.loadedStorylines[num]);
  }
}