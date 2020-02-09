import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardauditorComponent } from './dashboardauditor.component';

describe('DashboardauditorComponent', () => {
  let component: DashboardauditorComponent;
  let fixture: ComponentFixture<DashboardauditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardauditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardauditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
