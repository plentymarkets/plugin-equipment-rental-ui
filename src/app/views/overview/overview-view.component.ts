import {
    Component,
    OnInit
} from '@angular/core';
import { ArticleInterface } from '../../core/article.interface';
import { OverviewDataService } from './overview-view.service';
import {
    TerraSelectBoxValueInterface,
    TerraDataTableHeaderCellInterface,
    TerraTextAlignEnum,
    AlertService
}
from '@plentymarkets/terra-components';
import { HistoryDataTableService } from './table/history-table.service';
import { SettingsInterface } from '../settings/settings-view.component';
import { HistoryDataTableInterface } from './table/history-data-table.interface';


function isNullOrUndefined(object:any):boolean
{
    return object === undefined || object === null;
}

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

export interface UserInterface{
    id?:number;
    firstname?:string;
    lastname?:string;
    email?:string;
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

    public articlesResult:Array<ArticleInterface>; // Array with all results
    public articles:Array<ArticleInterface>; // Copy of array to filter items
    public articlesRentInformation:Array<RentInterface> = [];
    public propertyNames:Array<string> = [];
    public history:Array<any> = [];
    public findUserResult:Array<any> = [];
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

    public categoryFilter:string = '';
    public userFilter:string = '';

    public statusOption:string = '';
    public _actualArticleData:RentInterface;
    public _actualArticleTimeDif:number = 0;

    protected readonly headerList:Array<TerraDataTableHeaderCellInterface>;
    private autofillCall:any;
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
    private _selectCategory:Array<TerraSelectBoxValueInterface> = [
        {
            value: 0,
            caption: 'Alle'
        }
    ];
    private _selectUser:Array<TerraSelectBoxValueInterface> = [
        {
            value: 0,
            caption: 'Alle'
        }
    ];
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
    private _name:string = '';

    constructor(
                private _statsDataService:OverviewDataService,
                private _historyService:HistoryDataTableService,
                private _alert:AlertService)
    {
        this.headerList = this.createHeaderList();
    }

    public ngOnInit():void
    {
        this.loadPage(1);
        this.loadCategorys();
        this.loadPropertyNames();
    }

    public loadCategorys():void
    {
        this.isLoading = true;
        this._statsDataService.getRestCallData('rest/categories').subscribe((response:any) =>
            {
                if(isNullOrUndefined(response.entries))
                {
                    return;
                }

                for(let category of response.entries)
                {
                    this.categoryNames.set(category.id, category.details[0].name);
                }
                this.loadSettings();
            }, error =>
            {
                this.isLoading = false;
                this._alert.error('Fehler beim Laden der Kategorien');
            }
        );
    }

    public loadPropertyNames():void
    {
        let actualLang:string = 'de';
        this._statsDataService.getRestCallData('rest/properties').subscribe((response:any) =>
            {
                if(Object.keys(response).length > 0)
                {
                    for(let property of response['entries'])
                    {
                        let propertyName:string = 'NONAME';
                        for(let name of property.names)
                        {
                            if(name.lang === actualLang)
                            {
                                propertyName = name.name;
                                break;
                            }
                        }
                        this.propertyNames[property.position] = propertyName;
                    }
                }
            }, error =>
            {
                this._alert.error('Fehler beim Laden der Eigenschaften');
            }
        );
    }

    private isJsonString(str:string):boolean
    {
        try
        {
            let json:any = JSON.parse(str);
            return (typeof json === 'object' && json.length > 0);
        }
        catch (e)
        {
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
                    {
                        this.settings.set(setting.name, setting.value);
                    }
                }

                if(this.isJsonString(this.settings.get('categorys')))
                {
                    let categorys:Array<number> = JSON.parse(this.settings.get('categorys'));
                    for(let id of categorys)
                    {
                        this._selectCategory.push(
                            {
                                value:  id,
                                caption: this.categoryNames.get(id)
                            }
                        );
                    }
                    this.createArticleData();
                }
                else
                {
                    this._alert.error('Es wurde keine Kategorie in den Einstellungen festgelegt');
                    this.isLoading = false;
                }
            }, error =>
            {
                this._alert.error('Fehler beim Laden der Einstellungen');
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
        for(let status of this._selectStatus)
        {
            if (id > 0 && status.value == id)
            {
                return status.caption.toString();
            }
        }
        return '';
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

        if(!isNullOrUndefined(this.autofillCall)) {
            this.autofillCall.unsubscribe();
        }

        if(this.searchName.length < 3) {
            return;
        }

        this.autofillLoading = true;
        // tslint:disable-next-line:max-line-length
        this.autofillCall = this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/findUser/' + this.searchName).subscribe((response:Array<any>) =>
            {
                for(let user of response)
                {
                    this.findUserResult.push(user);
                }
                this.autofillLoading = false;
            }, error =>
            {
                this._alert.error('Fehler beim Laden der Benutzer');
                this.autofillLoading = false;
            }
        );

    }
    public fillForms(user:UserInterface):void
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
        let dif:number = (time * 1000 - new Date().getTime()) / (1000 * 60 * 60 * 24);
        return Math.ceil(dif);
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
        return new Date().getTime() / 1000;
    }

    private setActualArticleData(id:number):void
    {
        this._actualArticleData = {};
        this._actualArticleTimeDif = 0;
        let arrayKey:any;
        for (let i in this.articlesRentInformation) {
            if(this.articlesRentInformation[i].deviceId == id)
            {
                arrayKey = i;
                break;
            }
        }
        if(!isNullOrUndefined(arrayKey))
        {
            this._actualArticleData = this.articlesRentInformation[arrayKey];
            this._actualArticleTimeDif = this._actualArticleData.rent_until > 0 ? this.getDiferenceInDays(this._actualArticleData.rent_until) : 0;
        }

    }

    private loadRentInformation(id:number):void
    {
        this.showHistory(id);
        let arrayKey:any;
        for (let i in this.articlesRentInformation) {
            if(this.articlesRentInformation[i].deviceId === id)
            {
                arrayKey = i;
                break;
            }
        }
        if(isNullOrUndefined(arrayKey))
        {
            try{
                this.isLoading = true;
                this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/' + id).subscribe((response:any) =>
                    {
                        if(Object.keys(response).length > 0)
                        {
                            response.isAvailable = parseInt(response.isAvailable);
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
                            this._actualArticleIsRent = response.isAvailable === 0;
                        }
                        else
                        {
                            this._actualArticleIsRent = false;
                        }
                        this.setActualArticleData(id);
                        this.isLoading = false;
                    }, error =>
                    {
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
            this._actualArticleIsRent = this.articlesRentInformation[arrayKey].available === 0;
        }
        this.setActualArticleData(id);
    }

    private setActualArticleKeyById(id:number):void
    {
        for (let i in this.articlesResult)
        {
            if(this.articlesResult[i].id === id)
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
        if(email.indexOf('@') > 0 && email.split('@')[1].indexOf('.') > 0 )
        {
            return true;
        }
        return false;
    }

    private giveBack(deviceId:number):void
    {
        let data:any = {
            comment : this.giveBackComment,
            status: parseInt(this.statusOption)
        };
        this._statsDataService.putRestCallData('plugin/equipmentRental/rentalDevice/' + deviceId, data).subscribe((response:Array<any>) =>
            {
                this._alert.success('Das Gerät wurde erfolgreich zurückgegeben');
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
                this.articlesResult[this._actualArticleKey].user = '';
                this.email = '';
                this.date = '';
                this.lastName = '';
                this.firstName = '';
                this.comment = '';
                this.searchName = '';

            }, error =>
            {
                this._alert.error('Fehler beim Zurückgeben des Gerätes');
            }
        );
    }

    private rentItem(index:number):void
    {

        if(this.firstName.length < 3 || this.lastName.length < 3 || !this.isValidEmail(this.email))
        {
            this._alert.error('Es müssen alle Felder ausgefüllt werden');
            return;
        }
        let data:any = {
            firstname: this.firstName,
            lastname: this.lastName,
            email: this.email,
            deviceId: this.articlesResult[index].id,
            userId: 2,
            rent_until: this.date != null ? new Date(this.date).getTime() / 1000 : 0,
            comment: this.comment
        };

        if(data.rent_until > 0 && data.rent_until < this.actualTime())
        {
            this._alert.error('Das Rückgabedatum liegt in der Vergangenheit');
            return;
        }
        this._statsDataService.postRestCallData('plugin/equipmentRental/rentalDevice', data).subscribe((response:Array<any>) =>
            {
                this._alert.success('Das Gerät wurde erfolgreich verliehen');
                for (let i in this.articlesRentInformation) {
                    if(this.articlesRentInformation[i].deviceId == data.deviceId)
                    {
                        delete this.articlesRentInformation[i];
                        break;
                    }
                }
                this.articlesResult[index].available = 0;
                this.articlesResult[index].user = this.capitalize(this.firstName) + ' ' + this.capitalize(this.lastName);
                this.loadRentInformation(data.deviceId);
                this.refreshHistory(index);
                this._actualArticleIsRent = true;
            }, error =>
            {
                this._alert.error('Fehler beim Ausleihen des Gerätes');
            }
        );

    }


    public updateData():void
    {
        this.articles = this.articlesResult;

        // Name filter
        if(this._name.length > 0)
        {
            this.articles = this.articlesResult.filter(
                article => article.name.toLowerCase().indexOf(this._name.toLowerCase()) > -1
            );
        }

        // Available filter
        if(this.availableFilter != '-1')
        {
            this.articles = this.articles.filter(
                article => article.available == parseInt(this.availableFilter)
            );
        }

        // Category filter
        if(this.categoryFilter != '0')
        {
            this.articles = this.articles.filter(
                article => article.category == parseInt(this.categoryFilter)
            );
        }

        //User filter
        if(this.userFilter != '0')
        {
            this.articles = this.articles.filter(
                article => article.user == this.userFilter
            );
        }
    }

    private createArticleData():void
    {
        let categorys:Array<number> = JSON.parse(this.settings.get('categorys'));
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
                                category: category,
                                attributes: article.variationAttributeValues,
                                properties: article.properties,
                                available: article.isAvailable,
                                user: article.user,
                                rent_until: article.rent_until
                            });

                        if(article.isAvailable == 0){
                            let found:boolean = false;
                            for(let user of this._selectUser){
                                if(user.caption == article.user){
                                    found = true;
                                    break;
                                }
                            }
                            if(!found){
                                this._selectUser.push(
                                    {
                                        value:  article.user,
                                        caption: article.user
                                    }
                                );
                            }
                        }
                    }
                    this.isLoading = false;
                }, error =>
                {
                    this._alert.error('Fehler beim Laden der Artikel');
                    this.isLoading = false;
                }
            );
        }
        this.articles = this.articlesResult;
    }

    public exportCSV():void
    {
        let dateOptions:Object = { year: 'numeric', month: '2-digit', day: '2-digit'};
        let dateName = new Date().toLocaleDateString('de-DE', dateOptions).split(".").join("-");

        let filename = "EquipmentRental-"+dateName+".csv";
        let data = [];
        for(let article of this.articles)
        {
            let properties = "";
            if(article.properties.length > 0){
                for(let property of article.properties)
                {
                    if(!isNullOrUndefined(property.relationValues[0].value) && property.relationValues[0].value.length > 0)
                    {
                        properties += this.propertyNames[property.propertyRelation.position]+': ';
                        properties += property.relationValues[0].value+'<br>';
                    }

                }
            }
            let rent_until = "";
            if(article.available == 0)
            {
                rent_until = article.rent_until == 0 ? "Unbestimmte Zeit" : new Date(article.rent_until * 1000).toLocaleDateString('de-DE', dateOptions);
            }
            let newArticle:Object = {
                id:article.id,
                name:article.name,
                category:this.categoryNames.get(article.category),
                user:article.user,
                image:article.image,
                available:article.available === 1 ? "Verfügbar" : "Ausgeliehen",
                rent_until:rent_until,
                properties: properties,
            };
            console.log(JSON.stringify(newArticle));
            data.push(newArticle);
        }
        const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
        const header = Object.keys(data[0]);
        let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer).split("<br>").join('\n')).join(','));
        csv.unshift(header.join(','));
        let csvArray = csv.join('\r\n');

        let blob = new Blob([csvArray], {type: 'text/csv' })
        let url = window.URL.createObjectURL(blob);

        //Save or make hidden A tag and click it
        if(navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            let a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
    }

    private refreshHistory(id:number):void
    {
        if(!isNullOrUndefined(history[id])) {
            this.history[id] = undefined;
        }

        this._historyService.clearEntrys();
        this.showHistory(id);
    }

    public showHistory(id:number):void
    {
        this.isLoading = true;
        let dateOptions:Object = { year: 'numeric', month: '2-digit', day: '2-digit' };

        if(!isNullOrUndefined(history[id]))
            this.history[id] = undefined;

        this._historyService.clearEntrys();

        this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/history/' + id).subscribe((response:Array<any>) =>
            {
                this.history[id] = [];
                for(let deviceHistory of response)
                {
                    let historyItem:HistoryDataTableInterface = {
                        user: deviceHistory.user,
                        // tslint:disable-next-line:max-line-length
                        adminUser: deviceHistory.adminUser.id === 0 ? 'NONAME' : this.capitalize(deviceHistory.adminUser.firstname) + ' ' + this.capitalize(deviceHistory.adminUser.lastname),
                        comment: deviceHistory.comment,
                        getBackComment: deviceHistory.getBackComment,
                        isAvailable: deviceHistory.isAvailable,
                        // tslint:disable-next-line:max-line-length
                        rent_until: deviceHistory.rent_until > 0 ?  new Date(deviceHistory.rent_until * 1000).toLocaleDateString('de-DE', dateOptions) : 'Unbestimmte Zeit',
                        created_at: new Date(deviceHistory.created_at * 1000).toLocaleDateString('de-DE', dateOptions),
                        status: this.statusToText(deviceHistory.status),
                    };
                    this.history[id].push(historyItem);
                    this._historyService.addEntry(historyItem);
                    this.isLoading = true;
                }
                this._historyService.getResults();
                this.isLoading = false;
            }, error => {
                this._alert.error("Fehler beim Laden der Historie");
            }
        );

    }
    public capitalize(str:string):string
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
