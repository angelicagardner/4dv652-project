import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterFeedComponent } from './parameter-feed.component';

describe('ParameterFeedComponent', () => {
  let component: ParameterFeedComponent;
  let fixture: ComponentFixture<ParameterFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterFeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
