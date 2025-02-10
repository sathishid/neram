import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AJobComponent } from './a-job.component';

describe('AJobComponent', () => {
  let component: AJobComponent;
  let fixture: ComponentFixture<AJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
