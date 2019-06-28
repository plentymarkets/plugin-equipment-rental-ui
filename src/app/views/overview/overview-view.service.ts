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
            this.bearer = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjkwOTc0OGI1YWQ1NzdkODhmMzJmMTNjYzJkNjE1NzY0MDExN2U1ZmI0M2M4NTdjZmMyNTVlNjQzNzM4NDAyMjQzMWUzZWY1ZmI2NDFmNGM2In0.eyJhdWQiOiIxIiwianRpIjoiOTA5NzQ4YjVhZDU3N2Q4OGYzMmYxM2NjMmQ2MTU3NjQwMTE3ZTVmYjQzYzg1N2NmYzI1NWU2NDM3Mzg0MDIyNDMxZTNlZjVmYjY0MWY0YzYiLCJpYXQiOjE1NjE3MDIyMzIsIm5iZiI6MTU2MTcwMjIzMiwiZXhwIjoxNTYxNzg4NjMyLCJzdWIiOiIzIiwic2NvcGVzIjpbIioiXX0.Lkp52O7dMh4MSGMiY5EfQ6t9Sliyg-nBRcPzpBN_o5MUHLQ-yiB92_Lw3fbBwyqzRHEo8wK-Ui_6f-EZWHPXFsm18QrH0Ulk04ishf5UhMjXCQOHlUBCql8jkBIfdV4lyhs5ExbEUk0m4kqB1_Sdl6huepxZifFJI6Sa-3tF0SaoeXLctI2JYIVkNJOB21ad3en0MpyjTdSu2AQqW_5BgjmmKPKjT8a3XkV45_haGRomKuW1YWuucPlch8OMXi_-RMALfEjIJD3c7ubSF3WuFkjpT-Z3YCDZYvVSmwmoJgM1uVDM-fRt2ZFj3waWfLqy-RXqYeOu_e-pwawPu4lKqPtG9TeQiG6nwHsZ__TQCPZdGhIRgSDmD9ZVM_frKxgIWCK4C-6vdMRX9LjDNncGpWjp11sm6bariY7x4i3Gfvfa1FIM1hkl457JOdboxvqA6zwtCoxnNXADefRb3eAjQAHwsjqacAVfVzpUG1YNcOM08qE--RSawT9KBZaI9N_Hv1BYnuHCln9FfOn_NGfPRXHa3pO91LwGiQ5SWWtBuZOUKwgCyu8yR6KufigRmxr6y3qi5P3xALV7QGJ4kV550qOqy_p5YLKWd4ZUhgdvIVk89BE6UP1zqRW4CtryNvMWD21oh0C4zDxcMJZM07B1o-BqrLY3lSs1uku-5G2Wo4E';
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
