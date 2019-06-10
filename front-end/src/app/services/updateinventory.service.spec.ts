import { TestBed, inject } from '@angular/core/testing';

import { UpdateinventoryService } from './updateinventory.service';

describe('UpdateinventoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateinventoryService]
    });
  });

  it('should be created', inject([UpdateinventoryService], (service: UpdateinventoryService) => {
    expect(service).toBeTruthy();
  }));
});
