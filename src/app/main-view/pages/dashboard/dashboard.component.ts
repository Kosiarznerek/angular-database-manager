import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public menuItem$: Observable<IMenuItem>;

    constructor(
        private _activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;
    }

}
