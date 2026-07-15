import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportBankLocalForm } from './export-bank-local-form';

describe('ExportBankLocalForm', () => {
  let component: ExportBankLocalForm;
  let fixture: ComponentFixture<ExportBankLocalForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportBankLocalForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportBankLocalForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
