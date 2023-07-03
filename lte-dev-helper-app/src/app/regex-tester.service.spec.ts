import { TestBed } from '@angular/core/testing';

import { RegexTesterService } from './regex-tester.service';

describe('RegexTesterService', () => {
  let service: RegexTesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegexTesterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
