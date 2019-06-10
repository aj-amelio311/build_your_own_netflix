import { TestBed, inject } from '@angular/core/testing';

import { CreateaccountService } from './createaccount.service';

describe('CreateaccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateaccountService]
    });
  });

  it('should be created', inject([CreateaccountService], (service: CreateaccountService) => {
    expect(service).toBeTruthy();
  }));
});
