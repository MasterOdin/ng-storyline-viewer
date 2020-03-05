import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Storyline } from './types';
import sample_data_small from '../assets/sample_data_small';

@Injectable()
export class StorylinesService {

  constructor() {
  }

  getStorylines(start: number, count: number): Observable<Storyline[]> {
    console.log(start);
    console.log(start + count);
    return of(sample_data_small.slice(start, start + count));
  }
}