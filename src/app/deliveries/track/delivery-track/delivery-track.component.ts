import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import {Delivery, DeliveryState} from "../../../core/business.model";

@Component({
  selector: 'app-delivery-track',
  templateUrl: './delivery-track.component.html',
  styleUrls: ['./delivery-track.component.scss']
})
export class DeliveryTrackComponent implements OnInit {

  delivery: Observable<Delivery>;

  constructor() {

    const test: Delivery = {
      internalKey: 'hjakshjkashjkahsjkas',
      packageInfo: {
        externalKey: '#34434',
        description: 'Some description',
      },
      creationDate: (new Date()).getTime(),
      recollectionPlace: {
        mapsUrl: 'https://goo.gl/maps/RrhTEMDN7w7VXAPTA',
      },
      deliveryPlace: {
        mapsUrl: 'https://goo.gl/maps/RrhTEMDN7w7VXAPTA',
        address: 'Anillo periférico 4860\n' + '202 Torre A\n' + 'Tlalpan/Ciudad de Mexico\n' + 'Ciudad de México\n' + '14389',
        references: 'A lado de un OXXO'
      },
      status: DeliveryState.NEW,
      senderId: '123456789',
      receiver: {
        contact: {
          firstName: 'Carlos deliruis',
          phone: '5564204620'
        },
        place: {
          mapsUrl: 'https://goo.gl/maps/RrhTEMDN7w7VXAPTA',
          address: 'Some address',
          references: 'A lado de un OXXO'
        }
      }
    };
    this.delivery = of(test);
  }

  ngOnInit(): void {
  }

}
