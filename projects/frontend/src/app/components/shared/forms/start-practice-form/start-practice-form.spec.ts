import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPracticeForm } from './start-practice-form';

describe('StartPracticeForm', () => {
  let component: StartPracticeForm;
  let fixture: ComponentFixture<StartPracticeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartPracticeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartPracticeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
