import { TestBed } from '@angular/core/testing';

import { ConcurrentAsyncExecService } from './concurrent-async-exec.service';

describe('ConcurrentAsyncExecService', () => {
  let service: ConcurrentAsyncExecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcurrentAsyncExecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
