import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import { Subject, of, switchMap, take } from 'rxjs';
import * as GMAPILoader from '@googlemaps/js-api-loader';
import { AppService } from './app.service';
import { BuildingInsightsResponse, SolarPanel, SolarPotential } from './models/solar';
import { createPalette, normalize, rgbToColor } from './visualize';
import { panelsPalette } from './color';
import { GOOGLE_API_KEY } from '../environments/environment';
import { AddressSearchComponent } from './components/address-search/address-search.component';
import { SolarBuildingInformationComponent } from './components/solar-building-information/solar-building-information.component';
import { data } from './sample-data/data';
import { SegmentIndexComponent } from './components/filters/segment-index/segment-index.component';

const { Loader } = GMAPILoader;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    AddressSearchComponent,
    SegmentIndexComponent,
    SolarBuildingInformationComponent
  ],
  providers:[
    AppService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'solarpoint';

  object: {
    maxArrayPanelsCount? :number,
    solarPanel?: SolarPanel
  } = {};

  segmentIndexes: number[] = [];


  center: google.maps.LatLngLiteral = {lat: 30.4321992, lng: -97.7359108};



  options: google.maps.MapOptions = {
    zoom: 19,
    mapTypeId: 'satellite',
    mapTypeControl: false,
    fullscreenControl: false,
    rotateControl: false,
    streetViewControl: false,
    zoomControl: false,
  };

  boundingBoxes: google.maps.LatLngBoundsLiteral[] = [];

  solarPanels: google.maps.PolygonOptions[] = [];

  buildingInsightData: BuildingInsightsResponse|undefined;

  private destroy$ = new Subject();

  constructor(
    private appService: AppService,
  ){
   
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  libraries:any={};

  ngOnInit(): void {
    const loader = new Loader({ apiKey: GOOGLE_API_KEY });
    this.libraries = {
      geometry: loader.importLibrary('geometry'),
      maps: loader.importLibrary('maps'),
      places: loader.importLibrary('places'),
    };
  }

  protected searchAddress($event:string){
    this.appService.getLatLng($event).pipe(
      take(1),
      switchMap((_location:any) => {
        var geometry = _location.results[0].geometry;
        var location = { lat: geometry.location.lat, lng: geometry.location.lng};
        this.center = location;
        return of(location);
      }),
      switchMap((_location: {lat:number,lng:number})=>{
        return this.appService.getBuildingInsights(_location);
      })
    ).subscribe((result:BuildingInsightsResponse)=>{
      this.options.zoom = 20;
      // this.buildingInsightData = data;
      this.buildingInsightData = result;
      this.solarPanels =  this.drawSolarPanels(this.buildingInsightData.solarPotential);
      this.segmentIndexes = [...new Set(this.buildingInsightData.solarPotential.solarPanels.map(m=>m.segmentIndex))].sort((a,b)=>a-b);
      this.object.maxArrayPanelsCount = this.buildingInsightData.solarPotential.maxArrayPanelsCount;
    });
  }

  protected segmentFilter($event: number|undefined) {
    this.solarPanels = [...this.drawSolarPanels(this.buildingInsightData!.solarPotential,$event)];
  }


  protected getLocation($event:any){
    console.log($event);
  }

  private previousIdx?:number;
  protected panelClick(idx:number){
    this.object.solarPanel = this.buildingInsightData!.solarPotential.solarPanels[idx];
   
    if(this.previousIdx){
      this.solarPanels[this.previousIdx].fillColor= this.solarPanels[idx].fillColor;
    }
    this.solarPanels[idx].fillColor= '#3CB043';
    this.previousIdx = idx;
  }

 

  protected drawSolarPanels(solarPotential: SolarPotential,segmentIndex?:number):google.maps.PolygonOptions[]{
    const minEnergy = solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
    const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;

    const palette = createPalette(panelsPalette).map(rgbToColor);

    const latOffset = 0.00010;  // balance latitude offset
    const lngOffset = 0.000005;  // balance longitude offset

    const solarPanels = solarPotential.solarPanels.map((panel) => {
      const [w, h] = [solarPotential.panelWidthMeters / 2, solarPotential.panelHeightMeters / 2];
      const points = [
        { x: +w, y: +h }, // top right
        { x: +w, y: -h }, // bottom right
        { x: -w, y: -h }, // bottom left
        { x: -w, y: +h }, // top left
        { x: +w, y: +h }, //  top right
      ];
      const orientation = panel.orientation == 'PORTRAIT' ? 90 : 0;
      const azimuth = solarPotential.roofSegmentStats[panel.segmentIndex].azimuthDegrees;
      const colorIndex = Math.round(normalize(panel.yearlyEnergyDcKwh, maxEnergy, minEnergy) * 255);
      
      var polygon: google.maps.PolygonOptions = {
        paths: points.map(({ x, y }) =>
          this.libraries.geometry.__zone_symbol__value.spherical.computeOffset(
            { lat: panel.center.latitude + latOffset, lng: panel.center.longitude+lngOffset },
            Math.sqrt(x * x + y * y),
            Math.atan2(y, x) * (180 / Math.PI) + orientation + azimuth,
          ),
        ),
        strokeColor: '#FFD700',
        strokeOpacity: 1,
        strokeWeight: 0.5,
        fillColor: palette[colorIndex],
        fillOpacity: 0.9,
        visible: segmentIndex ? panel.segmentIndex===Number(segmentIndex):true
      };
      return polygon;
    });
    return solarPanels;
  }

}
