import {
    Component,
    ViewChild
} from '@angular/core';
import {
    TerraBreadcrumbsComponent,
    TerraBreadcrumbsService
} from '@plentymarkets/terra-components';

@Component({
    selector: 'router-view',
    templateUrl: './router-view.component.html',
    styleUrls:   ['./router-view.component.scss']
})
export class RouterViewComponent
{
    @ViewChild(TerraBreadcrumbsComponent)
    private breadcrumbs:TerraBreadcrumbsComponent;

    public get breadcrumbsService():TerraBreadcrumbsService
    {
        return this.breadcrumbs.breadcrumbsService;
    }
}
