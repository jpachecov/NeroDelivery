import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {MenuLayoutComponent} from './layouts/home-layout/menu-layout.component';
import {NewDeliveryComponent} from './deliveries/new-delivery/new-delivery.component';
import {AngularFireAuthGuard, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {map} from 'rxjs/operators';
import {RegisterNewUserComponent} from "./register-new-user/register-new-user.component";

const redirectUnauthorized = () => redirectUnauthorizedTo('login');
const redirectLoggedIntoProfile = () =>
    map((user) => user ? ['profile', (user as any).uid] : true
);
const onlyAllowSelf = (next) =>
    map((user) => (!!user && next.params.id === (user as any).uid) || ['login']);

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedIntoProfile
    }
  },
  {
    path: 'register',
    component: RegisterNewUserComponent
  },
  {
    path: '',
    component: MenuLayoutComponent,
    canActivate: [AngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorized
    },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AngularFireAuthGuard],
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
        canActivate: [AngularFireAuthGuard],
        data: {
          authGuardPipe: onlyAllowSelf
        },
      },
      {
        path: 'deliveries/new',
        component: NewDeliveryComponent,
        canActivate: [AngularFireAuthGuard],
      },
    ],
  },

  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
