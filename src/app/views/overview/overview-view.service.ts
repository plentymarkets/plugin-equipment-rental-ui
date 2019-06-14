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
            this.bearer = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImUxYTAzZWFkOGNiOGM1MDhkNDg2ZTQ1MGVlMWU2ODFmMDdkZjYyYWU1ZjRlNzY4MTQxMmY4NmEzOTViZjEzMzJiMDU0NzVhNzgxYWI4MjU3In0.eyJhdWQiOiIxIiwianRpIjoiZTFhMDNlYWQ4Y2I4YzUwOGQ0ODZlNDUwZWUxZTY4MWYwN2RmNjJhZTVmNGU3NjgxNDEyZjg2YTM5NWJmMTMzMmIwNTQ3NWE3ODFhYjgyNTciLCJpYXQiOjE1NjA0OTI5MTcsIm5iZiI6MTU2MDQ5MjkxNywiZXhwIjoxNTYwNTc5MzE3LCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.ZqqdAPDeSHp4p-WDKc-YlIt4cQ8VOQ9uL1yMBotDavVF0oUdCtMrK_g9mszqRGCuTHNUFHycNP_NgPSF9cx191Ze-xoyA7fvldtr3CwXDGJY0_hJ_lSK7K9iENUghlmc9vYYO6Q0qr-S2KuwKUVNlDf-IJX4Ye8A45TbV0b0um0ZyquNvzVsMmkv91MhgdGHdVh2ewYrjYxB3yxxCzCgOB-XLQGfOTOldDMzLTU5UJq7zDXmg7A5b88t8nYTXsPeioTyy6vayOggeD4Vp08Pa6RZj2wcdKqK5h7rrL5XBs0K5CrC7ju1vgP2jde6oUODLTHdq40J0kEEFA4i2pM2_WQ_R8G3R8YxmnfJVt3fG7MmyqOIRj7QGEvoowsJ6Py_tZ9QLUtcFMrEB7zMM9R4xd4zzldlYZNusDoUbnRyT0B-UYT-qghOdyyNCedgnBc4AEdM2pxu3AKf2Wm1iJhcMS9krzMdA8Dcrhnfox-dN5em_rZIf-pZsmZxEt6RlIHR4n-YU-13TcCWDwC2keN5XmxtL8NZeu-VzWTk8Bl9PMVqRhDXDosDdeHWocW1czIY9qwqV4nEByieKUFwR4xqfwH1PxVekY_ldzOIdp6M50j1UMnW7NQAqJRk1Gw2Fxg8Hc-W7Q3ElTrwfd3P9I-QZ7uUZEEQftxv-TJduqN64e0';
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

    public postRestCallData(restRoute:string, data:any):Observable <Array<any>>
    {
        let url:string;
        url = this.url + restRoute;
        return this.mapRequest(
            this.http.post(url, data)
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

    public putRestCallData(restRoute:string, data:any):Observable <Array<any>>
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
