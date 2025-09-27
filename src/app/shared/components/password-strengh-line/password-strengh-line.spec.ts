import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrenghLine } from './password-strengh-line';

describe('PasswordStrenghLine', () => {
  let component: PasswordStrenghLine;
  let fixture: ComponentFixture<PasswordStrenghLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrenghLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordStrenghLine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
