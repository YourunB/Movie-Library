import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { HistoryService } from '../../services/history.service';
import {
  selectCanUndo,
  selectCanRedo,
  selectHistoryLength,
} from '../../../../store/ui/ui.selectors';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-history-debug',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="history-debug" *ngIf="showDebug">
      <h4>{{ "history-debug.title" | translate }}</h4>
      <div class="history-info">
        <p>{{ "history-debug.length" | translate }}: {{ historyLength$ | async }}</p>
        <p>{{ "history-debug.undo" | translate }}: {{ canUndo$ | async }}</p>
        <p>{{ "history-debug.redo" | translate }}: {{ canRedo$ | async }}</p>
      </div>
      <div class="history-actions">
        <button [disabled]="(canUndo$ | async) === false" (click)="toggleDebug()">
          {{ "history-debug.toggle" | translate }}
        </button>
      </div>
      <div class="history-log" *ngIf="showDetails">
        <pre>{{ historyAsString }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .history-debug {
        position: fixed;
        top: 10px;
        right: 10px;
        background: var(--card-background);
        border: 1px solid var(--border-color);
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
        max-width: 300px;
      }

      .history-info p {
        margin: 2px 0;
      }

      .history-actions button {
        background: var(--button-background);
        color: var(--button-text);
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin: 5px 0;
      }

      .history-actions button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .history-log {
        margin-top: 10px;
        max-height: 200px;
        overflow-y: auto;
        background: var(--surface-color);
        padding: 5px;
        border-radius: 3px;
      }

      pre {
        margin: 0;
        font-size: 10px;
        white-space: pre-wrap;
      }
    `,
  ],
})
export class HistoryDebug implements OnInit {
  private store = inject(Store);
  private historyService = inject(HistoryService);

  canUndo$ = this.store.select(selectCanUndo);
  canRedo$ = this.store.select(selectCanRedo);
  historyLength$ = this.store.select(selectHistoryLength);

  showDebug = false;
  showDetails = false;
  historyAsString = '';

  toggleDebug(): void {
    this.showDebug = !this.showDebug;
    if (this.showDebug) {
      this.updateHistoryDisplay();
    }
  }

  updateHistoryDisplay(): void {
    this.historyAsString = this.historyService.getHistoryAsString();
  }

  ngOnInit(): void {
    // Update history display periodically
    setInterval(() => {
      if (this.showDebug) {
        this.updateHistoryDisplay();
      }
    }, 1000);
  }
}
