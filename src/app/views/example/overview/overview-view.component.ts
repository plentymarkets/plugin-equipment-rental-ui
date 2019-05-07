import { Component,OnInit } from '@angular/core';
import { ExampleDataService } from './overview-view.service';
import { TerraAlertComponent, TerraJsonToFormFieldService } from '@plentymarkets/terra-components';
import { TranslationService } from 'angular-l10n';
import { isArray } from 'util';
import { empty } from 'rxjs/Observer';

interface ArticleInterface
{
    id?:number;
    name?:string;
    image?:string;
    description?:string;
    created_at?:string;
}

@Component({
    selector: 'overview-view',
    styles:   [require('./overview-view.component.scss')],
    template: require('./overview-view.component.html'),
})
export class OverviewViewComponent implements OnInit
{
    private _name:string = "";

    private _selectedListBoxValue:number = 1;

    public articlesResult:Array<ArticleInterface>;
    public articles:Array<ArticleInterface>;
 
    private _alert:TerraAlertComponent;

    private onSearchBtnClicked():void
    {
        this.updateData();
    }

    private onResetBtnClicked():void
    {
        this._name = "";
        this.updateData();
    }

    private onClickTerraCard(id:string):void
    {
        alert(id);
    }

    private onSubmit():void
    {
        this.onSearchBtnClicked();
    }

    constructor(private _statsDataService:ExampleDataService)
    {
        this._alert = TerraAlertComponent.getInstance();
    }
 
    public ngOnInit():void
    {
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
