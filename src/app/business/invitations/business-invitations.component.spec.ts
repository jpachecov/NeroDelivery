import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInvitationsComponent } from './business-invitations.component';

describe('InvitationsComponent', () => {
  let component: BusinessInvitationsComponent;
  let fixture: ComponentFixture<BusinessInvitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessInvitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
