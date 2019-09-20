import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {IPaginatorState} from './paginator.component.models';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

    @Input() public state: IPaginatorState;
    @Output() public stateChange: EventEmitter<IPaginatorState>;

    constructor() {
        this.stateChange = new EventEmitter();
    }

    ngOnInit() {
    }

    /**
     * Executes when current page size has been changed
     */
    public onCurrentPageSizeChangeHandler(v: number): void {
        this.state.currentPageSize = v;
        this.stateChange.emit(this.state);
    }

    /**
     * Executes when next page button was clicked
     */
    public onNextPageClickHandler(): void {
        if (this.state.currentPage + 1 > this.state.totalPages) {
            return;
        }
        this.state.currentPage++;
        this.stateChange.emit(this.state);
    }

    /**
     * Executes when previous page button was clicked
     */
    public onPreviousPageClickHandler(): void {
        if (this.state.currentPage - 1 <= 0) {
            return;
        }
        this.state.currentPage--;
        this.stateChange.emit(this.state);
    }

}
