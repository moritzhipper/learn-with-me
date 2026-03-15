import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagicTranslate } from './magic-translate';

describe('MagicTranslate', () => {
  let component: MagicTranslate;
  let fixture: ComponentFixture<MagicTranslate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MagicTranslate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MagicTranslate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
