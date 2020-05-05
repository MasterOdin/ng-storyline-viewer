import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'sanitizeAbstract'
})
export class SanitizeAbstractPipe implements PipeTransform {
    transform(value: string, expectedSpaces?: number): string {
        const maxSpaces = expectedSpaces || 20;
        if(value.length < maxSpaces) { return value; }
        let idx = value.indexOf(' ');
        return ((idx < 0) || (idx > maxSpaces)) ? '(Looks jumbled)' : value;
    }
}