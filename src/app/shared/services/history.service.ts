import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectHistory,
  selectHistoryIndex,
  selectCanUndo,
  selectCanRedo,
  selectHistoryLength,
} from '../../../store/ui/ui.selectors';
import { UiState } from '../../../store/ui/ui.reducer';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private store = inject(Store);

  // Observable selectors
  history$: Observable<UiState[]> = this.store.select(selectHistory);
  historyIndex$: Observable<number> = this.store.select(selectHistoryIndex);
  canUndo$: Observable<boolean> = this.store.select(selectCanUndo);
  canRedo$: Observable<boolean> = this.store.select(selectCanRedo);
  historyLength$: Observable<number> = this.store.select(selectHistoryLength);

  // Get current state values
  getHistory(): UiState[] {
    let history: UiState[] = [];
    this.history$.subscribe((h) => (history = h)).unsubscribe();
    return history;
  }

  getCurrentIndex(): number {
    let index = -1;
    this.historyIndex$.subscribe((i) => (index = i)).unsubscribe();
    return index;
  }

  getCurrentState(): UiState | null {
    const history = this.getHistory();
    const index = this.getCurrentIndex();
    return history[index] || null;
  }

  getPreviousState(): UiState | null {
    const history = this.getHistory();
    const index = this.getCurrentIndex();
    return index > 0 ? history[index - 1] : null;
  }

  getNextState(): UiState | null {
    const history = this.getHistory();
    const index = this.getCurrentIndex();
    return index < history.length - 1 ? history[index + 1] : null;
  }

  canUndo(): boolean {
    return this.getCurrentIndex() > 0;
  }

  canRedo(): boolean {
    const history = this.getHistory();
    const index = this.getCurrentIndex();
    return index < history.length - 1;
  }

  // Utility methods
  getHistoryInfo(): {
    length: number;
    currentIndex: number;
    canUndo: boolean;
    canRedo: boolean;
  } {
    const history = this.getHistory();
    const index = this.getCurrentIndex();
    return {
      length: history.length,
      currentIndex: index,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }

  // Get history as formatted string for debugging
  getHistoryAsString(): string {
    const history = this.getHistory();
    const index = this.getCurrentIndex();

    return history
      .map((state, i) => {
        const marker = i === index ? '← current' : '';
        return `${i}: theme=${state.theme}, menu=${state.menuOpen} ${marker}`;
      })
      .join('\n');
  }
}
