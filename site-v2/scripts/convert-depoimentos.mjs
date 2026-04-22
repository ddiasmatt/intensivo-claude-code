// site/scripts/convert-depoimentos.mjs
// Converte os 19 depoimentos de PNG para WebP (qualidade 85).
// Uso: node scripts/convert-depoimentos.mjs
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
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

    const beforeStat = await stat(input);
    totalBefore += beforeStat.size;

    await sharp(input).webp({ quality: 85 }).toFile(output);

    const afterStat = await stat(output);
    totalAfter += afterStat.size;

    console.log(
      `  ${f} (${(beforeStat.size / 1024).toFixed(1)} KB) -> ${path.basename(output)} (${(afterStat.size / 1024).toFixed(1)} KB)`
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
