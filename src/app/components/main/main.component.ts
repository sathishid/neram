import { AJobComponent } from "../a-job/a-job.component";
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Job } from "../../models/job.model";
import { JobState } from "../../store/job.reducer";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [AJobComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  private store = inject(Store);
  state$: Observable<Job[]>;
  jobLength: number;
  jobs: Job[] = []; // Ensure jobs is initialized as an empty array

  constructor() {
    this.state$ = this.store.pipe(select((state: { jobs: JobState }) => state.jobs.jobs));
    this.jobLength = 0;
  }

  ngOnInit() {
    this.state$.subscribe((jobs: Job[]) => {
      this.jobs = jobs; // Directly assign the emitted Job[] to this.jobs
      this.jobLength = jobs.length;
    });
  }
}
