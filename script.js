// v2/script.js

const tooltip = document.getElementById("tooltip");
const contours = document.querySelectorAll(".contour");

// Panel elements
const panel = document.getElementById("info-panel");
const panelTitle = document.getElementById("panel-title");
const panelMeta = document.getElementById("panel-meta");
const panelBody = document.getElementById("panel-body");
const panelClose = document.getElementById("panel-close");
const panelOverlay = document.getElementById("panel-overlay");

// Footer controls (optional)
const prevBtn = document.getElementById("prev-fragment");
const nextBtn = document.getElementById("next-fragment");
const layerLink = document.getElementById("layer-link");

// Layer names + essay links (if you use them)
const LAYERS = {
  0: { name: "Orientation", href: "layer-0.html" },
  1: { name: "Instrument", href: "layer-1.html" },
  2: { name: "Extraction / Governance", href: "layer-2.html" },
  3: { name: "Ruin / Afterlives", href: "layer-3.html" },
};

// Content store (add entries gradually)
// IMPORTANT: keys must match your SVG path ids, e.g., "contour-1"
const CONTOUR_CONTENT = {
  "contour-1": {
    title: "Orientation · First ring",
    meta: "How to read · click rings to open fragments",
    layer: 0,
    order: 1,
    body: `
      <section class="entry">
        <div class="entry-block">
          <div class="entry-label">How to read</div>
          <p>
            Click a ring. The right-hand panel is a reader. Each fragment is a small relay between
            measurement, mountain, and memory.
          </p>
        </div>

        <div class="entry-block">
          <div class="entry-label">What the rings do</div>
          <p>
            These lines aren’t only elevation. They’re a way of watching enchantment thin out—
            where the world becomes legible as geometry, and something in it goes quiet.
          </p>
        </div>

        <div class="entry-actions">
          <a class="panel-link" href="essay.html">Read the essay →</a>
        </div>
      </section>
    `,
  },

  // Example Mt. Shasta signal fragment (edit the id to a real contour id you have)
  "contour-42": {
    title: "Relay Node · Mount Shasta Signal",
    meta: "Layer 1 · Instrument · 1875 / 1954 / afterlife",
    layer: 1,
    order: 1,
    body: `
      <section class="entry">
        <div class="entry-block">
          <div class="entry-label">Scene</div>
          <p>
            In 1875, a 3,500-pound reflective cone and base were hauled to the summit of Mount Shasta’s north peak
            and installed as a transcontinental geodetic relay point—built to collapse 192 miles into measurable relation.
          </p>
        </div>

        <div class="entry-block">
          <div class="entry-label">Operation</div>
          <p>
            Light flashed from summit to summit. Angles became lines. The mountain became an instrument platform:
            granite repurposed as infrastructure.
          </p>
        </div>

        <div class="entry-block">
          <div class="entry-label">Afterlife</div>
          <p>
            Snow returned. Ice encased it. The relay became weather, rumor, artifact—visible only when thaw revealed it,
            then finally moved into the Siskiyou County Museum.
          </p>
        </div>

        <div class="entry-actions">
          <a class="panel-link" href="essay.html">Read the essay →</a>
        </div>
      </section>
    `,
  },
};

// ---- helpers ----

function getContourTitleForTooltip(id) {
  const item = CONTOUR_CONTENT[id];
  return item?.title ?? `Contour: ${id}`;
}

function setActiveContour(id) {
  document.querySelectorAll(".contour").forEach((c) => c.classList.remove("active-contour"));
  const clicked = document.getElementById(id);
  clicked?.classList.add("active-contour");
}

function openPanel() {
  panel.classList.add("open");
  panelOverlay.classList.add("open");
  panel.setAttribute("aria-hidden", "false");

  // This triggers grid fade + any other "panel open" styling
  document.body.classList.add("panel-open");
}

function closePanel() {
  panel.classList.remove("open");
  panelOverlay.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");

  document.body.classList.remove("panel-open");
}

function getFallbackEntry(id) {
  return {
    title: `Contour: ${id}`,
    meta: `Unwritten fragment · add this entry in CONTOUR_CONTENT`,
    layer: 0,
    order: 9999,
    body: `
      <section class="entry">
        <div class="entry-block">
          <div class="entry-label">Unwritten fragment</div>
          <p>
            This ring doesn’t have an entry yet. Add it inside <code>CONTOUR_CONTENT</code> in <code>v2/script.js</code>.
          </p>
        </div>

        <div class="entry-block">
          <div class="entry-label">Template</div>
          <pre><code>"${id}": {
  title: "...",
  meta: "...",
  layer: 1,
  order: 3,
  body: \`&lt;section class="entry"&gt;...&lt;/section&gt;\`
}</code></pre>
        </div>
      </section>
    `,
  };
}

function getEntry(id) {
  return CONTOUR_CONTENT[id] ?? getFallbackEntry(id);
}

function getIdsInLayer(layerNum) {
  return Object.entries(CONTOUR_CONTENT)
    .filter(([_, v]) => v.layer === layerNum)
    .sort((a, b) => (a[1].order ?? 9999) - (b[1].order ?? 9999))
    .map(([k]) => k);
}

let currentId = null;

function updateFooterNav(entry) {
  if (!prevBtn || !nextBtn || !layerLink) return;

  const layerNum = entry.layer ?? 0;
  const ids = getIdsInLayer(layerNum);

  if (!currentId || ids.length === 0) {
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    layerLink.href = "essay.html";
    layerLink.textContent = "Read Essay";
    return;
  }

  const idx = ids.indexOf(currentId);
  prevBtn.disabled = idx <= 0;
  nextBtn.disabled = idx < 0 || idx >= ids.length - 1;

  const layerInfo = LAYERS[layerNum] ?? { name: "Essay", href: "essay.html" };
  layerLink.href = layerInfo.href;
  layerLink.textContent = `Read ${layerInfo.name}`;
}

function openPanelForContour(id) {
  currentId = id;
  const entry = getEntry(id);

  panelTitle.textContent = entry.title ?? `Contour: ${id}`;
  panelMeta.textContent = entry.meta ?? "";
  panelBody.innerHTML = entry.body ?? "";

  setActiveContour(id);
  updateFooterNav(entry);
  openPanel();
}

// ---- wire UI ----

panelClose?.addEventListener("click", closePanel);
panelOverlay?.addEventListener("click", closePanel);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

prevBtn?.addEventListener("click", () => {
  if (!currentId) return;
  const entry = getEntry(currentId);
  const ids = getIdsInLayer(entry.layer ?? 0);
  const idx = ids.indexOf(currentId);
  if (idx > 0) openPanelForContour(ids[idx - 1]);
});

nextBtn?.addEventListener("click", () => {
  if (!currentId) return;
  const entry = getEntry(currentId);
  const ids = getIdsInLayer(entry.layer ?? 0);
  const idx = ids.indexOf(currentId);
  if (idx >= 0 && idx < ids.length - 1) openPanelForContour(ids[idx + 1]);
});

// ---- hover + click behavior on contours ----

contours.forEach((path) => {
  path.addEventListener("mouseenter", () => {
    tooltip.style.opacity = 1;
    tooltip.innerHTML = getContourTitleForTooltip(path.id);
  });

  path.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + 12 + "px";
    tooltip.style.top = e.pageY + 12 + "px";
  });

  path.addEventListener("mouseleave", () => {
    tooltip.style.opacity = 0;
  });

  path.addEventListener("click", () => {
    openPanelForContour(path.id);
  });
});
