import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap, takeUntil } from 'rxjs';
import * as GMAPILoader from '@googlemaps/js-api-loader';
import { AppService } from './app.service';
import { BuildingInsightsResponse, SolarPanel, SolarPotential } from './models/solar';
import { createPalette, normalize, rgbToColor } from './visualize';
import { panelsPalette } from './color';
import { GOOGLE_API_KEY } from '../environments/environment';

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
  ],
  providers:[
    AppService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'solarpoint';
  searchForm : FormGroup;

  object: {
    maxArrayPanelsCount? :number,
    solarPanel?: SolarPanel
  } = {};


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

  solarPanels: google.maps.Polygon[] = [];

  buildingInsightData: BuildingInsightsResponse|undefined;

  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
  ){
    this.searchForm = this.fb.group({
      searchText: ['']
    });
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

    if(this.searchForm){
      this.searchForm.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap(result => {
            return this.appService.getLatLng(result.searchText);
        }),
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
        this.buildingInsightData = result;
        this.solarPanels = this.drawSolarPanels(this.buildingInsightData.solarPotential);
        this.object.maxArrayPanelsCount = this.buildingInsightData.solarPotential.maxArrayPanelsCount;
      });
    }
  }


  protected getLocation($event:any){
    console.log($event);
  }

  protected panelClick(idx:number){
    this.object.solarPanel = this.buildingInsightData!.solarPotential.solarPanels[idx];
  }

  protected drawSolarPanels(solarPotential: SolarPotential){
    const minEnergy = solarPotential.solarPanels.slice(-1)[0].yearlyEnergyDcKwh;
    const maxEnergy = solarPotential.solarPanels[0].yearlyEnergyDcKwh;

    const palette = createPalette(panelsPalette).map(rgbToColor);

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
      return new google.maps.Polygon({
        paths: points.map(({ x, y }) =>
          this.libraries.geometry.__zone_symbol__value.spherical.computeOffset(
            { lat: panel.center.latitude, lng: panel.center.longitude },
            Math.sqrt(x * x + y * y),
            Math.atan2(y, x) * (180 / Math.PI) + orientation + azimuth,
          ),
        ),
        strokeColor: '#B0BEC5',
        strokeOpacity: 0.9,
        strokeWeight: 1,
        fillColor: palette[colorIndex],
        fillOpacity: 0.9
      });
    });
    return solarPanels;
  }

}