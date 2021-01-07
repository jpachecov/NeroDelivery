import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {UserProfile, UserRole} from '../core/business.model';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private readonly uid: string;
  private itemDoc: AngularFirestoreDocument<UserProfile>;
  userProfile: Observable<UserProfile>;

  formGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.email, Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    city: new FormControl(''),
    zipCode: new FormControl(''),
    state: new FormControl(''),
    rfc: new FormControl(''),
    uid: new FormControl('', []),
    mapsUrl: new FormControl('', []),
  });

  constructor(readonly fAuth: AngularFireAuth,
              private readonly afs: AngularFirestore,
              private readonly auth: AuthService,
              private readonly route: ActivatedRoute) {

    this.uid = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.uid}`);
    this.userProfile = this.itemDoc.valueChanges().pipe(tap((user) => {

      console.log('user', user);

      if (user.role === UserRole.BUSINESS) {
        this.formGroup.get('rfc').setValue(user.businessInformation.rfc ?? '');
        this.formGroup.get('phone').setValue(user.businessInformation.contact?.phone);
        this.formGroup.get('address').setValue(user.businessInformation.place?.address);
        this.formGroup.get('city').setValue(user.businessInformation.place?.city);
        this.formGroup.get('state').setValue(user.businessInformation.place?.state);
        this.formGroup.get('email').setValue(user.businessInformation.contact?.email);
        this.formGroup.get('zipCode').setValue(user.businessInformation.place?.zipCode ?? '');
        this.formGroup.get('firstName').setValue(user.businessInformation.contact?.firstName);
        this.formGroup.get('lastName').setValue(user.businessInformation.contact?.lastName);
        this.formGroup.get('mapsUrl').setValue(user.businessInformation.place?.mapsUrl);
      }

      if (user.role === UserRole.NERO) {
        this.formGroup.get('rfc').setValue(user.neroInformation.rfc ?? '');
        this.formGroup.get('phone').setValue(user.neroInformation.phone);
        this.formGroup.get('address').setValue(user.neroInformation.address);
        this.formGroup.get('city').setValue(user.neroInformation.city);
        this.formGroup.get('state').setValue(user.neroInformation.state);
        this.formGroup.get('email').setValue(user.neroInformation.email);
        this.formGroup.get('zipCode').setValue(user.neroInformation.zipCode ?? '');
        this.formGroup.get('firstName').setValue(user.neroInformation.firstName);
        this.formGroup.get('lastName').setValue(user.neroInformation.lastName);
      }

      this.formGroup.get('uid').setValue(user.uid);
    }), shareReplay(1));
  }

  update(): void {
    const saveInfo$ = this.userProfile.pipe(
        take(1),
        map((user) => {
          let userProfile: UserProfile;
          if (user.role === UserRole.NERO) {
             userProfile = {
              uid: this.uid,
              role: UserRole.NERO,
              neroInformation: {
                firstName: this.formGroup.get('firstName').value,
                lastName: this.formGroup.get('lastName').value,
                email: this.formGroup.get('email').value,
                address: this.formGroup.get('address').value,
                city: this.formGroup.get('city').value,
                phone: this.formGroup.get('phone').value,
                rfc: this.formGroup.get('rfc').value,
                state: this.formGroup.get('state').value,
                zipCode: this.formGroup.get('zipCode').value,
              },
            };
          }
          if (user.role === UserRole.BUSINESS) {
            userProfile = {
              uid: this.uid,
              role: UserRole.BUSINESS,
              businessInformation: {
                rfc: this.formGroup.get('rfc').value,
                contact: {
                  firstName: this.formGroup.get('firstName').value,
                  lastName: this.formGroup.get('lastName').value,
                  email: this.formGroup.get('email').value,
                  phone: this.formGroup.get('phone').value,
                },
                place: {
                  state: this.formGroup.get('state').value,
                  zipCode: this.formGroup.get('zipCode').value,
                  address: this.formGroup.get('address').value,
                  city: this.formGroup.get('city').value,
                  mapsUrl: this.formGroup.get('mapsUrl').value,
                }
                // TODO add field for business
              }
            };
          }
          return userProfile;
        }),
        tap((userProfile) => console.log('before swichMap', userProfile)),
        switchMap((userProfile: UserProfile) => this.afs.doc(`users/${this.uid}`).update(userProfile)),
        tap((result) => console.log(result))
    );

    saveInfo$.subscribe();
  }

  isRouteMan(): Observable<boolean> {
    return this.userProfile.pipe(map(user => user.role === UserRole.NERO));
  }

  isBusiness(): Observable<boolean> {
    return this.userProfile.pipe(map(user => user.role === UserRole.BUSINESS));
  }
}
