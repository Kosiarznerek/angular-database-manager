import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  // Component data
  public menuItem$: Observable<IMenuItem>;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    // Getting menu item data
    this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;

  }

}
