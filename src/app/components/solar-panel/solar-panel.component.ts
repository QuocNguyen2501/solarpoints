import { Component, Input } from '@angular/core';
import { SolarPanel } from '../../models/solar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'solar-panel',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './solar-panel.component.html',
  styleUrl: './solar-panel.component.scss'
})
export class SolarPanelComponent {
  @Input() solarPanel: SolarPanel|undefined
}
