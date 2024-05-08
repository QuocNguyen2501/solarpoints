import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'segment-index',
  standalone: true,
  imports: [],
  templateUrl: './segment-index.component.html',
  styleUrl: './segment-index.component.scss'
})
export class SegmentIndexComponent {
  @Input() segmentIndexes: number[] = [];

  @ViewChild('segmentFilter') segmentFilter!: ElementRef; 
  @Output() segmentFilterEventEmit: EventEmitter<number|undefined> = new EventEmitter<number|undefined>();

  protected filterSegment() {
    const value = this.segmentFilter.nativeElement.value;
    value !== '' ?
      this.segmentFilterEventEmit.emit(value):
      this.segmentFilterEventEmit.emit(undefined);
  }
}
