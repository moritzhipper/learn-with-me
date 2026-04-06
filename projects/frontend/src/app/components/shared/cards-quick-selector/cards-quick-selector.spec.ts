import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsQuickSelector } from './cards-quick-selector';

describe('CardsQuickSelector', () => {
  let component: CardsQuickSelector;
  let fixture: ComponentFixture<CardsQuickSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsQuickSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsQuickSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
