import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFinderComponent } from './product-finder.component';

describe('SearchProductComponent', () => {
  let component: ProductFinderComponent;
  let fixture: ComponentFixture<ProductFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFinderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
