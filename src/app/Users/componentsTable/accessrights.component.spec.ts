import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { AccessrightsComponent } from './accessrights.component';

describe('AccessrightsComponent', () => {
  let component: AccessrightsComponent;
  let fixture: ComponentFixture<AccessrightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Add this line
      declarations: [AccessrightsComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessrightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
