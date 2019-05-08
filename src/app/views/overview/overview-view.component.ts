import { 
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import { ArticleInterface } from '../../core/article.interface';
import { ExampleDataService } from './overview-view.service';
import { TerraAlertComponent, 
    TerraJsonToFormFieldService,
    TerraOverlayComponent
} 
from '@plentymarkets/terra-components';
import { isArray } from 'util';
import { TranslationService } from 'angular-l10n';

@Component({
    selector: 'overview-view',
    styles:   [require('./overview-view.component.scss')],
    template: require('./overview-view.component.html'),
})
export class OverviewViewComponent implements OnInit
{
    private leftColumnWidth:number = 0;
    private centerColumnWidth:number = 0;
    private rightColumnWidth:number = 0;

    private _actualArticleId:number = 0;
    private _actualArticleKey:any = 0;
    private _name:string = "";
    private _selectedListBoxValue:number = 1;

    public articlesResult:Array<ArticleInterface>; //Array with all results
    public articles:Array<ArticleInterface>; //Copy of array to filter items
 
    private _alert:TerraAlertComponent;

    //Form
    firstName:string = '';
    lastName:string = '';
    email:string = '';

    constructor(
                public translation:TranslationService,
                private _statsDataService:ExampleDataService)
    {
        this._alert = TerraAlertComponent.getInstance();
    }  

    public ngOnInit():void
    {
        this.showFirstPage();

        this._alert.closeAlertByIdentifier('info');
        this.createArticleData();
        this._alert.addAlert(
            {
                msg:'Fetching data...',
                type:'info',
                dismissOnTimeout:3000,
                identifier: 'info'
            });   
    }

    emailAutocomplete(val) {
        if(this.email.indexOf("@plentymarkets.com") != -1 && (this.firstName.length == 0 || this.lastName.length == 0))
            this.email = "";
        if(this.firstName.length == 0 || this.lastName.length == 0)
            return; 
        this.email = this.firstName+"."+this.lastName+"@plentymarkets.com";
    } 

    private rentArticle():void
    {
        alert("pressed");
    }

    private showFirstPage():void
    {
        this.leftColumnWidth = 2;
        this.centerColumnWidth = 10;
        this.rightColumnWidth = 0;
    }

    private showSecondPage():void
    {
        this.leftColumnWidth = 0;
        this.centerColumnWidth = 0;
        this.rightColumnWidth = 12;
    }

    private openRentOverlay():void
    {
        this.rentOverlay.showOverlay();
    }

    private onSearchBtnClicked():void
    {
        this.updateData();
    }

    private onResetBtnClicked():void
    {
        this._name = "";
        this.updateData();
    }

    private onClickTerraCard(id:number):void
    {
        this._actualArticleId = id;
        this.setActualArticleKeyById(id);
        this.showSecondPage();
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

 
    public updateData():void
    {
        if(this._name.length > 0){
            this.articles = this.articlesResult.filter(
                article => article.name.toLowerCase().indexOf(this._name.toLowerCase()) > -1
            );  
        }
        else
            this.articles = this.articlesResult;   
    }
 
    private createArticleData():void
    {
        this.articlesResult = [];
        this._statsDataService.getRestCallData("/rest/items?with=itemImages").subscribe((response:Array<any>) =>
        {
            if(isArray(response["entries"])){ 
                for(let article of response["entries"])
                {
                    this.articlesResult.push(
                        {
                            name: article.texts[0].name1,
                            id: article.id,
                            image: (article.itemImages.length > 0) ? article.itemImages[0].url : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png",
                            description: article.texts[0].shortDescription,
                            longDescription: article.texts[0].description,
                            created_at: article.created_at
                        });
                }
            }
        }, error => {
            this._alert.addAlert({
                msg:              'Error while loading items',
                type:             'danger',
                dismissOnTimeout: 7000,
                identifier:       'info'
            });
        }
        );
        this.articles = this.articlesResult;             
    }
}
