import { TestBed, inject } from '@angular/core/testing';

import { RemovefromqueueService } from './removefromqueue.service';

describe('RemovefromqueueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RemovefromqueueService]
    });
  });

  it('should be created', inject([RemovefromqueueService], (service: RemovefromqueueService) => {
    expect(service).toBeTruthy();
  }));
});
