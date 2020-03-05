import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { StorylinesService } from '../storylines.service';
import { Storyline } from '../types';

@Component({
  selector: 'app-storyline',
  templateUrl: './storyline.component.html',
  styleUrls: ['./storyline.component.css']
})
export class StorylineComponent implements OnInit {
  storyline: Storyline;
  
  constructor(
    private storylineService: StorylinesService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.storylineService.getStoryline(
        +params.get('storylineId')
      ).subscribe(storyline => {
        this.storyline = storyline || {articles: []}
      });
    });
  }

  back() {
    this.location.back();
  }
}