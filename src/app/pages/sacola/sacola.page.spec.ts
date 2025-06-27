import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SacolaPage } from './sacola.page';

describe('SacolaPage', () => {
  let component: SacolaPage;
  let fixture: ComponentFixture<SacolaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SacolaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
