import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctiondepartmentComponent } from './auctiondepartment.component';

describe('AuctiondepartmentComponent', () => {
  let component: AuctiondepartmentComponent;
  let fixture: ComponentFixture<AuctiondepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctiondepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctiondepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
