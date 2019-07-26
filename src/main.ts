import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './environments/environment';
import { PluginEquipmentRentalModule } from './app/plugin-equipment-rental.module';

if(environment.production)
{
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(PluginEquipmentRentalModule).catch((err:any) => console.error(err));
