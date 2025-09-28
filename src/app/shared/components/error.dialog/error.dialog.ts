import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-error.dialog',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './error.dialog.html',
  styleUrl: './error.dialog.scss',
})
export class ErrorDialog {
  public data = inject(MAT_DIALOG_DATA) as { message: string };
  public dialogRef = inject(MatDialogRef<ErrorDialog>);

  close(): void {
    this.dialogRef.close();
  }
}
