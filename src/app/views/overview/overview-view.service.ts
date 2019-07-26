import {Injectable} from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArticleInterface} from "../../core/article.interface";
import {RentInterface} from "./overview-view.component";
import {TerraSelectBoxValueInterface} from "@plentymarkets/terra-components";

@Injectable()
export class OverviewDataService
{
    protected token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjdkODcyZDJhY2NlNmYwNmU2NGY2NGE1ZDBhOGFiOWJkNTdmYzViNGZjNzI5MjFiYTQ5NmRjZDk2ZDFlZWZhOThkYjBjM2ZhMjQ1YTAzNjgzIn0.eyJhdWQiOiIxIiwianRpIjoiN2Q4NzJkMmFjY2U2ZjA2ZTY0ZjY0YTVkMGE4YWI5YmQ1N2ZjNWI0ZmM3MjkyMWJhNDk2ZGNkOTZkMWVlZmE5OGRiMGMzZmEyNDVhMDM2ODMiLCJpYXQiOjE1NjI5MTE0ODQsIm5iZiI6MTU2MjkxMTQ4NCwiZXhwIjoxNTYyOTk3ODg0LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.cHb1iHoeK3wxTlu0LLJo10jRvcoERN4LrMItEPNhSlp3mrbxTcE7l9RsSPLyuRFG9UgXkMuxApI6wCPleeTmC3lGO8S8LPGs-Vk9zn-qOMzWizb9t6rsx8Nk750fB_uWZfjKbgs8SaxwgvQ2RVwNBUHuVoCN3lN8AHoTrfv-KstaXs9R8TsXXOY6ObRXZD-okXVT8j0dTTk46PZyW4OvVV59S0gFnCADlS07BLgT5cKrLTTZawD9ZZWzQmCz6Ht6Vl-h19HCJiJ2cW7SAqhi0s3EPbN30dcvoyRAwDOabW91zEZgDr4Qt-AivD75fAvbzb94QKxy7wBHxe7afPYqeWMSXkQOcJ25K4xWLUBton-MPHr_fYJfEJulV-0iF7YGRierXAfjl7FTvOWDAwthJlDUvgjUabkLsXM0BWFGdJCE9epkzG_CcRYyf1My1ezTQ27AoF8mCiQoJqK-wxtb9DR1jT7Jf5oxGEqvNbuWKRp_iTP8QQ75TkbNT01ovcZC4Rzsh96TzDC2IMm_qevIYXEZgOccxiYXsfa3nwuKPcEqqN0fH4-WrzNHlywblhulpLHRB766uBubaMeEwfJ74d303fREjGu9sCU-CHWJBLVEQkQ1VTHalHdVeuqmciurLt_FcnRERIYuHFW2diB-wfK66vc7YsHAq7h1Cc1ieSk';
    public url:string = '/';
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

    constructor(private http:HttpClient)
    {
        if(process.env.ENV !== 'production')
        {
            this.url = 'http://master.login.plentymarkets.com' + this.url;

            localStorage.setItem('accessToken', this.token);
        }
    }

    public getRestCallData(restRoute:string)
    {
        return this.http.get(this.url + restRoute, {
            headers: this.headers
        });
    }


    public postRestCallData(restRoute:string, data:any):Observable <Object>
    {
        return this.http.post(this.url + restRoute, data,{
            headers: this.headers
        });
    }

    public deleteRestCallData(restRoute:string):Observable <Object>
    {
        return this.http.delete(this.url + restRoute,{
            headers: this.headers
        });
    }

    public putRestCallData(restRoute:string, data:any):Observable <Object>
    {
        return this.http.put(this.url + restRoute, data,{
            headers: this.headers
        });
    }

}
