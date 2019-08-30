import { Component, OnInit } from '@angular/core';
import {OverviewDataService} from "../../services/overview-view.service";
import {SettingsInterface} from "../../interfaces/settings.interface";
import {AlertService, TerraSelectBoxValueInterface} from "@plentymarkets/terra-components";
import {ArticleInterface} from "../../interfaces/article.interface";

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
  selectedFile: File;

  private name:string = "";
  private image:string = "";
  private category:string = "";
  private base64Image:string = "";
  private propertyToggle:boolean = true;
  private isLoading:boolean = false;
  public imagePath;
  imgURL: any;

  private _selectCategory:Array<TerraSelectBoxValueInterface> = [
    {
      value: 0,
      caption: 'Bitte Auswählen'
    }
  ];
  constructor(
      public _statsDataService:OverviewDataService,
      private _alert:AlertService
  )
  { }

  ngOnInit() {
    this.loadPropertyNames();
    this.loadCategorys();
  }

  public createItem():void
  {
    let itemData = {
        name: this.name,
        image: this.image, //this.image = terra overlay
        categoryId: this.category,
    };

    if(this.name.length <= 0)
    {
      this._alert.error("Name muss ausgefüllt werden");
      return;
    }

    if(this.category == "0")
    {
      this._alert.error("Es muss eine Kategorie ausgewählt werden");
      return;
    }

    this._statsDataService.postRestCallData('plugin/equipmentRental/createItem', itemData).subscribe((response:any) =>
        {
            console.log(response);
        }, error =>
        {
          this._alert.error('Fehler beim Anlegen des Gerätes');
        }
    );
    console.log(itemData);
  }

  public addAttribute():void
  {

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
                this._statsDataService.propertyNames[property.position] = propertyName;
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
    //this.isLoading = true;
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
          }, error => {
            this.isLoading = false;
            this._alert.error('Fehler beim Laden der Kategorien');
          }
      );
    }
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64Image = btoa(binaryString);
    console.log(btoa(binaryString));
  }

  onFileChanged(event) {
    this.preview(event.target.files);
    this.selectedFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload =this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(event.target.files[0]);
    }

    console.log(this.selectedFile);
  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      console.log("nicht unterstützt");
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
}
