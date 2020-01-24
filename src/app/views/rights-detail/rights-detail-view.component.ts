import {Component, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {TerraMultiCheckBoxValueInterface} from "@plentymarkets/terra-components";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'ptb-rights-detail-view',
  templateUrl: './rights-detail-view.component.html',
  styleUrls: ['./rights-detail-view.component.scss']
})
export class RightsDetailViewComponent implements OnInit,OnDestroy {
  private userId:string = '0';
  public values:Array<TerraMultiCheckBoxValueInterface> = [
    {
      value:    'read',
      caption:  'Geräteübersicht sehen',
      selected: true
    },
    {
      value:    'write',
      caption:  'Geräte verleihen und verwalten',
      selected: false
    }
  ];
  private routerSub:any;
  constructor(private activeRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnDestroy(){
    this.routerSub.unsubscribe();
  }

  ngOnInit() {
    this.routerSub = this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        if (val.url.indexOf('/rights/') != -1) {
          console.log('test');
          let splitUrl = val.url.split('/');
          let userId = splitUrl[splitUrl.length - 1];
          this.loadUserRights(userId);
        }
      }
    });
    const routeParams = this.activeRoute.snapshot.params;
    this.loadUserRights(routeParams.userId);
  }

  private loadUserRights(userId:string):void
  {
    this.userId = userId;
  }

}
