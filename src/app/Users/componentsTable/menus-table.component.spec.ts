import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusTableComponent } from './menus-table.component';

describe('MenusTableComponent', () => {
  let component: MenusTableComponent;
  let fixture: ComponentFixture<MenusTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenusTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
