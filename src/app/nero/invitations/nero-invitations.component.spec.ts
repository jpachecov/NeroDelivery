import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeroInvitationsComponent } from './nero-invitations.component';

describe('InvitationsComponent', () => {
  let component: NeroInvitationsComponent;
  let fixture: ComponentFixture<NeroInvitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeroInvitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeroInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
