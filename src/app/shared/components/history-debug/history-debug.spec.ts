import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryDebug } from './history-debug';
import { provideStore } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HistoryService } from '../../services/history.service';

describe('HistoryDebug', () => {
  let component: HistoryDebug;
  let fixture: ComponentFixture<HistoryDebug>;
  let historyServiceSpy: jasmine.SpyObj<HistoryService>;

  beforeEach(() => {
    historyServiceSpy = jasmine.createSpyObj('HistoryService', ['getHistoryAsString']);
    historyServiceSpy.getHistoryAsString.and.returnValue('mocked history');

    TestBed.configureTestingModule({
      imports: [HistoryDebug, CommonModule, TranslatePipe],
      providers: [
        provideStore({}),
        { provide: HistoryService, useValue: historyServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(HistoryDebug);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle showDebug and update history', () => {
    expect(component.showDebug).toBeFalse();

    component.toggleDebug();
    expect(component.showDebug).toBeTrue();
    expect(component.historyAsString).toBe('mocked history');
  });
});
