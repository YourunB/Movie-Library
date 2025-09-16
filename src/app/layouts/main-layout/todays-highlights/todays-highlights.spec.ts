import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysHighlights } from './todays-highlights';

describe('TodaysHighlights', () => {
  let component: TodaysHighlights;
  let fixture: ComponentFixture<TodaysHighlights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysHighlights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysHighlights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
