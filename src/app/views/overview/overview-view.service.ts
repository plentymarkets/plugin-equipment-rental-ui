import {Injectable} from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class OverviewDataService
{
    protected token = 'YOUR_TOKEN_HERE';
    public url:string = '/';
    public headers:HttpHeaders = new HttpHeaders();

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
