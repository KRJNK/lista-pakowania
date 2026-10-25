// Lista pakowania: checklista + pasek postępu, stan w localStorage.
(function () {
  'use strict';
  var KEY = 'pakowanie-v1';
  var DEFAULTS = ['Dokumenty', 'Portfel', 'Telefon + ładowarka', 'Leki',
    'Szczoteczka', 'Ręcznik', 'Ubrania na zmianę', 'Bielizna', 'Buty zapasowe', 'Przekąski'];
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (Array.isArray(s)) return s;
    } catch (e) {}
    return DEFAULTS.map(function (n) { return { n: n, done: false }; });
  }
  var items = load();
  var listEl = document.getElementById('list');
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }
  function render() {
    listEl.innerHTML = '';
    items.forEach(function (it, i) {
      var lab = document.createElement('label');
      lab.style.display = 'block';
      var cb = document.createElement('input');
      cb.type = 'checkbox'; cb.checked = it.done;
      cb.addEventListener('change', function () { it.done = cb.checked; save(); progress(); });
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(' ' + it.n + ' '));
      var del = document.createElement('button');
      del.type = 'button'; del.textContent = '×'; del.title = 'Usuń';
      del.addEventListener('click', function () { items.splice(i, 1); save(); render(); });
      lab.appendChild(del);
      listEl.appendChild(lab);
    });
    progress();
  }
  function progress() {
    var done = items.filter(function (i) { return i.done; }).length;
    document.getElementById('bar').style.width =
      (items.length ? done / items.length * 100 : 0) + '%';
    document.getElementById('prog').textContent =
      items.length === 0 ? 'Lista pusta — dodaj rzeczy.' :
      done === items.length ? 'Spakowane! Miłej drogi. 🎉' :
      'Spakowane: ' + done + ' / ' + items.length;
  }
  document.getElementById('add').addEventListener('click', function () {
    var v = document.getElementById('new').value.trim();
    if (!v) return;
    items.push({ n: v, done: false });
    document.getElementById('new').value = '';
    save(); render();
  });
  document.getElementById('reset').addEventListener('click', function () {
    items = DEFAULTS.map(function (n) { return { n: n, done: false }; });
    save(); render();
  });
  render();
})();
