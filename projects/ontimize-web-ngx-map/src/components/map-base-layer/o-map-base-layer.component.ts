import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { InputConverter } from 'ontimize-web-ngx';
import { Subscription } from 'rxjs';

import { OMapComponent } from '../../components/map/o-map.component';
import { BaseLayer, OSearchable, OSearchResult } from '../../interfaces';

@Component({
  moduleId: module.id,
  selector: 'o-map-base-layer',
  providers: [],
  inputs: [
    'id: layer-id',
    'name: title',
    'urlTemplate: src',
    'active'
  ],
  templateUrl: './o-map-base-layer.component.html',
  styleUrls: ['./o-map-base-layer.component.scss']
})
export class OMapBaseLayerComponent implements OnInit, OnDestroy, BaseLayer, OSearchable {

  id: string;

  @InputConverter()
  active: boolean = false;

  protected _name: string;
  protected _urlTemplate: string;
  protected onMapReadySubscription: Subscription;

  public oSearchKeys: Array<string> = ['name'];
  get oSearchResult(): OSearchResult {
    return {
      label: this.name,
      icon: 'map',
      buttons: [{
        icon: ['visibility', 'visibility_off'],
        status: () => this.active,
        callback: () => this.select()
      }]
    };
  }

  constructor(
    @Inject(forwardRef(() => OMapComponent)) protected oMap: OMapComponent
  ) { }

  ngOnInit() {
    if (this.oMap) {
      var self = this;
      this.onMapReadySubscription = this.oMap.onMapAfterViewInit().subscribe(() => {
        self.oMap.getLMap().on('baselayerchange', (evt) => {
          self.updateActiveState(evt['name']);
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.onMapReadySubscription) {
      this.onMapReadySubscription.unsubscribe();
    }
  }

  updateActiveState(layerId: string) {
    if (layerId === this.name) {
      this.active = true;
    } else {
      this.active = false;
    }
  }

  select(): boolean {
    this.oMap.unselectBaseLayers();
    this.oMap.getMapService().selectBaseLayer(this.id);
    return this.active = true;
  }

  get urlTemplate(): string {
    return this._urlTemplate;
  }

  set urlTemplate(val: string) {
    this._urlTemplate = val;
  }

  get name(): string {
    return this._name;
  }

  set name(val: string) {
    this._name = val;
  }
}
