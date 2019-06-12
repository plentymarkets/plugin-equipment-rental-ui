import {
    Component,
    OnInit
} from '@angular/core';
import { ArticleInterface } from '../../core/article.interface';
import { OverviewDataService } from './overview-view.service';
import {
    TerraAlertComponent,
    TerraSelectBoxValueInterface,
    TerraDataTableHeaderCellInterface,
    TerraTextAlignEnum
}
    from '@plentymarkets/terra-components';

import { TranslationService } from 'angular-l10n';
import { HistoryDataTableService } from './table/history-table.service';
import {SettingsInterface} from "../settings/settings-view.component";

function isNullOrUndefined(object: any):boolean { return object === undefined || object === null};

export interface RentInterface
{
    id?:number;
    deviceId?:number;
    userId?:number;
    comment?:string;
    rent_until?:number;
    created_at?:number;
    user?:any;
    available?:number;
}

@Component({
    selector: 'overview-view',
    styles:   [require('./overview-view.component.scss')],
    template: require('./overview-view.component.html'),
    providers: [HistoryDataTableService]
})

export class OverviewViewComponent implements OnInit
{
    public isLoading:boolean = false;

    public settings:Map<string, any> = new Map<string, any>();
    public categoryNames:Map<number, string> = new Map<number, string>();

    protected readonly headerList:Array<TerraDataTableHeaderCellInterface>;

    public articlesResult:Array<ArticleInterface>; // Array with all results
    public articles:Array<ArticleInterface>; // Copy of array to filter items
    public articlesRentInformation:Array<RentInterface> = [];
    public propertyNames:Array<string> = [];
    public history:Array<any> = [];
    public findUserResult:Array<any> = [];
    private autofillCall:any;
    public autofillLoading:boolean = false;

    // Form
    public searchName:string = '';
    public firstName:string = '';
    public lastName:string = '';
    public email:string = '';
    public date:string = '';
    public comment:string = '';
    public giveBackComment:string = '';

    public availableFilter:string = '';
    private _selectAvailable:Array<TerraSelectBoxValueInterface> = [
        {
            value: -1,
            caption: 'Alle'
        },
        {
            value: 0,
            caption: 'Ausgeliehen'
        },
        {
            value: 1,
            caption: 'Verfügbar'
        }
    ];

    public categoryFilter:string = '';
    private _selectCategory:Array<TerraSelectBoxValueInterface> = [
        {
            value: 0,
            caption: 'Alle'
        }
    ];

    public statusOption:string = '';
    private _selectStatus:Array<TerraSelectBoxValueInterface> = [
        {
            value: 0,
            caption: '(Optional)'
        },
        {
            value: 1,
            caption: 'Defekt'
        },
        {
            value: 2,
            caption: 'Entwendet'
        },
        {
            value: 3,
            caption: 'Verloren'
        }
    ];

    // Layout
    private breadcrumbs:Array<string>;
    private leftColumnWidth:number = 0;
    private centerColumnWidth:number = 0;
    private rightColumnWidth:number = 0;

    private _actualArticleIsRent:boolean;
    private _actualArticleId:number = 0;
    private _actualArticleKey:any = 0;
    public _actualArticleData:RentInterface;
    public _actualArticleTimeDif:number = 0;
    private _name:string = '';

    private _alert:TerraAlertComponent;
    constructor(
                public translation:TranslationService,
                private _statsDataService:OverviewDataService,
                private _historyService:HistoryDataTableService,
    )
    {
        this._alert = TerraAlertComponent.getInstance();
        this.headerList = this.createHeaderList();
/*        this.contextMenu = this.createContextMenu();*/
    }

    public ngOnInit():void
    {
        this.loadPage(1);
        this._alert.closeAlertByIdentifier('info');
        this.loadCategorys()
        this.loadPropertyNames();
    }

    public loadCategorys():void
    {
        this.isLoading = true;
        this._statsDataService.getRestCallData('rest/categories').subscribe((response:any) =>
            {
                if(isNullOrUndefined(response.entries))
                    return;

                for(let category of response.entries)
                {
                    this.categoryNames.set(category.id,category.details[0].name);
                }
                this.loadSettings();
            }, error => {
                console.log("error while loading categorys");
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
    private loadSettings():void
    {
        this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/settings').subscribe((response:Array<SettingsInterface>) =>
            {
                for(let setting of response)
                {
                    if(!isNullOrUndefined(setting) && !isNullOrUndefined(setting.name))
                        this.settings.set(setting.name,setting.value);
                }

                if(this.isJsonString(this.settings.get("categorys")))
                {
                    let categorys = JSON.parse(this.settings.get("categorys"));
                    for(let id of categorys) {
                        this._selectCategory.push(
                            {
                                value:  id,
                                caption: this.categoryNames.get(id)
                            }
                        );
                    }
                    this.createArticleData();
                }
                else{
                    this._alert.addAlert({
                        msg:              'Es wurde keine Kategorie in den Einstellungen festgelegt',
                        type:             'danger',
                        dismissOnTimeout: 3000,
                        identifier:       'info'
                    });
                    this.isLoading = false;
                }
            }, error => {
                console.log("error while loading settings");
            }
        );
    }

    private createHeaderList():Array<TerraDataTableHeaderCellInterface>
    {
        return [
            {
                caption: 'Verliehen an',
                sortBy:  'user',
                width:   10
            },
            {
                caption:   'Rückgabe an',
                sortBy:    'adminUser',
                width:     10,
                textAlign: TerraTextAlignEnum.LEFT
            },
            {
                caption:   'Kommentar',
                sortBy:    'comment',
                width:     10,
                textAlign: TerraTextAlignEnum.LEFT
            },
            {
                caption:   'Kommentar bei Rückgabe',
                sortBy:    'getBackComment',
                width:     10,
                textAlign: TerraTextAlignEnum.LEFT
            },
            {
                caption:   'Verliehen am',
                sortBy:    'created_at',
                width:     10,
                textAlign: TerraTextAlignEnum.CENTER
            },
            {
                caption:   'Verliehen bis',
                sortBy:    'rent_until',
                width:     10,
                textAlign: TerraTextAlignEnum.CENTER
            },
            {
                caption:   'Status',
                sortBy:    'status',
                width:     10,
                textAlign: TerraTextAlignEnum.CENTER
            },
        ];
    }

    private statusToText(id:number):string
    {
        for(let status of this._selectStatus) {
            if (id > 0 && status.value == id)
                return status.caption.toString();
        }
        return "";
    }

    public loadPropertyNames():void
    {
        let actualLang = "de";
        this._statsDataService.getRestCallData('rest/properties').subscribe((response:any) =>
            {
                if(Object.keys(response).length > 0)
                {
                    for(let property of response['entries'])
                    {
                        let propertyName = "NONAME";
                        for(let name of property.names)
                        {
                            if(name.lang == actualLang)
                            {
                                propertyName = name.name;
                                break;
                            }
                        }
                        this.propertyNames[property.position] = propertyName;
                    }
                }
            }
        );
    }

    public emailAutocomplete(val:string):void {
        if(this.email.indexOf('@plentymarkets.com') !== -1 && (this.firstName.length === 0 || this.lastName.length === 0))
        {
            this.email = '';
        }
        if(this.firstName.length === 0 || this.lastName.length === 0)
        {
            return;
        }
        this.email = this.firstName + '.' + this.lastName + '@plentymarkets.com';
    }

    public autofill():void
    {
        this.autofillLoading = false;
        this.findUserResult = [];

        if(!isNullOrUndefined(this.autofillCall))
            this.autofillCall.unsubscribe();

        if(this.searchName.length < 3)
            return;

        this.autofillLoading = true;
        this.autofillCall = this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/findUser/' + this.searchName).subscribe((response:Array<any>) =>
            {
                for(let user of response)
                {
                    this.findUserResult.push(user);
                }
                this.autofillLoading = false;
            }, error => {
                this._alert.addAlert({
                    msg:              'Error while loading users',
                    type:             'danger',
                    dismissOnTimeout: 7000,
                    identifier:       'info'
                });
                this.autofillLoading = false;
            }
        );

    }

    public fillForms(user):void
    {
        this.findUserResult = [];
        this.firstName = user.firstname;
        this.lastName = user.lastname;
        this.email = user.email;
    }

    private loadPage(page:number):void
    {
        this.isLoading = false;
        this.leftColumnWidth = (page === 1) ? 2 : 0;
        this.centerColumnWidth = (page === 1) ? 10 : 0;
        this.rightColumnWidth = (page === 1) ? 0 : 12;
        this.breadcrumbs = (page === 1) ? ['Geräteliste'] : ['Geräteliste', 'Verleihen'];
        this._actualArticleIsRent = false;
    }

    private onSearchBtnClicked():void
    {
        this.updateData();
    }

    private onResetBtnClicked():void
    {
        this._name = '';
        this.availableFilter = '-1';
        this.categoryFilter = '0';
        this.updateData();
    }

    public getDiferenceInDays(time:number):number {
        return Math.abs(time*1000 - new Date().getTime()) / (1000 * 60 * 60 * 24) | 0;
    }

    private onClickTerraCard(id:number):void
    {
        this._actualArticleId = id;
        this.setActualArticleKeyById(id);
        this.loadPage(2);
        this.loadRentInformation(id);
    }

    private actualTime():number
    {
        return new Date().getTime()/1000;
    }

    private setActualArticleData(id:number):void
    {
        this._actualArticleData = {};
        this._actualArticleTimeDif = 0;
        let arrayKey;
        for (let i in this.articlesRentInformation) {
            if(this.articlesRentInformation[i].deviceId == id)
            {
                arrayKey = i;
                break;
            }
        }
        if(arrayKey != undefined)
        {
            this._actualArticleData = this.articlesRentInformation[arrayKey];
            this._actualArticleTimeDif = this._actualArticleData.rent_until > 0 ? this.getDiferenceInDays(this._actualArticleData.rent_until) : 0;
        }

    }

    private loadRentInformation(id:number):void
    {
        this.showHistory(id);
        let arrayKey;
        for (let i in this.articlesRentInformation) {
            if(this.articlesRentInformation[i].deviceId == id)
            {
                arrayKey = i;
                break;
            }
        }
        if(isNullOrUndefined(arrayKey))
        {
            try{
                this.isLoading = true;
                this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/'+id).subscribe((response:any) =>
                    {
                        if(Object.keys(response).length > 0)
                        {
                            this.articlesRentInformation.push(
                                {
                                    id: response.id,
                                    deviceId: response.deviceId,
                                    userId: response.userId,
                                    comment: response.comment,
                                    rent_until: response.rent_until,
                                    created_at: response.created_at,
                                    user: response.user,
                                    available: response.isAvailable
                                });
                            this._actualArticleIsRent = response.isAvailable == 0 ? true : false;
                        }
                        else {
                            this._actualArticleIsRent = false;
                        }
                        this.setActualArticleData(id);
                        this.isLoading = false;
                    }, error => {
                        this._actualArticleIsRent = false;
                        this.isLoading = false;
                    }
                );
            }
            catch
            {
                this._actualArticleIsRent = false;
                this.isLoading = false;
            }
        }
        else{
            this._actualArticleIsRent = this.articlesRentInformation[arrayKey].available == 0 ? true : false;
        }
        this.setActualArticleData(id);
    }

    private setActualArticleKeyById(id:number):void
    {
        for (let i in this.articlesResult) {
            if(this.articlesResult[i].id == this._actualArticleId)
            {
                this._actualArticleKey = i;
                break;
            }
        }
    }

    private onSubmit():void
    {
        this.onSearchBtnClicked();
    }

    public isValidEmail(email:string):boolean
    {
        if(email.indexOf("@") > 0 && email.split("@")[1].indexOf(".") > 0 )
        {
            return true;
        }
        return false;
    }

    private giveBack(deviceId:number):void
    {
        let data = {
            comment : this.giveBackComment,
            status: parseInt(this.statusOption)
        };
        this._statsDataService.putRestCallData('plugin/equipmentRental/rentalDevice/'+deviceId,data).subscribe((response:Array<any>) =>
            {
                this._alert.addAlert({
                    msg:              'Das Gerät wurde erfolgreich zurückgegeben',
                    type:             'success',
                    dismissOnTimeout: 3000,
                    identifier:       'info'
                });
                this._actualArticleIsRent = false;
                for (let i in this.articlesRentInformation) {
                    if(this.articlesRentInformation[i].deviceId == deviceId)
                    {
                        delete this.articlesRentInformation[i];
                        break;
                    }
                }
                this.refreshHistory(deviceId);
                this.articlesResult[this._actualArticleKey].available = 1;
                this.articlesResult[this._actualArticleKey].user = "";
                this.email = "";
                this.date = "";
                this.lastName = "";
                this.firstName = "";
                this.comment = "";

            }, error => {
                this._alert.addAlert({
                    msg:              'Error while giving back device',
                    type:             'danger',
                    dismissOnTimeout: 7000,
                    identifier:       'info'
                });
            }
        );
    }

    private rentItem(index:number):void
    {

        if(this.firstName.length < 3 || this.lastName.length < 3 || !this.isValidEmail(this.email))
        {
            this._alert.addAlert(
                {
                    msg:'Es müssen alle Felder ausgefüllt werden',
                    type:'danger',
                    dismissOnTimeout:3000,
                    identifier: 'info'
                });
            return;
        }
        let data = {
            firstname: this.firstName,
            lastname: this.lastName,
            email: this.email,
            deviceId: this.articlesResult[index].id,
            userId: 2,
            rent_until: this.date != null ? new Date(this.date).getTime()/1000 : 0,
            comment: this.comment
        };

        if(data.rent_until > 0 && data.rent_until < this.actualTime())
        {
            this._alert.addAlert(
                {
                    msg:'Das Rückgabedatum liegt in der Vergangenheit',
                    type:'danger',
                    dismissOnTimeout:3000,
                    identifier: 'info'
                });
            return;
        }
        this._statsDataService.postRestCallData('plugin/equipmentRental/rentalDevice',data).subscribe((response:Array<any>) =>
            {
                this._alert.addAlert({
                    msg:              'Das Gerät wurde erfolgreich verliehen',
                    type:             'success',
                    dismissOnTimeout: 3000,
                    identifier:       'info'
                });
                for (let i in this.articlesRentInformation) {
                    if(this.articlesRentInformation[i].deviceId == data.deviceId)
                    {
                        delete this.articlesRentInformation[i];
                        break;
                    }
                }
                this.articlesResult[index].available = 0;
                this.articlesResult[index].user = this.capitalize(this.firstName) + " " + this.capitalize(this.lastName);
                this.loadRentInformation(data.deviceId);
                this.refreshHistory(index);
                this._actualArticleIsRent = true;
            }, error => {
                this._alert.addAlert({
                    msg:              'Error while renting device',
                    type:             'danger',
                    dismissOnTimeout: 7000,
                    identifier:       'info'
                });
            }
        );

    }


    public updateData():void
    {
        this.articles = this.articlesResult;

        //Name filter
        if(this._name.length > 0)
        {
            this.articles = this.articlesResult.filter(
                article => article.name.toLowerCase().indexOf(this._name.toLowerCase()) > -1
            );
        }

        //Available filter
        if(this.availableFilter != "-1")
        {
            this.articles = this.articles.filter(
                article => article.available == parseInt(this.availableFilter)
            );
        }

        //Category filter
        if(this.categoryFilter != "0")
        {
            this.articles = this.articles.filter(
                article => article.category == parseInt(this.categoryFilter)
            );
        }
    }

    private createArticleData():void
    {
        let categorys = JSON.parse(this.settings.get("categorys"));
        this.articlesResult = [];
        for(let category of categorys)
        {
            // tslint:disable-next-line:max-line-length
            this.isLoading = true;
            this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice?categoryId=' + category).subscribe((response:Array<any>) =>
            {
                for(let article of response)
                {
                    this.articlesResult.push(
                        {
                            id: article.id,
                            name: (article.name !== null) ? article.name : 'NONAME',
                            image: article.image,
                            category: parseInt(category),
                            attributes: article.variationAttributeValues,
                            properties: article.properties,
                            available: article.isAvailable,
                            user: article.user
                        });
                }
                this.isLoading = false;
            }, error => {
                this._alert.addAlert({
                    msg:              'Error while loading items',
                    type:             'danger',
                    dismissOnTimeout: 7000,
                    identifier:       'info'
                });
                    this.isLoading = false;
            }
            );
        }
        this.articles = this.articlesResult;
    }


    private refreshHistory(id:number):void
    {
        if(!isNullOrUndefined(history[id]))
            this.history[id] = undefined;

        this._historyService.clearEntrys();
        this.showHistory(id);
    }

    public showHistory(id:number):void
    {
        this.isLoading = true;
        let dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

        if(!isNullOrUndefined(history[id]))
            this.history[id] = undefined;

        this._historyService.clearEntrys();

        this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/history/' + id).subscribe((response:Array<any>) =>
            {
                this.history[id] = [];
                for(let deviceHistory of response)
                {
                    let historyItem = {
                        user: deviceHistory.user,
                        adminUser: deviceHistory.adminUser.id == 0 ? "NONAME": this.capitalize(deviceHistory.adminUser.firstname)+" "+this.capitalize(deviceHistory.adminUser.lastname),
                        comment: deviceHistory.comment,
                        getBackComment: deviceHistory.getBackComment,
                        isAvailable: deviceHistory.isAvailable,
                        rent_until: deviceHistory.rent_until > 0 ?  new Date(deviceHistory.rent_until*1000).toLocaleDateString('de-DE', dateOptions) : "Unbestimmte Zeit",
                        created_at: new Date(deviceHistory.created_at*1000).toLocaleDateString('de-DE', dateOptions),
                        status: this.statusToText(deviceHistory.status),
                    };
                    this.history[id].push(historyItem);
                    this._historyService.addEntry(historyItem);
                    this.isLoading = true;
                }
                this._historyService.getResults();
                this.isLoading = false;
            }, error => {
                this._alert.addAlert({
                    msg:              'Error while loading items',
                    type:             'danger',
                    dismissOnTimeout: 7000,
                    identifier:       'info'
                });
            }
        );

    }
    public capitalize(string:string):string
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
