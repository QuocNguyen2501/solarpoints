import { Injectable } from '@angular/core';
import { SolarPotential } from '../models/solar';
import { createPalette, normalize, rgbToColor } from './visualize';
import { panelsPalette } from './color';
import { Loader } from '@googlemaps/js-api-loader';
import { GOOGLE_API_KEY } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DrawingService {
  libraries:any={};
  constructor() { 
    const loader = new Loader({ apiKey: GOOGLE_API_KEY });
    this.libraries = {
      geometry: loader.importLibrary('geometry'),
      maps: loader.importLibrary('maps'),
      places: loader.importLibrary('places'),
    };
  }

  public drawSolarPanels(solarPotential: SolarPotential,segmentIndex?:number):google.maps.PolygonOptions[]{
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
        strokeColor: '#FFFFFF',
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
