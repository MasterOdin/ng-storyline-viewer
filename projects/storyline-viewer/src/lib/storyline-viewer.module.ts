import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StorylineViewerComponent } from './storyline-viewer.component';


import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { StorylineViewerService } from './storyline-viewer.service';
import { StorylineDetailComponent } from './storyline-detail.component';
import { SanitizeAbstractPipe } from './sanitize-abstract.pipe';
import { RemainingConceptsPipe } from './remaining-concepts.pipe';
import { DriversSheet } from './drivers-sheet.component';

@NgModule({
  declarations: [
    SanitizeAbstractPipe,
    RemainingConceptsPipe,
    DriversSheet,
    StorylineViewerComponent,
    StorylineDetailComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    MatGridListModule,
    MatListModule,
    MatDividerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatCardModule,
    MatButtonModule,
    BrowserModule,
    BrowserAnimationsModule,
    InfiniteScrollModule
  ],
  exports: [
    StorylineViewerComponent
  ],
  providers: [
    StorylineViewerService
  ],
  entryComponents: [ DriversSheet ]
})
export class StorylineViewerModule { }
