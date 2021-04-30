import { TestBed } from '@angular/core/testing';

import { MoviepageService } from './moviepage.service';

describe('MoviepageService', () => {
  let service: MoviepageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoviepageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
