import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { StorylineViewerComponent } from './app.component';
import { StorylinesService } from './storylines.service';
import { RequestCacheService } from './request-cache.service';
import { CachingInterceptor } from './caching-interceptor';

@NgModule({
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    MatTableModule,
    MatChipsModule
  ],
  declarations: [
    StorylineViewerComponent
  ],
  bootstrap: [
    StorylineViewerComponent
  ],
  providers: [
    StorylinesService,
    RequestCacheService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    },
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ]
})
export class AppModule {
}
