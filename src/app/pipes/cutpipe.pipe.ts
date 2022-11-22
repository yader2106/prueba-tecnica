import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutpipe',
})
export class CutpipePipe implements PipeTransform {
  transform(value: number, args?: any[]): unknown {
    //recortar 2 posiciones de la cadena
    if (value) {
      let str = value.toString();
      if(str.length > 2) {
        return str.slice(0, 2);
      }
      else return str;
    } else return null;
  }
}
