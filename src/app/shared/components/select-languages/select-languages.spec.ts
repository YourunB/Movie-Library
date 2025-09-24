import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguages } from './select-languages';

describe('SelectLanguages', () => {
  let component: SelectLanguages;
  let fixture: ComponentFixture<SelectLanguages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectLanguages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLanguages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
