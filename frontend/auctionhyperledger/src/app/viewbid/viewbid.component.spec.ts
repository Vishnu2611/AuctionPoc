import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbidComponent } from './viewbid.component';

describe('ViewbidComponent', () => {
  let component: ViewbidComponent;
  let fixture: ComponentFixture<ViewbidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewbidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
