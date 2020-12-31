import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) {}
    canActivate(): Observable<boolean> {
        const isAuthenticated = this.auth.isUserAuthenticated();
        isAuthenticated.pipe(
            tap((is) => {
                if (!is) {
                    console.log('is not authenticated');
                    this.router.navigate(['login']);
                } else {
                    // this.router.navigate(['home']);
                }
            })
        ).subscribe();
        return isAuthenticated;
    }
}
