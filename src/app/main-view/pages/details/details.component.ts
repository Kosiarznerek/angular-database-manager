import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {Observable} from 'rxjs';
import {DetailsService} from '../../services/details/details.service';
import {IDetail} from '../../services/details/details.service.models';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    public menuItem$: Observable<IMenuItem>;
    public details$: Observable<IDetail[]>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _detailsService: DetailsService
    ) {
    }

    ngOnInit() {
        this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;
        this.menuItem$.subscribe(({controllerSource}) =>
            this.details$ = this._detailsService.getDetails(controllerSource)
        );
    }

}
