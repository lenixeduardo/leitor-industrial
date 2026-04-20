---
name: design-polish
description: Revisa hierarquia visual, consistência e acessibilidade dos componentes implementados. Use when the frontend implementation is complete and needs visual polish before testing.
---

# Design Polish

## Overview

Revisa e ajusta hierarquia visual, consistência de UI e acessibilidade após implementação.

## When to Use

- Ao iniciar o passo 5 do pipeline de execução (Design Polish)
- Após frontend-builder ter concluído os componentes

## Process

1. Revisar hierarquia visual de cada tela
2. Verificar consistência com design system existente (shadcn/ui + Tailwind)
3. Checar espaçamento, tipografia e cor
4. Verificar responsividade (mobile, tablet, desktop)
5. Verificar acessibilidade básica
6. Ajustar componentes conforme necessário

### Checklist de hierarquia visual

- [ ] Ação primária visualmente destacada
- [ ] Ação destrutiva com confirmação e cor de alerta
- [ ] Títulos com tamanho proporcional à importância
- [ ] Espaçamento consistente (usar escala do Tailwind)

### Checklist de acessibilidade

- [ ] Contraste de cor mínimo 4.5:1 (texto normal) / 3:1 (texto grande)
- [ ] Todos os campos de formulário com `<label>` associado
- [ ] Imagens com `alt` descritivo ou `alt=""` se decorativas
- [ ] Navegação por teclado funcional (Tab, Enter, Escape)
- [ ] Focus visible em elementos interativos

### Checklist de responsividade

- [ ] Layout funciona em 375px (mobile)
- [ ] Layout funciona em 768px (tablet)
- [ ] Layout funciona em 1280px (desktop)
- [ ] Nenhum overflow horizontal

## Output

- Componentes ajustados nos mesmos arquivos do frontend-builder
- Nenhum arquivo novo criado (apenas refinamentos)

## Critério de aceite

- [ ] Checklist de hierarquia visual completo
- [ ] Checklist de acessibilidade completo
- [ ] Checklist de responsividade completo
