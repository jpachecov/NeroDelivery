import {Component, OnInit} from '@angular/core';
import {Delivery, DeliveryState} from '../../core/business.model';
import {from, Observable, of} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, shareReplay, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DeliveryDetailDialogComponent} from '../dialog/delivery-detail-dialog/delivery-detail-dialog.component';
import {getDeliveryStatusName} from '../../utils/utilities';

@Component({
  selector: 'app-deliveries-list',
  templateUrl: './deliveries-list.component.html',
  styleUrls: ['./deliveries-list.component.scss']
})
export class DeliveriesListComponent implements OnInit {

  displayedColumns: string[] =
      ['externalKey', 'internalKey', 'creationDate', 'status', 'deliveryPlace', 'action'];
  deliveriesList: Observable<Delivery[]>;
  uid: string;

  constructor(
      private readonly afs: AngularFirestore,
      private readonly fAuth: AngularFireAuth,
      public dialog: MatDialog,
  ) {
    const uid$ = from(this.fAuth.currentUser).pipe(
        map((user) => user.uid),
    );

    this.deliveriesList = uid$.pipe(
        switchMap((uid) =>
            this.afs.collection<Delivery>('deliveries',
                        ref => ref.where('senderId', '==', uid).limit(10))
                .valueChanges()),
    );
  }

  getStatusName(status: DeliveryState): string {
    return getDeliveryStatusName(status);
  }

  openDetail(delivery: Delivery): void {
    console.log('openDetail');
    const passDelivery$ = this.afs.doc<Delivery>(`deliveries/${delivery.internalKey}`).valueChanges()
        .pipe(tap((delivery) => console.log('value changed!', delivery)),
            shareReplay(1));
    const dialogRef = this.dialog.open(DeliveryDetailDialogComponent, {
      width: '600px',
      data:  passDelivery$.pipe(takeUntil(this.dialog.afterAllClosed))
    });
  }

  ngOnInit(): void {
  }

}
