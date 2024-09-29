import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuUIComponent } from './add-menu-ui.component';

describe('AddMenuUIComponent', () => {
  let component: AddMenuUIComponent;
  let fixture: ComponentFixture<AddMenuUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMenuUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMenuUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
