import { TestBed } from '@angular/core/testing';

import { ViewbidService } from './viewbid.service';

describe('ViewbidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewbidService = TestBed.get(ViewbidService);
    expect(service).toBeTruthy();
  });
});
