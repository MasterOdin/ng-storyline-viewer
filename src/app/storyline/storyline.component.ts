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
      this.storylineService.getStorylines(
        +params.get('storylineId'),
        1
      ).subscribe(storylines => {
        this.storyline = storylines[0];
      });
    });
  }

  back() {
    this.location.back();
  }
}