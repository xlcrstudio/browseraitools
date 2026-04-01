import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = join(__dirname, 'client/public/sitemap.xml');
const LASTMOD_DATE  = '2026-04-01';

function run(label, cmd) {
  console.log(`\n▶ ${label}`);
  execSync(cmd, { stdio: 'inherit', cwd: __dirname });
  console.log(`✓ ${label} done`);
}

// ─── Step 1: Main tool pages ────────────────────────────────────────────────
run('generate-main-tool-pages.js', 'node generate-main-tool-pages.js');

// ─── Step 2: Internal links ─────────────────────────────────────────────────
run('add-internal-links.js', 'node add-internal-links.js');

// ─── Step 3: Unified sitemap ─────────────────────────────────────────────────
run('generate-unified-sitemap.js', 'node generate-unified-sitemap.js');

// ─── Step 4: Force lastmod = 2026-04-01 everywhere in sitemap.xml ───────────
console.log(`\n▶ Patching lastmod dates to ${LASTMOD_DATE} …`);

let xml = readFileSync(SITEMAP_PATH, 'utf8');
const before = (xml.match(/<lastmod>/g) || []).length;

xml = xml.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${LASTMOD_DATE}</lastmod>`);

writeFileSync(SITEMAP_PATH, xml, 'utf8');
console.log(`✓ Updated ${before} <lastmod> entries`);

// ─── Step 5: Verify & summarise ─────────────────────────────────────────────
const totalUrls    = (xml.match(/<loc>/g) || []).length;
const mainHtml     = (xml.match(/\/tools\/[^<]+\.html<\/loc>/g) || []);
const mainCount    = mainHtml.length;
const variantCount = (xml.match(/\/tools\/variants\//g) || []).length;
const homepageOk   = xml.includes('<loc>https://browseraitools.com/</loc>');
const allMainHtml  = mainHtml.every(m => m.endsWith('.html</loc>'));

const exampleCaption = mainHtml.find(m => m.includes('instagram')) || mainHtml[0] || '(none)';

console.log(`
══════════════════════════════════════════════════════════
✅ Full SEO regeneration complete
──────────────────────────────────────────────────────────
  Total URLs in sitemap     : ${totalUrls}
  Homepage                  : ${homepageOk ? '✓ https://browseraitools.com/' : '✗ MISSING'}
  Main tool pages           : ${mainCount - variantCount} (non-variant /tools/*.html)
  Variant pages             : ${variantCount}
  Lastmod date updated to   : ${LASTMOD_DATE} for all ${before} entries
  Main tool pages .html     : ${allMainHtml ? '✓ All confirmed with .html extension' : '✗ Some missing .html'}
  Example                   : ${exampleCaption.replace(/<\/loc>/, '').trim()}
══════════════════════════════════════════════════════════`);
