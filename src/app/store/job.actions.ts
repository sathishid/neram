import { createAction, props } from '@ngrx/store';
import { Job } from '../models/job.model';

export const loadJobs = createAction('[Job] Load Jobs');
export const loadJobsSuccess = createAction('[Job] Load Jobs Success', props<{ jobs: Job[] }>());
export const saveJob = createAction('[Job] Save Job', props<{ job: Job }>());
export const saveJobSuccess = createAction('[Job] Save Job Success', props<{ job: Job }>());