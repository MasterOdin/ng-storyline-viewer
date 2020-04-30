import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'remainingConcepts'
})
export class RemainingConceptsPipe implements PipeTransform {
    transform(value: string[], start?: number): string {
        const startIndex = start || 5;
        if(value.length <= startIndex) { return ''; }
        else return '' + (value.length - startIndex) + ' others: ' + value.slice(startIndex).join(', ');
    }
}