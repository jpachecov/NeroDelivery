import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedDeliveriesComponent } from './assigned-deliveries.component';

describe('AssignedDeliveriesComponent', () => {
  let component: AssignedDeliveriesComponent;
  let fixture: ComponentFixture<AssignedDeliveriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedDeliveriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
