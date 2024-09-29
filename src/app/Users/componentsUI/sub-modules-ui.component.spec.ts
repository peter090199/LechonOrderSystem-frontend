import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubModulesUIComponent } from './sub-modules-ui.component';

describe('SubModulesUIComponent', () => {
  let component: SubModulesUIComponent;
  let fixture: ComponentFixture<SubModulesUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubModulesUIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubModulesUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
