import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSlider } from './side-slider';

describe('SideSlider', () => {
  let component: SideSlider;
  let fixture: ComponentFixture<SideSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
