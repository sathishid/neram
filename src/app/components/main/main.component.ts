import { AJobComponent } from "../a-job/a-job.component";
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Job } from "../../models/job.model";

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
  jobs: Job[];

  constructor() {
    this.state$ = this.store.pipe(select("jobs"));
    this.jobLength = 0;
    this.jobs = [];
  }

  ngOnInit() {
    this.state$.subscribe((jobs) => {
      console.log(jobs);
      this.jobs = jobs;
      this.jobLength = jobs.length;
    });
  }
}
