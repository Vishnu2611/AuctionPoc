import { TestBed } from '@angular/core/testing';

import { AuctiondepartmentService } from './auctiondepartment.service';

describe('AuctiondepartmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuctiondepartmentService = TestBed.get(AuctiondepartmentService);
    expect(service).toBeTruthy();
  });
});
