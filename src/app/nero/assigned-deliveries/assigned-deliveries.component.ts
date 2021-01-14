import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Delivery, DeliveryState} from "../../core/business.model";
import {Observable, of} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {switchMap} from "rxjs/operators";
import {DeliveryDetailDialogComponent} from "../../deliveries/dialog/delivery-detail-dialog/delivery-detail-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-assigned-deliveries',
  templateUrl: './assigned-deliveries.component.html',
  styleUrls: ['./assigned-deliveries.component.scss']
})
export class AssignedDeliveriesComponent implements OnInit {

  assigned$: Observable<Delivery[]>;
  accepted$: Observable<Delivery[]>;

  constructor(
      private readonly afs: AngularFirestore,
      private readonly auth: AuthService,
      public dialog: MatDialog,
  ) {

    this.assigned$ = this.auth.userProfile$.pipe(
        switchMap((userProfile) => {
          return this.afs.collection<Delivery>(`deliveries`,
            ref => ref.where('routeManId', '==', userProfile.uid)
                      .where('status', '==', DeliveryState.ASSIGNED))
              .valueChanges();
        }),
    );

    this.accepted$ = this.auth.userProfile$.pipe(
        switchMap((userProfile) => {
          return this.afs.collection<Delivery>(`deliveries`,
              ref => ref.where('routeManId', '==', userProfile.uid)
                  .where('status', '==', DeliveryState.ACCEPTED_BY_NERO))
              .valueChanges();
        }),
    );
  }

  ngOnInit(): void {
  }

  openDeliveryDetail(delivery: Delivery): void {
    const dialogRef = this.dialog.open(DeliveryDetailDialogComponent, {
      width: '600px',
      data: of(delivery)
    });
  }

  acceptPackage(delivery: Delivery): Promise<void> {
    const acceptedPackage: Delivery = {
      status: DeliveryState.ACCEPTED_BY_NERO,
      ...delivery,
    };
    return this.afs.doc<Delivery>(`deliveries/${delivery.internalKey}`)
        .set(acceptedPackage);
  }

}
