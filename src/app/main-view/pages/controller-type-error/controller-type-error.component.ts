import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';

@Component({
    templateUrl: './controller-type-error.component.html',
    styleUrls: ['./controller-type-error.component.scss']
})
export class ControllerTypeErrorComponent implements OnInit {

    public menuItem$: Observable<IMenuItem>;

    constructor(
        private _activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;
    }

}
