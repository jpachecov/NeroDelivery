import {Component, Input, OnInit} from '@angular/core';
import {Delivery, DeliveryState, UserProfile} from '../../core/business.model';
import {getDeliveryStatusName} from '../../utils/utilities';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input()
  delivery: Observable<Delivery>;
  routeMan: Observable<UserProfile>;

  constructor(private readonly afs: AngularFirestore) {}

  ngOnInit(): void {
    this.routeMan = this.delivery.pipe(
        tap((delivery) => {
          console.log('delivery', delivery);
        }),
        switchMap((delivery) => {
          return this.afs.doc<UserProfile>(`users/${delivery.routeManId}`).valueChanges();
        })
    );
  }

  getStatusName(status: DeliveryState): string {
    return getDeliveryStatusName(status);
  }
}
