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

import { OverviewDataService } from './views/overview/overview-view.service'; // import the example service
import { TooltipModule } from 'ngx-bootstrap';
import {
    appRoutingProviders,
    routing
} from './plugin-equipment-rental.routing';
import { ManageViewComponent } from "./views/manage/manage-view.component";
import {SettingsViewComponent} from "./views/settings/settings-view.component";


@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig),
        TerraComponentsModule.forRoot(),
        TooltipModule.forRoot(),
        routing
    ],
    declarations: [
        PluginEquipmentRentalComponent,
        RouterViewComponent,
        OverviewViewComponent,
        ManageViewComponent,
        SettingsViewComponent
    ],
    providers:    [
        TerraNodeTreeConfig,
        OverviewDataService,
        {
            provide:    APP_INITIALIZER,
            useFactory: initL10n,
            deps:       [L10nLoader],
            multi:      true
        },
        appRoutingProviders,
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
