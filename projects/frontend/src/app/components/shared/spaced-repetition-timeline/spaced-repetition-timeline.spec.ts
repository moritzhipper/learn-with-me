import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacedRepetitionTimeline } from './spaced-repetition-timeline';

describe('SpacedRepetitionTimeline', () => {
  let component: SpacedRepetitionTimeline;
  let fixture: ComponentFixture<SpacedRepetitionTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpacedRepetitionTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpacedRepetitionTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
