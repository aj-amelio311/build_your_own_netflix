import { TestBed, inject } from '@angular/core/testing';

import { AddtoqueueService } from './addtoqueue.service';

describe('AddtoqueueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddtoqueueService]
    });
  });

  it('should be created', inject([AddtoqueueService], (service: AddtoqueueService) => {
    expect(service).toBeTruthy();
  }));
});
