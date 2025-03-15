import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { JobService } from '../services/job.service';
import { loadJobs, loadJobsSuccess, saveJob, saveJobSuccess } from './job.actions';

@Injectable()
export class JobEffects {
  loadJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadJobs),
      mergeMap(() =>
        this.jobService.getJobs().pipe(
          map(jobs => {
            console.log('Handling loadJobs effect', jobs);
            return loadJobsSuccess({ jobs });
          }),
          catchError(() => of({ type: '[Job] Load Jobs Failure' }))
        )
      )
    )
  );

  saveJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveJob),
      mergeMap(action =>
        this.jobService.saveJob(action.job).pipe(
          map(job => {
            console.log('Handling saveJob effect', job);
            return saveJobSuccess({ job });
          }),
          catchError(() => of({ type: '[Job] Save Job Failure' }))
        )
      )
    )
  );

  constructor(private actions$: Actions, private jobService: JobService) {}
}