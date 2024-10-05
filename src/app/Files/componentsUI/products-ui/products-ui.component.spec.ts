import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsUIComponent } from './products-ui.component';

describe('ProductsUIComponent', () => {
  let component: ProductsUIComponent;
  let fixture: ComponentFixture<ProductsUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
