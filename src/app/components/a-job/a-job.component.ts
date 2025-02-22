import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith, forkJoin, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';


@Component({
  selector: 'a-job',
  imports: [CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatAutocompleteModule,
    MatButtonModule,
    MatIconModule],
  templateUrl: './a-job.component.html',
  styleUrl: './a-job.component.scss'
})
export class AJobComponent implements OnInit {

  headerFormGroup: FormGroup;
  keyControl: FormControl;
  titleControl: FormControl;
  categoryControl: FormControl;
  timerControl: FormControl;
  currentJob : Job;

  endTime: Date = new Date(0, 0, 0, 0, 0, 0); // Initialize time to 00:00:00
  interval: any;
  isRunning: boolean = false; // Track whether the timer is running

  jobs: Job[];
  taskKeyFilteredOptions: Observable<Job[]>;
  taskTitles: string[];
  taskCategories: Category[];
  taskTitleFilteredOptions: Observable<Job[]>;
  taskCategoriesOptions: Observable<Category[]>;


  constructor(private fb: FormBuilder,
    private jobService: JobService,
    private categoryService: CategoryService) {
    this.currentJob = {} as Job;
    
    this.taskKeyFilteredOptions = of([]);
    this.taskTitleFilteredOptions = of([]);
    this.taskCategoriesOptions = of([]);
    this.jobs = [];
    this.taskTitles = [];
    this.taskCategories = [];
    this.keyControl = new FormControl('');
    this.titleControl = new FormControl('');
    this.categoryControl = new FormControl('');
    this.timerControl = new FormControl('');
    this.headerFormGroup = this.fb.group({
      keyControl: this.keyControl,
      titleControl: this.titleControl,
      categoryControl: this.categoryControl,
      timerControl: this.timerControl
    });
    this.endTime = new Date(0, 0, 0, 0, 0, 0);
  }

  ngOnInit() {
    this.jobService
      .getJobs()
      .subscribe(jobs => {
        this.jobs = jobs;
        console.log(this.jobs);
      });

    this.categoryService
      .getCategories()
      .subscribe(categories => this.taskCategories = categories);

    this.taskKeyFilteredOptions = this.keyControl
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.key),
        map(value => this._taskKeyFilter(value))
      );

    this.taskTitleFilteredOptions = this.titleControl
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.title),
        map(title => this.__taskTitleFilter(title))
      )

    this.taskCategoriesOptions = this.categoryControl
      .valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(value => this.__taskCategoryFilter(value))
      )

   
  }

  private _taskKeyFilter(value: string): Job[] {
    const filterValue = value.toLowerCase();
    let fioteredItems = this.jobs.filter(option => option
      .key
      .toLowerCase()
      .includes(filterValue));
      return fioteredItems;
  }

  displayJobKey(job: Job): string {
    return job && job.key ? job.key : '';
  }
  private __taskTitleFilter(value: string): Job[] {
    const filterValue = value.toLowerCase();
    let filteredItems= this.jobs.filter(jobObj => jobObj.title
      .toLowerCase()
      .includes(filterValue));
      return filteredItems;
  }
  displayJobTitle(job: Job): string {
    return job && job.title ? job.title : '';
  }

  private __taskCategoryFilter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.taskCategories.filter(option => option
      .name
      .toLowerCase()
      .includes(filterValue));
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
    this.endTime = new Date(0, 0, 0, 0, 0, 0); // Reset time to 00:00:00
    this.interval = setInterval(() => {
      // Create a new Date object to trigger change detection
      this.endTime = new Date(this.endTime.getTime() + 1000); // Add 1 second
    }, 1000); // Update every 1000ms (1 second)
  }

  stopTask() {
    this.isRunning = false; // Set the timer state to stopped
    if (this.interval) {
      clearInterval(this.interval); // Stop the interval
      this.interval = null; // Clear the interval reference
    }
  }

  onTimerBlur() {
    const value = this.timerControl.value;
    if (value && value.length === 6) {
      this.timerControl.setValue(this.formatTime(value));
    }
  }

  formatTime(value: string): string {
    const hours = value.substring(0, 2);
    const minutes = value.substring(2, 4);
    const seconds = value.substring(4, 6);
    return `${hours}:${minutes}:${seconds}`;
  }
}
