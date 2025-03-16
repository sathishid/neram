import { createReducer, on } from '@ngrx/store';
import { loadJobsSuccess, saveJob, saveJobSuccess } from './job.actions';
import { Job } from '../models/job.model';

export interface JobState {
  jobs: Job[];
}

export const initialState: JobState = 
{
  jobs: []
};

export const jobReducer = createReducer(
  initialState,
  on(loadJobsSuccess, (state, { jobs }) => {
    console.log('Handling loadJobsSuccess action', jobs);
    return { ...state, jobs };
  }),
  on(saveJobSuccess, (state, { job }) => {
    console.log('Handling saveJobSuccess action', job);
    return { ...state, jobs: [...state.jobs, job] };
  }),
  on(saveJob, (state, { job }) => {
    console.log('Handling saveJob action', job);
    return { ...state, jobs: [...state.jobs, job] };
  })
);