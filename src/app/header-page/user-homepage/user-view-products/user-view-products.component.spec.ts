import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { ProductItemsComponent } from 'src/app/Files/components/product-items/product-items.component';
import { ProductsService } from 'src/app/services/products.service';// Ensure you have the correct import for ProductsService

describe('ProductItemsComponent', () => {
  let component: ProductItemsComponent;
  let fixture: ComponentFixture<ProductItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Mock HTTP client
        RouterTestingModule // Add RouterTestingModule
      ],
      declarations: [ProductItemsComponent],
      providers: [ProductsService], // Ensure the service is provided
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verify that the component is created
  });
});
