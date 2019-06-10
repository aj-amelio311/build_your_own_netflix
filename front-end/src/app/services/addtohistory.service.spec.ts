import { TestBed, inject } from '@angular/core/testing';

import { AddtohistoryService } from './addtohistory.service';

describe('AddtohistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddtohistoryService]
    });
  });

  it('should be created', inject([AddtohistoryService], (service: AddtohistoryService) => {
    expect(service).toBeTruthy();
  }));
});
