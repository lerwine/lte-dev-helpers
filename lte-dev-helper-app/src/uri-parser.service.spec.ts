import { TestBed } from '@angular/core/testing';

import { UriParserService } from './uri-parser.service';

describe('UriParserService', () => {
  let service: UriParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UriParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
