import { Component } from '@angular/core';
import {OverviewDataService} from "../overview/overview-view.service";

import {
    TerraMultiCheckBoxValueInterface,
    TerraAlertComponent,
    TerraTagInterface
}
from '@plentymarkets/terra-components';
import {isNullOrUndefined} from "util";
export interface SettingsInterface
{
    id?:number;
    name?:string;
    value?:any;
}

@Component({
    selector: 'settings-view',
    template: require('./settings-view.component.html')
})

export class SettingsViewComponent
{
    public isLoading:boolean = false;
    public emailTemplate:string = "E-Mail Template";
    public emailTemplateTopic:string;
    public categoryValues:Array<TerraMultiCheckBoxValueInterface> = [];
    public activeCategorys:Array<TerraTagInterface> = [];


    public settings:Map<string, any> = new Map<string, any>();
    public oldSettings:Map<string, any> = new Map<string, any>();

    public saveSettingSuccess:number = 0;
    public saveSettingError:number = 0;

    private _alert:TerraAlertComponent;
    constructor(
        private _statsDataService:OverviewDataService,
    )
    {
        this._alert = TerraAlertComponent.getInstance();
    }

    public ngOnInit():void
    {
        this._alert.closeAlertByIdentifier('info');
        this.getSettings();
    }

    public getSettings():void
    {
        this.isLoading = true;
        this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/settings').subscribe((response:Array<SettingsInterface>) =>
            {
                for(let setting of response)
                {
                    if(!isNullOrUndefined(setting) && !isNullOrUndefined(setting.name))
                        this.settings.set(setting.name,setting.value);
                }
                this.emailTemplate = this.settings.get('emailTemplate');
                this.emailTemplateTopic = this.settings.get('emailTemplateTopic');

                this.settings.forEach((value: any,name: string) => {
                    this.oldSettings.set(name,value);
                });
                this.getCategorys();
            }, error => {
                console.log("error while loading settings");
                this.isLoading = false;
            }
        );
    }

    private isJsonString(str:string):boolean
    {
        try {
            var json = JSON.parse(str);
            return (typeof json === 'object' && json.length > 0);
        } catch (e) {
            return false;
        }
    }

    public getCategorys():void
    {
        this._statsDataService.getRestCallData('rest/categories').subscribe((response:any) =>
            {
                if(isNullOrUndefined(response.entries))
                    return;

                let categorySettings = this.isJsonString(this.settings.get("categorys")) ? JSON.parse(this.settings.get("categorys")) : []
                for(let category of response.entries)
                {
                    let categoryData =  {
                        value:    category.id,
                        caption:  category.details[0].name,
                        selected: categorySettings.includes(category.id)
                    };
                    this.categoryValues.push(categoryData);
                    if(categorySettings.includes(category.id)){
                        this.activeCategorys.push(
                            {
                                name: category.details[0].name,
                            }
                        );
                    }
                }
                this.emailTemplate = this.settings.get('emailTemplate');
                this.emailTemplateTopic = this.settings.get('emailTemplateTopic');

                this.settings.forEach((value: any,name: string) => {
                    this.oldSettings.set(name,value);
                });
                this.isLoading = false;
            }, error => {
                console.log("error while loading categorys");
                this.isLoading = false;
            }
        );
    }

    private getCategoryNameByid(id:number):string
    {
        for(let category of this.categoryValues)
        {
            if(category.value == id){
                return category.caption;
            }
        }
        return "";
    }

    public saveSettings():void
    {
        let categorys = [];
        this.activeCategorys = [];
        for(let category of this.categoryValues)
        {
            if(category.selected){
                categorys.push(category.value);
                this.activeCategorys.push(
                    {
                        name: this.getCategoryNameByid(category.value)
                    }
                );
            }
        }
        this.settings.set("categorys",JSON.stringify(categorys));
        this.settings.set("emailTemplate",this.emailTemplate);
        this.settings.set("emailTemplateTopic",this.emailTemplateTopic);

        this.saveSettingSuccess = 0;
        this.saveSettingError = 0;
        this.settings.forEach((value: any,name: string) => {
            if(this.oldSettings.get(name) != value){
                this.saveSettingsRequest(name,value);
                this.oldSettings.set(name,value);
            }
        });

    }

    private saveSettingsRequest(name:string,value:any):void
    {
        let data = {
            name: name,
            value: value
        }
        this._statsDataService.putRestCallData('plugin/equipmentRental/rentalDevice/setting',data).subscribe((response:any) =>
            {
                if(this.saveSettingSuccess == 0)
                {
                    this._alert.addAlert({
                        msg:              'Einstellungen wurden gespeichert',
                        type:             'success',
                        dismissOnTimeout: 3000,
                        identifier:       'info'
                    });
                }
                this.saveSettingSuccess++;
            }, error => {
                this.saveSettingError++;
                if(this.saveSettingError == 1)
                {
                    this._alert.addAlert({
                        msg:              'Fehler beim Speichern der Einstellungen',
                        type:             'danger',
                        dismissOnTimeout: 3000,
                        identifier:       'info'
                    });
                }
            }
        );
    }
}
