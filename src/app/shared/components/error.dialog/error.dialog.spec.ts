import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorDialog } from './error.dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('ErrorDialog', () => {
  let fixture: ComponentFixture<ErrorDialog>;
  let component: ErrorDialog;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ErrorDialog>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj<MatDialogRef<ErrorDialog>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ErrorDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test error message' } },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: TranslatePipe, useValue: new MockTranslatePipe() },
      ],
    })
      .overrideComponent(ErrorDialog, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when close() is called', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should expose injected message data', () => {
    expect(component.data.message).toBe('Test error message');
  });
});
