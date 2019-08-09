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

  private name:string = "";
  private image:string = "";
  private category:string = "";

  private isLoading:boolean = false;

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
  }

  public createItem():void
  {
    let itemData = {
      name: this.name,
      image: this.image,
      category: this.category,
    };

    if(this.name.length <= 0)
    {
      this._alert.error("Name muss ausgefüllt werden");
      return;
    }


    let data = {
      "variations": {
        "variation": {
          "name": this.name,
          "variationCategories": [
            {
              "categoryId": 23
            }
          ],
          "unit": {
            "unitId": 1,
            "content": 1
          }
        }
      }
    };
    this._statsDataService.postRestCallData('rest/items', data).subscribe((response:any) =>
        {
            if(!isNullOrUndefined(response.variations))
            {
                let id = response.variations[0].id;
                this._statsDataService.getRestCallData('plugin/equipmentRental/rentalDeviceById?id='+id).subscribe((response:ArticleInterface) =>
                    {
                        console.log(response);
                        this._statsDataService.articlesResult.push(response);
                    },error =>
                    {
                        this._alert.error('Fehler beim Laden der Daten');
                    }
                );

            }
        }, error =>
        {
          this._alert.error('Fehler beim Ausleihen des Gerätes');
        }
    );
    console.log(itemData);
  }

}
