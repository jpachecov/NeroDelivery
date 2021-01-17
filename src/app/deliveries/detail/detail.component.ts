import {Component, Input, OnInit} from '@angular/core';
import {Delivery, DeliveryState, UserProfile} from '../../core/business.model';
import {getDeliveryStatusName} from '../../utils/utilities';
import {Observable, of} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {catchError, switchMap, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @Input()
  delivery$: Observable<Delivery>;
  routeMan$: Observable<UserProfile | undefined>;
  businessProfile$: Observable<UserProfile>;

  constructor(private readonly afs: AngularFirestore) {}

  ngOnInit(): void {
    this.businessProfile$ = this.delivery$.pipe(
        switchMap((delivery) => {
          return this.afs.doc<UserProfile>(`users/${delivery.senderId}`).valueChanges();
        })
    );
    this.routeMan$ = this.delivery$.pipe(
        tap((delivery) => {
          console.log('delivery', delivery);
        }),
        switchMap((delivery) => {
          return this.afs.doc<UserProfile>(`users/${delivery.routeManId}`).valueChanges();
        }),
        catchError(() => of(undefined))
    );
  }

  assignRouteMan(routeManId: string): void {
    this.delivery$.pipe(
        take(1),
        switchMap((delivery: Delivery) => {
          const updatedDelivery: Delivery = {
            ...delivery,
            routeManId,
            status: DeliveryState.ASSIGNED
          };
          return this.afs
              .doc(`deliveries/${updatedDelivery.internalKey}`)
              .set(updatedDelivery);
        }),
    ).subscribe();
  }

  clearRouteMan(): void {
    this.delivery$.pipe(
        take(1),
        switchMap((delivery: Delivery) => {
          const updatedDelivery: Delivery = {
            ...delivery,
            routeManId: '',
            status: DeliveryState.NEW
          };
          return this.afs
              .doc(`deliveries/${updatedDelivery.internalKey}`)
              .set(updatedDelivery);
        }),
    ).subscribe();
  }

  getStatusName(status: DeliveryState): string {
    return getDeliveryStatusName(status);
  }
}
