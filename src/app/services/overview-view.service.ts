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
            this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJlM2EwYTlmOWNkZjY3MTZmYWFkZmRiYTliOWY0NTI1ZjMwYzk4YTcwZDYwOGM0NTM1NWVjNDNjMTBlZWQxYmVmMmNlYmRmZjY2YWZjMTQxIn0.eyJhdWQiOiIxIiwianRpIjoiMmUzYTBhOWY5Y2RmNjcxNmZhYWRmZGJhOWI5ZjQ1MjVmMzBjOThhNzBkNjA4YzQ1MzU1ZWM0M2MxMGVlZDFiZWYyY2ViZGZmNjZhZmMxNDEiLCJpYXQiOjE1NjQxMjE1NzksIm5iZiI6MTU2NDEyMTU3OSwiZXhwIjoxNTY0MjA3OTc5LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.h2Yvyu7E2_xD_eaaB2fnsI3EQEQfzVwDgse4jMYoWk77fPP1k-05yQLIqaKWe-aGjImdNLyddXqxWdEb-AaHsW_tb8UPJICwR6IDHrF6a6hy5nQ08899vhPgJDV_ulcwCRWVD1V_7AOMTSYwGI3fy6ok24gAgDh4jIjz1taRZeidXYXRvuJxiMHN4oOENg7YZqiZS2E1ZCJ_k3eO_XLm-JSxyV2MSP8B9LMyxqpez_r3s9i6-A_hgjYsaIaBXsPqDixTxBWzFbivyXs9jrcW2P7Z1mHsZJMTeRwSo9WHUNmRyE5WvHfeSxmkFFlv0zkoVzbjoTjKUT6boKIFpBqPqmWg601mNsjDgujGDG1qq5yelCyVhdLflIO59hn14KoabPcAxy_BYZt_esU1pwZzKOQsSydzZZi6bxcBkiAo-qbKTa_GemBJUwtXLIcFDJwXH_6H0GWhAlxITSqkQIGvQljTSrSND7Uy4vENv_mIcy0-rwz9gorBvpa0b0ZJVAQR5BvrsDqNOC0E4OwleLwapEZO3xO_3E9oRjHfvMie8wlhFFWtsI3FI4yETwWeDGS3W33V7-HYrxrE_p-vx6XfhGMh7Z5LrcXQR58H0E3sGNcoL2fJU6FdK8ett9vVzMfgdKP_sVeT2Vi283364wGKf_t6G9YFA0X1S-PorbzmGqc';
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
