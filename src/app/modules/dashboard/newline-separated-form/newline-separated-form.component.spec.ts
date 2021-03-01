import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlineSeparatedFormComponent } from './newline-separated-form.component';

describe('NewlineSeparatedFormComponent', () => {
  let component: NewlineSeparatedFormComponent;
  let fixture: ComponentFixture<NewlineSeparatedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewlineSeparatedFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewlineSeparatedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
