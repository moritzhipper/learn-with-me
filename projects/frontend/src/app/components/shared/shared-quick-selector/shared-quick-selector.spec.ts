import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedQuickSelector } from './shared-quick-selector';

describe('SharedQuickSelector', () => {
  let component: SharedQuickSelector;
  let fixture: ComponentFixture<SharedQuickSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedQuickSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedQuickSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
