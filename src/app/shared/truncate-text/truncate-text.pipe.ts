import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncateText'
})
export class TruncateTextPipe implements PipeTransform {

  /**
   * Slice text including limit
   * @param value Text to trim
   * @param limit Max characters limit
   * @param trail Rest operator
   */
  transform(value: string, limit: number = 40, trail: string = '…'): any {

    const result = value || '';
    return result.length > limit ? result.substring(0, limit) + trail : result;

  }

}
