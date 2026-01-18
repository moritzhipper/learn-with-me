import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePlaceholderComp } from './page-placeholder-comp';

describe('PagePlaceholderComp', () => {
  let component: PagePlaceholderComp;
  let fixture: ComponentFixture<PagePlaceholderComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagePlaceholderComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagePlaceholderComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
