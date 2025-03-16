import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { loadJobs, saveJob } from '../../store/job.actions';
import { JobState } from '../../store/job.reducer';

@Component({
  selector: 'a-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule, MatButtonModule, MatIconModule],
  templateUrl: './a-job.component.html',
  styleUrls: ['./a-job.component.scss']
})
export class AJobComponent implements OnInit {
  headerFormGroup: FormGroup;
  keyControl: FormControl;
  titleControl: FormControl;
  categoryControl: FormControl;
  jobStartedTimeControl: FormControl;
  currentJob: Job;

  startTime: Date = new Date(); // Initialize start time to current date and time
  spentTime: Date = new Date(0, 0, 0, 0, 0, 0); // Initialize end time to 00:00:00
  timerInterval: any;
  
  isRunning: boolean = false; // Track whether the timer is running

  jobs$: Observable<Job[]>;
  taskKeyFilteredOptions: Observable<Job[]>;
  taskTitles: string[];
  taskCategories: Category[];
  taskTitleFilteredOptions: Observable<Job[]>;
  taskCategoriesOptions: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private categoryService: CategoryService,
    private store: Store<{ jobState: JobState }>
  ) {
    this.currentJob = {} as Job;

    this.taskKeyFilteredOptions = of([]);
    this.taskTitleFilteredOptions = of([]);
    this.taskCategoriesOptions = of([]);
    this.jobs$ = this.store.select(state => state.jobState.jobs);
    this.taskTitles = [];
    this.taskCategories = [];
    this.keyControl = new FormControl('');
    this.titleControl = new FormControl('');
    this.categoryControl = new FormControl('');
    this.jobStartedTimeControl = new FormControl('');
    this.headerFormGroup = this.fb.group({
      keyControl: this.keyControl,
      titleControl: this.titleControl,
      categoryControl: this.categoryControl,
      jobStartedTimeControl: this.jobStartedTimeControl
    });
  }

  ngOnInit() {
    this.store.dispatch(loadJobs());

    this.jobs$.subscribe(jobs => {
      this.taskKeyFilteredOptions = this.keyControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.key),
        map(value => this._taskKeyFilter(value, jobs))
      );

      this.taskTitleFilteredOptions = this.titleControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.title),
        map(title => this.__taskTitleFilter(title, jobs))
      );
    });

    this.categoryService.getCategories().subscribe(categories => this.taskCategories = categories);

    this.taskCategoriesOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.__taskCategoryFilter(value))
    );
  }

  private _taskKeyFilter(value: string, jobs: Job[]): Job[] {
    const filterValue = value.toLowerCase();
    return jobs.filter(option => option.key.toLowerCase().includes(filterValue));
  }

  displayJobKey(job: Job): string {
    return job && job.key ? job.key : '';
  }

  private __taskTitleFilter(value: string, jobs: Job[]): Job[] {
    const filterValue = value.toLowerCase();
    return jobs.filter(jobObj => jobObj.title.toLowerCase().includes(filterValue));
  }

  displayJobTitle(job: Job): string {
    return job && job.title ? job.title : '';
  }

  private __taskCategoryFilter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.taskCategories.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayCategory(category: Category): string {
    return category && category.name ? category.name : '';
  }

  toggleTimer() {
    if (this.isRunning) {
      this.stopTask(); // Stop the timer if it's running
    } else {
      this.startTask(); // Start the timer if it's not running
    }
  }

  startTask() {
    this.isRunning = true; // Set the timer state to running
    this.startTime = new Date(); // Set the start time to the current date and time
    this.spentTime = new Date(0, 0, 0, 0, 0, 0); // Reset end time to 00:00:00
    this.timerInterval = setInterval(() => {
      // Create a new Date object to trigger change detection
      this.spentTime = new Date(this.spentTime.getTime() + 1000); // Add 1 second
    }, 1000); // Update every 1000ms (1 second)
    //update the jobStartedTimeControl value to current time
    this.jobStartedTimeControl.setValue(this.formatTime(this.startTime.toLocaleTimeString
      ('en-US', { hour12: false })));
    
  }

  stopTask() {
    this.isRunning = false; // Set the timer state to stopped
    if (this.timerInterval) {
      clearInterval(this.timerInterval); // Stop the interval
      this.timerInterval = null; // Clear the interval reference
    }
    //update the jobStartedTimeControl value to zero
    this.jobStartedTimeControl.setValue('0')
    //reset the start time to zero
    this.startTime = new Date(0, 0, 0, 0, 0, 0);
    
    
  }

  // Format the time when the timer control loses focus
  onTimerBlur() {
    const value = this.jobStartedTimeControl.value;
    if (value && value.length === 6) {
      this.jobStartedTimeControl.setValue(this.formatTime(value));
    }
  }

  formatTime(value: string): string {
    const hours = value.substring(0, 2);
    const minutes = value.substring(2, 4);
    const seconds = value.substring(4, 6);
    return `${hours}:${minutes}:${seconds}`;
  }

  saveJob() {
    this.jobs$.subscribe(jobs => {
      const job: Job = {
        id: jobs.length + 1,
        key: this.keyControl.value,
        title: this.titleControl.value,
        category: this.categoryControl.value,
        startTime: this.startTime, // Use the startTime managed by the component
        endTime: this.spentTime // Use the endTime managed by the component
      };
      this.store.dispatch(saveJob({ job }));
    }).unsubscribe();
  }
}
