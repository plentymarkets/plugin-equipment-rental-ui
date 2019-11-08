import {Component, OnInit, ViewChildren} from '@angular/core';
import {OverviewDataService} from "../../services/overview-view.service";
import {SettingsInterface} from "../../interfaces/settings.interface";
import {AlertService, TerraSelectBoxValueInterface} from "@plentymarkets/terra-components";
import {ArticleInterface} from "../../interfaces/article.interface";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

function isNullOrUndefined(object:any):boolean
{
  return object === undefined || object === null;
}

@Component({
  selector: 'ptb-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {
  public createItemForm: FormGroup;
  @ViewChildren('propertyInput') propertyInputs;

  private name:string = "";
  private image:string = "";
  private category:string = "";
  private propertyToggle:boolean = true;
  private isLoading:boolean = false;
  imgURL: any;

  private _selectCategory:Array<TerraSelectBoxValueInterface> = [
  ];
  constructor(
      public _statsDataService:OverviewDataService,
      private _alert:AlertService,
      private router: Router,
  )
  { }

  ngOnInit() {
      this.createItemForm = new FormGroup({
          name: new FormControl( '',[Validators.required]),
          category: new FormControl( '',[Validators.required])
      });
    this.loadPropertyNames();
    this.loadCategorys();
  }

    public hasError = (controlName: string, errorName: string) =>{
        return this.createItemForm.controls[controlName].hasError(errorName);
    }

  private getPropertyIdByName(name:string):number{
    for (let [key, value] of Object.entries(this._statsDataService.propertyNames)) {
      if(value == name){
        return parseInt(key);
      }
    }
    return 0;
  }

  public createItem():void
  {
    if(this.createItemForm.status == "INVALID"){
        this.createItemForm.get('name').markAsTouched();
        this.createItemForm.get('category').markAsTouched();
        return;
    }

    this.name = this.createItemForm.get('name').value;
    this.category = this.createItemForm.get('category').value;

    let propertyPostData = [];
    let property = {
      id: 0,
      name: ''
    };
    for(let input of this.propertyInputs.toArray()){
        input = input.nativeElement;
      if (input.value === undefined || input.value.length === 0){
        continue;
      }
      let property = {
        id: this.getPropertyIdByName(input.name),
        name: input.value
      };
      propertyPostData.push(property);
    }
    let itemData = {
        name: this.name,
        image: this.image, //this.image = terra overlay
        categoryId: this.category,
        properties: propertyPostData
    };

    if(this.name.length <= 0)
    {
      this._alert.error("Name muss ausgefüllt werden");
      return;
    }

    if(this.category == "0" || this.category.length === 0)
    {
      this._alert.error("Es muss eine Kategorie ausgewählt werden");
      return;
    }

    this._statsDataService.postRestCallData('plugin/equipmentRental/createItem', itemData).subscribe((article:any) =>
        {
          this._statsDataService.articlesResult.push(
              {
                id: article.id,
                name: (article.name !== null) ? article.name : 'NONAME',
                image: article.image,
                category: parseInt(this.category),
                attributes: article.variationAttributeValues,
                properties: article.properties,
                available: article.isAvailable,
                user: article.user,
                rent_until: article.rent_until
              });
          this._alert.success('Das Gerät wurde erfolgreich angelegt');
          this.router.navigateByUrl('plugin/overview/'+article.id);
        }, error =>
        {
          this._alert.error('Fehler beim Anlegen des Gerätes');
        }
    );
  }

  public parseProperties():void
  {
    this.isLoading = false;
  }

  public loadPropertyNames():void
  {
    let actualLang: string = 'de';
    if(this._statsDataService.propertyNames.length === 0){
      this._statsDataService.getRestCallData('rest/properties').subscribe((response: any) => {
            this.isLoading = true;
            if (Object.keys(response).length > 0) {
              for (let property of response['entries']) {
                let propertyName: string = 'NONAME';
                for (let name of property.names) {
                  if (name.lang === actualLang) {
                    propertyName = name.name;
                    break;
                  }
                }
                this._statsDataService.propertyNames[property.id] = propertyName;
              }
              this.parseProperties();
            }
          }, error => {
            this._alert.error('Fehler beim Laden der Eigenschaften');
          }
      );
    }
    else{
      this.parseProperties();
    }
  }

  public loadCategorys():void{
    this.isLoading = true;
    if(Object.keys(this._statsDataService.categoryNames).length === 0)
    {
      this._statsDataService.getRestCallData('rest/categories').subscribe((response: any) => {
            if (isNullOrUndefined(response.entries)) {
              return;
            }
            for (let category of response.entries) {
              this._statsDataService.categoryNames.set(category.id, category.details[0].name);
              this._selectCategory.push(
                  {
                    value:  category.id,
                    caption: this._statsDataService.categoryNames.get(category.id)
                  }
              );
            }
            this.isLoading = false;
          }, error => {
            this.isLoading = false;
            this._alert.error('Fehler beim Laden der Kategorien');
          }
      );
    }
  }
}
