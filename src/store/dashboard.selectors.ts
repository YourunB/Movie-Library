import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from './dashboard.reducer';

export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectTrending = createSelector(selectDashboardState, (s) => s.trending);
export const selectTopRated = createSelector(selectDashboardState, (s) => s.topRated);
export const selectPopularPeople = createSelector(selectDashboardState, (s) => s.popularPeople);
export const selectReviews = createSelector(selectDashboardState, (s) => s.reviews);
export const selectLoading = createSelector(selectDashboardState, (s) => s.loading);
export const selectError = createSelector(selectDashboardState, (s) => s.error);
