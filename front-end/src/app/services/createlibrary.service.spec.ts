import { TestBed, inject } from '@angular/core/testing';

import { CreatelibraryService } from './createlibrary.service';

describe('CreatelibraryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreatelibraryService]
    });
  });

  it('should be created', inject([CreatelibraryService], (service: CreatelibraryService) => {
    expect(service).toBeTruthy();
  }));
});
