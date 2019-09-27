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

    constructor(private http:HttpClient)
    {
        if(!environment.production)
        {
            this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjViYzM2N2FkZjQ0YTZjNGQ2NGE4YTE5ZTNjMGQ5YzA5NGM1NGY5MmY1ZGIyZmRiMmRhNzQyMDMwNTAwODIzN2YxZmEwZDMxOTQ3ZTVlNTEzIn0.eyJhdWQiOiIxIiwianRpIjoiNWJjMzY3YWRmNDRhNmM0ZDY0YThhMTllM2MwZDljMDk0YzU0ZjkyZjVkYjJmZGIyZGE3NDIwMzA1MDA4MjM3ZjFmYTBkMzE5NDdlNWU1MTMiLCJpYXQiOjE1Njk1NjQ2MDIsIm5iZiI6MTU2OTU2NDYwMiwiZXhwIjoxNTY5NjUxMDAyLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.kR52L2YmtmRP5fro7IFnawUFB93kYRTF8r4iUuoghDqbGK9FwGmZEtzyCGhWHtGkdZqYm20MhecnLanmZ5NZbqHEMRDXVGyJ6BqghKqqyRcNg4g4JU5MqpZfyMg14D20CKNpvnk8AlAIJOtLXGDl8bPjhyA3bHreKPTJkFOgZND7jtC2_5lV9fgC_2zbVkY75rtQaBBhebibSKipT9XVzb1UtVyKB-6ytfiJWqArF_LPChS-IpEKahN0swNHKQ2MscvclgSD6QnZGcu3U_7Y0iElYMTZ4BmdEj7AMUoBcdE69PZDBKcvcNIABTFqtbn1k8bJabs6DjmqlSq985mDBYXhYqCasNnBmPnFoN4bwLBlmWf-m0vuZipHDsNeinlgPqp-BhXwBTurpVxGfSea4ykoqj8QEoNN1dl7FDlVu0uEBnJVA9htTUww2HpK9tljLQKaALbXWQqimkzoOIIL_RC2DwaTLmN_y_3Mgo4fhAQo7NPBkqhsQWaZdJQA3GRaZ0J1kZBjFUKeneR8zslIoFxDWh2tDsHoOc7NcL-uv55CySV_Kgdt94o-c9rqZ5JhxfjfTeZswSe_4_enuvb0MyUrSL6AIvzequOud007_RDkSUqgIY84Wn6RJhxSTPi_vrdTPIuKt8J6IYmBRV7MapZWE9gKBX6hwjnQ15KV0d0';
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
