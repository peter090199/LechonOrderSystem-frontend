import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryProductUIComponent } from './inventory-product-ui.component';

describe('InventoryProductUIComponent', () => {
  let component: InventoryProductUIComponent;
  let fixture: ComponentFixture<InventoryProductUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryProductUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryProductUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
