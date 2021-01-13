import {Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Invitation, InvitationStatus, UserProfile, UserRole} from '../../core/business.model';
import {Observable, of, Subject} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {AuthService} from '../../auth/auth.service';
import {produceRandom} from '../../utils/utilities';

@Component({
  selector: 'app-invitations',
  templateUrl: './business-invitations.component.html',
  styleUrls: ['./business-invitations.component.scss']
})
export class BusinessInvitationsComponent {
    formGroup = this.fb.group({
        neroEmail: ['', Validators.email],
    });

    neroResult: Observable<UserProfile>;
    searchTrigger = new Subject<string>();

    sentInvitations: Observable<Invitation[]>;

    businessProfile: UserProfile;

    businessRouteMen: Observable<UserProfile[]>;

    constructor(private readonly fb: FormBuilder,
                private readonly afs: AngularFirestore,
                private readonly auth: AuthService) {
        this.neroResult = this.searchTrigger.asObservable().pipe(
            switchMap((email) => this.findNeroByEmail(email)),
            map(results => results[0]),
            catchError(() =>
                of({})
            ),
        );

        this.auth.userProfile$.subscribe((userProfile) => {
            this.businessProfile = userProfile;
            this.sentInvitations =
                this.afs
                    .collection<Invitation>(`invitations`,
                            ref => ref.where('from.uid', '==', userProfile.uid))
                    .valueChanges();

            this.businessRouteMen = this.afs.collection<UserProfile>('users',
                ref => ref.where('uid', 'in', userProfile.businessInformation.deliveryMenIds))
                .valueChanges();
        });
    }

    findNeroByEmail(email: string): Observable<UserProfile[]> {
       return this.afs.collection<UserProfile>('users', ref =>
           ref.where('role', '==', UserRole.NERO)
                .where('neroInformation.email', '==', email)).valueChanges();
    }

    triggerSearch(): void {
        this.searchTrigger.next(this.formGroup.get('neroEmail').value);
    }

    inviteNero(neroProfile: UserProfile): Promise<void> {
        const invitation: Invitation = {
            invitationId: produceRandom(15),
            from: {
                uid: this.businessProfile.uid,
                name: this.businessProfile.businessInformation.businessName,
            }, to: {
                uid: neroProfile.uid,
                name: neroProfile.neroInformation?.firstName + ' ' + neroProfile.neroInformation.lastName,
                email: neroProfile.neroInformation.email
            },
            status: InvitationStatus.PENDING
        };

        return this.afs
            .doc(`invitations/${invitation.invitationId}`)
            .set(invitation);

    }

    decideStatus(status: InvitationStatus): string {
        switch (status) {
            case InvitationStatus.PENDING:
                return 'Pendiente';
            case InvitationStatus.ACCEPTED:
                return 'Aceptada';
            case InvitationStatus.DECLINED:
                return 'Cancelada';
            default:
                return 'Unknown';
        }
    }
}
