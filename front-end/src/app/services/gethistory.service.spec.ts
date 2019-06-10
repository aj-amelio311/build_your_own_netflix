import { TestBed, inject } from '@angular/core/testing';

import { GethistoryService } from './gethistory.service';

describe('GethistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GethistoryService]
    });
  });

  it('should be created', inject([GethistoryService], (service: GethistoryService) => {
    expect(service).toBeTruthy();
  }));
});
