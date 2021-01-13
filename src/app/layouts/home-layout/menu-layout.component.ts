import { Component } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.scss']
})
export class MenuLayoutComponent {

  isBusiness$: Observable<boolean>;
  isRouteMan$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    this.isBusiness$ = this.authService.isBusinessAccount();
    this.isRouteMan$ = this.authService.isNeroAccount();
  }

  signOut(): void {
    this.authService.signOut();
  }
}
