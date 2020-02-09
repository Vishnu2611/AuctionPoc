import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardbidderComponent } from './dashboardbidder.component';

describe('DashboardbidderComponent', () => {
  let component: DashboardbidderComponent;
  let fixture: ComponentFixture<DashboardbidderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardbidderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardbidderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
