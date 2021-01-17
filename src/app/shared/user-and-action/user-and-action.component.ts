import {EventEmitter, Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-user-and-action',
  templateUrl: './user-and-action.component.html',
  styleUrls: ['./user-and-action.component.scss']
})
export class UserAndActionComponent implements OnInit {

  @Input()
  name: string;
  @Input()
  actionName: string;
  @Input()
  toEmit: unknown;

  @Output()
  eventEmitter = new EventEmitter<unknown>();
  constructor() { }


  doAction(): void {
    this.eventEmitter.emit(this.toEmit);
  }

  ngOnInit(): void {
  }

}
