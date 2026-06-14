import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInputForm } from './text-input-form';

describe('TextInputForm', () => {
  let component: TextInputForm;
  let fixture: ComponentFixture<TextInputForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInputForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextInputForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
