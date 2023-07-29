import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UriBuilderComponent } from './uri-builder.component';

describe('UriBuilderComponent', () => {
  let component: UriBuilderComponent;
  let fixture: ComponentFixture<UriBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UriBuilderComponent]
    });
    fixture = TestBed.createComponent(UriBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
