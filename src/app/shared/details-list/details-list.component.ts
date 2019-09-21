import {Component, Input, OnInit} from '@angular/core';
import {IDetail} from './details-list.component.models';

@Component({
  selector: 'app-details-list',
  templateUrl: './details-list.component.html',
  styleUrls: ['./details-list.component.scss']
})
export class DetailsListComponent implements OnInit {

  @Input() public readonly detailsData: IDetail[];

  constructor() {
  }

  ngOnInit() {
  }

}
