import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {catchError, map, share, tap} from 'rxjs/operators';
import firebase from 'firebase';
import User = firebase.User;
import {Router} from '@angular/router';
import {from, Observable, of as observableOf, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User | null>;
  isLogged = observableOf(false);

  constructor(
      private readonly afAuth: AngularFireAuth,
      private readonly router: Router
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
            return !!result;
    }));
  }

  isUserAuthenticated(): Observable<boolean> {
      return this.isLogged;
  }

  signOut() {
      this.afAuth.signOut();
  }
}