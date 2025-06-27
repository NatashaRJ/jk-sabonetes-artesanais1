import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarPor',
  standalone: false

})
export class OrdenarPorPipe implements PipeTransform {
  transform(produtos: any[], criterio: string): any[] {
    if (!produtos || !criterio) return produtos;  // Garantir que critérios sejam válidos

    switch (criterio) {
      case 'menor_preco':
        return [...produtos].sort((a, b) => a.valor - b.valor);
      case 'maior_preco':
        return [...produtos].sort((a, b) => b.valor - a.valor);
      default:
        return produtos;
    }
  }
}
