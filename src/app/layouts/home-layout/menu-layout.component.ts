import { Component } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Observable, of, throwError} from 'rxjs';
import {catchError, switchMap, take} from 'rxjs/operators';

@Component({
  selector: 'app-home-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.scss']
})
export class MenuLayoutComponent {

  isBusiness: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    const uid$ = authService.user.pipe(
        switchMap((user) => {
          if (user) {
            return of(user.uid);
          } else {
            return throwError('No user');
          }
        })
    );

    this.isBusiness = uid$.pipe(
        take(1),
        switchMap((uid) => authService.isBusinessAccount(uid)),
        catchError(() => of(false)),
    );
  }

  signOut(): void {
    this.authService.signOut();
  }
}
