import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StorylineViewerComponent } from './storyline-viewer.component';


import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StorylineViewerService } from './storyline-viewer.service';

@NgModule({
  declarations: [
    StorylineViewerComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatChipsModule,
    InfiniteScrollModule
  ],
  exports: [
    StorylineViewerComponent
  ],
  providers: [
    StorylineViewerService
  ]
})
export class StorylineViewerModule { }
