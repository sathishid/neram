import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, of, startWith, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-header-form',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule],
  templateUrl: './header-form.component.html',
  styleUrl: './header-form.component.scss'
})
export class HeaderFormComponent implements OnInit {
  headerFormGroup: FormGroup;
  keyControl: FormControl;
  titleControl: FormControl;
  categoryControl: FormControl;

  jobs: Job[];
  taskKeyFilteredOptions: Observable<Job[]>;
  taskTitles: string[];
  taskCategories: Category[];
  taskTitleFilteredOptions: Observable<Job[]>;
  taskCategoriesOptions: Observable<Category[]>;


  constructor(private fb: FormBuilder,
    private jobService: JobService,
    private categoryService: CategoryService) {
    this.taskKeyFilteredOptions = of([]);
    this.taskTitleFilteredOptions = of([]);
    this.taskCategoriesOptions = of([]);
    this.jobs = [];
    this.taskTitles = [];
    this.taskCategories = [];
    this.keyControl = new FormControl('');
    this.titleControl = new FormControl('');
    this.categoryControl = new FormControl('');
    this.headerFormGroup = this.fb.group({
      keyControl: this.keyControl,
      titleControl: this.titleControl,
      categoryControl: this.categoryControl
    });

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


}
