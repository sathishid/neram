import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Job } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor() { }
    getTaskKeys(): Observable<Job[]> {
      // Replace with your actual implementation to fetch task keys
      return of([
        { id: 1, key: 'Job 1',title: 'Job 1', category: 'Category 1' },
        { id: 2, key: 'Job 2',title: 'Job 2', category: 'Category 2' },
        { id: 3, key: 'Job 3',title: 'Job 3', category: 'Category 3' }
      ] as Job[]);
    }
}
