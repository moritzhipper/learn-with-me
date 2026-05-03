import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLink } from './header-link';

describe('HeaderLink', () => {
  let component: HeaderLink;
  let fixture: ComponentFixture<HeaderLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
