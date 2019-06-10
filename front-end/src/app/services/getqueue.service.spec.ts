import { TestBed, inject } from '@angular/core/testing';

import { GetqueueService } from './getqueue.service';

describe('GetqueueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetqueueService]
    });
  });

  it('should be created', inject([GetqueueService], (service: GetqueueService) => {
    expect(service).toBeTruthy();
  }));
});
