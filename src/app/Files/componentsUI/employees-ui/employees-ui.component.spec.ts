import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeesUIComponent } from './employees-ui.component';
import { ProductsService } from 'src/app/services/products.service';
import { NotificationsService } from 'src/app/Global/notifications.service';
import { of, throwError } from 'rxjs';

describe('EmployeesUIComponent', () => {
  let component: EmployeesUIComponent;
  let fixture: ComponentFixture<EmployeesUIComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EmployeesUIComponent>>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockNotificationsService: jasmine.SpyObj<NotificationsService>;

  const mockDialogData = {
    id: 1,
    empID: 'emp123',
    empName: 'John Doe',
    address: '123 Street',
    contactNo: '1234567890'
  };

  beforeEach(async () => {
    // Create spies for services
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockProductsService = jasmine.createSpyObj('ProductsService', ['postProducts', 'updateProduct']);
    mockNotificationsService = jasmine.createSpyObj('NotificationsService', ['popupSwalMixin', 'toastrError']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Import ReactiveFormsModule
      declarations: [EmployeesUIComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: ProductsService, useValue: mockProductsService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Initialize the component and trigger change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verify component is created
  });

  it('should initialize form for existing employee data', () => {
    component.ngOnInit(); // Call ngOnInit
    expect(component.btnSave).toBe('Update'); // Check button label
    expect(component.EmployeeForm.controls['empID'].disabled).toBe(true); // Check if empID is disabled
    expect(component.EmployeeForm.value).toEqual({
      id: 1,
      empID: 'emp123',
      empName: 'John Doe',
      address: '123 Street',
      contactNo: '1234567890'
    }); // Verify form values
  });

  it('should save a new employee', () => {
    component.btnSave = 'Save'; // Set button to save state
    component.EmployeeForm.setValue({
      id: 0,
      empID: '',
      empName: 'Jane Doe',
      address: '456 Avenue',
      contactNo: '0987654321'
    });
    
    mockProductsService.postProducts.and.returnValue(of({})); // Mock service response
    component.onSubmit(); // Call onSubmit

    expect(mockProductsService.postProducts).toHaveBeenCalledWith(component.EmployeeForm.getRawValue()); // Verify service was called
    expect(mockNotificationsService.popupSwalMixin).toHaveBeenCalledWith('Successfully Saved.'); // Verify notification
    expect(component.loading).toBe(false); // Check loading state
    expect(component.EmployeeForm.value).toEqual({
      id: 0,
      empID: '',
      empName: '',
      address: '',
      contactNo: ''
    }); // Verify form reset
  });

  it('should update an existing employee', () => {
    component.btnSave = 'Update'; // Set button to update state
    component.EmployeeForm.setValue({
      id: 1,
      empID: 'emp123',
      empName: 'John Doe Updated',
      address: '789 Boulevard',
      contactNo: '1122334455'
    });
    
    mockProductsService.updateProduct.and.returnValue(of({})); // Mock service response
    component.onSubmit(); // Call onSubmit

    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(component.EmployeeForm.getRawValue(), mockDialogData.id); // Verify service was called
    expect(mockNotificationsService.popupSwalMixin).toHaveBeenCalledWith('Successfully Updated.'); // Verify notification
    expect(mockDialogRef.close).toHaveBeenCalledWith(true); // Verify dialog close
    expect(component.loading).toBe(false); // Check loading state
  });

  it('should handle error on save', () => {
    component.btnSave = 'Save'; // Set button to save state
    component.EmployeeForm.setValue({
      id: 0,
      empID: '',
      empName: 'Jane Doe',
      address: '456 Avenue',
      contactNo: '0987654321'
    });
    
    const errorResponse = { error: 'Save failed' };
    mockProductsService.postProducts.and.returnValue(throwError(errorResponse)); // Mock service error
    component.onSubmit(); // Call onSubmit

    expect(mockNotificationsService.toastrError).toHaveBeenCalledWith('Save failed'); // Verify error notification
    expect(component.loading).toBe(false); // Check loading state
  });

  it('should handle error on update', () => {
    component.btnSave = 'Update'; // Set button to update state
    component.EmployeeForm.setValue({
      id: 1,
      empID: 'emp123',
      empName: 'John Doe Updated',
      address: '789 Boulevard',
      contactNo: '1122334455'
    });
    
    const errorResponse = { error: 'Update failed' };
    mockProductsService.updateProduct.and.returnValue(throwError(errorResponse)); // Mock service error
    component.onSubmit(); // Call onSubmit

    expect(mockNotificationsService.toastrError).toHaveBeenCalledWith('Update failed'); // Verify error notification
    expect(component.loading).toBe(false); // Check loading state
  });

  it('should enable empID field when onCheck is called with false', () => {
    component.onCheck(false); // Call onCheck with false
    expect(component.EmployeeForm.controls['empID'].enabled).toBe(true); // Verify empID is enabled
    expect(component.EmployeeForm.controls['empID'].value).toBe(''); // Verify empID is reset
  });

  it('should disable empID field when onCheck is called with true', () => {
    component.onCheck(true); // Call onCheck with true
    expect(component.EmployeeForm.controls['empID'].disabled).toBe(true); // Verify empID is disabled
    expect(component.EmployeeForm.controls['empID'].value).toBe('generated'); // Verify empID is set
  });

  it('should reset the form', () => {
    component.ResetForm(); // Call ResetForm
    expect(component.EmployeeForm.value).toEqual({ // Verify form is reset
      id: 0,
      empID: '',
      empName: '',
      address: '',
      contactNo: ''
    });
  });
});
