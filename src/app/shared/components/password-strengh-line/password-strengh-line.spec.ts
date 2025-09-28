import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordStrengthLineComponent } from './password-strengh-line';

describe('PasswordStrenghLine', () => {
  let component: PasswordStrengthLineComponent;
  let fixture: ComponentFixture<PasswordStrengthLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordStrengthLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
