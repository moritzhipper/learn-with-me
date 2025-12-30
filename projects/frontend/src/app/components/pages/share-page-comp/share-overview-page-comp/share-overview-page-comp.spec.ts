import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOverviewPageComp } from './share-overview-page-comp';

describe('ShareOverviewPageComp', () => {
  let component: ShareOverviewPageComp;
  let fixture: ComponentFixture<ShareOverviewPageComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareOverviewPageComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareOverviewPageComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
