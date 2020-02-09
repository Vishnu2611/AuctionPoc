import { TestBed } from '@angular/core/testing';

import { ViewitemService } from './viewitem.service';

describe('ViewitemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewitemService = TestBed.get(ViewitemService);
    expect(service).toBeTruthy();
  });
});
