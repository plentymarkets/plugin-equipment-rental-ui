import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {TerraPagerInterface, TerraSelectBoxValueInterface} from "@plentymarkets/terra-components";
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
            this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ0MWM4ZDU0MzJjODcyNzA3MWEwMjk1NWU5NjEzZDM4MTg0MTk3NDY1ZDIzZGEwNWIzZGQwN2IyM2MxNDI5Yzk1NzY3NTIwMjFkOTBiZGJkIn0.eyJhdWQiOiIxIiwianRpIjoiZDQxYzhkNTQzMmM4NzI3MDcxYTAyOTU1ZTk2MTNkMzgxODQxOTc0NjVkMjNkYTA1YjNkZDA3YjIzYzE0MjljOTU3Njc1MjAyMWQ5MGJkYmQiLCJpYXQiOjE1NzE5ODY5MjEsIm5iZiI6MTU3MTk4NjkyMSwiZXhwIjoxNTcyMDczMzIxLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.AaSdMHJr_Ycben3_IBmqRzGfAhH5geRrpqzQdyOijUJJ7dLfXIVM-nHtEFywXFIGkRDMvQ38yaMwnmauvcwlQ_UHTYZyNCP6vffh7Icd8wVOMamdt3VtVxMIKsfef1MDk28TuX0HdDE5jGPTVJrzM-gAXaXbkfuPRtmxxafiVoKIWGa6fcA_ecovdnQB73N9XpkbaiCD0ZzHcm8Oi81THv__crF-_mHZWk_B1IsaHJGx6RFMhMmwVpPiZZaP_3i6pLAlBpciWQbTK9cXImlGDlm9gKBMsO2Ft0XPO9RZTTsem0qlwgpfqXaC77haV2l_03nTOL4m_5SBwI9y7J0XsQiPc0Lnj_0ORT0ilEFf4WG4ue0QvNsOWE7806Y6SFKqJUMwt1KUOFysuPA6WTWljKabG27Bn6bHttgY0yu3TOQS5WZ2MFEL0llkEaQPvYZ-qjspq1kJVbVo_-S8dB3uJmgPer0w1Ijkw3z39cdSYMRkYvczW0G85rTpttXSVDCN55Lix3tsydxp36_ic_RDIy47h0UoV0p-tgtvfPmlsLzYj8mbErazb6YJOP8F6Ki4-5EoFvVJ4LhpJG1K1g0oRiqqscDwrJJWi_ncXgYYRw1-1SnHKa9NWl1sr2JbuUEom-90j2rgHIZX0WEXhQGoHv1AHw6h8aTy0qnqpbtyEE8';
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

    public getLogEntries(params:any):Observable<any>
    {
        return this.http.get(this.url + '/plugin/equipmentRental/log',{
            params: params,
        });
    }

}
