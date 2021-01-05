import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {UserProfile} from '../auth/user-profile.model';
import {Observable} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<UserProfile>;
  item: Observable<UserProfile>;
  uid: string;


  formGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    zipCode: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    uid: new FormControl('', []),
  });

  constructor(readonly fAuth: AngularFireAuth,
              private readonly afs: AngularFirestore,
              private readonly auth: AuthService,
              private readonly route: ActivatedRoute) {

    this.uid = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.itemDoc = this.afs.doc<UserProfile>(`users/${this.uid}`);
    this.item = this.itemDoc.valueChanges().pipe(tap((user) => {
      this.formGroup.get('phone').setValue(user.phone);
      this.formGroup.get('address').setValue(user.address);
      this.formGroup.get('city').setValue(user.city);
      this.formGroup.get('state').setValue(user.state);
      this.formGroup.get('email').setValue(user.email);
      this.formGroup.get('zipCode').setValue(user.zipCode);
      this.formGroup.get('firstName').setValue(user.firstName);
      this.formGroup.get('lastName').setValue(user.lastName);
      this.formGroup.get('uid').setValue(user.uid);
    }));
  }

  update(): void {

    const {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      zipCode,
      phone,
      uid,
    } = this.formGroup.getRawValue();

    const userProfile: UserProfile = {
      firstName, lastName, email, address, city, state,
      zipCode, phone, ip: '',
      uid
    };
    this.afs.doc(`users/${this.uid}`).update(userProfile);
  }
}
