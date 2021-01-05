import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {map, share, tap} from 'rxjs/operators';
import firebase from 'firebase';
import User = firebase.User;
import {Router} from '@angular/router';
import {from, Observable, of as observableOf} from 'rxjs';
import {UserProfile} from './user-profile.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User | null>;
  isLogged = observableOf(false);

  constructor(
      private readonly afAuth: AngularFireAuth,
      private readonly router: Router,
      private readonly afs: AngularFirestore
  ) {

    this.user = this.afAuth.authState.pipe(
        map((user) =>  user),
        share()
    );

    this.isLogged = this.afAuth.authState.pipe(
        map((user) => !!user),
        share(),
    );
  }

  loginWithEmail(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
            console.log('auth error', error);
            return new Promise((resolve) => {
                resolve(false);
            });
        })).pipe(
            tap((signInResult) => {
                console.log('SignInResult', signInResult);
            }),
            map((result) => {
            return result;
    }));
  }

  isUserAuthenticated(): Observable<boolean> {
      return this.isLogged;
  }

  signOut(): void {
      this.afAuth.signOut().then(() => {
          this.router.navigate(['login']);
      });
  }

  async createUserDocument(): Promise<void> {
      const user: User = await this.afAuth.currentUser;
      const userProfile: UserProfile = {
        uid: user.uid,
        address: '',
        city: '',
        email: user.email,
        ip: '',
        firstName: user.displayName,
        lastName: user.displayName,
        phone: '',
        state: '',
        zipCode: ''
      };
      return this.afs.doc(`users/${user.uid}`).set(userProfile);
  }
}
