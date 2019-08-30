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
            this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjZmOWFmZDdiZDBkOGMyZDg5MDUzMWZiNjI1MDczYmEzNzgzNWQwYjlmOTZlNTA3NDYyMjI4NDI0MDMyYTE0NjdlYzk3MjFhZjUzOGQ5NmZmIn0.eyJhdWQiOiIxIiwianRpIjoiNmY5YWZkN2JkMGQ4YzJkODkwNTMxZmI2MjUwNzNiYTM3ODM1ZDBiOWY5NmU1MDc0NjIyMjg0MjQwMzJhMTQ2N2VjOTcyMWFmNTM4ZDk2ZmYiLCJpYXQiOjE1NjcxNDU3MDAsIm5iZiI6MTU2NzE0NTcwMCwiZXhwIjoxNTY3MjMyMTAwLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Z8wtuVPJc4mhRgqOVNfbDpM8KHafO8OFubvMbllimcWmyRAFXoiNnRpIvgz8_UIHJ-h9Zg0XPf8CeiEy2OopQa0_u1PNRI-r2_xRnN9IllgI95lRDm3bE8tErjzcu_RI3yrg_8re5-slHkEY3GEwIchccjgjf3w3oBhdH_sY2Od0vC7cgQkyaS6MWrRWfkgoaPsv6823--uMsL_EIu7eshABB6jrOkq7UItoO-_xO7As4mF-gwzjf_uhbK_zHdlkQSic-Dg3EknJLujX_uhXTs21oDTKn3zl81cywDMOb1nvWSviNI6zocSNk4ZiaxKkRXfjZ9ZBDUdNfet0L5TiAiKJ2xF4fFpOjHoR_6-SXqmV6KpBgrOA5fe8N_oQ4nK_UThG_i7NGuTLBS_MXkLUcuZm9AaiNGY8LIJMboLN-qbxgpgg6SDUNn4w3f1iIflxC5xUshOiCGoMvlnoEAl1h9ugPcqIpTpD5A6LLCEAe5FHnMT_Ehznip5YK6eyyFeYg1ni4XoPXkVqYjaBEsahzaKXe17AYIpZ1iZ6hzwiG4pOt1bWruPRgu9cyWuwg5b2s_0Singwwg8W7BApfRAj2CYSLF3KZwiV2WRlrlhYuvErKIaFV4YauB1RDSqp-ZzgJyqpXE5zzpKrox7TubbdT31gcno1PhkFRBxxMoaKads';
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
