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

class MockDialogRef {
  close(): void {
    void 0;
  }
}

describe('ErrorDialog', () => {
  let fixture: ComponentFixture<ErrorDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test error message' } },
        { provide: MatDialogRef, useClass: MockDialogRef },
      ],
    })
      .overrideComponent(ErrorDialog, {
        remove: { imports: [TranslatePipe] },
        add: { imports: [MockTranslatePipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ErrorDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
