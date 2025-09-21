import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerPlayer } from './trailer-player';

describe('TrailerPlayer', () => {
  let component: TrailerPlayer;
  let fixture: ComponentFixture<TrailerPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailerPlayer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrailerPlayer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
