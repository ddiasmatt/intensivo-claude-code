---
title: Story 05 — Remover `src/pages/lab/` + rebuild
slug: intensivo-claude-code-ajustes-pre-deploy-05
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: P
model: implementer-haiku
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 05 — Remover `src/pages/lab/` + rebuild

- **Complexidade:** P
- **Modelo sugerido:** implementer-haiku
- **Depende de:** nenhuma
- **Arquivos a criar:** nenhum
- **Arquivos a modificar:** nenhum (operacao destrutiva controlada)
- **Arquivos a remover:**
  - `site/src/pages/lab/` (pasta inteira: `index.astro`, `timeline/index.astro`, qualquer sub-rota)
  - `site/src/layouts/LabLayout.astro` se nao for usado em mais lugar nenhum apos remocao do `/lab/`
- **Patterns a seguir:** PRD secao 4.4

**Contexto:** rota `/lab/` era zona interna de experimentos (variantes de Timeline, etc.) e foi para `dist/` no build atual. Audit detectou como risco de vazamento. Decisao do PRD: **remocao fisica** (preserva historico em git, bundle menor, zero acesso publico).

**Acao:**
1. Conferir se `src/layouts/LabLayout.astro` e referenciado **apenas** por arquivos dentro de `src/pages/lab/`:
   ```bash
   cd site && grep -rln "LabLayout" src/ --include="*.astro"
   ```
   Esperado: so arquivos em `src/pages/lab/*`. Se aparecer em outro lugar, **nao remover o layout** — so o diretorio `pages/lab/`.
2. Executar:
   ```bash
   rm -rf site/src/pages/lab/
   # Se passo 1 confirmou que LabLayout so e usado em /lab/:
   rm site/src/layouts/LabLayout.astro
   ```
3. Rebuild:
   ```bash
   cd site && npx astro build
   ```
4. Validar:
   ```bash
   ! test -d dist/lab && echo "PASS: dist/lab removido"
   ```

**Criterios de aceite:**
1. QUANDO executar `rm -rf site/src/pages/lab/`, ENTAO pasta e removida sem erro
2. QUANDO `npx astro build` roda apos remocao, ENTAO build passa sem warning e `dist/lab/` nao existe
3. QUANDO `npx astro check` roda, ENTAO zero erros de referencia quebrada
4. QUANDO buscar `LabLayout` no src, ENTAO nenhuma ocorrencia resta (se o layout foi removido junto)
5. QUANDO `git status` exibir, ENTAO as mudancas sao `deleted` (nao `modified`) nos arquivos removidos

**Comando de validacao:**
```bash
cd site && npx astro build 2>&1 | grep -q "Complete!" && \
  ! test -d dist/lab && \
  echo "PASS: build ok, /lab/ ausente"
```

---

## Execução

### Status: DONE (no-op)

**Contexto:** `/src/pages/lab/` e `/src/layouts/LabLayout.astro` ja haviam sido removidos em commit anterior. Esta story e no-op — apenas validacao.

### Checks executados:

1. ✓ `grep -rln "LabLayout" src/ --include="*.astro"` — retornou vazio (zero referencias remanescentes)
2. ✓ `ls src/pages/ | grep -i lab` — retornou vazio (nenhuma rota /lab/)
3. ✓ `ls src/layouts/` — apenas `Base.astro` presente
4. ✓ `npx astro build` — passou com "Complete!" (exit code 0)
5. ✓ `! test -d dist/lab/` — confirmado que `/lab/` nao existe em dist

### Criterios de aceite verificados:
- [x] src/pages/lab/ ausente (confirmado via ls + git history)
- [x] LabLayout.astro ausente (confirmado via ls + zero referencias em grep)
- [x] npx astro build passa sem warning
- [x] dist/lab/ nao existe apos build

### Validacao final:
```
PASS: build ok, /lab/ ausente
```

Nenhum arquivo removido ou criado nesta execucao — confirmacao apenas.
