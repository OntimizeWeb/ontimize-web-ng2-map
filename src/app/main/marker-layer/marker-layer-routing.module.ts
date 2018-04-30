import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkerLayerComponent } from './marker-layer.component';

const routes: Routes = [
  {
    path: '',
    component: MarkerLayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkerLayerRoutingModule { }