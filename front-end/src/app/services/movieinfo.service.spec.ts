import { TestBed, inject } from '@angular/core/testing';

import { MovieinfoService } from './movieinfo.service';

describe('MovieinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovieinfoService]
    });
  });

  it('should be created', inject([MovieinfoService], (service: MovieinfoService) => {
    expect(service).toBeTruthy();
  }));
});
