import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subject, of, switchMap, take } from 'rxjs';
import { AppService } from './app.service';
import { BuildingInsightsResponse, SolarPanel } from './models/solar';
import { AddressSearchComponent } from './components/address-search/address-search.component';
import { SolarBuildingInformationComponent } from './components/solar-building-information/solar-building-information.component';
import { data } from './sample-data/data';
import { SegmentIndexComponent } from './components/filters/segment-index/segment-index.component';
import { DrawingService } from './providers/drawing.service';
import { MapComponent } from './components/map/map.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AddressSearchComponent,
    SegmentIndexComponent,
    MapComponent,
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
    private drawingService: DrawingService,
  ){
   
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        this.center = {lat: position.coords.latitude, lng: position.coords.longitude};
      })
    }else {
      console.log("No support for geolocation");
    }
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
      this.solarPanels =  this.drawingService.drawSolarPanels(this.buildingInsightData.solarPotential);
      this.segmentIndexes = [...new Set(this.buildingInsightData.solarPotential.solarPanels.map(m=>m.segmentIndex))].sort((a,b)=>a-b);
      this.object.maxArrayPanelsCount = this.buildingInsightData.solarPotential.maxArrayPanelsCount;
    });
  }

  protected segmentFilter($event: number|undefined) {
    this.solarPanels = [...this.drawingService.drawSolarPanels(this.buildingInsightData!.solarPotential,$event)];
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

}
