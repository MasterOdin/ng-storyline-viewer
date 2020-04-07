import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorylineViewerComponent } from './storyline-viewer.component';

describe('StorylineViewerComponent', () => {
  let component: StorylineViewerComponent;
  let fixture: ComponentFixture<StorylineViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorylineViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorylineViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
