import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeTimeline } from './practice-timeline';

describe('PracticeTimeline', () => {
  let component: PracticeTimeline;
  let fixture: ComponentFixture<PracticeTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
