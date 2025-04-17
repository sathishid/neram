import { Component, input, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith, take, throwError } from 'rxjs';
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
export class AJobComponent implements OnInit, OnChanges {
  headerFormGroup: FormGroup;
  keyControl: FormControl;
  titleControl: FormControl;
  categoryControl: FormControl;
  jobStartedTimeControl: FormControl;
  @Input("job") currentJob: Job | undefined = undefined
  @Input("header") isHeader: boolean = false;;

  startTime: Date = new Date(); // Initialize start time to current date and time
  spentTime: Date = new Date(); // Initialize end time to 00:00:00

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
    private store: Store<{ jobs: JobState }> // Update this line
  ) {

    this.setTime();
    
    this.taskKeyFilteredOptions = of([]);
    this.taskTitleFilteredOptions = of([]);
    this.taskCategoriesOptions = of([]);
    this.jobs$ = this.store.select(state => state.jobs.jobs); // Update this line
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

    this.jobs$.pipe(take(1)).subscribe(jobs => {
      this.taskKeyFilteredOptions = this.keyControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.key),
        map((value: string) => this._taskKeyFilter(value, jobs as Job[]))
      );

      this.taskTitleFilteredOptions = this.titleControl.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.title),
        map(title => this.__taskTitleFilter(title, jobs))
      );
    });

    this.categoryService.getCategories().pipe(take(1)).subscribe(categories => this.taskCategories = categories);

    this.taskCategoriesOptions = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(value => this.__taskCategoryFilter(value))
    );
  }
  ngOnChanges() {
    if(this.currentJob) {
      this.keyControl.setValue(this.currentJob.key);
      this.titleControl.setValue(this.currentJob.title);
      this.categoryControl.setValue(this.currentJob.category);
      this.jobStartedTimeControl.setValue(this.formatTime(this.currentJob.startTime.toISOString().substring(11, 19)));
    }
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
    if(!this.isHeader) {
      throwError(() => 'Not implemented');
    }
    // Toggle the timer state
    if (this.isRunning) {
      this.stopTask(); // Stop the timer if it's running
    } else {
      this.startTask(); // Start the timer if it's not running
    }
  }

  startTask() {
    if (this.isHeader) {
      this.startHeaderJob();
    } else {
      throwError(() => 'Not implemented');
    }

  }
  startHeaderJob() {
    this.isRunning = true; // Set the timer state to running

   this.setTime();
    // Start the timer interval
    this.timerInterval = setInterval(() => {
      // Increment spentTime by 1 second
      this.spentTime = new Date(this.spentTime.getTime() + 1000);
    }, 1000);

    // Format and set the jobStartedTimeControl value
    this.jobStartedTimeControl.setValue(this.formatTime(this.startTime.toISOString().substring(11, 19)));
  }

  stopTask() {
    this.isRunning = false; // Set the timer state to stopped
    if (this.timerInterval) {
      clearInterval(this.timerInterval); // Stop the interval
      this.timerInterval = null; // Clear the interval reference
    }

    this.saveJob();
    //update the jobStartedTimeControl value to zero
    this.jobStartedTimeControl.setValue('0')
    //reset the start time to zero
    this.startTime = new Date(0, 0, 0, 0, 0, 0);
    //clear the spent time
    this.spentTime = new Date(0, 0, 0, 0, 0, 0);


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
    const minutes = value.substring(3, 5);
    const seconds = value.substring(6, 8);
    return `${hours}:${minutes}:${seconds}`;
  }

  saveJob() {
    // Reset the date portion of spentTime to a base date (e.g., 1970-01-01)
    const spentTimeInMilliseconds = this.spentTime.getHours() * 3600000 +
                                    this.spentTime.getMinutes() * 60000 +
                                    this.spentTime.getSeconds() * 1000;

  // Calculate endTime by adding only the time portion of spentTime to startTime
    const endTime = new Date(this.startTime.getTime() + spentTimeInMilliseconds);

    const job: Job = {
        id: 1,
        key: this.keyControl.value,
        title: this.titleControl.value,
        category: this.categoryControl.value,
        startTime: this.startTime,
        endTime: endTime,
        spentTime: this.spentTime
    };

    console.log('startTime:', this.startTime);
    console.log('spentTime:', this.spentTime);
    console.log('endTime:', endTime);

    this.store.dispatch(saveJob({ job }));
  }

  setTime() {
 // Set the current date and time in the "Asia/Kolkata" timezone
 const currentDate = new Date();
 this.startTime = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000); // Adjust for UTC offset
 // Set the spentTime to 00:00:00 with the current date
 this.spentTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);

  }
}
