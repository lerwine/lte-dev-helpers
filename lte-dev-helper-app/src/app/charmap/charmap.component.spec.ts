import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharmapComponent } from './charmap.component';

describe('CharmapComponent', () => {
  let component: CharmapComponent;
  let fixture: ComponentFixture<CharmapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CharmapComponent]
    });
    fixture = TestBed.createComponent(CharmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
