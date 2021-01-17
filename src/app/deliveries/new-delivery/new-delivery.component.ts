import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  Delivery, DeliveryState, PersonInformation, UserProfile, UserRole,
} from '../../core/business.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable, of, Subject} from 'rxjs';
import {map, shareReplay, takeUntil, takeWhile, tap} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';
import {produceRandom} from '../../utils/utilities';

@Component({
  selector: 'app-new-delivery',
  templateUrl: './new-delivery.component.html',
  styleUrls: ['./new-delivery.component.scss']
})
export class NewDeliveryComponent implements OnDestroy {
  businessId = '';
  businessProfile: Observable<UserProfile>;
  formGroup = this.fb.group({
    packageFormGroup: this.fb.group({
      externalKey: [''],
      description: ['']
    }),
    pickupFormGroup: this.fb.group({
      address: [''],
      mapsUrl: ['']
    }),
    deliveryFormGroup: this.fb.group({
      firstName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      address: ['', Validators.required],
      mapsUrl: [''],
      references: ['']
    }),
    routeManGroup: this.fb.group({
      userId: [''],
    })
  });

  businessRouteMen: Observable<UserProfile[]>;
  routeManAssigned: Observable<UserProfile>;
  ngUnsubscribe = new Subject<boolean>();

  constructor(private readonly fb: FormBuilder,
              private readonly auth: AuthService,
              private readonly afs: AngularFirestore) {

    this.businessProfile = this.auth.userProfile$.pipe(
        takeWhile((userProfile) => userProfile.role === UserRole.BUSINESS),
        tap((user: UserProfile) => {
          this.businessId = user.uid;
          this.formGroup
              .get('pickupFormGroup')
              .get('mapsUrl')
              .setValue(user.businessInformation.place?.mapsUrl ?? '');
        }),
        shareReplay(1)
    );
    this.businessProfile.subscribe(
        (businessProfile) => {
          try {
            this.businessRouteMen =
                this.afs.collection<UserProfile>('users',
                        ref => ref.where('uid', 'in', businessProfile.businessInformation.deliveryMenIds))
                .valueChanges();
          } catch (e) {
            this.businessRouteMen = of([]);
          }
          const businessName = businessProfile.businessInformation.businessName;
          const description = businessName ? `From ${businessName}` : '';
          this.formGroup
              .get('packageFormGroup')
              .get('description')
              .setValue(description);
        }
    );

    (this.formGroup.get('routeManGroup') as FormGroup).valueChanges.pipe(
        tap((valueChanges) => {
          if (valueChanges.userId) {
            this.routeManAssigned =
                this.afs.doc<UserProfile>(`users/${valueChanges.userId}`).valueChanges();
          }
        }),
        takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  async saveNewDelivery(): Promise<void> {
    const receiver: PersonInformation = {
      contact: {
      ...(this.formGroup.get('deliveryFormGroup') as FormGroup).getRawValue()
      },
      place: {
        ...(this.formGroup.get('deliveryFormGroup') as FormGroup).getRawValue()
      },
    };

    const deliveryInfo: Delivery = {
      internalKey: produceRandom(25),
      status: this.isPackageAssigned() ? DeliveryState.ASSIGNED : DeliveryState.NEW,
      senderId: this.businessId,
      packageInfo: {
        ...(this.formGroup.get('packageFormGroup') as FormGroup).getRawValue(),
      },
      receiver,
      deliveryPlace: {
        ...(this.formGroup.get('deliveryFormGroup') as FormGroup).getRawValue()
      },
      recollectionPlace: {
        ...(this.formGroup.get('pickupFormGroup') as FormGroup).getRawValue()
      },
      creationDate: (new Date()).getTime(),
      routeManId: (this.formGroup.get('routeManGroup') as FormGroup).get('userId').value ?? ''
    };

    const updatePromise = await this.afs
        .doc(`deliveries/${deliveryInfo.internalKey}`)
        .set(deliveryInfo);

    this.formGroup.reset();
    this.formGroup.markAsUntouched();
    this.formGroup.clearValidators();

    return updatePromise;
  }

  assignRouteMan(routeManId: string): void {
    const formGroup = this.formGroup.get('routeManGroup') as FormGroup;
    formGroup.get('userId').setValue(routeManId);
  }

  unAssignRouteMan(): void {
    const formGroup = this.formGroup.get('routeManGroup') as FormGroup;
    formGroup.get('userId').setValue('');
  }

  isPackageAssigned(): boolean {
    return this.formGroup.get('routeManGroup').get('userId').value !== '';
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
  }

}
