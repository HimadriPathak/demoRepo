import { TestBed } from '@angular/core/testing';

import { GetEmpListService } from './get-emp-list.service';

describe('GetEmpListService', () => {
  let service: GetEmpListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetEmpListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
