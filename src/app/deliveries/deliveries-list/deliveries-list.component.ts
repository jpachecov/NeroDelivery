import {Component, OnInit} from '@angular/core';
import {Delivery, DeliveryState} from '../../core/business.model';
import {from, Observable, of} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
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
      public dialog: MatDialog
  ) {
    const uid$ = from(this.fAuth.currentUser).pipe(
        map((user) => user.uid),
    );

    // this.deliveriesList = uid$.pipe(
    //     switchMap((uid) =>
    //         this.afs.collection<Delivery>('deliveries',
    //                     ref => ref.where('senderId', '==', uid).limit(10))
    //             .valueChanges()),
    // );

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
          phone: '5568156149'
        },
        place: {
          mapsUrl: 'https://goo.gl/maps/RrhTEMDN7w7VXAPTA',
          address: 'Some address',
          references: 'A lado de un OXXO'
        }
      }
    };

    this.deliveriesList = of([
        test, test, test
    ]);
  }

  getStatusName(status: DeliveryState): string {
    return getDeliveryStatusName(status);
  }

  openDetail(delivery: Delivery): void {
    const dialogRef = this.dialog.open(DeliveryDetailDialogComponent, {
      width: '600px',
      data: of(delivery)
    });
  }

  ngOnInit(): void {
  }

}
