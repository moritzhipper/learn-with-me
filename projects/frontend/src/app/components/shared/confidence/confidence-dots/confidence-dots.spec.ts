import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfidenceDots } from './confidence-dots';

describe('ConfidenceDots', () => {
  let component: ConfidenceDots;
  let fixture: ComponentFixture<ConfidenceDots>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfidenceDots]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfidenceDots);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
