import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthNeroGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) {}
    canActivate(): Observable<boolean> {
        return this.auth.isNeroAccount();
    }
}
