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

    constructor(private http:HttpClient)
    {
        if(!environment.production)
        {
            this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImU2M2Y2NWMxZDY5YWY3MmE1ZDI0NTk3MDBhYzk0OTFiNzFmNDU3YWQzNmJjN2IwMzE3ZTNhZjJhNzIyODY3Yjg3YjFlMjE2NmMwN2QxNjFjIn0.eyJhdWQiOiIxIiwianRpIjoiZTYzZjY1YzFkNjlhZjcyYTVkMjQ1OTcwMGFjOTQ5MWI3MWY0NTdhZDM2YmM3YjAzMTdlM2FmMmE3MjI4NjdiODdiMWUyMTY2YzA3ZDE2MWMiLCJpYXQiOjE1NjUzMzE1MTksIm5iZiI6MTU2NTMzMTUxOSwiZXhwIjoxNTY1NDE3OTE5LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.SMShp3gdoQKzAeGlboTcNT0yGMe9zT0H_w-8UyD5zQLAjJIBDmpdtONMZbu-AMH9bJRhWbEE2apco5sKM2Rgha4uCGQg1V5iz4eagqoPmramG2uVFOZndmq1YC5AbPpdaI-FN3-xGkS1w2kwZlDHfNN9TKqnLNHPmY4bGIJJ07rmHMBYWmWHshvemYfz_WPjy8KbRRlq4JAi1RwYc9T6uiE8VkKZmUbRPGcRFXhtPu83HrEHPNcufZR5KDvqgslXQWJ0Rk4qfbtnaWN1et0tUBxeseXYPy3LBPnsl5fXthOOPHr_2Yf6hj2m9wsiaMdI6EQjhy63dkSidEVaACMZVl_D0fFFgCRLRHC4b_08GD03j7wFrnBjn-SG4_GCY_d8ywCGJWWMhDXW_wPk9ief_4HdCkR_xtUf26_WHeYxKWewSQ5nnxf0tT7HEHaDrhQwEG9gockYXuhBeK-wjTZGeWz2wjDTQOoeVdLBZsftFdNCse3gWucegc4ruaGwYu1VVuwK7wUFBm7O_jsCo1K17Ew6NVgFgR6aMF9cEBpm8klqfLkWA5gR9bhXHT62Q6RqABjQNcWeGbfqJinp441w-VDxBFDJagrsUQgHkkcb7AgSd-fqauF057Sbfgyt4ALMGqxLFdKX2AVWQcdNayS5hW8L9DnXv96vKMqLKlZwxCQ';
            this.url = 'http://master.login.plentymarkets.com/' + this.url;

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
