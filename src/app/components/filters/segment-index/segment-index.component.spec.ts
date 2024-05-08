import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentIndexComponent } from './segment-index.component';

describe('SegmentIndexComponent', () => {
  let component: SegmentIndexComponent;
  let fixture: ComponentFixture<SegmentIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SegmentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
