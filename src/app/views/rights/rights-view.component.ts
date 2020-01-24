import {Component, OnInit, ViewChild} from '@angular/core';
import {
  TerraBreadcrumbsComponent, TerraBreadcrumbsService,
  TerraDataTableHeaderCellInterface,
  TerraMultiCheckBoxValueInterface,
  TerraTextAlignEnum
} from "@plentymarkets/terra-components";
import {OverviewDataService} from "../../services/overview-view.service";
import {UserTableService} from "../../services/user.service";
import {UserRightsInterface} from "../../interfaces/userrights.interface";
import {RouterViewComponent} from "../router/router-view.component";

@Component({
  selector: 'ptb-rights-view',
  templateUrl: './rights-view.component.html',
  styleUrls: ['./rights-view.component.scss'],
  providers: [UserTableService]
})
export class RightsViewComponent implements OnInit {
  public userId:string = '';
  public userName:string = '';
  public headerList:Array<TerraDataTableHeaderCellInterface> = [
    {
      caption: 'ID',
      sortBy:  'id',
      width:   10,
      textAlign: TerraTextAlignEnum.LEFT
    },
    {
      caption: 'Name',
      sortBy:  'real_name',
      width:   10,
      textAlign: TerraTextAlignEnum.LEFT
    },
    {
      caption: 'Benutzername',
      sortBy:  'user',
      width:   10,
      textAlign: TerraTextAlignEnum.LEFT
    },
    {
      caption: 'Zugang',
      sortBy:  'user',
      width:   10,
      textAlign: TerraTextAlignEnum.LEFT
    },
  ];
  public contextMenu = [];

  constructor(private dataService: OverviewDataService,
              private userService:UserTableService) {}

  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Load the users
   */
  private loadUsers():void
  {
    if(this.dataService.userData.length > 0){
      this.addUsersToTable(this.dataService.userData);
    }
    else{
      this.dataService.getUsers().subscribe((response: any) => {
        this.dataService.userData = response.entries;
        this.addUsersToTable(this.dataService.userData);
      });
    }
  }

  private addUsersToTable(users):void
  {
    for(let user of users){
      this.userService.addEntry(user);
    }
    this.userService.getResults();
  }

  private getUserType(value:number):string
  {
    let types = ['','Admin','Backend'];
    return types[value] === undefined ? 'Unbekannt' : types[value];
  }

}
