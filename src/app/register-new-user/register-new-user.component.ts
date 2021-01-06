import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {UserProfile, UserRole} from '../core/business.model';

@Component({
  selector: 'app-register-new-user',
  templateUrl: './register-new-user.component.html',
  styleUrls: ['./register-new-user.component.scss']
})
export class RegisterNewUserComponent {

  formGroup = new FormGroup({
    userType: new FormControl('business', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    passConfirmation: new FormControl('', [Validators.required]),
  });

  constructor(private readonly afAuth: AngularFireAuth,
              private readonly router: Router,
              private readonly auth: AuthService) { }

  isPasswordConfirmed(): boolean {
    return this.formGroup.get('password').value
        === this.formGroup.get('passConfirmation').value;
  }

  async register() {
    const userType = this.formGroup.get('userType').value;
    const firstName = this.formGroup.get('firstName').value;
    const lastName = this.formGroup.get('lastName').value;
    const email = this.formGroup.get('email').value;
    const password = this.formGroup.get('password').value;
    try {
      console.log('user type: ', userType);
      const resp = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await resp.user.updateProfile({ displayName: `${firstName} ${lastName}`});
      const uid = resp.user.uid;

      let userProfile: UserProfile;
      if (userType === 'business') {
         userProfile = {
          uid,
          role: UserRole.BUSINESS,
          businessInformation: {
            contact: {
              firstName,
              lastName,
              email,
            }
          },
        };
      }
      if (userType === 'nero') {
        userProfile = {
          uid,
          role: UserRole.NERO,
          neroInformation: {
            firstName,
            lastName,
            email
          },
        };
      }
      await this.auth.createUserDocument(userProfile);
      this.router.navigate([`profile/${uid}`]);
    } catch (error) {
      console.log(error);
    }
  }
}
