import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpSubnetComponent } from './ip-subnet.component';

describe('IpSubnetComponent', () => {
  let component: IpSubnetComponent;
  let fixture: ComponentFixture<IpSubnetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IpSubnetComponent]
    });
    fixture = TestBed.createComponent(IpSubnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
