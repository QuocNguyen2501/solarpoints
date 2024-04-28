import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarBuildingInformationComponent } from './solar-building-information.component';

describe('SolarBuildingInformationComponent', () => {
  let component: SolarBuildingInformationComponent;
  let fixture: ComponentFixture<SolarBuildingInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarBuildingInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolarBuildingInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
