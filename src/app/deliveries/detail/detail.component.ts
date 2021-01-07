import {Component, Input, OnInit} from '@angular/core';
import {Delivery, DeliveryState} from '../../core/business.model';
import {getDeliveryStatusName} from '../../utils/utilities';
import {Observable} from "rxjs";

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input()
  delivery: Observable<Delivery>;

  constructor() { }

  ngOnInit(): void {
  }

  getStatusName(status: DeliveryState): string {
    return getDeliveryStatusName(status);
  }
}
