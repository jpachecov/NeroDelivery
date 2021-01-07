import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Delivery, DeliveryState, PersonInformation, UserProfile} from '../../core/business.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {from, Observable, throwError} from 'rxjs';
import {shareReplay, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-new-delivery',
  templateUrl: './new-delivery.component.html',
  styleUrls: ['./new-delivery.component.scss']
})
export class NewDeliveryComponent {
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
  });

  constructor(private readonly fb: FormBuilder,
              private readonly afs: AngularFirestore,
              private readonly fAuth: AngularFireAuth) {

    this.businessProfile = from(this.fAuth.currentUser).pipe(
        switchMap((businessUser) => {
              if (businessUser) {
                return this.afs.doc<UserProfile>(`users/${businessUser.uid}`).valueChanges();
              } else {
                return throwError('No user');
              }
            }
        ),
        tap((user: UserProfile) => {
          this.businessId = user.uid;
          this.formGroup
              .get('pickupFormGroup')
              .get('mapsUrl')
              .setValue(user.businessInformation.place?.mapsUrl);
        }),
        shareReplay(1)
    );
    this.businessProfile.subscribe();
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
      internalKey: this.produceRandom(25),
      status: DeliveryState.NEW,
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
      creationDate: (new Date()).getMilliseconds()
    };

    console.log('New Delivery Obj', deliveryInfo);

    const r = await this.afs
        .doc(`deliveries/${deliveryInfo.internalKey}`)
        .set(deliveryInfo);

    console.log('Guardado!');
    this.formGroup.reset();
    return r;
  }

  private produceRandom(length: number): string {
    const random13chars = () => {
      return Math.random().toString(16).substring(2, 15);
    };
    const loops = Math.ceil(length / 13);
    return new Array(loops).fill(random13chars).reduce((crtString, func) => {
      return crtString + func();
    }, '').substring(0, length);
  }

}
