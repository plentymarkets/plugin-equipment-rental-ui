import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TerraSelectBoxValueInterface } from "@plentymarkets/terra-components";
import { ArticleInterface } from '../interfaces/article.interface';
import { RentInterface } from "../interfaces/rent.interface";
import { environment } from "../../environments/environment";

@Injectable()
export class OverviewDataService
{
    public url:string = "";
    public token:string = "";
    public headers:HttpHeaders = new HttpHeaders();

    public articlesResult:Array<ArticleInterface>; // Array with all results
    public articles:Array<ArticleInterface>; // Copy of array to filter items
    public articlesRentInformation:Array<RentInterface> = [];

    public settings:Map<string, any> = new Map<string, any>();
    public categoryNames:Map<number, string> = new Map<number, string>();

    public _actualArticleIsRent:boolean;
    public _actualArticleData:RentInterface;
    public history:Array<any> = [];
    public  _actualArticleKey:any = 0;
    public _actualArticleId:number = 0;
    public propertyNames:Array<string> = [];
    public _selectUser:Array<TerraSelectBoxValueInterface> = [
        {
            value: 0,
            caption: 'Alle'
        }
    ];
    public _selectCategory:Array<TerraSelectBoxValueInterface> = [
        {
            value: 0,
            caption: 'Alle'
        }
    ];

    public userData = [];

    constructor(private http:HttpClient)
    {
        if(!environment.production)
        {
            this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ2OTUwMTA4ZWE3ODJjNTliNjFkYWNiYTkzMjNkYjk3ZjY5NmMyYjM5NjFiZDRmZTFhMGFhNjIyNjRiOWRhNGFlOGY5ZWZkNDViM2QzZWY5In0.eyJhdWQiOiIxIiwianRpIjoiZDY5NTAxMDhlYTc4MmM1OWI2MWRhY2JhOTMyM2RiOTdmNjk2YzJiMzk2MWJkNGZlMWEwYWE2MjI2NGI5ZGE0YWU4ZjllZmQ0NWIzZDNlZjkiLCJpYXQiOjE1Nzk4NTA3NjMsIm5iZiI6MTU3OTg1MDc2MywiZXhwIjoxNTc5OTM3MTYzLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.TaAComW3Uj9Yd0ruurSlVC7-e9MbU59Q3b3R2RjUDRhxEimwSLmnuj8jpbRv5Z4ZbsIk3P2XSRTgka7hQXBqmmk7PmJ952qf1keBVzvuGkXtYvNX00yiv8MDs6AIgxkoehY978LBc_Ye35lVRzZME-kcEMBekgoDcYz_Nq01q1aoad-nu3Eg8h-pV4jA2SRIapawrOBhzpoBat9vyh4_NXbU_SisJJzzMH3ofwA4HhVRWWu97x3usKlkhkesji2unK-oGy7YLm2IC2K3gHYXRvl4lz8kguXZ7dow73k97ImOZA5X2V0X056zID5MQ1mZOKCU3PUZo9fvBPKFmXOkkwJfo_8nvvkczzfbZ6u-_C3k9_K6x5gHfUZp3HqljUKXnS2CojmIBgCo_HpwYaWF4R_nJ6KkOwDZL2VIUEk1cWc1o1468f4gbkaH7dsM7-PScGOE-hzoCMaon0XiL9Lz5UjxBsKI_6Rr_lUZHNuRdwHclUeBhulvrPQckkimHSwL7BbgsZ98UqAiU8ZbIxeBRR5CL5XP19NOF4jOjaJUtYyB7Di6LPvHORHpEamoSIPm3Sl_9aUl2Z0VNy_24BYYCL4eehFDz2ciib_aYi9E-Q_Onm0znbXcUGzBMsTWNL7x7hSu7jk8l2N6_lprPiqPYVGxS-9ZTjN32M_iRSM_5z8';
            this.url = 'http://master.login.plentymarkets.com' + this.url;
            localStorage.setItem('accessToken', this.token);
        }
    }

    public getRestCallData(restRoute:string)
    {
        return this.http.get(this.url + '/' + restRoute);
    }


    public postRestCallData(restRoute:string, data:any):Observable <Object>
    {
        return this.http.post(this.url + '/' + restRoute, data);
    }

    public deleteRestCallData(restRoute:string):Observable <Object>
    {
        return this.http.delete(this.url + '/' + restRoute,{
            headers: this.headers
        });
    }

    public putRestCallData(restRoute:string, data:any):Observable <Object>
    {
        return this.http.put(this.url + '/' + restRoute, data,);
    }

    public getUsers(): Observable<any> {
        return this.http.get(this.url + '/rest/users?columns=id,user,real_name,Ustatus');
    }

    public isJsonString(str:string):boolean
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

}
