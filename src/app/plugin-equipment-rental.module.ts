import {
    APP_INITIALIZER,
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PluginEquipmentRentalComponent } from './plugin-equipment-rental.component';
import { HttpModule } from '@angular/http';
import {
    L10nLoader,
    TranslationModule
} from 'angular-l10n';
import { FormsModule } from '@angular/forms';
import { l10nConfig } from './core/localization/l10n.config';
import { HttpClientModule } from '@angular/common/http';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app';
import { RouterModule } from '@angular/router';
import { RouterViewComponent } from './views/router/router-view.component';
import { TerraNodeTreeConfig } from '@plentymarkets/terra-components';
import { OverviewViewComponent } from './views/overview/overview-view.component';

import { ExampleDataService } from './views/overview/overview-view.service'; // import the example service

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig),
        RouterModule.forRoot([]),
        TerraComponentsModule.forRoot()
    ],
    declarations: [
        PluginEquipmentRentalComponent,
        RouterViewComponent,
        OverviewViewComponent
    ],
    providers:    [
        TerraNodeTreeConfig,
        ExampleDataService,
        {
            provide:    APP_INITIALIZER,
            useFactory: initL10n,
            deps:       [L10nLoader],
            multi:      true
        },        
    ],
    bootstrap:    [
        PluginEquipmentRentalComponent
    ]
})
export class PluginEquipmentRentalModule
{
    constructor(public l10nLoader:L10nLoader)
    {
        this.l10nLoader.load();
    }
}

function initL10n(l10nLoader:L10nLoader):Function
{
    return ():Promise<void> => l10nLoader.load();
}
