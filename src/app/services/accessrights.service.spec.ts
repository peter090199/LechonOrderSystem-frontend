import { TestBed } from '@angular/core/testing';

import { AccessrightsService } from './accessrights.service';

describe('AccessrightsService', () => {
  let service: AccessrightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessrightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
