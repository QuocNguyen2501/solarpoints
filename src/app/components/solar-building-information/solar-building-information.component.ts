import { Component, Input } from '@angular/core';
import { SolarPanel } from '../../models/solar';
import { CommonModule } from '@angular/common';
import { SolarPanelComponent } from '../solar-panel/solar-panel.component';

@Component({
  selector: 'solar-building-information',
  standalone: true,
  imports: [
    CommonModule,
    SolarPanelComponent
  ],
  templateUrl: './solar-building-information.component.html',
  styleUrl: './solar-building-information.component.scss'
})
export class SolarBuildingInformationComponent {
  @Input() object: {
    maxArrayPanelsCount? :number,
    solarPanel?: SolarPanel
  } = {};
}
