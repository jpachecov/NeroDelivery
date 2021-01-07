import {Component, Inject, OnInit} from '@angular/core';
import {Delivery} from '../../../core/business.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delivery-detail-dialog',
  templateUrl: './delivery-detail-dialog.component.html',
  styleUrls: ['./delivery-detail-dialog.component.scss']
})
export class DeliveryDetailDialogComponent implements OnInit {
  constructor(
      public dialogRef: MatDialogRef<DeliveryDetailDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Delivery) {}

  ngOnInit(): void {
  }

}
