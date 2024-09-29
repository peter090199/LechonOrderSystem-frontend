import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersUIRoleComponent } from './users-ui-role.component';

describe('UsersUIRoleComponent', () => {
  let component: UsersUIRoleComponent;
  let fixture: ComponentFixture<UsersUIRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersUIRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersUIRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
