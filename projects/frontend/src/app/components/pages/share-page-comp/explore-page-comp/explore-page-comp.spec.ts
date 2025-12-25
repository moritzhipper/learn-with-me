import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorePageComp } from './explore-page-comp';

describe('ExplorePageComp', () => {
  let component: ExplorePageComp;
  let fixture: ComponentFixture<ExplorePageComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorePageComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorePageComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
