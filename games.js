// Game registry. Every game: {title, emoji, desc, init(first) -> state, view(state, A) -> status text}
// A = {root, me:'a'|'b', names:{a,b}, act(fn), mem:{}, toast}. act(fn): fn(stateClone) returns new state (or nothing to cancel).
const other = r => (r === 'a' ? 'b' : 'a'), rnd = n => Math.floor(Math.random() * n), pick = a => a[rnd(a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const seg = (lv, dis) => `<div class="seg" id="lv">${['Normal', '🌶️ Spicy', '🔥 Extra'].map((t, i) => `<button data-v="${i}" class="${(lv || 0) === i ? 'on' : ''}" ${dis ? 'disabled' : ''}>${t}</button>`).join('')}</div>`;
const segBind = (A, can) => { const e = A.root.querySelector('#lv'); if (e) e.onclick = ev => { const b = ev.target.closest('[data-v]'); if (!b || b.disabled) return; const v = +b.dataset.v; A.act(s => { if (!can(s)) return; s.level = v; return s; }); }; };
const turnTxt = (s, A) => (s.winner ? '' : s.turn === A.me ? 'Your turn' : `${A.names[s.turn]}'s turn`);
const L3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const c4win = (c, i, me) => { const r0 = Math.floor(i / 7), c0 = i % 7; for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) { const line = [i]; for (const sg of [1, -1]) { let r = r0 + dr * sg, cc = c0 + dc * sg; while (r >= 0 && r < 6 && cc >= 0 && cc < 7 && c[r * 7 + cc] === me) { line.push(r * 7 + cc); r += dr * sg; cc += dc * sg; } } if (line.length >= 4) return line; } return null; };
const RB = { r: 's', s: 'p', p: 'r' }, RE = { r: '✊', p: '✋', s: '✌️' };
const EMO = ['🍓', '🍒', '🌹', '💋', '🍫', '🎀', '🦋', '🌙'];
const SN = { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 }, LD = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };
const cellXY = n => { if (n < 1) return [5, 105]; const r = Math.floor((n - 1) / 10), c = (n - 1) % 10; return [(r % 2 ? 9 - c : c) * 10 + 5, (9 - r) * 10 + 5]; };
const snake = (a, b) => { const [x1, y1] = cellXY(a), [x2, y2] = cellXY(b), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), px = -dy / L, py = dx / L; let d = ''; for (let i = 0; i <= 26; i++) { const t = i / 26, w = Math.sin(t * Math.PI * 4) * 2.4 * (1 - t * .35); d += (i ? 'L' : 'M') + (x1 + dx * t + px * w).toFixed(1) + ' ' + (y1 + dy * t + py * w).toFixed(1); } return `<path d="${d}" fill="none" stroke="#ff6b81" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" opacity=".92"/><circle cx="${x1}" cy="${y1}" r="2" fill="#ff4d6d"/><circle cx="${x1 - .7}" cy="${y1 - .6}" r=".4" fill="#fff"/><circle cx="${x1 + .7}" cy="${y1 - .6}" r=".4" fill="#fff"/>`; };
const ladder = (a, b) => { const [x1, y1] = cellXY(a), [x2, y2] = cellXY(b), dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), px = -dy / L * 1.3, py = dx / L * 1.3; let t = `<line x1="${x1 + px}" y1="${y1 + py}" x2="${x2 + px}" y2="${y2 + py}" stroke="#e0b46a" stroke-width=".9"/><line x1="${x1 - px}" y1="${y1 - py}" x2="${x2 - px}" y2="${y2 - py}" stroke="#e0b46a" stroke-width=".9"/>`; const n = Math.max(2, Math.floor(L / 4.5)); for (let i = 1; i < n; i++) { const u = i / n; t += `<line x1="${x1 + dx * u + px}" y1="${y1 + dy * u + py}" x2="${x1 + dx * u - px}" y2="${y1 + dy * u - py}" stroke="#e0b46a" stroke-width=".7"/>`; } return t; };
export const TOD = {
  normal: { truth: ['What is your most embarrassing moment?', 'What was your first impression of me?', 'What is a secret talent you have?', 'What is the silliest fear you have?', 'What song makes you think of us?', 'What is your favorite memory of us?', 'What is one habit of mine you secretly love?', 'What would you do with a free day just for yourself?', 'What is the best gift you have ever received?', 'What is something you have never told me?', 'What do you daydream about most?', 'When did you realize you liked me?'],
    dare: ['Do your best dance move for 20 seconds.', 'Talk in an accent until your next turn.', 'Send me a selfie with a silly face.', 'Sing the chorus of your favorite song.', 'Say three nice things about me in 10 seconds.', 'Do 10 jumping jacks right now.', 'Make up a short poem about me.', 'Imitate me for 30 seconds.', 'Draw my portrait in 30 seconds and show me.', 'Tell a joke and keep a straight face.', 'Hold a plank until I say stop (max 30s).', 'Speak only in questions for two minutes.'] },
  spicy: { truth: ['What is the first thing you noticed about me physically?', 'What is your favorite place for me to kiss you?', 'Have you ever had a dream about me you did not tell me about?', 'What outfit of mine drives you wild?', 'What is the most romantic thing you want to do with me?', 'What is your biggest turn-on that is not physical?', 'Where is the most adventurous place you would like to kiss me?', 'What is a fantasy date you have imagined for us?', 'When did you last think about me in a naughty way?', 'What is one thing you want me to try with you?', 'What is your favorite way I flirt with you?', 'What is the most daring thing you have done for love?', 'What do you think about when you miss me at night?', 'What would our perfect lazy morning in bed look like?', 'What compliment from me makes you melt?', 'What is something you find irresistible about my voice or touch?'],
    dare: ['Whisper something flirty in my ear (or voice-note it).', 'Give me your best sultry look for 10 seconds.', 'Send me your favorite photo of us with a flirty caption.', 'Describe our best kiss in three words.', 'Tell me what you would do if we were alone right now.', 'Blow me a kiss and make it count.', 'Say my name in your most seductive voice.', 'Write a two-line love poem with a spicy twist.', 'Compliment me in the sexiest way you can.', 'Give me a 20-second shoulder massage (or describe one in detail).', 'Do your best catwalk and strike a pose.', 'Tell me your favorite thing about my lips, eyes or smile.', 'Plan our next date night in the most romantic way you can.', 'Whisper three things you love about my body (keep it classy).', 'Send me a voice note saying good night like you mean it.', 'Hold eye contact with me for 30 seconds without laughing.'] } };
export const HW = ["What's my favorite food?", "What's my dream vacation?", 'What am I most afraid of?', "What's my favorite movie?", "What's my guilty pleasure?", 'What would I do with a totally free day?', "What's my favorite memory of us?", "What's my biggest pet peeve?", "What's my go-to comfort food?", 'What song would I sing at karaoke?', "What's my favorite season?", 'What did I want to be as a kid?', "What's my love language?", "What's my most used emoji?", 'What do I notice first about a person?', 'Who is my celebrity crush?', "What's my ideal date night?", "What's my hidden talent?", "What's my biggest dream?", "What's my favorite thing about you?"];
export const WORDS = ['cat', 'house', 'pizza', 'rainbow', 'guitar', 'butterfly', 'umbrella', 'bicycle', 'sunflower', 'robot', 'castle', 'rocket', 'cupcake', 'balloon', 'dragon', 'elephant', 'penguin', 'lighthouse', 'snowman', 'camera', 'airplane', 'volcano', 'heart', 'kiss', 'wedding ring', 'candle', 'teddy bear', 'moon', 'ice cream', 'dinosaur', 'treasure', 'bridge', 'octopus', 'pirate', 'mermaid', 'sandwich', 'fireworks', 'spider', 'tent', 'crown'];
export const GAMES = {
  ttt: { title: 'Tic-Tac-Toe', emoji: '❌', desc: 'Three in a row wins.',
    init: f => ({ cells: Array(9).fill(''), turn: f, winner: null, last: -1, line: [] }),
    view(s, A) {
      A.root.innerHTML = `<div class="g3">${s.cells.map((c, i) => `<button class="cell ${c} ${i === s.last ? 'new' : ''} ${s.line.includes(i) ? 'win' : ''}" data-i="${i}" aria-label="square ${i + 1}">${c === 'a' ? '✕' : c === 'b' ? '○' : ''}</button>`).join('')}</div>`;
      A.root.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i; A.act(s => { if (s.winner || s.turn !== A.me || s.cells[i]) return; s.cells[i] = A.me; s.last = i; const L = L3.find(l => l.every(k => s.cells[k] === A.me)); if (L) { s.winner = A.me; s.line = L; } else if (s.cells.every(Boolean)) s.winner = 'draw'; else s.turn = other(A.me); return s; }); };
      return turnTxt(s, A); } },
  c4: { title: 'Connect Four', emoji: '🔴', desc: 'Drop discs, line up four.',
    init: f => ({ cells: Array(42).fill(''), turn: f, winner: null, last: -1, line: [] }),
    view(s, A) {
      A.root.innerHTML = `<div class="c4">${s.cells.map((c, i) => `<button class="c4c" data-c="${i % 7}" aria-label="column ${i % 7 + 1}"><span class="disc ${c} ${i === s.last ? 'new' : ''} ${s.line.includes(i) ? 'win' : ''}" style="--d:${Math.floor(i / 7) + 1}"></span></button>`).join('')}</div>`;
      A.root.onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; const c = +b.dataset.c; A.act(s => { if (s.winner || s.turn !== A.me) return; for (let r = 5; r >= 0; r--) { const i = r * 7 + c; if (!s.cells[i]) { s.cells[i] = A.me; s.last = i; const L = c4win(s.cells, i, A.me); if (L) { s.winner = A.me; s.line = L; } else if (s.cells.every(Boolean)) s.winner = 'draw'; else s.turn = other(A.me); return s; } } }); };
      return turnTxt(s, A); } },
  rps: { title: 'Rock Paper Scissors', emoji: '✊', desc: 'First to 3 wins.',
    init: f => ({ pa: '', pb: '', sa: 0, sb: 0, round: 1, last: null, winner: null, turn: f }),
    view(s, A) {
      const mine = s['p' + A.me], L = s.last, old = L && A.mem.rn === L.n; if (L) A.mem.rn = L.n;
      A.root.innerHTML = `<div class="score"><b>${esc(A.names.a)}</b> <span>${s.sa} : ${s.sb}</span> <b>${esc(A.names.b)}</b></div>` +
        (L ? `<div class="rev ${old ? 'old' : ''}"><span class="h l">${RE[L.a]}</span><span class="vs">${L.r === 'tie' ? 'Tie!' : esc(A.names[L.r]) + ' scores'}</span><span class="h r">${RE[L.b]}</span></div>` : '<div class="rev"></div>') +
        (s.winner ? '' : mine ? `<p class="wait">Waiting for ${esc(A.names[other(A.me)])}…</p>` : `<div class="hands">${['r', 'p', 's'].map(x => `<button class="hand" data-h="${x}" aria-label="${x}">${RE[x]}</button>`).join('')}</div>`);
      A.root.onclick = e => { const b = e.target.closest('[data-h]'); if (!b) return; const x = b.dataset.h; A.act(s => { if (s.winner || s['p' + A.me]) return; s['p' + A.me] = x; if (s.pa && s.pb) { const r = s.pa === s.pb ? 'tie' : RB[s.pa] === s.pb ? 'a' : 'b'; s.last = { a: s.pa, b: s.pb, r, n: s.round }; if (r !== 'tie') s['s' + r]++; s.pa = s.pb = ''; s.round++; if (s.sa >= 3 || s.sb >= 3) s.winner = s.sa > s.sb ? 'a' : 'b'; } return s; }); };
      return s.winner ? '' : `Round ${s.round} · pick secretly`; } },
  mem: { title: 'Memory Match', emoji: '🃏', desc: 'Find the most pairs.',
    init: f => ({ cards: shuffle([...EMO, ...EMO]), up: [], done: Array(16).fill(''), sa: 0, sb: 0, turn: f, winner: null }),
    view(s, A) {
      if (A.root.dataset.g !== 'mem') { A.root.dataset.g = 'mem'; A.root.innerHTML = `<div class="score"></div><div class="mem">${s.cards.map((c, i) => `<button class="mc" data-i="${i}" aria-label="card ${i + 1}"><i><s></s></i></button>`).join('')}</div>`; }
      A.root.querySelector('.score').innerHTML = `<b>${esc(A.names.a)}</b> <span>${s.sa} : ${s.sb}</span> <b>${esc(A.names.b)}</b>`;
      A.root.querySelectorAll('.mc').forEach((b, i) => { const on = s.up.includes(i) || s.done[i]; b.classList.toggle('up', !!on); b.classList.toggle('done', !!s.done[i]); b.dataset.o = s.done[i]; b.querySelector('s').textContent = on ? s.cards[i] : ''; });
      A.root.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i; A.act(s => { if (s.winner || s.turn !== A.me || s.up.length >= 2 || s.up.includes(i) || s.done[i]) return; s.up.push(i); if (s.up.length === 2) { const [x, y] = s.up; if (s.cards[x] === s.cards[y]) { s.done[x] = s.done[y] = A.me; s['s' + A.me]++; s.up = []; if (s.done.every(Boolean)) s.winner = s.sa > s.sb ? 'a' : s.sb > s.sa ? 'b' : 'draw'; } } return s; }); };
      if (s.up.length === 2 && s.turn === A.me && A.mem.k !== s.n) { A.mem.k = s.n; setTimeout(() => A.act(t => { if (t.up.length !== 2 || t.winner) return; t.up = []; t.turn = other(t.turn); return t; }), 1100); }
      return turnTxt(s, A); } },
  snl: { title: 'Snakes & Ladders', emoji: '🐍', desc: 'Race to 100.',
    init: f => ({ pa: 0, pb: 0, turn: f, dice: 0, ev: '', winner: null }),
    view(s, A) {
      if (A.root.dataset.g !== 'snl') { A.root.dataset.g = 'snl'; let g = '', nums = '';
        for (let n = 1; n <= 100; n++) { const [x, y] = cellXY(n); g += `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${(Math.floor((n - 1) / 10) + (n - 1) % 10) % 2 ? '#2a2030' : '#231a28'}"/>`; nums += `<text x="${x - 4.4}" y="${y - 2.8}" font-size="2.4" fill="#9a8a98">${n}</text>`; }
        const ln = Object.entries(LD).map(([a, b]) => ladder(+a, b)).join('') + Object.entries(SN).map(([a, b]) => snake(+a, b)).join('');
        A.root.innerHTML = `<svg class="snl" viewBox="0 0 100 110">${g}${nums}${ln}<g id="ta" class="tk"><circle r="2.6" fill="#E879A5" stroke="#fff" stroke-width=".5"/></g><g id="tb" class="tk"><rect x="-2.4" y="-2.4" width="4.8" height="4.8" rx="1.2" fill="#7be0a0" stroke="#fff" stroke-width=".5"/></g></svg><div class="row"><button class="pri big" id="roll" aria-label="Roll the dice">🎲 Roll</button><span class="ev" id="ev"></span></div>`;
        A.root.querySelector('#roll').onclick = () => A.act(s => { if (s.winner || s.turn !== A.me) return; const d = 1 + rnd(6); let p = s['p' + A.me] + d, ev = `${A.names[A.me]} rolled ${d}`; if (p > 100) { p = s['p' + A.me]; ev += ' — needs an exact roll'; } else if (SN[p]) { ev += ` · 🐍 slid to ${SN[p]}`; p = SN[p]; } else if (LD[p]) { ev += ` · 🪜 climbed to ${LD[p]}`; p = LD[p]; } s['p' + A.me] = p; s.dice = d; s.ev = ev; if (p === 100) s.winner = A.me; else if (d !== 6) s.turn = other(A.me); return s; }); }
      for (const r of ['a', 'b']) { const [x, y] = cellXY(s['p' + r]); A.root.querySelector('#t' + r).style.transform = `translate(${x + (r === 'a' ? -1.8 : 1.8)}px,${y}px)`; }
      A.root.querySelector('#roll').disabled = !(s.turn === A.me && !s.winner); A.root.querySelector('#ev').textContent = s.ev;
      return turnTxt(s, A) + (s.turn === A.me && s.ev.includes('6') ? '' : ''); } },
  tod: { title: 'Truth or Dare', emoji: '😈', desc: 'Normal or spicy cards.',
    init: f => ({ turn: f, level: 0, card: null, count: 0, winner: null }),
    view(s, A) {
      const mine = s.turn === A.me, pk = (t) => A.act(s => { if (s.card || s.turn !== A.me) return; s.card = { t, q: pick(TOD[['normal', 'spicy', 'hot'][s.level || 0]][t]) }; return s; });
      A.root.innerHTML = seg(s.level, !!s.card) +
        (s.card ? `<div class="tcard ${s.card.t}" key="${s.count}"><small>${s.card.t === 'truth' ? '💬 TRUTH' : '🔥 DARE'} for ${esc(A.names[s.turn])}</small><p>${esc(s.card.q)}</p></div>` + (mine ? `<div class="row"><button class="pri" id="done">✅ Done</button><button id="skip">Skip</button></div>` : '<p class="wait">Waiting for them to finish…</p>')
          : mine ? `<div class="row"><button class="pri big" id="tr">💬 Truth</button><button class="big" id="dr">🔥 Dare</button></div>` : `<p class="wait">${esc(A.names[s.turn])} is choosing…</p>`);
      const q = x => A.root.querySelector(x);
      segBind(A, s => !s.card);
      if (q('#tr')) { q('#tr').onclick = () => pk('truth'); q('#dr').onclick = () => pk('dare'); }
      if (q('#done')) { q('#done').onclick = q('#skip').onclick = () => A.act(s => { if (!s.card || s.turn !== A.me) return; s.card = null; s.turn = other(s.turn); s.count++; return s; }); }
      return mine ? (s.card ? 'Do it, then tap Done' : 'Your turn — pick one') : `${A.names[s.turn]}'s turn`; } },
  hw: { title: 'How Well Do You Know Me?', emoji: '💞', desc: 'Guess each other’s answers.',
    init: f => ({ order: shuffle([...HW.keys()]).slice(0, 10), round: 1, total: 10, ans: f, phase: 'guess', guess: '', sa: 0, sb: 0, turn: other(f), winner: null }),
    view(s, A) {
      const gz = other(s.ans), q = HW[s.order[s.round - 1]], me = A.me;
      A.root.innerHTML = `<div class="score"><b>${esc(A.names.a)}</b> <span>${s.sa} : ${s.sb}</span> <b>${esc(A.names.b)}</b></div><div class="tcard truth" key="${s.round}"><small>ROUND ${s.round} OF ${s.total} · about ${esc(A.names[s.ans])}</small><p>${esc(q)}</p></div>` +
        (s.winner ? '' : s.phase === 'guess' ? (me === gz ? `<form class="hf"><input id="gi" maxlength="80" placeholder="Your guess about ${esc(A.names[s.ans])}…" autocomplete="off"><button class="pri">Guess</button></form>` : `<p class="wait">Think of your real answer… ${esc(A.names[gz])} is guessing 🤔</p>`)
          : `<p class="gs">“${esc(s.guess)}”</p>` + (me === s.ans ? `<div class="row"><button class="pri" id="ok">✅ Right!</button><button id="no">❌ Not quite</button></div>` : '<p class="wait">Waiting for the verdict…</p>'));
      const f = A.root.querySelector('.hf'); if (f) f.onsubmit = e => { e.preventDefault(); const t = A.root.querySelector('#gi').value.trim(); if (!t) return; A.act(s => { if (s.phase !== 'guess' || A.me !== other(s.ans)) return; s.guess = t.slice(0, 80); s.phase = 'judge'; s.turn = s.ans; return s; }); };
      const v = ok => A.act(s => { if (s.phase !== 'judge' || A.me !== s.ans) return; if (ok) s['s' + other(s.ans)]++; if (s.round >= s.total) s.winner = s.sa > s.sb ? 'a' : s.sb > s.sa ? 'b' : 'draw'; else { s.round++; s.ans = other(s.ans); s.phase = 'guess'; s.guess = ''; s.turn = other(s.ans); } return s; });
      if (A.root.querySelector('#ok')) { A.root.querySelector('#ok').onclick = () => v(true); A.root.querySelector('#no').onclick = () => v(false); }
      return s.winner ? '' : s.phase === 'guess' ? (me === gz ? 'Your turn to guess' : 'Waiting for the guess') : me === s.ans ? 'Judge their guess' : 'Waiting for the verdict'; } },
  draw: { title: 'Draw & Guess', emoji: '🎨', desc: 'One draws, one guesses.',
    init: f => ({ drawer: f, word: pick(WORDS), strokes: [], guesses: [], phase: 'draw', result: '', round: 1, total: 6, sa: 0, sb: 0, turn: other(f), winner: null }),
    view(s, A) {
      const me = A.me, dr = s.drawer === me;
      if (A.root.dataset.g !== 'draw') { A.root.dataset.g = 'draw';
        A.root.innerHTML = `<div class="score"></div><div class="word" id="wd"></div><canvas id="cv" width="640" height="480" aria-label="Drawing canvas"></canvas><div class="tools" id="tl"><button data-c="#ffffff" style="background:#fff"></button><button data-c="#ff6b81" style="background:#ff6b81"></button><button data-c="#ffd54f" style="background:#ffd54f"></button><button data-c="#5be08a" style="background:#5be08a"></button><button data-c="#5bb8ff" style="background:#5bb8ff"></button><button data-c="#E879A5" style="background:#E879A5"></button><button id="un" aria-label="Undo">↩</button><button id="cl" aria-label="Clear">🗑</button></div><form class="hf" id="gf"><input id="gi" maxlength="30" placeholder="Type your guess…" autocomplete="off"><button class="pri">Guess</button></form><div id="gl" class="gl"></div><div class="row" id="ar"></div>`;
        const cv = A.root.querySelector('#cv'), cx = cv.getContext('2d'); A.mem.col = '#ffffff'; A.mem.cur = null;
        const pt = e => { const r = cv.getBoundingClientRect(); return [Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (e.clientY - r.top) / r.height))]; };
        cv.onpointerdown = e => { if (!A.mem.canDraw) return; cv.setPointerCapture(e.pointerId); A.mem.cur = { c: A.mem.col, w: 5, p: [...pt(e)] }; A.mem.redraw(); };
        cv.onpointermove = e => { if (!A.mem.cur) return; const p = pt(e); A.mem.cur.p.push(p[0], p[1]); A.mem.redraw(); };
        cv.onpointerup = cv.onpointercancel = () => { const st = A.mem.cur; A.mem.cur = null; if (!st || st.p.length < 2) return; if (st.p.length === 2) st.p.push(st.p[0] + .001, st.p[1]); st.p = st.p.map(v => Math.round(v * 1000) / 1000); A.act(s => { if (s.drawer !== A.me || s.phase !== 'draw' || s.strokes.length >= 120) return; s.strokes.push(st); return s; }); };
        A.mem.redraw = () => { cx.fillStyle = '#1b1220'; cx.fillRect(0, 0, 640, 480); cx.lineCap = cx.lineJoin = 'round'; for (const st of [...(A.mem.strokes || []), ...(A.mem.cur ? [A.mem.cur] : [])]) { cx.strokeStyle = st.c; cx.lineWidth = st.w * 1.4; cx.beginPath(); for (let i = 0; i < st.p.length; i += 2) { const x = st.p[i] * 640, y = st.p[i + 1] * 480; i ? cx.lineTo(x, y) : cx.moveTo(x, y); } cx.stroke(); } };
        A.root.querySelectorAll('#tl [data-c]').forEach(b => b.onclick = () => { A.mem.col = b.dataset.c; A.root.querySelectorAll('#tl [data-c]').forEach(x => x.classList.toggle('sel', x === b)); });
        A.root.querySelector('#un').onclick = () => A.act(s => { if (s.drawer !== A.me || s.phase !== 'draw') return; s.strokes.pop(); return s; });
        A.root.querySelector('#cl').onclick = () => A.act(s => { if (s.drawer !== A.me || s.phase !== 'draw') return; s.strokes = []; return s; });
        A.root.querySelector('#gf').onsubmit = e => { e.preventDefault(); const inp = A.root.querySelector('#gi'), t = inp.value.trim(); inp.value = ''; if (!t) return; A.act(s => { if (s.drawer === A.me || s.phase !== 'draw') return; s.guesses.push({ by: A.me, t: t.slice(0, 30) }); if (t.toLowerCase() === s.word.toLowerCase()) { s.phase = 'done'; s.result = 'guessed'; s['s' + A.me]++; } return s; }); };
        A.root.querySelector('#ar').onclick = e => { const id = e.target.id; if (id === 'gu') A.act(s => { if (s.drawer !== A.me || s.phase !== 'draw') return; s.phase = 'done'; s.result = 'gaveup'; return s; }); if (id === 'nx') A.act(s => { if (s.phase !== 'done') return; if (s.round >= s.total) { s.winner = s.sa > s.sb ? 'a' : s.sb > s.sa ? 'b' : 'draw'; return s; } s.round++; s.drawer = other(s.drawer); s.word = pick(WORDS.filter(w => w !== s.word)); s.strokes = []; s.guesses = []; s.phase = 'draw'; s.result = ''; s.turn = other(s.drawer); return s; }); };
      }
      A.mem.canDraw = dr && s.phase === 'draw' && !s.winner; A.mem.strokes = s.strokes; A.mem.redraw();
      const q = x => A.root.querySelector(x), open = s.phase === 'draw';
      q('.score').innerHTML = `<b>${esc(A.names.a)}</b> <span>${s.sa} : ${s.sb}</span> <b>${esc(A.names.b)}</b> · round ${s.round}/${s.total}`;
      q('#wd').textContent = dr || s.phase === 'done' ? `Word: ${s.word}` : s.word.replace(/[a-z]/gi, '_ ').trim();
      q('#tl').style.display = A.mem.canDraw ? '' : 'none'; q('#gf').style.display = !dr && open && !s.winner ? '' : 'none';
      q('#gl').innerHTML = s.guesses.slice(-5).map(g => `<span class="${g.by === me ? 'm' : ''}">${esc(g.t)}</span>`).join('');
      q('#ar').innerHTML = s.winner ? '' : s.phase === 'done' ? `<p class="wait">${s.result === 'guessed' ? '🎉 Guessed it!' : '🏳️ Gave up'} The word was <b>${esc(s.word)}</b></p><button class="pri" id="nx">${s.round >= s.total ? 'Finish' : 'Next round ▶'}</button>` : dr ? '<button id="gu">Give up</button>' : '';
      return s.winner ? '' : dr ? (open ? 'Your turn to draw!' : 'Round over') : (open ? `${A.names[s.drawer]} is drawing — guess!` : 'Round over'); } }
};

// ================= batch 2 =================
const RD = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const rflips = (c, i, me) => { if (c[i]) return []; const o = other(me), r0 = i >> 3, c0 = i & 7, out = []; for (const [dr, dc] of RD) { let r = r0 + dr, cc = c0 + dc; const line = []; while (r >= 0 && r < 8 && cc >= 0 && cc < 8 && c[r * 8 + cc] === o) { line.push(r * 8 + cc); r += dr; cc += dc; } if (line.length && r >= 0 && r < 8 && cc >= 0 && cc < 8 && c[r * 8 + cc] === me) out.push(...line); } return out; };
const rmoves = (c, me) => { const m = []; for (let i = 0; i < 64; i++) if (rflips(c, i, me).length) m.push(i); return m; };
const isMine = (v, me) => v && v.toLowerCase() === me;
function chkMoves(s, me) {
  const c = s.cells, fwd = me === 'a' ? -1 : 1, out = [], caps = [], from = s.chain >= 0 ? [s.chain] : [...c.keys()].filter(i => isMine(c[i], me));
  for (const i of from) { const king = c[i] === c[i].toUpperCase(), r = i >> 3, cc = i & 7;
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) { if (!king && dr !== fwd) continue; const r1 = r + dr, c1 = cc + dc; if (r1 < 0 || r1 > 7 || c1 < 0 || c1 > 7) continue; const j = r1 * 8 + c1;
      if (!c[j]) out.push({ f: i, t: j, c: -1 }); else if (!isMine(c[j], me)) { const r2 = r1 + dr, c2 = c1 + dc; if (r2 >= 0 && r2 < 8 && c2 >= 0 && c2 < 8 && !c[r2 * 8 + c2]) caps.push({ f: i, t: r2 * 8 + c2, c: j }); } } }
  return caps.length ? caps : (s.chain >= 0 ? [] : out);
}
const SIZES = [5, 4, 3, 3, 2];
const placeFleet = () => { const g = Array(64).fill(0); SIZES.forEach((n, id) => { for (;;) { const h = Math.random() < .5, r = rnd(h ? 8 : 9 - n), c = rnd(h ? 9 - n : 8), cells = [...Array(n).keys()].map(k => h ? r * 8 + c + k : (r + k) * 8 + c); if (cells.every(i => !g[i])) { cells.forEach(i => g[i] = id + 1); break; } } }); return g; };
const WL = 'crane slate adieu house plant brain flame grape smile table chair light water river stone cloud dream heart music night ocean pearl queen robot sugar tiger uncle voice whale young zebra beach candy dance eagle fairy ghost honey jelly koala lemon mango olive peach quilt rainy sunny tulip unity vivid wheat yacht amber bloom charm drift ember frost glory haven ivory jolly'.split(' ').filter(w => w.length === 5);
const wscore = (g, w) => { const r = Array(5).fill('x'), u = w.split(''); for (let i = 0; i < 5; i++) if (g[i] === w[i]) { r[i] = 'g'; u[i] = null; } for (let i = 0; i < 5; i++) if (r[i] === 'x') { const k = u.indexOf(g[i]); if (k >= 0) { r[i] = 'y'; u[k] = null; } } return r.join(''); };
const hgFig = ['<circle cx="70" cy="38" r="9"/>', '<line x1="70" y1="47" x2="70" y2="80"/>', '<line x1="70" y1="55" x2="55" y2="70"/>', '<line x1="70" y1="55" x2="85" y2="70"/>', '<line x1="70" y1="80" x2="57" y2="100"/>', '<line x1="70" y1="80" x2="83" y2="100"/>', '<line x1="62" y1="34" x2="66" y2="38"/><line x1="66" y1="34" x2="62" y2="38"/><line x1="74" y1="34" x2="78" y2="38"/><line x1="78" y1="34" x2="74" y2="38"/>'];
const scoreRow = (s, A, extra = '') => `<div class="score"><b>${esc(A.names.a)}</b> <span>${s.sa} : ${s.sb}</span> <b>${esc(A.names.b)}</b>${extra}</div>`;
Object.assign(GAMES, {
  dab: { title: 'Dots & Boxes', emoji: '🔷', desc: 'Close boxes to score.',
    init: f => ({ h: Array(30).fill(''), v: Array(30).fill(''), box: Array(25).fill(''), turn: f, sa: 0, sb: 0, winner: null, last: '' }),
    view(s, A) {
      const P = i => 5 + i * 18; let g = '';
      s.box.forEach((o, i) => { if (o) g += `<rect class="bx ${o}" x="${P(i % 5) + 1.5}" y="${P((i / 5) | 0) + 1.5}" width="15" height="15" rx="3"/>`; });
      for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) { const k = r * 5 + c; g += `<line class="ed ${s.h[k]} ${s.last === 'h' + k ? 'new' : ''}" x1="${P(c) + 1.5}" y1="${P(r)}" x2="${P(c + 1) - 1.5}" y2="${P(r)}"/>` + (s.h[k] ? '' : `<line class="hit" data-e="h${k}" x1="${P(c) + 2}" y1="${P(r)}" x2="${P(c + 1) - 2}" y2="${P(r)}"/>`); }
      for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) { const k = r * 6 + c; g += `<line class="ed ${s.v[k]} ${s.last === 'v' + k ? 'new' : ''}" x1="${P(c)}" y1="${P(r) + 1.5}" x2="${P(c)}" y2="${P(r + 1) - 1.5}"/>` + (s.v[k] ? '' : `<line class="hit" data-e="v${k}" x1="${P(c)}" y1="${P(r) + 2}" x2="${P(c)}" y2="${P(r + 1) - 2}"/>`); }
      for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) g += `<circle cx="${P(c)}" cy="${P(r)}" r="1.7" fill="#F8EAF0"/>`;
      A.root.innerHTML = scoreRow(s, A) + `<svg class="dab" viewBox="0 0 100 100">${g}</svg>`;
      A.root.onclick = e => { const b = e.target.closest('[data-e]'); if (!b) return; const t = b.dataset.e[0], i = +b.dataset.e.slice(1);
        A.act(s => { if (s.winner || s.turn !== A.me || s[t][i]) return; s[t][i] = A.me; s.last = b.dataset.e; const rr = t === 'h' ? (i / 5) | 0 : (i / 6) | 0, cc = t === 'h' ? i % 5 : i % 6, bs = t === 'h' ? [[rr - 1, cc], [rr, cc]] : [[rr, cc - 1], [rr, cc]]; let n = 0;
          for (const [r, c] of bs) { if (r < 0 || r > 4 || c < 0 || c > 4 || s.box[r * 5 + c]) continue; if (s.h[r * 5 + c] && s.h[(r + 1) * 5 + c] && s.v[r * 6 + c] && s.v[r * 6 + c + 1]) { s.box[r * 5 + c] = A.me; s['s' + A.me]++; n++; } }
          if (s.box.every(Boolean)) s.winner = s.sa > s.sb ? 'a' : s.sb > s.sa ? 'b' : 'draw'; else if (!n) s.turn = other(A.me); return s; }); };
      return turnTxt(s, A); } },
  man: { title: 'Mancala', emoji: '🥜', desc: 'Sow seeds, capture, win.',
    init: f => ({ p: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], turn: f, winner: null, last: -1 }),
    view(s, A) {
      const me = A.me, mine = me === 'a' ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12], opp = me === 'a' ? [12, 11, 10, 9, 8, 7] : [5, 4, 3, 2, 1, 0], ms = me === 'a' ? 6 : 13, os = me === 'a' ? 13 : 6;
      const pit = (k, own) => `<button class="pit ${own ? 'own' : ''} ${k === s.last ? 'new' : ''}" data-p="${k}" ${own && s.turn === me && !s.winner && s.p[k] ? '' : 'disabled'} aria-label="pit with ${s.p[k]} seeds">${s.p[k]}</button>`;
      A.root.innerHTML = `<div class="man"><div class="store"><small>${esc(A.names[other(me)])}</small>${s.p[os]}</div><div class="pits">${opp.map(k => pit(k, 0)).join('')}${mine.map(k => pit(k, 1)).join('')}</div><div class="store me"><small>You</small>${s.p[ms]}</div></div>`;
      A.root.onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; const k = +b.dataset.p;
        A.act(s => { if (s.winner || s.turn !== me || !mine.includes(k) || !s.p[k]) return; const p = s.p; let n = p[k], j = k; p[k] = 0; while (n > 0) { j = (j + 1) % 14; if (j === os) continue; p[j]++; n--; } s.last = j; const lo = me === 'a' ? 0 : 7;
          if (j >= lo && j < lo + 6 && p[j] === 1 && p[12 - j] > 0) { p[ms] += p[12 - j] + 1; p[j] = 0; p[12 - j] = 0; }
          if (j !== ms) s.turn = other(me);
          if (p.slice(0, 6).every(x => !x) || p.slice(7, 13).every(x => !x)) { for (let q = 0; q < 6; q++) { p[6] += p[q]; p[q] = 0; p[13] += p[7 + q]; p[7 + q] = 0; } s.winner = p[6] > p[13] ? 'a' : p[13] > p[6] ? 'b' : 'draw'; } return s; }); };
      return turnTxt(s, A); } },
  rev: { title: 'Reversi', emoji: '⚫', desc: 'Flank and flip discs.',
    init: f => { const c = Array(64).fill(''); c[28] = c[35] = 'a'; c[27] = c[36] = 'b'; return { cells: c, turn: f, winner: null, last: -1, fl: [], ev: '' }; },
    view(s, A) {
      const mv = s.turn === A.me && !s.winner ? rmoves(s.cells, A.me) : [], na = s.cells.filter(x => x === 'a').length, nb = s.cells.filter(x => x === 'b').length;
      A.root.innerHTML = `<div class="score"><b>${esc(A.names.a)}</b> <span>${na} : ${nb}</span> <b>${esc(A.names.b)}</b></div><div class="rv">${s.cells.map((c, i) => `<button class="rc ${mv.includes(i) ? 'mv' : ''}" data-i="${i}" aria-label="square ${i + 1}">${c ? `<span class="rd ${c} ${s.fl.includes(i) ? 'fl' : ''} ${i === s.last ? 'new' : ''}"></span>` : ''}</button>`).join('')}</div>`;
      A.root.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i;
        A.act(s => { if (s.winner || s.turn !== A.me) return; const f = rflips(s.cells, i, A.me); if (!f.length) return; s.cells[i] = A.me; f.forEach(k => s.cells[k] = A.me); s.fl = f; s.last = i; s.ev = ''; const o = other(A.me);
          if (rmoves(s.cells, o).length) s.turn = o; else if (rmoves(s.cells, A.me).length) s.ev = `${A.names[o]} has no move — ${A.names[A.me]} plays again`; else { const a = s.cells.filter(x => x === 'a').length, b2 = s.cells.filter(x => x === 'b').length; s.winner = a > b2 ? 'a' : b2 > a ? 'b' : 'draw'; } return s; }); };
      return s.ev || turnTxt(s, A); } },
  chk: { title: 'Checkers', emoji: '♟️', desc: 'Jump pieces, crown kings.',
    init: f => { const c = Array(64).fill(''); for (let i = 0; i < 64; i++) { const r = i >> 3, k = i & 7; if ((r + k) % 2) { if (r < 3) c[i] = 'b'; else if (r > 4) c[i] = 'a'; } } return { cells: c, turn: f, winner: null, chain: -1, last: -1 }; },
    view(s, A) {
      const me = A.me; A.mem.s = s; if (A.mem.n !== s.n) { A.mem.n = s.n; A.mem.sel = -1; }
      A.mem.draw = () => { const s = A.mem.s, mv = s.turn === me && !s.winner ? chkMoves(s, me) : [], sel = A.mem.sel, froms = new Set(mv.map(m => m.f)), tos = mv.filter(m => m.f === sel).map(m => m.t), order = [...Array(64).keys()]; if (me === 'b') order.reverse();
        A.root.innerHTML = `<div class="ck">${order.map(i => { const v = s.cells[i], dark = ((i >> 3) + (i & 7)) % 2, king = v && v === v.toUpperCase(); return `<button class="kc ${dark ? 'd' : 'l'} ${tos.includes(i) ? 'to' : ''} ${i === sel ? 'sel' : ''} ${froms.has(i) && sel < 0 ? 'can' : ''}" data-i="${i}" aria-label="square ${i + 1}">${v ? `<span class="pc2 ${v.toLowerCase()} ${king ? 'k' : ''} ${i === s.last ? 'new' : ''}">${king ? '♛' : ''}</span>` : ''}</button>`; }).join('')}</div>`; };
      A.mem.draw();
      A.root.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i, s = A.mem.s; if (s.turn !== me || s.winner) return; const mv = chkMoves(s, me);
        if (mv.some(m => m.f === i)) { A.mem.sel = i; A.mem.draw(); return; }
        const m = mv.find(x => x.f === A.mem.sel && x.t === i); if (!m) return; A.mem.sel = -1;
        A.act(s => { if (s.winner || s.turn !== me) return; const mm = chkMoves(s, me).find(x => x.f === m.f && x.t === m.t); if (!mm) return; const c = s.cells; let v = c[mm.f]; c[mm.f] = ''; if (mm.c >= 0) c[mm.c] = ''; let crowned = false; const row = mm.t >> 3;
          if (v === me && (me === 'a' ? row === 0 : row === 7)) { v = v.toUpperCase(); crowned = true; } c[mm.t] = v; s.last = mm.t; s.chain = -1;
          if (mm.c >= 0 && !crowned) { s.chain = mm.t; if (!chkMoves(s, me).length) s.chain = -1; }
          if (s.chain < 0) { s.turn = other(me); if (!chkMoves(s, other(me)).length) s.winner = me; } return s; }); };
      return turnTxt(s, A) + (s.chain >= 0 ? ' — keep jumping!' : ''); } },
  bat: { title: 'Battleship', emoji: '🚢', desc: 'Hide your fleet, sink theirs.',
    init: f => ({ fa: placeFleet(), fb: placeFleet(), ra: false, rb: false, ha: Array(64).fill(''), hb: Array(64).fill(''), turn: f, phase: 'place', ev: '', winner: null }),
    view(s, A) {
      const me = A.me, o = other(me), mf = s['f' + me], inc = s['h' + o], shots = s['h' + me];
      const myB = `<div class="bt ${s.phase === 'war' ? 'sm' : ''}">${mf.map((v, i) => `<span class="bc ${v ? 'sh' : ''} ${inc[i] === 'h' ? 'hit' : inc[i] === 'm' ? 'miss' : ''}"></span>`).join('')}</div>`; let h;
      if (s.phase === 'place') h = `<p class="wait">Your fleet</p>${myB}` + (s['r' + me] ? `<p class="wait">Ready! Waiting for ${esc(A.names[o])}…</p>` : `<div class="row"><button id="rs">🔀 Reshuffle</button><button class="pri" id="rdy">✅ Ready</button></div>`);
      else h = `<p class="wait">Enemy waters${s.turn === me && !s.winner ? ' — tap to fire' : ''}</p><div class="bt">${shots.map((v, i) => `<button class="bc ${v === 'h' ? 'hit' : v === 'm' ? 'miss' : 'fire'}" data-t="${i}" ${v || s.turn !== me || s.winner ? 'disabled' : ''} aria-label="fire at ${i + 1}"></button>`).join('')}</div><p class="wait">Your fleet</p>${myB}`;
      A.root.innerHTML = h; const q = x => A.root.querySelector(x);
      if (q('#rs')) { q('#rs').onclick = () => A.act(s => { if (s.phase !== 'place' || s['r' + me]) return; s['f' + me] = placeFleet(); return s; }); q('#rdy').onclick = () => A.act(s => { if (s.phase !== 'place') return; s['r' + me] = true; if (s.ra && s.rb) s.phase = 'war'; return s; }); }
      A.root.onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; const i = +b.dataset.t;
        A.act(s => { if (s.phase !== 'war' || s.turn !== me || s.winner) return; const t = s['h' + me], ef = s['f' + o]; if (t[i]) return; t[i] = ef[i] ? 'h' : 'm'; let ev = t[i] === 'h' ? '💥 Hit!' : '💦 Miss'; if (ef[i] && ef.every((v, k) => v !== ef[i] || t[k] === 'h')) ev = `🔥 ${A.names[me]} sunk a ship!`; s.ev = ev; if (ef.every((v, k) => !v || t[k] === 'h')) s.winner = me; else s.turn = o; return s; }); };
      return s.winner ? '' : s.phase === 'place' ? 'Arrange your fleet, then tap Ready' : s.ev || turnTxt(s, A); } },
  wd: { title: 'Wordle Duel', emoji: '🔤', desc: 'Race to guess the word.',
    init: () => ({ word: pick(WL), ga: [], gb: [], winner: null, turn: '' }),
    view(s, A) {
      const me = A.me, o = other(me); A.mem.s = s;
      A.mem.draw = () => { const s = A.mem.s, cur = A.mem.cur || '', gs = s['g' + me], og = s['g' + o], done = !!s.winner || gs.length >= 6, rows = [];
        for (let r = 0; r < 6; r++) { const g = gs[r], sc = g ? wscore(g, s.word) : ''; rows.push(`<div class="wr">${[0, 1, 2, 3, 4].map(k => `<i class="${sc ? sc[k] : ''} ${!g && r === gs.length && cur[k] ? 't' : ''}">${g ? g[k] : r === gs.length ? cur[k] || '' : ''}</i>`).join('')}</div>`); }
        const best = {}; gs.forEach(g => { const sc = wscore(g, s.word), pr = { x: 1, y: 2, g: 3 }; [...g].forEach((ch, k) => { if (!best[ch] || pr[sc[k]] > pr[best[ch]]) best[ch] = sc[k]; }); });
        const kb = ['qwertyuiop', 'asdfghjkl', '⏎zxcvbnm⌫'].map(r => `<div class="kr">${[...r].map(ch => `<button class="wk ${best[ch] || ''}" data-k="${ch}">${ch === '⏎' ? 'Enter' : ch}</button>`).join('')}</div>`).join('');
        const opp = og.map(g => `<div class="wr sm">${[...wscore(g, s.word)].map(c => `<i class="${c}"></i>`).join('')}</div>`).join('') || '<div class="wr sm"><i></i><i></i><i></i><i></i><i></i></div>';
        A.root.innerHTML = `<div class="wrap2"><div>${rows.join('')}</div><div class="oppb"><small>${esc(A.names[o])}</small>${opp}</div></div>${done ? '' : kb}`; };
      A.mem.draw();
      if (!A.mem.kb) { A.mem.kb = 1;
        const press = k => { const s = A.mem.s; if (!s || s.winner || s['g' + me].length >= 6) return; let cur = A.mem.cur || '';
          if (k === '⌫') cur = cur.slice(0, -1); else if (k === '⏎') { if (cur.length === 5) { const w = cur; A.mem.cur = ''; A.act(t => { if (t.winner || t['g' + me].length >= 6) return; t['g' + me].push(w); if (w === t.word) t.winner = me; else if (t.ga.length >= 6 && t.gb.length >= 6) t.winner = 'draw'; return t; }); return; } A.toast('Need 5 letters'); return; } else if (/^[a-z]$/.test(k) && cur.length < 5) cur += k;
          A.mem.cur = cur; A.mem.draw(); };
        A.root.addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k); });
        document.addEventListener('keydown', e => { if (e.ctrlKey || e.metaKey || (e.target.closest && e.target.closest('input,textarea'))) return; const k = e.key === 'Enter' ? '⏎' : e.key === 'Backspace' ? '⌫' : e.key.toLowerCase(); if (k.length === 1) press(k); }); }
      return s.winner ? `The word was ${s.word.toUpperCase()}` : 'First to find the word wins'; } },
  hg: { title: 'Hangman', emoji: '🪢', desc: 'Set a word, guess theirs.',
    init: f => ({ setter: f, word: '', phase: 'set', guessed: [], wrong: 0, round: 1, total: 2, sa: 0, sb: 0, result: '', turn: f, winner: null }),
    view(s, A) {
      const me = A.me, gz = other(s.setter), w = s.word, pat = [...w].map(ch => ch === ' ' ? ' ' : (s.guessed.includes(ch) || s.phase === 'done') ? ch : '_').join(' ');
      let h = scoreRow(s, A, ` · round ${s.round}/${s.total}`);
      if (s.phase === 'set') h += me === s.setter ? `<form class="hf" id="hf"><input id="hw" maxlength="20" placeholder="Secret word or name" autocomplete="off"><button class="pri">Set</button></form>` : `<p class="wait">${esc(A.names[s.setter])} is choosing a word…</p>`;
      else { h += `<svg class="hg" viewBox="0 0 120 110"><g stroke="#E879A5" stroke-width="2.4" fill="none" stroke-linecap="round"><line x1="20" y1="105" x2="100" y2="105"/><line x1="35" y1="105" x2="35" y2="10"/><line x1="35" y1="10" x2="70" y2="10"/><line x1="70" y1="10" x2="70" y2="29"/>${hgFig.slice(0, Math.min(s.wrong, 7)).join('')}</g></svg><div class="word">${esc(pat)}</div>`;
        if (s.phase === 'guess' && me === gz) h += `<div class="kb">${'abcdefghijklmnopqrstuvwxyz'.split('').map(ch => `<button class="lk ${s.guessed.includes(ch) ? (w.includes(ch) ? 'ok' : 'bad') : ''}" data-l="${ch}" ${s.guessed.includes(ch) ? 'disabled' : ''}>${ch}</button>`).join('')}</div>`;
        else if (s.phase === 'guess') h += `<p class="wait">They are guessing <b>${esc(w)}</b> — ${7 - s.wrong} misses left</p>`;
        else h += `<p class="wait">${s.result === 'solved' ? '🎉 Solved!' : '💀 Not this time'} The word was <b>${esc(w)}</b></p><button class="pri" id="nx">${s.round >= s.total ? 'Finish' : 'Next round ▶'}</button>`; }
      A.root.innerHTML = h; const q = x => A.root.querySelector(x);
      if (q('#hf')) q('#hf').onsubmit = e => { e.preventDefault(); const t = q('#hw').value.toLowerCase().replace(/[^a-z ]/g, '').trim(); if (t.replace(/ /g, '').length < 2) return A.toast('Use at least 2 letters'); A.act(s => { if (s.phase !== 'set' || A.me !== s.setter) return; s.word = t; s.phase = 'guess'; s.turn = other(s.setter); return s; }); };
      A.root.onclick = e => { const b = e.target.closest('[data-l]'), n = e.target.closest('#nx');
        if (b) { const l = b.dataset.l; A.act(s => { if (s.phase !== 'guess' || A.me !== other(s.setter) || s.guessed.includes(l)) return; s.guessed.push(l); if (!s.word.includes(l)) s.wrong++; if ([...s.word].every(ch => ch === ' ' || s.guessed.includes(ch))) { s.phase = 'done'; s.result = 'solved'; s['s' + other(s.setter)]++; } else if (s.wrong >= 7) { s.phase = 'done'; s.result = 'lost'; } return s; }); }
        if (n) A.act(s => { if (s.phase !== 'done') return; if (s.round >= s.total) { s.winner = s.sa > s.sb ? 'a' : s.sb > s.sa ? 'b' : 'draw'; return s; } s.round++; s.setter = other(s.setter); s.word = ''; s.phase = 'set'; s.guessed = []; s.wrong = 0; s.result = ''; s.turn = s.setter; return s; }); };
      return s.winner ? '' : s.phase === 'set' ? (me === s.setter ? 'Pick a word for them' : 'Waiting for a word') : s.phase === 'guess' ? (me === gz ? 'Guess a letter' : 'They are guessing') : 'Round over'; } },
  tq: { title: '20 Questions', emoji: '❓', desc: 'Think of something, they guess.',
    init: f => ({ thinker: f, secret: '', phase: 'set', qs: [], pending: '', isGuess: false, winner: null, turn: f }),
    view(s, A) {
      const me = A.me, th = s.thinker, gz = other(th), n = s.qs.length;
      let h = `<div class="score">Question <span>${Math.min(n + (s.phase === 'ans' ? 1 : 0), 20)}</span> of 20</div><div class="qa">${s.qs.slice(-6).map(x => `<div><b>${esc(x.q)}</b> <i class="${x.a}">${x.a}</i></div>`).join('')}</div>`;
      if (s.phase === 'set') h += me === th ? `<form class="hf" id="sf"><input id="si" maxlength="40" placeholder="Think of something (only you see it)" autocomplete="off"><button class="pri">Set</button></form>` : `<p class="wait">${esc(A.names[th])} is thinking of something…</p>`;
      else if (s.phase === 'ask') h += me === gz ? `<form class="hf" id="qf"><input id="qi" maxlength="80" placeholder="Ask a yes/no question…" autocomplete="off"><button class="pri">Ask</button><button type="button" id="fg">Guess!</button></form>` : `<p class="wait">Your secret: <b>${esc(s.secret)}</b>. Waiting for a question…</p>`;
      else if (s.phase === 'ans') h += me === th ? `<p class="gs">${s.isGuess ? 'Final guess: ' : ''}“${esc(s.pending)}”</p><div class="row">${s.isGuess ? '<button class="pri" id="ok">✅ Correct!</button><button id="no">❌ No</button>' : '<button class="pri" data-a="Yes">Yes</button><button data-a="No">No</button><button data-a="Maybe">Sometimes</button>'}</div>` : '<p class="wait">Waiting for the answer…</p>';
      else h += `<p class="wait">It was <b>${esc(s.secret)}</b></p>`;
      A.root.innerHTML = h; const q = x => A.root.querySelector(x);
      const push = (a) => A.act(s => { if (s.phase !== 'ans' || A.me !== s.thinker) return; s.qs.push({ q: (s.isGuess ? 'Guess: ' : '') + s.pending, a }); if (s.qs.length >= 20) { s.phase = 'done'; s.winner = s.thinker; } else { s.phase = 'ask'; s.turn = other(s.thinker); } return s; });
      if (q('#sf')) q('#sf').onsubmit = e => { e.preventDefault(); const t = q('#si').value.trim(); if (!t) return; A.act(s => { if (s.phase !== 'set' || A.me !== s.thinker) return; s.secret = t; s.phase = 'ask'; s.turn = other(s.thinker); return s; }); };
      const ask = g => { const t = q('#qi').value.trim(); if (!t) return A.toast('Type something first'); A.act(s => { if (s.phase !== 'ask' || A.me !== other(s.thinker)) return; s.pending = t; s.isGuess = g; s.phase = 'ans'; s.turn = s.thinker; return s; }); };
      if (q('#qf')) { q('#qf').onsubmit = e => { e.preventDefault(); ask(false); }; q('#fg').onclick = () => ask(true); }
      A.root.onclick = e => { const b = e.target.closest('[data-a]'); if (b) push(b.dataset.a); if (e.target.closest('#no')) push('No');
        if (e.target.closest('#ok')) A.act(s => { if (s.phase !== 'ans' || A.me !== s.thinker) return; s.qs.push({ q: 'Guess: ' + s.pending, a: 'Yes' }); s.phase = 'done'; s.winner = other(s.thinker); return s; }); };
      return s.winner ? '' : s.phase === 'set' ? (me === th ? 'Think of something' : 'Waiting for them to think') : s.phase === 'ask' ? (me === gz ? 'Ask a question or make a guess' : 'Waiting for a question') : s.phase === 'ans' ? (me === th ? 'Answer honestly' : 'Waiting for the answer') : ''; } }
});

// ================= batch 3 =================
TOD.hot = {
  truth: ['What is the boldest thing you have imagined us doing?', 'Which part of me do you find hardest to resist?', 'What is your favorite way to be touched?', 'Where is the most daring place you would want to kiss me?', 'What outfit would you love to see me in tonight?', 'What is your steamiest thought about me this week?', 'What do you wish I did more often when we are alone?', 'What compliment from me makes you weak?', 'If I whispered one thing in your ear right now, what would you want it to be?', 'What is the sexiest memory we share?', 'What kind of kiss drives you wild?', 'What would you do if we had the house to ourselves all weekend?', 'What is something new you would love to try together?', 'What do you notice first when I walk into a room?', 'Which of my habits is secretly irresistible to you?', 'What would your perfect night alone with me look like, minute by minute?'],
  dare: ['Give me your most seductive look for 15 seconds without laughing.', 'Whisper what you want to do to me after this game.', 'Kiss me somewhere that is not my lips.', 'Send me a voice note describing our best night in 20 seconds.', 'Give me a slow 30-second neck massage.', 'Take a flirty photo for me with a caption that makes me blush.', 'Dance slowly for me for 30 seconds.', 'Say my name the way you do when you want me.', 'Tell me three things you love about my body, slowly.', 'Kiss me like it is our first kiss.', 'Describe your perfect night with me in three sentences.', 'Pick a song and slow dance with me.', 'Trace a heart on my skin and tell me what you feel.', 'Tell me a secret fantasy in one sentence.', 'Close your eyes while I whisper something to you.', 'Hold my gaze and tell me exactly what you are thinking.'] };
const WYR = { normal: [['Always be 10 minutes late', 'Always be 20 minutes early'], ['Live by the beach', 'Live in the mountains'], ['Never use social media again', 'Never watch movies again'], ['Have a personal chef', 'Have a personal driver'], ['Travel to the past', 'Travel to the future'], ['Be able to fly', 'Be invisible'], ['Eat pizza forever', 'Eat sushi forever'], ['Breakfast in bed every day', 'Dinner by the sea every night'], ['Be a famous singer', 'Be a famous actor'], ['Unlimited travel', 'Unlimited money'], ['Have a pet dragon', 'Have a pet unicorn'], ['Only text', 'Only call']],
  spicy: [['Kiss in the rain', 'Kiss under the stars'], ['Receive a love letter', 'Receive a surprise kiss'], ['Slow dance in the kitchen', 'Dance close at a party'], ['Give a massage', 'Get a massage'], ['Surprise date at home', 'Surprise trip anywhere'], ['Whisper sweet things all night', 'Send flirty texts all day'], ['Cuddle all day in bed', 'Cook together and kiss between bites'], ['Be teased playfully for an hour', 'Tease your partner for an hour'], ['Wake up to kisses', 'Fall asleep to whispers'], ['Candlelit bath together', 'Hot tub under the stars'], ['Fancy restaurant date', 'Picnic with just us'], ['A flirty voice note every morning', 'A flirty photo every night'], ['Kiss only on the neck for a day', 'Kiss only on the lips for a day']],
  hot: [['Be blindfolded and kissed', 'Blindfold your partner and tease'], ['Slow, teasing kisses all night', 'Passionate, can’t-stop kisses'], ['Hear what your partner wants', 'Tell your partner what you want'], ['Stay in bed all weekend', 'A spontaneous hotel night'], ['Steamy shower together', 'Candlelit bath with a massage'], ['Your partner picks your outfit tonight', 'You pick your partner’s outfit tonight'], ['Be teased with ice cubes', 'Be teased with warm massage oil'], ['Role-play strangers at a bar', 'Role-play a first date again'], ['Lights low, music loud', 'Candles on, whispers only'], ['Share your wildest fantasy', 'Hear their wildest fantasy'], ['Secret kisses in public', 'Endless kisses in private'], ['Surprise your partner at the door in something special', 'Be surprised at the door'], ['Take the lead tonight', 'Let your partner take the lead tonight'], ['A night of kisses only', 'A night of touches only']] };
const LOVE = [{ a: ['Hug', 'Hold', 'Kiss', 'Stroke', 'Cuddle', 'Whisper to'], t: ['your forehead', 'your hands', 'your cheek', 'your shoulders', 'your hair', 'your nose'] },
  { a: ['Kiss', 'Massage', 'Nibble', 'Trace', 'Whisper to', 'Tease'], t: ['your neck', 'your ear', 'your lips', 'your back', 'your wrist', 'your collarbone'] },
  { a: ['Slowly kiss', 'Caress', 'Tease', 'Whisper wicked words to', 'Nibble', 'Blindfold and kiss'], t: ['your neck', 'your lips', 'your inner wrist', 'your jawline', 'the small of your back', 'your waist'] }];
const LDUR = ['for 10 seconds', 'for 20 seconds', 'for 30 seconds', 'for a full minute', 'slowly', 'until you smile'];
const DATES = [['🏠 Cozy', ['Build a blanket fort and watch a movie', 'Cook a new recipe together', 'Bake cookies at midnight', 'Play board games with snacks', 'Candlelit dinner at home', 'Take turns reading to each other']], ['🌳 Outdoors', ['Sunset walk with ice cream', 'Picnic in the park', 'Stargazing on a blanket', 'A spontaneous drive with a playlist', 'Visit a night market', 'Rent bikes and explore']], ['🍷 Romantic', ['Slow dance in the living room', 'Write love letters and swap them', 'Recreate your first date', 'Fancy dinner at home — dress up', 'Watch the sunrise together', 'Plan a surprise for each other']], ['🔥 Steamy', ['Couples massage night with oils', 'Candlelit bath for two', 'Truth or Dare, extra spicy', 'Dress up and pretend you just met', 'A hotel night for no reason', 'Slow kisses and a playlist, no phones']]];
const MC = ['#ff6b81', '#ffd54f', '#5be08a', '#5bb8ff', '#b388ff', '#ff9e57'];
const mmFb = (code, g) => { let b = 0; const cc = Array(6).fill(0), gc = Array(6).fill(0); code.forEach((c, i) => { if (c === g[i]) b++; else { cc[c]++; gc[g[i]]++; } }); return { b, w: cc.reduce((a, x, i) => a + Math.min(x, gc[i]), 0) }; };
const lineN = (c, i, me, W, H, K) => { const r0 = Math.floor(i / W), c0 = i % W; for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) { const line = [i]; for (const sg of [1, -1]) { let r = r0 + dr * sg, cc = c0 + dc * sg; while (r >= 0 && r < H && cc >= 0 && cc < W && c[r * W + cc] === me) { line.push(r * W + cc); r += dr * sg; cc += dc * sg; } } if (line.length >= K) return line; } return null; };
Object.assign(GAMES, {
  gmk: { title: 'Gomoku', emoji: '⚪', desc: 'Five in a row wins.',
    init: f => ({ cells: Array(169).fill(''), turn: f, winner: null, last: -1, line: [] }),
    view(s, A) {
      A.root.innerHTML = `<div class="gm">${s.cells.map((c, i) => `<button class="gc" data-i="${i}" aria-label="point ${i + 1}">${c ? `<span class="gs2 ${c} ${i === s.last ? 'new' : ''} ${s.line.includes(i) ? 'win' : ''}"></span>` : ''}</button>`).join('')}</div>`;
      A.root.onclick = e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i;
        A.act(s => { if (s.winner || s.turn !== A.me || s.cells[i]) return; s.cells[i] = A.me; s.last = i; const L = lineN(s.cells, i, A.me, 13, 13, 5); if (L) { s.winner = A.me; s.line = L; } else if (s.cells.every(Boolean)) s.winner = 'draw'; else s.turn = other(A.me); return s; }); };
      return turnTxt(s, A); } },
  wyr: { title: 'Would You Rather', emoji: '🤔', desc: 'Pick secretly, see if you match.',
    init: f => ({ level: 0, pair: pick(WYR.normal), pa: '', pb: '', round: 1, total: 10, matches: 0, last: null, winner: null, end: '', turn: f }),
    view(s, A) {
      const mine = s['p' + A.me], L = s.last, old = L && A.mem.rn === L.n; if (L) A.mem.rn = L.n;
      A.root.innerHTML = seg(s.level, false) + `<div class="score">Round <span>${s.round}/${s.total}</span> · matches <span>${s.matches}</span></div>` +
        (L ? `<div class="rv2 ${old ? 'old' : ''} ${L.m ? 'm' : ''}"><b>${esc(A.names.a)}: ${L.a}</b> · <b>${esc(A.names.b)}: ${L.b}</b> — ${L.m ? 'Match 💞' : 'Different!'}</div>` : '') +
        (s.winner ? '' : `<div class="wy">${[0, 1].map(k => `<button class="wc ${mine === 'AB'[k] ? 'sel' : ''}" data-w="${'AB'[k]}" ${mine ? 'disabled' : ''}><small>${'AB'[k]}</small>${esc(s.pair[k])}</button>`).join('')}</div>` + (mine ? `<p class="wait">Waiting for ${esc(A.names[other(A.me)])}…</p>` : ''));
      segBind(A, s => !s.pa && !s.pb);
      A.root.querySelectorAll('.wc').forEach(b => b.onclick = () => { const x = b.dataset.w; A.act(s => { if (s.winner || s['p' + A.me]) return; s['p' + A.me] = x; if (s.pa && s.pb) { const m = s.pa === s.pb; s.last = { a: s.pa, b: s.pb, m, n: s.round }; if (m) s.matches++; s.pa = s.pb = ''; if (s.round >= s.total) { s.winner = 'draw'; s.end = `You matched on ${s.matches} of ${s.total} 💞`; } else { s.round++; s.pair = pick(WYR[['normal', 'spicy', 'hot'][s.level]]); } } return s; }); });
      return s.winner ? '' : (s.level === 2 ? '🔥 Extra spicy is ON' : 'Pick the one you would rather'); } },
  love: { title: 'Love Dice', emoji: '🎲', desc: 'Roll an action, do it for them.',
    init: f => ({ level: 0, roll: null, turn: f, count: 0, winner: null }),
    view(s, A) {
      const mine = s.turn === A.me, r = s.roll, L = LOVE[s.level || 0];
      A.root.innerHTML = seg(s.level, !!r) + (r ? `<div class="dice3" key="${s.count}${r.join('')}"><div class="d3">${esc(L.a[r[0]])}</div><div class="d3">${esc(L.t[r[1]])}</div><div class="d3">${esc(LDUR[r[2]])}</div></div><p class="gs">${esc(A.names[s.turn])} → ${esc(A.names[other(s.turn)])}: <b>${esc(L.a[r[0]])} ${esc(L.t[r[1]])} ${esc(LDUR[r[2]])}</b></p>` + (mine ? '<div class="row"><button class="pri" id="dn">✅ Done</button><button id="rr">🎲 Re-roll</button></div>' : '<p class="wait">Enjoy it 😘</p>') : mine ? '<button class="pri big" id="rl">🎲 Roll the dice</button>' : `<p class="wait">${esc(A.names[s.turn])} is rolling…</p>`);
      segBind(A, s => !s.roll);
      const q = x => A.root.querySelector(x), rl = () => A.act(s => { if (s.turn !== A.me) return; s.roll = [rnd(6), rnd(6), rnd(6)]; return s; });
      if (q('#rl')) q('#rl').onclick = rl; if (q('#rr')) q('#rr').onclick = rl;
      if (q('#dn')) q('#dn').onclick = () => A.act(s => { if (s.turn !== A.me || !s.roll) return; s.roll = null; s.turn = other(s.turn); s.count++; return s; });
      return mine ? (r ? 'Do it, then tap Done' : 'Your turn — roll!') : `${A.names[s.turn]}'s turn`; } },
  date: { title: 'Date Roulette', emoji: '🎡', desc: 'Spin for your next date idea.',
    init: f => ({ cat: 0, idea: '', spins: 0, turn: f, winner: null }),
    view(s, A) {
      A.root.innerHTML = `<div class="seg" id="ct">${DATES.map((d, i) => `<button data-c="${i}" class="${s.cat === i ? 'on' : ''}">${d[0]}</button>`).join('')}</div>` + (s.idea ? `<div class="tcard truth" key="${s.spins}"><small>${DATES[s.cat][0]}</small><p>${esc(s.idea)}</p></div>` : '<p class="wait">Pick a mood and spin!</p>') + '<button class="pri big" id="sp">🎡 Spin</button>';
      A.root.querySelector('#ct').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; const c = +b.dataset.c; A.act(s => { s.cat = c; s.idea = ''; return s; }); };
      A.root.querySelector('#sp').onclick = () => A.act(s => { s.idea = pick(DATES[s.cat][1].filter(x => x !== s.idea)); s.spins++; return s; });
      return s.idea ? 'Do it this week? 💕' : 'Choose a mood'; } },
  pig: { title: 'Pig Dice', emoji: '🐷', desc: 'Push your luck to 50.',
    init: f => ({ sa: 0, sb: 0, tt: 0, dice: 0, turn: f, ev: '', winner: null }),
    view(s, A) {
      const mine = s.turn === A.me && !s.winner, anim = A.mem.dn !== s.n; A.mem.dn = s.n;
      A.root.innerHTML = scoreRow(s, A) + `<div class="bigdie ${anim && s.dice ? (s.dice === 1 ? 'bad' : 'go') : ''}">${s.dice || '🎲'}</div><p class="gs">Turn total: <b>${s.tt}</b></p><p class="wait">${esc(s.ev)}</p>` + (mine ? `<div class="row"><button class="pri big" id="r">🎲 Roll</button><button class="big" id="h" ${s.tt ? '' : 'disabled'}>🏦 Hold</button></div>` : '');
      const q = x => A.root.querySelector(x);
      if (q('#r')) { q('#r').onclick = () => A.act(s => { if (s.winner || s.turn !== A.me) return; const d = 1 + rnd(6); s.dice = d; if (d === 1) { s.tt = 0; s.ev = `${A.names[A.me]} rolled a 1 — turn lost!`; s.turn = other(A.me); } else { s.tt += d; s.ev = `${A.names[A.me]} rolled ${d}`; } return s; });
        q('#h').onclick = () => A.act(s => { if (s.winner || s.turn !== A.me || !s.tt) return; s['s' + A.me] += s.tt; s.tt = 0; s.ev = `${A.names[A.me]} banked the points`; if (s['s' + A.me] >= 50) s.winner = A.me; else s.turn = other(A.me); return s; }); }
      return s.winner ? '' : mine ? 'Roll or hold' : `${A.names[s.turn]} is playing`; } },
  mm: { title: 'Mastermind', emoji: '🧠', desc: 'Crack the secret colour code.',
    init: f => ({ setter: f, code: [], guesses: [], phase: 'set', max: 10, winner: null, turn: f }),
    view(s, A) {
      const me = A.me, gz = other(s.setter); A.mem.s = s; if (A.mem.n !== s.n) { A.mem.n = s.n; A.mem.cur = []; }
      A.mem.draw = () => { const s = A.mem.s, cur = A.mem.cur || [], can = (s.phase === 'set' && me === s.setter) || (s.phase === 'guess' && me === gz), dot = c => `<i class="dt" style="background:${MC[c]}"></i>`;
        A.root.innerHTML = `<div class="mmh">${s.guesses.map(g => `<div class="mmr">${g.g.map(dot).join('')}<span class="pegs">${'●'.repeat(g.b)}<em>${'○'.repeat(g.w)}</em></span></div>`).join('')}</div>` +
          ((s.phase === 'guess' && me === s.setter) || s.phase === 'done' ? `<p class="wait">Secret code:</p><div class="mmr">${s.code.map(dot).join('')}</div>` : '') +
          (can ? `<div class="mmr cur">${[0, 1, 2, 3].map(k => cur[k] !== undefined ? dot(cur[k]) : '<i class="dt e"></i>').join('')}</div><div class="pal">${MC.map((c, i) => `<button class="pc" data-c="${i}" style="background:${c}" aria-label="colour ${i + 1}"></button>`).join('')}<button id="bk">⌫</button><button class="pri" id="ok" ${cur.length === 4 ? '' : 'disabled'}>${s.phase === 'set' ? 'Set code' : 'Guess'}</button></div>` : s.phase === 'set' ? `<p class="wait">${esc(A.names[s.setter])} is choosing a secret code…</p>` : s.phase === 'guess' ? `<p class="wait">${esc(A.names[gz])} is cracking it — ${s.max - s.guesses.length} tries left</p>` : ''); };
      A.mem.draw();
      A.root.onclick = e => { const s = A.mem.s, c = e.target.closest('[data-c]'), cur = A.mem.cur = A.mem.cur || [];
        if (c && cur.length < 4) { cur.push(+c.dataset.c); A.mem.draw(); } else if (e.target.closest('#bk')) { cur.pop(); A.mem.draw(); }
        else if (e.target.closest('#ok') && cur.length === 4) { const v = cur.slice(); A.mem.cur = [];
          A.act(s => { if (s.phase === 'set' && A.me === s.setter) { s.code = v; s.phase = 'guess'; s.turn = other(s.setter); return s; }
            if (s.phase === 'guess' && A.me === other(s.setter)) { const f = mmFb(s.code, v); s.guesses.push({ g: v, b: f.b, w: f.w }); if (f.b === 4) { s.phase = 'done'; s.winner = other(s.setter); } else if (s.guesses.length >= s.max) { s.phase = 'done'; s.winner = s.setter; } return s; } }); } };
      return s.winner ? '' : s.phase === 'set' ? (me === s.setter ? 'Choose 4 colours (repeats allowed)' : 'Waiting for the code') : me === gz ? 'Guess the code' : 'They are guessing'; } }
});
