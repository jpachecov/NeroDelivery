import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-delivery',
  templateUrl: './new-delivery.component.html',
  styleUrls: ['./new-delivery.component.scss']
})
export class NewDeliveryComponent implements OnInit {


  formGroup = new FormGroup({
    boxNumber: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    addressReference: new FormControl('', [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
  }

}
