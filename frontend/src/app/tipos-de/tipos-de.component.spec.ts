import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposDeComponent } from './tipos-de.component';

describe('TiposDeComponent', () => {
  let component: TiposDeComponent;
  let fixture: ComponentFixture<TiposDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposDeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
