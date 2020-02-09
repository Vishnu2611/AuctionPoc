import { TestBed } from '@angular/core/testing';

import { CreateitemService } from './createitem.service';

describe('CreateitemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateitemService = TestBed.get(CreateitemService);
    expect(service).toBeTruthy();
  });
});
