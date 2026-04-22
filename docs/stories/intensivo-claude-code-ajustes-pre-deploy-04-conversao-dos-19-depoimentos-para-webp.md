---
title: Story 04 — Conversao dos 19 depoimentos para WebP
slug: intensivo-claude-code-ajustes-pre-deploy-04
plan: docs/plans/intensivo-claude-code-ajustes-pre-deploy.md
prd: docs/prds/intensivo-claude-code-ajustes-pre-deploy.md
complexity: M
model: implementer-sonnet
depends_on: []
status: done
created: 2026-04-22
tags: [story, landing, intensivo-claude-code-ajustes-pre-deploy]
---

# Story 04 — Conversao dos 19 depoimentos para WebP

- **Complexidade:** M
- **Modelo sugerido:** implementer-sonnet
- **Depende de:** nenhuma
- **Arquivos a criar:**
  - `site/scripts/convert-depoimentos.mjs` (script de conversao)
  - `site/public/depoimentos/depoimento-{01..19}.webp` (output da conversao)
- **Arquivos a modificar:**
  - `site/package.json` — adicionar `sharp` em `devDependencies`; opcionalmente adicionar npm script `"convert:webp": "node scripts/convert-depoimentos.mjs"`
  - `site/src/config.ts` linhas 45-48 — trocar `.png` por `.webp` no `SOCIALPROOF_IMAGES`
  - `site/public/depoimentos/` — **deletar** os 19 `.png` apos confirmar que os `.webp` renderizam no preview
- **Patterns a seguir:** PRD secao 4.3

**Contexto:** 19 depoimentos em PNG puro estao inflando o bundle de imagens em ~60-70%. WebP com qualidade 85 mantem qualidade visual indistinguivel e reduz ~60% do peso. Audience VUK e >95% Chrome/Safari mobile — WebP e suportado universalmente em 2020+. `<picture>` fallback nao vale a pena (complica marquee GSAP).

**Codigo de referencia:** `site/scripts/convert-depoimentos.mjs`

```js
// site/scripts/convert-depoimentos.mjs
import sharp from 'sharp';
import { readdir, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, '..', 'public', 'depoimentos');

async function main() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'));

  if (files.length === 0) {
    console.log('Nenhum PNG para converter.');
    return;
  }

  console.log(`Convertendo ${files.length} arquivos em ${DIR}...`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const f of files) {
    const input = path.join(DIR, f);
    const output = path.join(DIR, f.replace('.png', '.webp'));

    const buf = await sharp(input).webp({ quality: 85 }).toBuffer();
    const { fs } = await import('fs');
    (await import('fs')).writeFileSync(output, buf);

    const beforeSize = (await import('fs')).statSync(input).size;
    const afterSize = buf.length;
    totalBefore += beforeSize;
    totalAfter += afterSize;

    console.log(
      `  ${f} (${(beforeSize / 1024).toFixed(1)} KB) -> ${path.basename(output)} (${(afterSize / 1024).toFixed(1)} KB)`
    );
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024).toFixed(1)} KB -> ${(totalAfter / 1024).toFixed(1)} KB (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% menor)`
  );
  console.log(`\nOK. Para deletar os PNGs, rode:`);
  console.log(`  rm ${DIR}/*.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

**Atualizacao em `site/src/config.ts` linhas 45-48:**
```ts
// Antes
SOCIALPROOF_IMAGES: Array.from(
  { length: 19 },
  (_, i) => `/depoimentos/depoimento-${String(i + 1).padStart(2, '0')}.png`
),

// Depois
SOCIALPROOF_IMAGES: Array.from(
  { length: 19 },
  (_, i) => `/depoimentos/depoimento-${String(i + 1).padStart(2, '0')}.webp`
),
```

**Sequencia de execucao:**
1. `cd site && npm install --save-dev sharp`
2. Criar `site/scripts/convert-depoimentos.mjs` com o conteudo acima
3. Rodar `node scripts/convert-depoimentos.mjs` — gera 19 `.webp`
4. Atualizar `src/config.ts`
5. `npx astro build` — confirmar que `dist/depoimentos/*.webp` existe
6. `npx astro preview` — abrir em localhost, conferir marquee renderiza as 19 imagens
7. **Apos confirmar visualmente no preview**, executar `rm site/public/depoimentos/*.png`
8. Rebuild final: `npx astro build` — confirmar `dist/depoimentos/*.png` nao existe

**Criterios de aceite:**
1. QUANDO rodar `node scripts/convert-depoimentos.mjs`, ENTAO 19 arquivos `.webp` sao gerados em `public/depoimentos/`
2. QUANDO comparar tamanhos, ENTAO o total dos `.webp` e < 40% do total dos `.png` originais (reducao >= 60%)
3. QUANDO rodar `npx astro build` apos update do config, ENTAO `dist/depoimentos/*.webp` existe e `dist/depoimentos/*.png` **nao** existe (apos deletados)
4. QUANDO abrir o preview local, ENTAO SocialProof renderiza as 19 imagens em marquee sem quebra visual
5. QUANDO conferir o DevTools Network em mobile viewport, ENTAO Content-Type dos depoimentos e `image/webp`

**Comando de validacao:**
```bash
cd site && npm install && node scripts/convert-depoimentos.mjs && \
  ls public/depoimentos/*.webp | wc -l | tr -d ' ' | grep -q "^19$" && \
  echo "PASS: 19 WebP gerados"
```
