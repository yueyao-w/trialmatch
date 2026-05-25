// scripts/generate-flow-diagram.cjs
// Run: node scripts/generate-flow-diagram.cjs

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHOTS = path.join(ROOT, 'public', 'screenshots');
const OUTPUT = path.join(ROOT, 'public', 'flow-diagram.png');

function b64(filename) {
  const buf = fs.readFileSync(path.join(SHOTS, filename));
  return `data:image/png;base64,${buf.toString('base64')}`;
}

const CARDS = [
  { id: 'c1', src: b64('01-list .png'),           num: '①', title: '候选列表', en: 'Candidate List',   desc: 'AI 0.8 秒筛出 17 人' },
  { id: 'c2', src: b64('02-detail .png'),          num: '②', title: '匹配详情', en: 'Match Detail',     desc: '证据链 + 三态判断' },
  { id: 'c3', src: b64('03-reasoning.png'),        num: '③', title: 'AI 推理',  en: 'Reasoning',        desc: '模型版本可追溯' },
  { id: 'c4', src: b64('04-medical-records.png'),  num: '④', title: '原始病历', en: 'Source Records',   desc: '三层可解释性' },
  { id: 'c5', src: b64('05-override.png'),         num: '⑤', title: '推翻判断', en: 'Override',         desc: 'AI 不替人决策' },
  { id: 'c6', src: b64('06-drawer.png'),           num: '⑥', title: '沟通话术', en: 'Communication',    desc: '工作流延伸' },
];

function card(c) {
  return `
  <div class="card" id="${c.id}">
    <div class="chrome">
      <span class="dot r"></span>
      <span class="dot y"></span>
      <span class="dot g"></span>
    </div>
    <img src="${c.src}" alt="${c.title}">
    <div class="caption">
      <div class="ct"><span class="num">${c.num}</span>${c.title}</div>
      <div class="ce">${c.en}</div>
      <div class="cd">${c.desc}</div>
    </div>
  </div>`;
}

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{
  background:#FAFAF9;
  width:2200px;
  min-height:1600px;
  padding:80px 100px 100px;
  font-family:-apple-system,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;
  position:relative;
}
.hd{text-align:center;margin-bottom:60px}
.hd h1{
  font-family:Georgia,'Times New Roman',serif;
  font-size:32px;color:#1C1917;
  letter-spacing:.05em;margin-bottom:10px
}
.hd p{font-size:14px;color:#999;letter-spacing:.03em}

.row{display:flex;align-items:flex-start;justify-content:center}
.gap-col{width:80px;flex-shrink:0}
.row-gap{height:80px}

.card{
  width:400px;flex-shrink:0;
  border:1px solid #E5E5E5;border-radius:8px;
  overflow:hidden;
  box-shadow:0 4px 12px rgba(0,0,0,.08);
  background:#fff;
}
.chrome{
  height:28px;background:#F5F5F4;
  display:flex;align-items:center;
  padding:0 10px;gap:7px;
  border-bottom:1px solid #E5E5E5;
  flex-shrink:0;
}
.dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
.dot.r{background:#FF5F57}
.dot.y{background:#FEBC2E}
.dot.g{background:#28C840}
.card img{width:400px;height:auto;display:block}
.caption{
  padding:12px 14px 14px;
  border-top:1px solid #F0F0EF;
}
.ct{font-size:14px;font-weight:700;color:#1C1917;margin-bottom:3px}
.num{color:#78716C;margin-right:4px}
.ce{font-size:10px;color:#999;margin-bottom:2px;letter-spacing:.04em}
.cd{font-size:11px;color:#555}

#overlay{
  position:absolute;top:0;left:0;
  width:2200px;
  pointer-events:none;
}
.ft{
  text-align:right;margin-top:40px;
  font-size:10px;color:#BBB;letter-spacing:.02em;
}
</style>
</head>
<body>

<div class="hd">
  <h1>TrialMatch · CRC 工作台 产品流程</h1>
  <p>V1 范围 · 6 个核心页面</p>
</div>

<svg id="overlay" height="2000">
  <defs>
    <marker id="ah" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
      <polygon points="0 0,7 3.5,0 7" fill="#A8A29E"/>
    </marker>
  </defs>
</svg>

<div class="row" id="row1">
  ${card(CARDS[0])}
  <div class="gap-col"></div>
  ${card(CARDS[1])}
  <div class="gap-col"></div>
  ${card(CARDS[2])}
  <div class="gap-col"></div>
  ${card(CARDS[3])}
</div>

<div class="row-gap"></div>

<div class="row" id="row2">
  ${card(CARDS[4])}
  <div class="gap-col"></div>
  ${card(CARDS[5])}
</div>

<div class="ft">TrialMatch · Demo for PM Portfolio · 2026-05</div>

<script>
window.addEventListener('load', function () {
  var svg = document.getElementById('overlay');
  var pageH = Math.max(document.body.scrollHeight, 1600);
  svg.setAttribute('height', pageH);

  // collect card rects
  var ids = ['c1','c2','c3','c4','c5','c6'];
  var rects = ids.map(function(id){
    var r = document.getElementById(id).getBoundingClientRect();
    return {
      left: r.left, right: r.right,
      top: r.top, bottom: r.bottom,
      cx: (r.left + r.right) / 2,
      cy: (r.top + r.bottom) / 2,
      imgMidY: r.top + 28 + (r.height - 28 - 75) * 0.42
    };
  });

  var ns = 'http://www.w3.org/2000/svg';

  function line(x1, y1, x2, y2) {
    var el = document.createElementNS(ns, 'line');
    el.setAttribute('x1', x1); el.setAttribute('y1', y1);
    el.setAttribute('x2', x2); el.setAttribute('y2', y2);
    el.setAttribute('stroke', '#A8A29E');
    el.setAttribute('stroke-width', '1.5');
    el.setAttribute('marker-end', 'url(#ah)');
    svg.appendChild(el);
  }

  function curve(sx, sy, ex, ey, c1x, c1y, c2x, c2y) {
    var el = document.createElementNS(ns, 'path');
    el.setAttribute('d', 'M '+sx+' '+sy+' C '+c1x+' '+c1y+', '+c2x+' '+c2y+', '+ex+' '+ey);
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', '#A8A29E');
    el.setAttribute('stroke-width', '1.5');
    el.setAttribute('stroke-dasharray', '0');
    el.setAttribute('marker-end', 'url(#ah)');
    svg.appendChild(el);
  }

  // Row 1 horizontal arrows (use imgMidY of card 0 as baseline)
  var hy1 = rects[0].imgMidY;
  line(rects[0].right + 6, hy1, rects[1].left - 10, hy1);
  line(rects[1].right + 6, hy1, rects[2].left - 10, hy1);
  line(rects[2].right + 6, hy1, rects[3].left - 10, hy1);

  // Row 2 horizontal arrow
  var hy2 = rects[4].imgMidY;
  line(rects[4].right + 6, hy2, rects[5].left - 10, hy2);

  // Curved arrow: card4 bottom-center → card5 top-center
  var sx = rects[3].cx;
  var sy = rects[3].bottom + 6;
  var ex = rects[4].cx;
  var ey = rects[4].top - 6;

  // Bezier: drop straight down from c4, then sweep left and arrive from below c5
  var dx = ex - sx;  // negative (c5 is left of c4)
  var dy = ey - sy;  // positive (downward)

  var c1x = sx;
  var c1y = sy + dy * 0.5;
  var c2x = ex - dx * 0.1;
  var c2y = ey - 60;

  curve(sx, sy, ex, ey, c1x, c1y, c2x, c2y);

  window._arrowsDrawn = true;
});
</script>

</body>
</html>`;

(async () => {
  console.log('Launching Puppeteer …');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 2200, height: 2000, deviceScaleFactor: 1 });

  await page.setContent(html, { waitUntil: 'load' });

  // wait for JS arrows to finish
  await page.waitForFunction(() => window._arrowsDrawn === true, { timeout: 15000 });

  // re-measure actual content height, then resize viewport
  const contentH = await page.evaluate(() => document.body.scrollHeight);
  await page.setViewport({ width: 2200, height: contentH + 20, deviceScaleFactor: 1 });

  await page.screenshot({ path: OUTPUT, fullPage: false });
  await browser.close();
  console.log('Saved →', OUTPUT);
})().catch(err => { console.error(err); process.exit(1); });
