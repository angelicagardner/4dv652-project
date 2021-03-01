import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPredictorFormComponent } from './default-predictor-form.component';

describe('DefaultPredictorFormComponent', () => {
  let component: DefaultPredictorFormComponent;
  let fixture: ComponentFixture<DefaultPredictorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultPredictorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPredictorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
