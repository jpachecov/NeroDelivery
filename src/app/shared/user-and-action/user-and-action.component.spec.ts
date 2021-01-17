import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAndActionComponent } from './user-and-action.component';

describe('UserAndActionComponent', () => {
  let component: UserAndActionComponent;
  let fixture: ComponentFixture<UserAndActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAndActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAndActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
