import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBankExploreComp } from './shared-bank-explore-comp';

describe('SharedBankExploreComp', () => {
  let component: SharedBankExploreComp;
  let fixture: ComponentFixture<SharedBankExploreComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedBankExploreComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedBankExploreComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
