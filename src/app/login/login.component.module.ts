import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        MatInputModule,
        MatCardModule,
        MatButtonModule
    ],
    providers: [],
})
export class LoginModule { }
