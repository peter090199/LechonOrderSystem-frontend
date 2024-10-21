import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { ChangePasswordUIComponent } from './change-password-ui.component';

describe('ChangePasswordUIComponent', () => {
  let component: ChangePasswordUIComponent;
  let fixture: ComponentFixture<ChangePasswordUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Add this line
      declarations: [ChangePasswordUIComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
