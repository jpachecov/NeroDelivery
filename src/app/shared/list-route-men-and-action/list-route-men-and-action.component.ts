import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {UserProfile} from '../../core/business.model';
import {AuthService} from '../../auth/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-list-route-men-and-action',
  templateUrl: './list-route-men-and-action.component.html',
  styleUrls: ['./list-route-men-and-action.component.scss']
})
export class ListRouteMenAndActionComponent implements OnInit {

  @Input()
  businessProfile$: Observable<UserProfile>;
  @Input()
  actionName = 'Action';
  @Output()
  uuidEvent = new EventEmitter<string>();
  businessRouteMen$: Observable<UserProfile[]>;

  constructor(
      private readonly auth: AuthService,
      private readonly afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.businessRouteMen$ = this.businessProfile$.pipe(
        switchMap((businessProfile) => {
          return this.afs
              .collection<UserProfile>(
                  'users', ref => ref.where('uid', 'in',
                      businessProfile.businessInformation.deliveryMenIds))
              .valueChanges();
        })
    );
  }

  doAction(userProfile: UserProfile): void {
    this.uuidEvent.emit(userProfile.uid);
  }

}
