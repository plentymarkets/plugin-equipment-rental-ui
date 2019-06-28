import { ModuleWithProviders } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { RouterViewComponent } from './views/router/router-view.component';
import {OverviewViewComponent} from "./views/overview/overview-view.component";
import { ManageViewComponent } from "./views/manage/manage-view.component";
import { SettingsViewComponent } from "./views/settings/settings-view.component";

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
                data:        {
                    label:       'menu'
                },
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
                }
            },
            {
                path: 'manage',
                component: ManageViewComponent,
                data: {
                    label: 'Verleihübersicht'
                }
            }
        ]
    },

];

export const appRoutingProviders:Array<any> = [];

export const routing:ModuleWithProviders =
    RouterModule.forRoot(appRoutes, {useHash:true});
