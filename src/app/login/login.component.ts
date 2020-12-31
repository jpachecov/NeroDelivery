import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {of, throwError} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
      private readonly authService: AuthService,
      private readonly router: Router
  ) { }

  ngOnInit(): void {}

  login() {
    this.authService.loginWithEmail(this.formGroup.get('email').value, this.formGroup.get('password').value)
        .pipe(map((result) => {
          console.log('result', result);
          if (result) {
              return this.router.navigate(['home']);
          } else {
              return throwError(false);
          }
        }), catchError(() => {
          console.error('error in auth');
          return of(false);
        })).subscribe();
  }

}
