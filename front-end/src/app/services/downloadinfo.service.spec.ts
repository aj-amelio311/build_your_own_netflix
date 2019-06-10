import { TestBed, inject } from '@angular/core/testing';

import { DownloadinfoService } from './downloadinfo.service';

describe('DownloadinfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DownloadinfoService]
    });
  });

  it('should be created', inject([DownloadinfoService], (service: DownloadinfoService) => {
    expect(service).toBeTruthy();
  }));
});
