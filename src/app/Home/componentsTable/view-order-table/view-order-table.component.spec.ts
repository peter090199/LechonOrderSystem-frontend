import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderTableComponent } from './view-order-table.component';

describe('ViewOrderTableComponent', () => {
  let component: ViewOrderTableComponent;
  let fixture: ComponentFixture<ViewOrderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOrderTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOrderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
