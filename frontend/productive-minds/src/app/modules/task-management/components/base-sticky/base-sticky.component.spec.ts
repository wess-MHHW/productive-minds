import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseStickyComponent } from './base-sticky.component';

describe('BaseStickyComponent', () => {
  let component: BaseStickyComponent;
  let fixture: ComponentFixture<BaseStickyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseStickyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BaseStickyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
