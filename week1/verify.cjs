// Run: node week1/verify.cjs (Node.js built-ins only).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'assets/fontawesome/css/fontawesome.min.css'), 'utf8');
const names = ['Pizza','Sushi','Burger','Salad','Tacos','Ramen','Sandwich','Pasta','Curry','Steak','Soup','BBQ'];
const icons = ['pizza-slice','fish','hamburger','leaf','utensil-spoon','bowl-food','bread-slice','utensils','mortar-pestle','drumstick-bite','bowl-rice','fire'];
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
assert(!/<(?:link|script)[^>]+(?:href|src)=["']https?:/i.test(html), 'No external runtime dependencies');
for (const relative of [...html.matchAll(/<link[^>]+href="([^"]+)"/g)].map(m=>m[1])) {
  const file = path.join(__dirname, relative);
  assert(fs.existsSync(file), relative);
  const sheet = fs.readFileSync(file,'utf8');
  for (const match of sheet.matchAll(/url\(([^)]+)\)/g)) {
    assert(fs.existsSync(path.resolve(path.dirname(file),match[1].replace(/["']/g,''))), match[1]);
  }
}
// Force each random interval in a test-only VM; production Math.random is unchanged.
for (let index=0;index<names.length;index++) {
  const events = {}, timers = [];
  const icon = {}, name = {};
  const classes = new Set();
  const display = {classList:{remove:c=>classes.delete(c),add:c=>classes.add(c)}};
  const button = {addEventListener:(event,fn)=>events[event]=fn};
  const testMath = Object.create(Math);
  testMath.random = () => (index + 0.5) / names.length;
  vm.runInNewContext(script, {
    Math:testMath,
    document:{addEventListener:(event,fn)=>fn(), getElementById:()=>button,
      querySelector:selector=>({'.food-icon':icon,'.food-name':name,'.lunch-display':display})[selector]},
    setTimeout:(fn,delay)=>{assert.equal(delay,500);timers.push(fn);}
  });
  function finish() {
    assert.equal(name.textContent,'Thinking...');
    assert(icon.innerHTML.includes('fa-spinner'));
    timers.shift()();
    assert.equal(name.textContent,names[index]);
    assert.equal(icon.innerHTML,`<i class="fas fa-${icons[index]}"></i>`);
    assert(css.includes(`.fa-${icons[index]}:before`),`Missing CSS: ${icons[index]}`);
    assert(classes.has('fade-in'));
  }
  finish(); // Initial generation.
  events.click();
  finish(); // Button handler.
}
console.log('PASS: all 12 name/icon pairs on initial load and button click; loading and animation; local CSS/font paths.');
