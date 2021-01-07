import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryDetailDialogComponent } from './delivery-detail-dialog.component';

describe('DeliveryDetailDialogComponent', () => {
  let component: DeliveryDetailDialogComponent;
  let fixture: ComponentFixture<DeliveryDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
