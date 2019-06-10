import { TestBed, inject } from '@angular/core/testing';

import { KeywordqueueService } from './keywordqueue.service';

describe('KeywordqueueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeywordqueueService]
    });
  });

  it('should be created', inject([KeywordqueueService], (service: KeywordqueueService) => {
    expect(service).toBeTruthy();
  }));
});
