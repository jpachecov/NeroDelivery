import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from './auth/auth.guard.service';
import {ProfileComponent} from './profile/profile.component';
import {MenuLayoutComponent} from './layouts/home-layout/menu-layout.component';
import {NewDeliveryComponent} from "./deliveries/new-delivery/new-delivery.component";


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MenuLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'profile/:id',
        component: ProfileComponent,
      },
      {
        path: 'deliveries/new',
        component: NewDeliveryComponent,
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
