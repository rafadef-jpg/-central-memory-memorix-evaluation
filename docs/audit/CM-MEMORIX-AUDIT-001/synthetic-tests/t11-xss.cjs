const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: require('fs').existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  const p = await b.newPage(); await p.setContent('<div id=r></div>');
  const out = await p.evaluate(() => { function escapeHtml(t){const d=document.createElement('div');d.textContent=t;return d.innerHTML}
    const title='x" onmouseover="window.__pwned=1" data-a="'; const html=`<span id=s title="${escapeHtml(title)}">${escapeHtml(title)}</span>`;
    document.getElementById('r').innerHTML=html; const s=document.getElementById('s'); s.dispatchEvent(new MouseEvent('mouseover')); return {escaped: escapeHtml(title), hasHandler: s.hasAttribute('onmouseover'), pwned: window.__pwned===1} });
  console.log(JSON.stringify(out)); await b.close() })();
