import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {combineLatest, Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
@Injectable()
export class AuthBusinessGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router,
                private readonly afs: AngularFirestore,
                private readonly fAuth: AngularFireAuth) {}
    canActivate(): Observable<boolean> {
        const uid$ = this.auth.user.pipe(
            switchMap((user) => {
                if (user) {
                    return of(user.uid);
                } else {
                    throwError('No user');
                }
            })
        );
        return uid$.pipe(
            switchMap((uid) => this.auth.isBusinessAccount(uid)),
            tap((isBusiness) => {
                if (!isBusiness) {
                    this.router.navigate(['home']);
                }
            }),
            catchError(() => of(false))
        );
    }
}
