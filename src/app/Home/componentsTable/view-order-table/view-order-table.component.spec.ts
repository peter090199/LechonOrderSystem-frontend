import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router'; // Import Router
import { ViewOrderTableComponent } from './view-order-table.component';

describe('ViewOrderTableComponent', () => {
  let component: ViewOrderTableComponent;
  let fixture: ComponentFixture<ViewOrderTableComponent>;

  // Create a mock for Router
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'), // Mock the navigate method
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewOrderTableComponent],
      providers: [
        { provide: Router, useValue: mockRouter }, // Provide mock Router
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Example test to verify if Router's navigate method is called
  it('should navigate on some action', () => {
    component.someMethodThatNavigates();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['expected-route']); // Check if navigate was called
  });
});
