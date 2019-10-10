import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'externalLink'
})
export class ExternalLinkPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value.trim().indexOf('http') === 0 ? value : 'http://' + value; // add http if missing
  }

}
