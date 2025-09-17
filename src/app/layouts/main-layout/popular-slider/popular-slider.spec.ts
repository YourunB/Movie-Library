import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularPeopleSlider } from './popular-slider';

describe('PopularSlider', () => {
  let component: PopularPeopleSlider;
  let fixture: ComponentFixture<PopularPeopleSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularPeopleSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularPeopleSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
