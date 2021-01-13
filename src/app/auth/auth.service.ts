import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {catchError, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import firebase from 'firebase';
import {Router} from '@angular/router';
import {from, Observable, of as observableOf, throwError} from 'rxjs';
import {UserProfile, UserRole} from '../core/business.model';
import {AngularFirestore} from '@angular/fire/firestore';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;
  isLogged$ = observableOf(false);
  userProfile$: Observable<UserProfile>;

  constructor(
      private readonly afAuth: AngularFireAuth,
      private readonly router: Router,
      private readonly afs: AngularFirestore
  ) {
      this.user$ = this.afAuth.authState.pipe(
        map((user) =>  user),
        shareReplay(1)
    );

      this.userProfile$ = this.user$.pipe(
          map((user) => {
              if (user) {
                  return user.uid;
              } else {
                  return throwError('No user');
              }
          }),
          switchMap((uid) => this.afs.doc<UserProfile>(`users/${uid}`).valueChanges()),
          shareReplay(1),
      );

      this.isLogged$ = this.afAuth.authState.pipe(
        map((user) => !!user),
        shareReplay(1),
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
      return this.isLogged$;
  }

  signOut(): void {
      this.afAuth.signOut().then(() => {
          this.router.navigate(['login']);
      });
  }

  isBusinessAccount(): Observable<boolean> {
      return this.userProfile$
          .pipe(
              take(1),
              map((user: UserProfile) => user.role === UserRole.BUSINESS),
              catchError(() => observableOf(false))
          );
  }

  isNeroAccount(): Observable<boolean> {
    return this.userProfile$
        .pipe(
            take(1),
            map((user: UserProfile) => user.role === UserRole.NERO),
            catchError(() => observableOf(false))
        );
  }

  async createUserDocument(userProfile: UserProfile): Promise<void> {
      return this.afs.doc(`users/${userProfile.uid}`).set(userProfile);

  }
}
