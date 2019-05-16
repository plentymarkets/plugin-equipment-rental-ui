import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import {
    TerraBaseService,
    TerraLoadingSpinnerService
} from '@plentymarkets/terra-components';


@Injectable()
export class ExampleDataService extends TerraBaseService
{
    public bearer:string;
    private _basePathUrl:string;
    constructor(private _loadingSpinnerService:TerraLoadingSpinnerService,
                private _http:Http)
    {
        super(_loadingSpinnerService, _http, '/rest/');
        if(process.env.ENV !== 'production')
        {
            // tslint:disable-next-line:max-line-length
            this.bearer = 'fSEi9jGnOlGUNYspmCaOw6KjAfg-MkpL6MkH91cz9GHeRluLzIP89jGKxabeArvcvBhMJQ557UMge4usumqi68BeiKH-_0odgQXihH18IMQLJR0ZKBC5LFUg0EUCSb5BynW-dQXujBbT2UaVyWw3VFhnzf7orEFYG6i9obQd8XuHy0KtJtISClMZO7-bQVXpSfGQJLdMjvlBvnnBxOqC5HGE-rGCrqWAnuNmK7lZ4EIaD2L8fkXryEHHRk-y1C_o9HFByvVZse4RGMPFciJW2NZ2ATJjfhbJCcQ1liUaLM46pecT66608pUleJ0xQ_33tIo6JA973OAx0drliAZzLVnBeA24aj2EJMQhZ_3kwvXPwbtWY3Euww_FjIYV_6Jsp_dQr8IWeTlyNPCFBRCuCZg8qe1RAw4cipmkKCYpggET5zdXQBI';
            this._basePathUrl = 'http://master.login.plentymarkets.com';
            this.url = this._basePathUrl + this.url;
        }
        this.setHeader();
    }

    public getRestCallData(restRoute:string):Observable <Array<any>>
    {
        this.setAuthorization();
        let url:string;
        url = this._basePathUrl + restRoute;
        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }

    private setHeader():void
    {
        if(this.bearer !== null && this.bearer.length > 0)
        {
            this.headers.set('Authorization', 'Bearer ' + this.bearer);
        }
    }
}
