import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsItemComp } from './settings-item-comp';

describe('SettingsItemComp', () => {
  let component: SettingsItemComp;
  let fixture: ComponentFixture<SettingsItemComp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsItemComp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsItemComp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
