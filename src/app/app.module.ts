import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LoginModule} from './login/login.component.module';

import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { HomeComponent } from './home/home.component';
import {AuthGuardService} from './auth/auth.guard.service';
import {environment} from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { MenuLayoutComponent } from './layouts/home-layout/menu-layout.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { NewDeliveryComponent } from './deliveries/new-delivery/new-delivery.component';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { RegisterNewUserComponent } from './register-new-user/register-new-user.component';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    MenuLayoutComponent,
    NewDeliveryComponent,
    RegisterNewUserComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        LoginModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        MatButtonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        FormsModule,
        AngularFirestoreModule,
        MatButtonToggleModule,
    ],
  providers: [AuthGuardService, AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
