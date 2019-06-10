import { TestBed, inject } from '@angular/core/testing';

import { GetuserinfoService } from './getuserinfo.service';

describe('GetuserinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetuserinfoService]
    });
  });

  it('should be created', inject([GetuserinfoService], (service: GetuserinfoService) => {
    expect(service).toBeTruthy();
  }));
});
