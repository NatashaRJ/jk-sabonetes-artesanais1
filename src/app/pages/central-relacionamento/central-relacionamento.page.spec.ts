import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentralRelacionamentoPage } from './central-relacionamento.page';

describe('CentralRelacionamentoPage', () => {
  let component: CentralRelacionamentoPage;
  let fixture: ComponentFixture<CentralRelacionamentoPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CentralRelacionamentoPage]
    });
    fixture = TestBed.createComponent(CentralRelacionamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
