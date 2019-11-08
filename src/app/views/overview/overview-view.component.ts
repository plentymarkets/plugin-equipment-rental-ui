import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    TerraSelectBoxValueInterface,
    TerraDataTableHeaderCellInterface,
    TerraTextAlignEnum,
    AlertService
}
from '@plentymarkets/terra-components';
import { HistoryDataTableService } from '../../services/history-table.service';
import { HistoryDataTableInterface } from '../../interfaces/history-data-table.interface';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from "@angular/router";
import { RouterViewComponent } from "../router/router-view.component";
import { RentInterface } from '../../interfaces/rent.interface';
import { UserInterface } from '../../interfaces/user.interface';
import { SettingsInterface } from '../../interfaces/settings.interface';
import { OverviewDataService } from "../../services/overview-view.service";
import {ArticleInterface} from "../../interfaces/article.interface";


function isNullOrUndefined(object:any):boolean
{
    return object === undefined || object === null;
}

@Component({
    selector: 'overview-view',
    styleUrls:   ['./overview-view.component.scss'],
    templateUrl: './overview-view.component.html',
    providers: [HistoryDataTableService]
})

export class OverviewViewComponent implements OnInit, OnDestroy
{
    public isLoading:boolean = false;

    public settings:Map<string, any> = new Map<string, any>();
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

    public availableFilter:any = -1;

    public categoryFilter:any = 0;
    public userFilter:any = 0;
    public statusFilter:any = 0;

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

    private _selectStatusFilter:Array<TerraSelectBoxValueInterface> = [
        {
            value: 0,
            caption: 'Alle'
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
    private leftColumnWidth:number = 0;
    private centerColumnWidth:number = 0;
    private rightColumnWidth:number = 0;

    private _actualArticleIsRent:boolean;
    private _name:string = '';

    private _routerSub:any;

    constructor(
                public _statsDataService:OverviewDataService,
                private _historyService:HistoryDataTableService,
                private _alert:AlertService,
                private route: ActivatedRoute,
                private router: Router,
                private routerViewComponent:RouterViewComponent)
    {
        this.headerList = this.createHeaderList();
    }

    ngOnDestroy(){
        this._routerSub.unsubscribe();
    }

    public ngOnInit():void
    {
        this.loadPage(1);
        this._routerSub = this.router.events.subscribe((val) => {
            if (val instanceof NavigationStart) {
                if (val.url.indexOf('/overview/') != -1) {
                    let splitUrl = val.url.split('/');
                    let deviceId = parseInt(splitUrl[splitUrl.length - 1]);
                    this.loadArticleRoute(deviceId);
                } else {
                    this.loadPage(1);
                }
            }
        });

        if (!isNullOrUndefined(this.route.snapshot.paramMap.get("deviceId")) && this.route.snapshot.paramMap.get("deviceId").length > 0) {
            this.loadArticleRoute(parseInt(this.route.snapshot.paramMap.get("deviceId")));
        }
        if (this._statsDataService.categoryNames.size === 0) {
            this.loadCategorys();
            this.loadPropertyNames();
        }
    }

    private loadArticleRoute(deviceId:number):void
    {
        this._statsDataService._actualArticleId = deviceId;
        this.setActualArticleKeyById(deviceId);
        this.loadPage(2);
        this.loadRentInformation(deviceId,true);
        this.isLoading = true;
        this.searchName = "";
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.comment = "";
        this.giveBackComment = "";
        this.statusOption = "";
        this.updateBreadcrumbByDeviceId(deviceId);
    }

    public loadCategorys():void
    {
        this.isLoading = true;
        this._statsDataService.getRestCallData('rest/categories').subscribe((response: any) => {
                if (isNullOrUndefined(response.entries)) {
                    return;
                }

                for (let category of response.entries) {
                    this._statsDataService.categoryNames.set(category.id, category.details[0].name);
                }
                this.loadSettings();
            }, error => {
                this.isLoading = false;
                this._alert.error('Fehler beim Laden der Kategorien');
            }
        );
    }

    public loadPropertyNames():void
    {
        let actualLang: string = 'de';
        this._statsDataService.getRestCallData('rest/properties').subscribe((response: any) => {
                if (Object.keys(response).length > 0) {
                    for (let property of response['entries']) {
                        let propertyName: string = 'NONAME';
                        for (let name of property.names) {
                            if (name.lang === actualLang) {
                                propertyName = name.name;
                                break;
                            }
                        }
                        this._statsDataService.propertyNames[property.position] = propertyName;
                    }
                }
            }, error => {
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
                        this._statsDataService.settings.set(setting.name, setting.value);
                    }
                }

                if(this.isJsonString(this._statsDataService.settings.get('categorys')))
                {
                    let categorys:Array<number> = JSON.parse(this._statsDataService.settings.get('categorys'));
                    for(let id of categorys)
                    {
                        this._statsDataService._selectCategory.push(
                            {
                                value:  id,
                                caption: this._statsDataService.categoryNames.get(id)
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
        this._statsDataService._actualArticleIsRent = false;
        if(page === 1){
            this._statsDataService._actualArticleId = 0;
            this._statsDataService._actualArticleKey = 0;
        }
    }

    private onSearchBtnClicked():void
    {
        this.updateData();
    }

    private onResetBtnClicked():void
    {
        this._name = '';
        this.availableFilter = -1;
        this.categoryFilter = 0;
        this.userFilter = 0;
        this.statusFilter = 0;
        this.updateData();
    }

    public getDiferenceInDays(time:number):number {
        let dif:number = (time * 1000 - new Date().getTime()) / (1000 * 60 * 60 * 24);
        return Math.ceil(dif);
    }

    private onClickTerraCard(id:number):void
    {
        this.router.navigateByUrl('plugin/overview/'+id);
    }

    private loadCreateItem():void
    {
        this.router.navigateByUrl('plugin/create-item');
    }

    private actualTime():number
    {
        return new Date().getTime() / 1000;
    }

    private setActualArticleData(id:number):void
    {
        this._statsDataService._actualArticleData = {};
        this._actualArticleTimeDif = 0;
        let arrayKey:any;
        for (let i in this._statsDataService.articlesRentInformation) {
            if(this._statsDataService.articlesRentInformation[i].deviceId == id)
            {
                arrayKey = i;
                break;
            }
        }
        if(!isNullOrUndefined(arrayKey))
        {
            this._statsDataService._actualArticleData = this._statsDataService.articlesRentInformation[arrayKey];
            this._actualArticleTimeDif = this._statsDataService._actualArticleData.rent_until > 0 ? this.getDiferenceInDays(this._statsDataService._actualArticleData.rent_until) : 0;
        }

    }

    private loadRentInformation(id:number,loadBreadcrumb:boolean = false):void
    {
        this.showHistory(id);
        let arrayKey:any;
        for (let i in this._statsDataService.articlesRentInformation) {
            if(this._statsDataService.articlesRentInformation[i].deviceId === id)
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
                        if(Object.keys(response) && Object.keys(response).length > 0)
                        {
                            response.isAvailable = parseInt(response.isAvailable);
                            this._statsDataService.articlesRentInformation.push(
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
                            this._statsDataService._actualArticleIsRent = response.isAvailable === 0;
                        }
                        else
                        {
                            this._statsDataService._actualArticleIsRent = false;
                        }
                        this.setActualArticleData(id);
                        this.isLoading = false;
                    }, error =>
                    {
                        this._statsDataService._actualArticleIsRent = false;
                        this.isLoading = false;
                    }
                );
            }
            catch
            {
                this._statsDataService._actualArticleIsRent = false;
                this.isLoading = false;
            }
        }
        else{
            this._statsDataService._actualArticleIsRent = this._statsDataService.articlesRentInformation[arrayKey].available === 0;
        }
        this.setActualArticleData(id);
    }

    private updateBreadcrumbByDeviceId(id:number):void
    {
        let name = "NONAME";
        for (let i in this._statsDataService.articlesResult)
        {
            if(this._statsDataService.articlesResult[i].id === id)
            {
                name = this._statsDataService.articlesResult[i].name;
                break;
            }
        }
        setTimeout(() =>
            {
                this.routerViewComponent.breadcrumbsService.updateBreadcrumbNameByUrl('/overview/' + id, name);
            },
            100);
    }

    private setActualArticleKeyById(id:number):void
    {
        for (let i in this._statsDataService.articlesResult)
        {
            if(this._statsDataService.articlesResult[i].id === id)
            {
                this._statsDataService._actualArticleKey = i;
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
                this._statsDataService._actualArticleIsRent = false;
                for (let i in this._statsDataService.articlesRentInformation) {
                    if(this._statsDataService.articlesRentInformation[i].deviceId == deviceId)
                    {
                        delete this._statsDataService.articlesRentInformation[i];
                        break;
                    }
                }
                this.refreshHistory(deviceId);
                this._statsDataService.articlesResult[this._statsDataService._actualArticleKey].available = 1;
                this._statsDataService.articlesResult[this._statsDataService._actualArticleKey].status = data.status;
                this._statsDataService.articlesResult[this._statsDataService._actualArticleKey].user = '';
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
            deviceId: this._statsDataService.articlesResult[index].id,
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
                for (let i in this._statsDataService.articlesRentInformation) {
                    if(this._statsDataService.articlesRentInformation[i].deviceId == data.deviceId)
                    {
                        delete this._statsDataService.articlesRentInformation[i];
                        break;
                    }
                }
                this._statsDataService.articlesResult[index].available = 0;
                this._statsDataService.articlesResult[index].user = this.capitalize(this.firstName) + ' ' + this.capitalize(this.lastName);
                this.loadRentInformation(data.deviceId);
                this.refreshHistory(index);
                this._statsDataService._actualArticleIsRent = true;
            }, error =>
            {
                this._alert.error('Fehler beim Ausleihen des Gerätes');
            }
        );

    }


    public updateData():void
    {
        this._statsDataService.articles = this._statsDataService.articlesResult;

        // Name filter
        if(this._name.length > 0)
        {
            this._statsDataService.articles = this._statsDataService.articlesResult.filter(
                article => article.name.toLowerCase().indexOf(this._name.toLowerCase()) > -1
            );
        }

        // Available filter
        if(this.availableFilter != '-1')
        {
            this._statsDataService.articles = this._statsDataService.articles.filter(
                article => article.available == parseInt(this.availableFilter)
            );
        }

        // Category filter
        if(this.categoryFilter != '0')
        {
            this._statsDataService.articles = this._statsDataService.articles.filter(
                article => article.category == parseInt(this.categoryFilter)
            );
        }

        //User filter
        if(this.userFilter != '0')
        {
            this._statsDataService.articles = this._statsDataService.articles.filter(
                article => article.user == this.userFilter
            );
        }

        //Status filter
        if(this.statusFilter != '0')
        {
            this._statsDataService.articles = this._statsDataService.articles.filter(
                article => article.status == this.statusFilter
            );
        }
    }

    private createArticleData():void
    {
        let categorys:Array<number> = JSON.parse(this._statsDataService.settings.get('categorys'));
        this._statsDataService.articlesResult = [];
        let i = 0;
        for(let category of categorys)
        {
            // tslint:disable-next-line:max-line-length
            this.isLoading = true;
            this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice?categoryId=' + category).subscribe((response:Array<any>) =>
                {
                    for(let article of response)
                    {
                        this._statsDataService.articlesResult.push(
                            {
                                id: article.id,
                                name: (article.name !== null) ? article.name : 'NONAME',
                                image: article.image,
                                category: category,
                                attributes: article.variationAttributeValues,
                                properties: article.properties,
                                available: article.isAvailable,
                                user: article.user,
                                rent_until: article.rent_until,
                                status: parseInt(article.status)
                            });

                        if(article.isAvailable == 0){
                            let found:boolean = false;
                            for(let user of this._statsDataService._selectUser){
                                if(user.caption == article.user){
                                    found = true;
                                    break;
                                }
                            }
                            if(!found){
                                this._statsDataService._selectUser.push(
                                    {
                                        value:  article.user,
                                        caption: article.user
                                    }
                                );
                            }
                        }
                    }
                    if(i === categorys.length-1){
                        this.isLoading = false;
                    }
                    i++;
                }, error =>
                {
                    this._alert.error('Fehler beim Laden der Artikel');
                    this.isLoading = false;
                }
            );
        }
        this._statsDataService.articles = this._statsDataService.articlesResult;
    }

    public exportCSV():void
    {
        let dateOptions:Object = { year: 'numeric', month: '2-digit', day: '2-digit'};
        let dateName = new Date().toLocaleDateString('de-DE', dateOptions).split(".").join("-");

        let filename = "EquipmentRental-"+dateName+".csv";
        let data = [];
        for(let article of this._statsDataService.articles)
        {
            let properties = "";
            if(article.properties.length > 0){
                for(let property of article.properties)
                {
                    if(!isNullOrUndefined(property.relationValues[0]) && !isNullOrUndefined(property.relationValues[0].value) && property.relationValues[0].value.length > 0)
                    {
                        properties += this._statsDataService.propertyNames[property.propertyRelation.position]+': ';
                        properties += property.relationValues[0].value+'<br>';
                    }

                }
            }
            let rent_until = "";
            console.log(article.rent_until);
            if(article.available == 0)
            {
                rent_until = article.rent_until == 0 || article.rent_until == null ? "Unbestimmte Zeit" : new Date(article.rent_until * 1000).toLocaleDateString('de-DE', dateOptions);
            }
            let newArticle:Object = {
                id:article.id,
                name:article.name,
                category:this._statsDataService.categoryNames.get(article.category),
                user:article.user,
                available:article.available === 1 ? "Verfügbar" : "Ausgeliehen",
                rent_until:rent_until,
                properties: properties,
            };
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
        if(!isNullOrUndefined(this._statsDataService.history[id])) {
            this._statsDataService.history[id] = undefined;
        }

        this._historyService.clearEntrys();
        this.showHistory(id);
    }

    public showHistory(id:number):void
    {
        this.isLoading = true;
        let dateOptions:Object = { year: 'numeric', month: '2-digit', day: '2-digit' };

        if(!isNullOrUndefined(this._statsDataService.history[id]))
            this._statsDataService.history[id] = undefined;

        this._historyService.clearEntrys();

        this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDevice/history/' + id).subscribe((response:Array<any>) =>
            {
                this._statsDataService.history[id] = [];
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
                    this._statsDataService.history[id].push(historyItem);
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

    /**
     * Returns tooltip string for the terra card of an item
     *
     * @param article
     * @return string
     */
    private getCardTooltip(article:ArticleInterface):string{
        if(article.status > 0){
            return 'Nicht verfügbar: '+this._selectStatus[article.status].caption;
        }
        return  article.available == 0 ? 'Dieses Gerät ist verliehen an '+article.user : '';
    }

    /**
     * Returns classes for the terra card of an item
     *
     * @param article
     * @return string
     */
    private getCardClasses(article:ArticleInterface):string{
        return article.available == 0 ? 'rent' : 'available';
    }
}
