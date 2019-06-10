import { TestBed, inject } from '@angular/core/testing';

import { CheckqueueService } from './checkqueue.service';

describe('CheckqueueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckqueueService]
    });
  });

  it('should be created', inject([CheckqueueService], (service: CheckqueueService) => {
    expect(service).toBeTruthy();
  }));
});
