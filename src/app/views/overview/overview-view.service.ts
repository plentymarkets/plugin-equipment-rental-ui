import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {TerraBaseService, TerraLoadingSpinnerService} from '@plentymarkets/terra-components';


@Injectable()
export class OverviewDataService extends TerraBaseService
{
    public bearer:string;
    constructor(private _loadingSpinnerService:TerraLoadingSpinnerService,
                private _http:Http)
    {
        super(_loadingSpinnerService, _http, '/');
        if(process.env.ENV !== 'production')
        {
            // tslint:disable-next-line:max-line-length
            this.bearer = 'YOUR_TOKEN_HERE';
            this.url = 'http://master.login.plentymarkets.com/';
            this.setToHeader('Authorization', 'Bearer ' + this.bearer);
        }
        this.setAuthorization();
    }

    public getRestCallData(restRoute:string):Observable <Array<any>>
    {
        let url:string;
        url = this.url + restRoute;
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }

    public postRestCallData(restRoute:string,data:any):Observable <Array<any>>
    {
        let url:string;
        url = this.url + restRoute;
        return this.mapRequest(
            this.http.post(url,data)
        );
    }

    public deleteRestCallData(restRoute:string):Observable <Array<any>>
    {
        let url:string;
        url = this.url + restRoute;
        return this.mapRequest(
            this.http.delete(url,{
                headers: this.headers
            })
        );
    }

    public putRestCallData(restRoute:string,data:any):Observable <Array<any>>
    {
        let url:string;
        url = this.url + restRoute;
        return this.mapRequest(
            this.http.put(url,data,{
                headers: this.headers
            })
        );
    }

}
