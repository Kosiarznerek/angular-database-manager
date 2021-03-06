import {AfterViewInit, Directive, Host, Input, OnDestroy, Self} from '@angular/core';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[appMatAutocompleteEnforceSelection]'
})
export class MatAutocompleteEnforceSelectionDirective implements AfterViewInit, OnDestroy {

  @Input()
  matAutocomplete: MatAutocomplete;

  constructor(
    @Host() @Self() private readonly autoCompleteTrigger: MatAutocompleteTrigger,
    private readonly ngControl: NgControl
  ) {
  }

  ngAfterViewInit() {

    this.autoCompleteTrigger.panelClosingActions.pipe(
      untilDestroyed(this)
    ).subscribe((e) => {
      if (!e || !e.source) {
        const selected = this.matAutocomplete.options
          .map(option => option.value)
          .find(option => option === this.ngControl.value);

        if (selected == null) {
          this.ngControl.reset();
        }
      }
    });

  }

  ngOnDestroy(): void {
  }

}
