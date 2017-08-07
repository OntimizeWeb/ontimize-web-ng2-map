import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'ontimize-web-ng2';

import { MainComponent } from './main.component';

import { BasicModule } from './basic/basic.module';
import { GeoJsonLayerModule } from './geojson-layer/geojson-layer.module';
import { HomeModule } from './home/home.module';
import { MarkerLayerModule } from './marker-layer/marker-layer.module';
import { WmsLayerModule } from './wms-layer/wms-layer.module';

export function loadBasicModule() {
  return BasicModule;
}

export function loadGeoJsonLayerModule() {
  return GeoJsonLayerModule;
}

export function loadHomeModule() {
  return HomeModule;
}

export function loadMarkerLayerModule() {
  return MarkerLayerModule;
}

export function loadWmsLayerModule() {
  return WmsLayerModule;
}

export const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'basic',
        loadChildren: loadBasicModule
      },
      {
        path: 'geojson',
        loadChildren: loadGeoJsonLayerModule
      },
      {
        path: 'home',
        loadChildren: loadHomeModule
      },
      {
        path: 'marker',
        loadChildren: loadMarkerLayerModule
      },
      {
        path: 'wms',
        loadChildren: loadWmsLayerModule
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }