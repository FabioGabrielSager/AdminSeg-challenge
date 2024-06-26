import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProductDetailsComponent } from './my-product-details.component';

describe('MyProductDetailsComponent', () => {
  let component: MyProductDetailsComponent;
  let fixture: ComponentFixture<MyProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProductDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
