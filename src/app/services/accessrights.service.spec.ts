import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { AccessrightsService } from './accessrights.service';

describe('AccessrightsService', () => {
  let service: AccessrightsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Add this line
      providers: [AccessrightsService]
    });
    service = TestBed.inject(AccessrightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
