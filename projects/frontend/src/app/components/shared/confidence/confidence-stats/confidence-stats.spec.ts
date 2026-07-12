import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfidenceStats } from './confidence-stats';

describe('ConfidenceStats', () => {
  let component: ConfidenceStats;
  let fixture: ComponentFixture<ConfidenceStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfidenceStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfidenceStats);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
