
## Virada de Lote — R$27 → R$47 (válido até 22/02)

Atualizar 3 arquivos para refletir o novo lote. Todas as mudanças seguem o padrão do projeto: valores no `config.ts`, textos hardcoded corrigidos nos componentes.

---

### 1. `src/components/vendas/config.ts`

| Campo | Antes | Depois |
|---|---|---|
| `CHECKOUT_URL` | `https://pay.kiwify.com.br/oP6cxCS` | `https://pay.kiwify.com.br/n9aF0X6` |
| `COUNTDOWN_TARGET` | `2026-03-19T00:00:00-03:00` | `2026-02-22T23:59:59-03:00` |
| `PRICE_CURRENT` | `27` | `47` |
| `PRICE_NEXT_BATCH` | `47` | `67` |
| `DISCOUNT_PERCENT` | `72` | `52` → (97-47)/97 ≈ 51,5% arredondado |
| `SAVINGS` | `70` | `50` → 97-47 |
| `HERO_BADGE` | `🎟️ Pré-venda ativa: R$ 27,00 \| Próximo lote 19/02 ➜ R$ 47,00` | `🎟️ Lote 2 ativo: R$ 47,00 \| Próximo lote 22/02 ➜ R$ 67,00` |
| `PRICING_HEADLINE` | `LIBERE UM DESCONTO EXCLUSIVO DE 72% OFF` | `LIBERE UM DESCONTO EXCLUSIVO DE 52% OFF` |
| `PRICING_CTA` | `LIBERAR DESCONTO DE 72%` | `LIBERAR DESCONTO DE 52%` |

---

### 2. `src/components/vendas/SalesHeroSection.tsx` — linha 128

Texto hardcoded abaixo do botão CTA:

```
// Antes
Pré-venda R$27 · Vagas limitadas

// Depois
Lote 2 · R$47 · Vagas limitadas
```

---

### 3. `src/components/vendas/PricingSection.tsx` — linha 53

Label hardcoded acima do preço grande:

```
// Antes
🔥 Investimento Lote Pré-Venda:

// Depois
🔥 Investimento Lote 2:
```

---

### Resumo dos 3 arquivos

| Arquivo | O que muda |
|---|---|
| `config.ts` | URL checkout, countdown, preços, desconto, economia, badge, headline, CTA |
| `SalesHeroSection.tsx` | 1 texto hardcoded na linha 128 |
| `PricingSection.tsx` | 1 label hardcoded na linha 53 |
