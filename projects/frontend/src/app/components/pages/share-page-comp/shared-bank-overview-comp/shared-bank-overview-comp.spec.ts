import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBankOverviewComp } from './shared-bank-overview-comp';

describe('SharedBankOverviewComp', () => {
  let component: SharedBankOverviewComp;
  let fixture: ComponentFixture<SharedBankOverviewComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedBankOverviewComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedBankOverviewComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
