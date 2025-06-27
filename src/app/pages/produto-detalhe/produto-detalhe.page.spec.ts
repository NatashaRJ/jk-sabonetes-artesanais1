import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutoDetalhePage } from './produto-detalhe.page'; // Alterado para ProdutoDetalhePage

describe('ProdutoDetalhePage', () => { // Alterado para ProdutoDetalhePage
  let component: ProdutoDetalhePage; // Alterado para ProdutoDetalhePage
  let fixture: ComponentFixture<ProdutoDetalhePage>; // Alterado para ProdutoDetalhePage

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoDetalhePage); // Alterado para ProdutoDetalhePage
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
