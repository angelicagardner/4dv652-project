import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommaSeparatedFormComponent } from './comma-separated-form.component';

describe('CommaSeparatedFormComponent', () => {
  let component: CommaSeparatedFormComponent;
  let fixture: ComponentFixture<CommaSeparatedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommaSeparatedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommaSeparatedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
