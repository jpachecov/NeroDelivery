import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRouteMenAndActionComponent } from './list-route-men-and-action.component';

describe('ListRouteMenAndActionComponent', () => {
  let component: ListRouteMenAndActionComponent;
  let fixture: ComponentFixture<ListRouteMenAndActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRouteMenAndActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRouteMenAndActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
