import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Invitation, InvitationStatus, UserProfile} from '../../core/business.model';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {map, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-invitations',
  templateUrl: './nero-invitations.component.html',
  styleUrls: ['./nero-invitations.component.scss']
})
export class NeroInvitationsComponent {

  receivedInvitations: Observable<Invitation[]>;

  neroProfile: UserProfile;

  constructor(
      private readonly afs: AngularFirestore,
      private readonly auth: AuthService
  ) {

    this.auth.userProfile$.subscribe((userProfile) => {
      this.neroProfile = userProfile;
      this.receivedInvitations =
          this.afs
              .collection<Invitation>(`invitations`,
                  ref => ref.where('to.uid', '==', userProfile.uid)
                      .where('status', '==', InvitationStatus.PENDING))
              .valueChanges();
    });
  }


  acceptInvitation(invitation: Invitation): void {
    const updatedInvitation: Invitation = {
      ...invitation,
      status: InvitationStatus.ACCEPTED,
    };

    this.afs.doc<Invitation>(`invitations/${invitation.invitationId}`)
        .set(updatedInvitation);

    const updatedBusinessIds = this.neroProfile.neroInformation.businessIds ?? [];
    updatedBusinessIds.push(invitation.from.uid);

    const updatedUserProfile: UserProfile = {
      ...this.neroProfile,
      neroInformation: {
        ...this.neroProfile.neroInformation,
        businessIds: updatedBusinessIds,
      }
    };

    this.afs.doc<UserProfile>(`users/${this.neroProfile.uid}`)
        .set(updatedUserProfile);

    // Update business info
    this.afs.doc<UserProfile>(`users/${invitation.from.uid}`)
        .valueChanges().pipe(take(1),
        map((businessProfile: UserProfile) => {

          const repartidoresIds = businessProfile.businessInformation.deliveryMenIds ?? [];
          repartidoresIds.push(this.neroProfile.uid);

          return {
            ...businessProfile,
            businessInformation: {
              ...businessProfile.businessInformation,
              deliveryMenIds: repartidoresIds,
            }
          } as UserProfile;
        }),
        tap((newBusinessProfile) => {
          this.afs.doc<UserProfile>(`users/${newBusinessProfile.uid}`)
              .set(newBusinessProfile);
        })).subscribe();
  }

  declineInvitation(invitation: Invitation): Promise<void> {
    const updatedInvitation = {
      ...invitation,
      status: InvitationStatus.DECLINED,
    };

    return this.afs.doc<Invitation>(`invitations/${invitation.invitationId}`)
        .set(updatedInvitation);

  }
}
