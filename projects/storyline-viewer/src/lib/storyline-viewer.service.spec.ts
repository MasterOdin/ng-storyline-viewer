import { TestBed } from '@angular/core/testing';

import { StorylineViewerService } from './storyline-viewer.service';

describe('StorylineViewerService', () => {
  let service: StorylineViewerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorylineViewerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
