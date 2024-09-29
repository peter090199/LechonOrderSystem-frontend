import { TestBed } from '@angular/core/testing';

import { UsersRoleService } from './users-role.service';

describe('UsersRoleService', () => {
  let service: UsersRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
