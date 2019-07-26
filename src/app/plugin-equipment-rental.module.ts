import {
    APP_INITIALIZER,
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {
    L10nLoader,
    TranslationModule
} from 'angular-l10n';
import { FormsModule } from '@angular/forms';
import { l10nConfig } from './core/localization/l10n.config';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
    appRoutingProviders,
    routing
} from './plugin-equipment-rental.routing';
import {
    httpInterceptorProviders,
    TerraComponentsModule,
    TerraNodeTreeConfig
} from '@plentymarkets/terra-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationProvider } from './core/localization/translation-provider';
import { PlaceHolderService } from './core/placeholder/placeholder.service';
import { PluginEquipmentRentalComponent } from './plugin-equipment-rental.component';
import { RouterViewComponent } from './views/router/router-view.component';
import { OverviewViewComponent } from './views/overview/overview-view.component';
import { ManageViewComponent } from './views/manage/manage-view.component';
import { SettingsViewComponent } from './views/settings/settings-view.component';
import { TooltipModule } from 'ngx-bootstrap';
import { OverviewDataService } from './views/overview/overview-view.service';

@NgModule({
    imports:      [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        FormsModule,
        HttpClientModule,
        TranslationModule.forRoot(l10nConfig, { translationProvider: TranslationProvider }),
        RouterModule.forRoot([]),
        TerraComponentsModule,
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
        {
            provide:    APP_INITIALIZER,
            useFactory: initL10n,
            deps:       [L10nLoader],
            multi:      true
        },
        httpInterceptorProviders,
        appRoutingProviders,
        TerraNodeTreeConfig,
        PlaceHolderService,
        OverviewDataService
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
