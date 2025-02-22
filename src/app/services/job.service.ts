import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  //Simulate DB data here for now
  jobs: Job[] ;

  constructor() {
    this.jobs= [];
   }
    getJobs(): Observable<Job[]> {
      return of(this.jobs);
    }

    saveJob(job: Job): Observable<Job> {
      this.jobs.push(job);
      return of(job);
    }

    editJob(id:number,job: Job): Observable<Job> {
      this.jobs[id]=job;
      return of(job);
    }

}
  