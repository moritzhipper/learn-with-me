import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LarryBig } from './larry-big';

describe('LarryBig', () => {
  let component: LarryBig;
  let fixture: ComponentFixture<LarryBig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LarryBig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LarryBig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
