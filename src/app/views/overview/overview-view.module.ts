import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { OverviewViewComponent } from './overview-view.component';
import { TranslationModule } from 'angular-l10n';

@NgModule({
    imports:      [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslationModule,
        TerraComponentsModule.forRoot()
    ],
    declarations: [
        OverviewViewComponent
    ]
})
export class OverviewViewModule
{
    static forRoot()
    {
        return {
            ngModule:  OverviewViewModule,
            providers: []
        };
    }

    static getMainComponent():string
    {
        return 'OverviewViewComponent';
    }
}
