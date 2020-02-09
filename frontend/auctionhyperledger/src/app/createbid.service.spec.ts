import { TestBed } from '@angular/core/testing';

import { CreatebidService } from './createbid.service';

describe('CreatebidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreatebidService = TestBed.get(CreatebidService);
    expect(service).toBeTruthy();
  });
});
