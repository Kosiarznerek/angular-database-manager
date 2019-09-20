import {Component} from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {NavigationService} from '../../services/navigation/navigation.service';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {GridComponent} from '../grid/grid.component';
import {DetailsComponent} from '../details/details.component';
import {ControllerTypeErrorComponent} from '../controller-type-error/controller-type-error.component';
import {DashboardComponent} from '../dashboard/dashboard.component';

@Component({
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

    // Component data
    isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset).pipe(
        map(result => result.matches)
    );
    public menuItems: IMenuItem[];

    constructor(
        private _breakpointObserver: BreakpointObserver,
        private _navigationService: NavigationService,
        private  _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
        this._initComponent();
    }

    /**
     * Inits component
     */
    private _initComponent(): void {
        this._navigationService.menuItems
            .subscribe(r => {
                this._activatedRoute.routeConfig.children = [];
                this._initRouting(r);
                this.menuItems = r;
                this._router.navigate(
                    [this.menuItems[0].routerLink],
                    {relativeTo: this._activatedRoute}
                );
            });
    }

    /**
     * Inits routing
     */
    private _initRouting(menuItems: IMenuItem[], parent: Route[] = this._activatedRoute.routeConfig.children) {

        // Foreach menu item
        menuItems.forEach(v => {

            // Creating route
            const route: Route = this._createRoute(v);

            // Init sub items
            if (v.children.length > 0) {
                this._initRouting(v.children, route.children);
            }

            // Push to parent
            parent.push(route);

        });

    }

    /**
     * Creates route for menu item
     */
    private _createRoute(menuItem: IMenuItem): Route {

        // Creating route
        const route: Route = {
            path: menuItem.routePath,
            data: menuItem,
            children: []
        };

        // Assign component
        switch (menuItem.controllerType) {
            case 'grid':
                route.component = GridComponent;
                break;
            case 'details':
                route.component = DetailsComponent;
                break;
            case 'dashboard':
                route.component = DashboardComponent;
                break;
            case 'empty':
                break;
            default:
                route.component = ControllerTypeErrorComponent;
                break;
        }

        // Depending on child
        if (menuItem.children.length === 0) {
            delete route.children;
        }

        // Returning route
        return route;

    }

    /**
     * On user sign out
     */
    public onSignOutButtonClickHandler() {
        this._router.navigate(['/']);
    }

}
