import { TestBed, inject } from '@angular/core/testing';

import { KeywordService } from './keyword.service';

describe('KeywordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeywordService]
    });
  });

  it('should be created', inject([KeywordService], (service: KeywordService) => {
    expect(service).toBeTruthy();
  }));
});
