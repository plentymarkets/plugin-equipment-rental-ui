import { ModuleWithProviders } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { RouterViewComponent } from './views/router/router-view.component';
import { OverviewViewComponent } from "./views/overview/overview-view.component";
import { ManageViewComponent } from "./views/manage/manage-view.component";
import { SettingsViewComponent } from "./views/settings/settings-view.component";
import {CreateItemComponent} from "./views/create-item/create-item.component";
import {LogComponent} from "./views/log/log.component";

const appRoutes:Routes = [
    {
        path: '',
        redirectTo: 'plugin',
        pathMatch: 'full',
    },
    {
        path: 'plugin',
        component: RouterViewComponent,
        children:[
            {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full'
            },
            {
                path: 'settings',
                component: SettingsViewComponent,
                data: {
                    label: 'Einstellungen'
                }
            },
            {
                path: 'overview',
                component: OverviewViewComponent,
                data: {
                    label: 'Geräteübersicht'
                },
            },
            {
                path: 'overview/:deviceId',
                component: OverviewViewComponent,
                data: {
                    label: 'Verleihen'
                },
            },
            {
                path: 'manage',
                component: ManageViewComponent,
                data: {
                    label: 'Verleihübersicht'
                }
            },
            {
                path: 'create-item',
                component: CreateItemComponent,
                data: {
                    label: 'Artikel anlegen'
                }
            },
            {
                path: 'log',
                component: LogComponent,
                data: {
                    label: 'Log'
                }
            }
        ]
    },

];

export const appRoutingProviders:Array<any> = [];

export const routing:ModuleWithProviders =
    RouterModule.forRoot(appRoutes, {useHash:true});
