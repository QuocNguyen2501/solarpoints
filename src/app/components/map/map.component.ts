import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'map',
  standalone: true,
  imports: [
    GoogleMapsModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{
  @Input() options: google.maps.MapOptions = {};
  @Input() mapCenter?: google.maps.LatLngLiteral | google.maps.LatLng ;
  @Input()boundingBoxes: google.maps.LatLngBoundsLiteral[] = [];
  @Input()solarPanels: google.maps.PolygonOptions[] = [];

  @Output() panelClickEmitter: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {
    
  }

  protected panelClick(idx:number){
    this.panelClickEmitter.emit(idx);
  }
}
