import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
    selector: 'driver-sheet',
    templateUrl: 'drivers-sheet.component.html'
})
export class DriversSheet {

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public drivers: string[], private _bottomSheet: MatBottomSheetRef) {}

    onDriverClick(d: string) {
        this._bottomSheet.dismiss(d);
    }
}