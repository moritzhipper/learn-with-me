import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeQuickActions } from './practice-quick-actions';

describe('PracticeQuickActions', () => {
  let component: PracticeQuickActions;
  let fixture: ComponentFixture<PracticeQuickActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeQuickActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeQuickActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
