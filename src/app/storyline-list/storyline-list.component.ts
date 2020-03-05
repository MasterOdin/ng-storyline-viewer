import { Component, OnInit } from '@angular/core';
import { StorylinesService } from '../storylines.service';
import { Storyline, Article, Concept } from '../types';

@Component({
  selector: 'app-storyline-list',
  templateUrl: './storyline-list.component.html',
  styleUrls: ['./storyline-list.component.css']
})
export class StorylineListComponent implements OnInit {
  start = 0;
  count = 5;

  storylines: {articles: Article[], concepts: Concept[]}[] = [];

  constructor(
    private storylinesService: StorylinesService
  ) {}

  ngOnInit() {
    this.start = 0;
    this.getStorylines();
  }

  getStorylines() {
    this.storylinesService.getStorylines(
      this.start,
      this.count
    ).subscribe((storylines: Storyline[]) => {
      for (let storyline of storylines) {
        const concepts: {[key: string]: number} = {};
        for (let article of storyline.articles) {
          for (let key of ['companies', 'persons', 'organizations', 'locations'])
          for (let concept of article[key]) {
            if (!concepts[concept.name]) {
              concepts[concept.name] = 0;
            }
            concepts[concept.name] += concepts.count;
          }
        }
        
        this.storylines.push({
          articles: storyline.articles,
          concepts: Object.entries(concepts).sort((a, b) => {
            if (a[1] > b[1]) {
              return -1;
            }
            else if (a[1] < b[1]) {
              return 1;
            }
            else {
              return 0;
            }
          }).map(val => val[0]).slice(0, 5)
        });
      }
    }).unsubscribe();
    this.start += this.count;
  }
  
  onScroll() {
    this.getStorylines();
  }
}