import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bubbles } from './bubbles';

describe('Bubbles', () => {
  let component: Bubbles;
  let fixture: ComponentFixture<Bubbles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bubbles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bubbles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
