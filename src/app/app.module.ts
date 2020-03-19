import { NgModule } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Router, Event, Scroll } from '@angular/router';

import { filter } from 'rxjs/operators';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { StorylinesService } from './storylines.service';
import { RequestCacheService } from './request-cache.service';
import { CachingInterceptor } from './caching-interceptor';

import { StorylineListComponent } from './storyline-list/storyline-list.component';
import { StorylineComponent } from './storyline/storyline.component';

@NgModule({
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    RouterModule.forRoot([
      {
        path: '',
        component: StorylineListComponent
      },
      {
        path: 'storyline/:storylineId',
        component: StorylineComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    StorylineListComponent,
    StorylineComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    StorylinesService,
    RequestCacheService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CachingInterceptor,
      multi: true
    }
  ]
})

export class AppModule {
    constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(
      filter((e: Event): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        viewportScroller.scrollToPosition(e.position);
      }
      else if (e.anchor) {
        viewportScroller.scrollToAnchor(e.anchor);
      }
      else {
        viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
