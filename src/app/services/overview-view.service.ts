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
            this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImE0ODM3OTkzNGE4NzhiYmQyYWQ0NDU1ZDFiNTMxNzUyODA5YTExNTIzNTRiMTI2MTZlNDE1OTFjNGM0YjE2Y2VkNWQ0MjM0M2JmNGU2MjliIn0.eyJhdWQiOiIxIiwianRpIjoiYTQ4Mzc5OTM0YTg3OGJiZDJhZDQ0NTVkMWI1MzE3NTI4MDlhMTE1MjM1NGIxMjYxNmU0MTU5MWM0YzRiMTZjZWQ1ZDQyMzQzYmY0ZTYyOWIiLCJpYXQiOjE1NjcxNDU2NTgsIm5iZiI6MTU2NzE0NTY1OCwiZXhwIjoxNTY3MjMyMDU3LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.CC0q7GtxnsNJCQs9jvU6VW-9_F-9f_f-5i3eWKRSMvDZW6hN7tPRkfiiWS8TwKZZKPGRxAZk-omN4EUbMY5WmUZlUxgbwbjrgKV1KwRV29MZOz-mv74QU3s0wrFAaGFpRP8FOobU5mO71f7foX3s44B-Wn1PBee7RJ0Xd71tsQvD26dkzaxUhsEarNBvs8JvdvTYjtLiEdyixM3kgBY3gvviamZjQKewmm5gmxX-9QJEwoN6HD8z4VdaRw74AcbcAiCF0kGTsTMI9XolQYsO8LsfSH7y1wuZjJ725fQoRss-HsKygL2hyjAkQKpp87NeZEmVG2F6T0BCHSZCX4DGKiZ_laRZUl6sNJ-5aJB0OL288FMKUa5KIydhWcfGQsHecu0mMswixvbUZIoJOVIns2oCZt1QOlEfGTIvmvLlSiQDytcKRVu62tx32Uu-MOlmKChcV2A6dgIkK85e_nP9wcQpnOdEmLShPVQ9P-xX1tWA3Bo34W4Qofk4-15WVHN5fB7MZeZWwmYBk5q33t_lO7cXgpNLVY7qU8Cbs6Ze9ztCAe34STrgCCkCM3uljeY7vKDSgoJ8h6h15vR8CSgxzZWzf0jM9Hbxqo-s2tIfVcrRQlieobP86W5XLe5L_3RQnpcSIpo0_7m_eWQ3F866rCoupgWvBc8fvV7KQnIraW8';
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
