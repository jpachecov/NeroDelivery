import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-home-layout',
  templateUrl: './menu-layout.component.html',
  styleUrls: ['./menu-layout.component.scss']
})
export class MenuLayoutComponent implements OnInit {


  constructor(private readonly authService: AuthService) { }

  ngOnInit(): void {
  }

  signOut() {
    this.authService.signOut();
  }

}
