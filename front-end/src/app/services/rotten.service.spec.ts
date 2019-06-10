import { TestBed, inject } from '@angular/core/testing';

import { RottenService } from './rotten.service';

describe('RottenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RottenService]
    });
  });

  it('should be created', inject([RottenService], (service: RottenService) => {
    expect(service).toBeTruthy();
  }));
});
