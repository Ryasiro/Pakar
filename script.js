/**
 * ============================================================
 * SISTEM PAKAR MOCKTAIL — script.js
 * Metode : Certainty Factor (CF) + Forward Chaining
 * Author : Mixologist Expert System
 * ============================================================
 */

/* =============================================================
   1. KNOWLEDGE BASE — DEFINISI FAKTA INPUT
   ============================================================= */

/**
 * Setiap fakta memiliki:
 *  - key      : nama variabel fakta
 *  - label    : label tampilan (Indonesia)
 *  - icon     : emoji dekoratif
 *  - options  : pilihan nilai
 */
const FACTS_DEF = [
  { key: "rasa_manis",    label: "Rasa Manis",     icon: "🍬", options: ["tinggi","sedang","rendah"] },
  { key: "rasa_asam",     label: "Rasa Asam",      icon: "🍋", options: ["tinggi","sedang","rendah"] },
  { key: "rasa_pahit",    label: "Rasa Pahit",     icon: "🫖", options: ["ada","tidak"] },
  { key: "teknik_mixing", label: "Teknik Mixing",  icon: "🥄", options: ["shake","stir","layer"] },
  { key: "target_tekstur",label: "Target Tekstur", icon: "🧊", options: ["ringan","tebal","foam"] },
  { key: "jenis_dairy",   label: "Jenis Dairy",    icon: "🥛", options: ["tidak_ada","fresh_milk","creamer","santan"] },
  { key: "ada_soda",      label: "Ada Soda?",      icon: "🫧", options: ["ya","tidak"] },
  { key: "visual_garnish",label: "Visual Garnish", icon: "🌿", options: ["ada","tidak"] },
  { key: "filosofi_nama", label: "Filosofi Nama",  icon: "📜", options: ["ada","tidak"] },
];

/* =============================================================
   2. NILAI CF USER
   ============================================================= */
const CF_USER_LEVELS = {
  "Tidak Yakin":   0.2,
  "Sedikit Yakin": 0.4,
  "Cukup Yakin":   0.6,
  "Yakin":         0.8,
  "Sangat Yakin":  1.0,
};

/* =============================================================
   3. RULE SET 2 — STATUS KESEIMBANGAN
   ============================================================= */
const RULES_SET2 = [
  {
    code: "RS2-1",
    conditions: [
      ["rasa_manis", ["tinggi","sedang"]],
      ["rasa_asam",  ["tinggi","sedang"]],
    ],
    operator:   "AND",
    conclusion: "status_keseimbangan=ok",
    cf:         0.90,
  },
  {
    code: "RS2-2",
    conditions: [
      ["rasa_manis", ["tinggi","sedang"]],
      ["rasa_asam",  ["sedang","tinggi"]],
    ],
    operator:   "AND",
    conclusion: "status_keseimbangan=ok",
    cf:         0.90,
  },
  {
    code: "RS2-3",
    conditions: [
      ["rasa_manis", ["tinggi","sedang"]],
      ["rasa_asam",  ["tinggi","sedang"]],
      ["rasa_pahit", ["ada"]],
    ],
    operator:   "AND",
    conclusion: "status_keseimbangan=ok",
    cf:         0.85,
  },
  {
    code: "RS2-4",
    conditions: [
      ["rasa_manis", ["tinggi"]],
      ["rasa_asam",  ["rendah"]],
    ],
    operator:   "AND",
    conclusion: "status_keseimbangan=not_ok",
    cf:         0.95,
  },
  {
    code: "RS2-5",
    conditions: [
      ["rasa_manis", ["rendah"]],
      ["rasa_asam",  ["tinggi","sedang"]],
    ],
    operator:   "AND",
    conclusion: "status_keseimbangan=not_ok",
    cf:         0.90,
  },
  {
    code: "RS2-6",
    conditions: [
      ["rasa_manis", ["rendah","sedang"]],
      ["rasa_asam",  ["rendah"]],
      ["rasa_pahit", ["ada"]],
    ],
    operator:   "AND",
    conclusion: "status_keseimbangan=not_ok",
    cf:         0.92,
  },
  {
    code: "RS2-7",
    conditions: [
      ["rasa_manis", ["rendah"]],
      ["rasa_asam",  ["rendah"]],
    ],
    operator:   "AND",
    conclusion: "status_keseimbangan=not_ok",
    cf:         0.97,
  },
];

/* =============================================================
   4. RULE SET 3 — STATUS TEKNIK
   ============================================================= */
const RULES_SET3 = [
  {
    code: "RS3-1",
    conditions: [
      ["teknik_mixing",  ["shake"]],
      ["target_tekstur", ["tebal","foam"]],
    ],
    operator:   "AND",
    conclusion: "status_teknik=sesuai",
    cf:         0.95,
  },
  {
    code: "RS3-2",
    conditions: [
      ["teknik_mixing",  ["stir","layer"]],
      ["target_tekstur", ["ringan"]],
    ],
    operator:   "AND",
    conclusion: "status_teknik=sesuai",
    cf:         0.90,
  },
  {
    code: "RS3-3",
    conditions: [
      ["teknik_mixing",  ["shake"]],
      ["target_tekstur", ["ringan"]],
    ],
    operator:   "AND",
    conclusion: "status_teknik=tidak_sesuai",
    cf:         0.88,
  },
  {
    code: "RS3-4",
    conditions: [
      ["teknik_mixing",  ["stir"]],
      ["target_tekstur", ["tebal","foam"]],
    ],
    operator:   "AND",
    conclusion: "status_teknik=tidak_sesuai",
    cf:         0.93,
  },
  {
    code: "RS3-5",
    conditions: [
      ["teknik_mixing",  ["layer"]],
      ["target_tekstur", ["tebal","foam"]],
    ],
    operator:   "AND",
    conclusion: "status_teknik=tidak_sesuai",
    cf:         0.95,
  },
];

/* =============================================================
   5. RULE SET 1 — REKOMENDASI AKHIR
   ============================================================= */
const RULES_SET1 = [
  {
    code: "RS1-1",
    conditions: [
      ["jenis_dairy", ["fresh_milk"]],
      ["ada_soda",    ["ya"]],
    ],
    operator:   "AND",
    conclusion: "fatal_error",
    cf:         1.00,
  },
  {
    code: "RS1-2",
    conditions: [
      ["status_keseimbangan", ["ok"]],
      ["status_teknik",       ["sesuai"]],
      ["visual_garnish",      ["ada"]],
      ["filosofi_nama",       ["ada"]],
    ],
    operator:   "AND",
    conclusion: "premium_look",
    cf:         0.95,
  },
  {
    code: "RS1-3",
    conditions: [
      ["status_keseimbangan", ["ok"]],
      ["status_teknik",       ["sesuai"]],
      ["jenis_dairy",         ["creamer","fresh_milk"]],
      ["ada_soda",            ["ya"]],
    ],
    operator:   "AND",
    conclusion: "mocktail_segar",
    cf:         0.88,
  },
  {
    code: "RS1-4",
    conditions: [
      ["status_keseimbangan", ["ok"]],
      ["status_teknik",       ["sesuai"]],
      ["jenis_dairy",         ["creamer","santan"]],
      ["ada_soda",            ["tidak"]],
    ],
    operator:   "AND",
    conclusion: "mocktail_kompleks",
    cf:         0.92,
  },
  {
    code: "RS1-5",
    conditions: [
      ["status_keseimbangan", ["ok"]],
      ["status_teknik",       ["sesuai"]],
      ["jenis_dairy",         ["santan"]],
    ],
    operator:   "AND",
    conclusion: "mocktail_kompleks",
    cf:         0.90,
  },
  {
    code: "RS1-6",
    conditions: [
      ["status_keseimbangan", ["ok"]],
      ["status_teknik",       ["tidak_sesuai"]],
    ],
    operator:   "AND",
    conclusion: "koreksi_teknik",
    cf:         0.95,
  },
  {
    code: "RS1-7",
    conditions: [
      ["status_keseimbangan", ["not_ok"]],
      ["status_teknik",       ["sesuai"]],
    ],
    operator:   "AND",
    conclusion: "koreksi_rasa",
    cf:         0.96,
  },
  {
    code: "RS1-8",
    conditions: [
      ["status_keseimbangan", ["not_ok"]],
      ["status_teknik",       ["tidak_sesuai"]],
    ],
    operator:   "AND",
    conclusion: "koreksi_rasa_dan_teknik",
    cf:         0.99,
  },
];

/* =============================================================
   6. METADATA KESIMPULAN
   ============================================================= */
const CONCLUSION_META = {
  premium_look: {
    name:  "Premium Look",
    icon:  "✨",
    desc:  "Mocktail Anda memiliki keseimbangan sempurna dan tampilan premium layaknya sajian fine-dining.",
    type:  "ok",
  },
  mocktail_segar: {
    name:  "Mocktail Segar",
    icon:  "🍹",
    desc:  "Kombinasi dairy dan soda menciptakan minuman yang menyegarkan dengan tekstur ringan berkelas.",
    type:  "ok",
  },
  mocktail_kompleks: {
    name:  "Mocktail Kompleks",
    icon:  "🌀",
    desc:  "Perpaduan dairy creamy tanpa soda menghasilkan profil rasa yang kaya, berlapis, dan kompleks.",
    type:  "ok",
  },
  koreksi_teknik: {
    name:  "Koreksi Teknik Diperlukan",
    icon:  "⚙️",
    desc:  "Rasa sudah seimbang, namun teknik mixing belum sesuai target tekstur. Sesuaikan teknik Anda.",
    type:  "warn",
  },
  koreksi_rasa: {
    name:  "Koreksi Rasa Diperlukan",
    icon:  "⚖️",
    desc:  "Teknik sudah tepat, namun keseimbangan rasa perlu diperbaiki. Sesuaikan level manis dan asam.",
    type:  "warn",
  },
  koreksi_rasa_dan_teknik: {
    name:  "Koreksi Rasa & Teknik",
    icon:  "🔧",
    desc:  "Baik keseimbangan rasa maupun teknik mixing perlu diperbaiki sebelum mocktail ini layak saji.",
    type:  "warn",
  },
  fatal_error: {
    name:  "Fatal Error — Dairy Conflict",
    icon:  "❌",
    desc:  "Fresh milk + soda adalah kombinasi fatal yang menyebabkan koagulasi. Gunakan creamer atau hilangkan soda.",
    type:  "error",
  },
};

/* =============================================================
   7. UTILITAS CERTAINTY FACTOR
   ============================================================= */

/**
 * Menghitung CF Evidence dari kumpulan nilai fakta dalam satu rule.
 * Untuk AND: ambil minimum semua CF fakta yang cocok.
 * @param {Object} facts  — { key: { value, cf } }
 * @param {Array}  conditions
 * @param {string} operator
 * @returns {number|null} CF Evidence, atau null jika kondisi tidak terpenuhi
 */
function calcCFEvidence(facts, conditions, operator) {
  const cfValues = [];

  for (const [key, allowedValues] of conditions) {
    const fact = facts[key];
    if (!fact) return null; // Fakta tidak ada → rule tidak aktif

    // Cek apakah nilai fakta ada dalam daftar nilai yang diizinkan rule
    if (!allowedValues.includes(fact.value)) return null;

    cfValues.push(fact.cf);
  }

  if (operator === "AND") return Math.min(...cfValues);
  if (operator === "OR")  return Math.max(...cfValues);
  return cfValues[0];
}

/**
 * Menghitung CF rule: CF(H,E) = CF(E) × CF(rule)
 */
function calcCFRule(cfEvidence, cfRule) {
  return cfEvidence * cfRule;
}

/**
 * Kombinasi dua CF yang menghasilkan kesimpulan yang sama:
 * CFcombine = CF1 + CF2 × (1 - CF1)
 */
function combineCF(cf1, cf2) {
  return cf1 + cf2 * (1 - cf1);
}

/* =============================================================
   8. FORWARD CHAINING ENGINE
   ============================================================= */

/**
 * Jalankan inferensi forward chaining.
 * Returns objek berisi:
 *   - derivedFacts : fakta turunan (status_keseimbangan, status_teknik)
 *   - fired        : array semua rule yang aktif + detail CF
 *   - conclusions  : map { conclusion → CF akhir setelah kombinasi }
 *   - calcLog      : log perhitungan langkah demi langkah
 */
function runInference(userFacts) {
  // Salin fakta user agar tidak dimodifikasi langsung
  const facts = { ...userFacts };

  const fired   = [];   // Rule yang aktif
  const calcLog = [];   // Log perhitungan
  const conclusions = {}; // { conclusion → CF akhir }

  /**
   * Fungsi helper: proses satu set rule dan update facts + conclusions.
   */
  function processRuleSet(rules, phase) {
    calcLog.push(`\n── FASE ${phase} ──`);

    for (const rule of rules) {
      const cfE = calcCFEvidence(facts, rule.conditions, rule.operator);
      if (cfE === null) continue; // Rule tidak aktif (kondisi tidak terpenuhi)

      const cfH = calcCFRule(cfE, rule.cf);

      // Log perhitungan
      const condStr = rule.conditions
        .map(([k, v]) => `${k}=${facts[k]?.value}(${facts[k]?.cf})`)
        .join(", ");

      calcLog.push(`\n[${rule.code}] aktif`);
      calcLog.push(`  Kondisi : ${condStr}`);
      calcLog.push(`  CF(E)   = ${rule.operator}(${rule.conditions.map(([k]) => facts[k]?.cf).join(", ")}) = ${cfE.toFixed(4)}`);
      calcLog.push(`  CF(H,E) = ${cfE.toFixed(4)} × ${rule.cf} = ${cfH.toFixed(4)}`);

      // Fakta turunan (RS2/RS3): gunakan MAX (ambil CF tertinggi, tidak dikombinasikan)
      // Rekomendasi akhir (RS1): gunakan rumus kombinasi CF
      const isIntermediateFact = rule.conclusion.includes("=");

      if (conclusions[rule.conclusion] !== undefined) {
        const cfPrev = conclusions[rule.conclusion];
        if (isIntermediateFact) {
          // Fakta turunan → ambil nilai MAX
          const cfNew = Math.max(cfPrev, cfH);
          calcLog.push(`  Fakta sudah ada → ambil MAX(${cfPrev.toFixed(4)}, ${cfH.toFixed(4)}) = ${cfNew.toFixed(4)}`);
          conclusions[rule.conclusion] = cfNew;
        } else {
          // Rekomendasi akhir → kombinasi CF
          const cfNew = combineCF(cfPrev, cfH);
          calcLog.push(`  Kombinasi CF:`);
          calcLog.push(`    CF_prev = ${cfPrev.toFixed(4)}`);
          calcLog.push(`    CFcombine = ${cfPrev.toFixed(4)} + ${cfH.toFixed(4)} × (1 − ${cfPrev.toFixed(4)}) = ${cfNew.toFixed(4)}`);
          conclusions[rule.conclusion] = cfNew;
        }
      } else {
        conclusions[rule.conclusion] = cfH;
      }

      // Simpan rule yang aktif
      fired.push({ rule, cfE, cfH });

      // Jika kesimpulan adalah fakta turunan, masukkan ke facts
      // Format: "key=value"
      if (isIntermediateFact) {
        const [k, v] = rule.conclusion.split("=");
        const prevCF = facts[k]?.cf ?? 0;
        if (conclusions[rule.conclusion] > prevCF) {
          facts[k] = { value: v, cf: conclusions[rule.conclusion] };
          calcLog.push(`  → Fakta baru: ${k} = ${v} (CF=${conclusions[rule.conclusion].toFixed(4)})`);
        }
      }
    }
  }

  // Jalankan rule set secara berurutan (forward chaining)
  processRuleSet(RULES_SET2, "Keseimbangan Rasa (RS2)");
  processRuleSet(RULES_SET3, "Teknik Mixing (RS3)");
  processRuleSet(RULES_SET1, "Rekomendasi Akhir (RS1)");

  return { facts, fired, conclusions, calcLog };
}

/* =============================================================
   9. BUILD UI — INPUT FORM (REMOVED: NOW HARDCODED)
   ============================================================= */
// Form input sekarang bersifat statis di HTML agar desain konsisten dengan Folder 1.

/* =============================================================
   10. BACA INPUT USER
   ============================================================= */

function readUserFacts() {
  const facts = {};
  for (const factDef of FACTS_DEF) {
    let val;
    const elem = document.getElementById(`val_${factDef.key}`);
    if (elem) {
        val = elem.value;
    } else {
        // Handle radio buttons (chip-group)
        const radios = document.getElementsByName(`val_${factDef.key}`);
        for (const radio of radios) {
            if (radio.checked) val = radio.value;
        }
    }
    const cfKey = document.getElementById(`cf_${factDef.key}`).value;
    facts[factDef.key] = {
      value: val,
      cf:    CF_USER_LEVELS[cfKey],
      cfKey: cfKey,
    };
  }
  return facts;
}

/* =============================================================
   11. RENDER HASIL
   ============================================================= */

function renderResults(userFacts, result) {
  const { conclusions, fired, calcLog, facts } = result;

  /* ── Tentukan rekomendasi utama (CF tertinggi untuk kategori akhir) ── */
  const finalConclusions = Object.entries(conclusions).filter(([k]) => !k.includes("="));
  finalConclusions.sort((a, b) => b[1] - a[1]);

  const [topKey, topCF] = finalConclusions[0] || ["unknown", 0];
  const meta = CONCLUSION_META[topKey] || {
    name: topKey, icon: "❓", desc: "Kesimpulan tidak ditemukan.", type: "warn",
  };

  /* ── Verdict box ── */
  const vBox = document.getElementById("verdictBox");
  vBox.className = `verdict-box ${meta.type}`;
  vBox.innerHTML = `
    <div class="verdict-icon">${meta.icon}</div>
    <div class="verdict-code">${topKey.replace(/_/g, " ")}</div>
    <div class="verdict-name">${meta.name}</div>
    <div class="verdict-desc">${meta.desc}</div>
  `;

  /* ── CF Progress bar ── */
  const pct = Math.round(topCF * 100);
  document.getElementById("cfPercent").textContent = `${pct}%`;
  setTimeout(() => {
    document.getElementById("cfBarFill").style.width = `${pct}%`;
  }, 100);

  /* ── Decision Table ── */
  const dtTbody = document.querySelector("#decisionTable tbody");
  dtTbody.innerHTML = "";
  let counter = 1;

  for (const { rule, cfE, cfH } of fired) {
    const tr = document.createElement("tr");
    
    // Format conditions
    const condStr = rule.conditions.map(([k, v]) => `<strong>${k}</strong> in [${v.join(", ")}]`).join("<br/> AND ");
    
    tr.innerHTML = `
      <td>${condStr}</td>
      <td><strong>${rule.conclusion}</strong></td>
      <td><span class="cf-badge">${rule.cf}</span></td>
      <td><span class="step-badge init-badge">Aktif (CF: ${cfH.toFixed(2)})</span></td>
    `;
    dtTbody.appendChild(tr);
    counter++;
  }

  if (fired.length === 0) {
      dtTbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Tidak ada rule yang aktif.</td></tr>`;
  }

  /* ── Working Memory Box ── */
  const wmBox = document.getElementById("wmOutput");
  wmBox.innerHTML = "";
  
  // Fakta input
  for (const [k, v] of Object.entries(userFacts)) {
      const div = document.createElement("div");
      div.className = "wm-item";
      div.innerHTML = `<span class="wm-name">${k} = ${v.value}</span><span class="wm-cf">${v.cf.toFixed(2)}</span>`;
      wmBox.appendChild(div);
  }
  // Fakta turunan
  for (const [k, v] of Object.entries(facts)) {
      if (!userFacts[k]) {
          const div = document.createElement("div");
          div.className = "wm-item";
          div.style.borderColor = "var(--accent)";
          div.style.background = "rgba(0, 170, 19, 0.05)";
          div.innerHTML = `<span class="wm-name">${k} = ${v.value}</span><span class="wm-cf">${v.cf.toFixed(2)}</span>`;
          wmBox.appendChild(div);
      }
  }

  /* ── Inference Table ── */
  const infTbody = document.querySelector("#inferenceTable tbody");
  infTbody.innerHTML = "";
  let step = 1;
  for (const { rule, cfE, cfH } of fired) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${step}</td>
      <td><strong>${rule.code}</strong></td>
      <td>${cfE.toFixed(2)}</td>
      <td>${cfH.toFixed(2)}</td>
      <td>${rule.conclusion}</td>
    `;
    infTbody.appendChild(tr);
    step++;
  }

  /* ── Contoh Perhitungan CF ── */
  const contohDiv = document.getElementById("contohOutput");
  if (fired && fired.length) {
      let html = "";
      for (let i = 0; i < fired.length; i++) {
          const { rule, cfE, cfH } = fired[i];
          const premList = rule.conditions.map(([k, v]) => {
              const factVal = facts[k] || userFacts[k];
              const cfVal = factVal ? factVal.cf.toFixed(2) : "0.00";
              return `<span class="mono">${k}</span> = ${cfVal}`;
          }).join(" | ");
          
          html += `
              <div class="contoh-step" style="border:1px solid var(--border-glass); border-radius:8px; padding:1.2rem; margin-bottom:1.2rem; background:var(--bg-secondary);">
                  <div class="contoh-step-header" style="margin-bottom:0.8rem; border-bottom:1px dashed var(--border-glass); padding-bottom:0.7rem; display:flex; align-items:center; gap:0.5rem;">
                      <span class="contoh-step-num" style="background:var(--accent); color:#fff; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:700;">Langkah ${i + 1}</span>
                      <span class="contoh-rule-id" style="font-family:'JetBrains Mono', monospace; font-weight:700; color:var(--text-primary);">${rule.code}</span>
                  </div>
                  <div class="cf-step" style="margin-bottom:1rem;">
                      <div class="cf-step-title" style="font-weight:600; font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.4rem;">1. Identifikasi Premis & CF Fakta</div>
                      <p class="mono" style="font-family:'JetBrains Mono', monospace; background:var(--bg-glass); padding:0.6rem 0.8rem; border-radius:6px; margin:0.4rem 0; font-size:0.85rem; color:var(--text-primary);">IF ${rule.conditions.map(([k,v])=>`${k} in [${v.join(",")}]`).join(" AND ")} THEN ${rule.conclusion} &nbsp;[CF<sub>rule</sub> = ${rule.cf}]</p>
                      <p style="font-size:0.85rem; color:var(--text-secondary);">CF fakta dari memori: ${premList}</p>
                  </div>
                  <div class="cf-step">
                      <div class="cf-step-title" style="font-weight:600; font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.4rem;">2. Hitung CF Kesimpulan Rule</div>
                      <p style="font-size:0.85rem; color:var(--text-secondary);">min(CF premis) = <strong style="color:var(--text-primary);">${cfE.toFixed(4)}</strong></p>
                      <p class="mono formula" style="font-family:'JetBrains Mono', monospace; background:var(--bg-glass); padding:0.6rem 0.8rem; border-radius:6px; margin:0.4rem 0; font-size:0.85rem; color:var(--text-primary);">CF<sub>hasil</sub> = ${cfE.toFixed(4)} × ${rule.cf} = <strong style="color:var(--accent); font-size:1rem;">${cfH.toFixed(4)}</strong></p>
                  </div>
              </div>
          `;
      }
      contohDiv.innerHTML = html;
  } else {
      contohDiv.innerHTML = `<p class="empty-msg" style="color:var(--text-secondary); font-style:italic;">Tidak ada contoh perhitungan (tidak ada rule yang aktif).</p>`;
  }
}

/* =============================================================
   12. HELPER — ESCAPE HTML
   ============================================================= */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* =============================================================
   13. EVENT LISTENERS
   ============================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* --- 0. Build Knowledge Base --- */
  function buildRulesList() {
      const container = document.getElementById("rulesList");
      if (!container) return;
      container.innerHTML = "";
      const allRules = [...RULES_SET2, ...RULES_SET3, ...RULES_SET1];
      
      for (const rule of allRules) {
          const div = document.createElement("div");
          div.className = "rule-item";
          const condStr = rule.conditions.map(([k, v]) => `${k} in [${v.join(", ")}]`).join(` ${rule.operator} `);
          div.innerHTML = `
              <span class="rule-id">${rule.code}</span>
              <span>IF ${condStr} THEN <strong>${rule.conclusion}</strong></span>
              <span class="rule-cf">CF=${rule.cf.toFixed(2)}</span>
          `;
          container.appendChild(div);
      }
  }
  buildRulesList();

  /* --- 1. Dark Mode Toggle --- */
  const themeToggle = document.getElementById("themeToggle");
  const currentTheme = localStorage.getItem("theme");
  
  function updateThemeIcon(theme) {
      if (theme === "dark") {
          themeToggle.innerHTML = '<i data-lucide="sun"></i>';
      } else {
          themeToggle.innerHTML = '<i data-lucide="moon"></i>';
      }
      lucide.createIcons(); // Re-initialize new icon
  }
  
  if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      updateThemeIcon("dark");
  } else {
      updateThemeIcon("light");
  }
  
  themeToggle.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      if (theme === "dark") {
          document.documentElement.removeAttribute("data-theme");
          localStorage.setItem("theme", "light");
          updateThemeIcon("light");
      } else {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
          updateThemeIcon("dark");
      }
  });

  /* --- 2. Confidence Color Coding --- */
  const confidenceSelects = document.querySelectorAll(".confidence-select");
  function updateConfidenceColor(selectElement) {
      selectElement.classList.remove("cf-high", "cf-med", "cf-low");
      const val = selectElement.value;
      if (val === "Sangat Yakin" || val === "Yakin") {
          selectElement.classList.add("cf-high");
      } else if (val === "Cukup Yakin") {
          selectElement.classList.add("cf-med");
      } else {
          selectElement.classList.add("cf-low");
      }
  }
  confidenceSelects.forEach(select => {
      updateConfidenceColor(select); // Init
      select.addEventListener("change", (e) => updateConfidenceColor(e.target));
  });

  /* --- 3. Tombol Analisis & Loading Overlay --- */
  document.getElementById("btnAnalisis").addEventListener("click", () => {
    const userFacts = readUserFacts();
    const result    = runInference(userFacts);

    // Show loading overlay
    const overlay = document.getElementById("loadingOverlay");
    overlay.classList.add("active");

    setTimeout(() => {
        overlay.classList.remove("active");
        renderResults(userFacts, result);

        // Show main result section
        document.getElementById("section-result").style.display = "block";
        
        // Reset accordion
        document.getElementById("detailAccordion").classList.remove("open");
        document.getElementById("btnToggleDetail").classList.remove("open");
        
        // Ensure inner sections are visible (controlled by accordion)
        document.getElementById("decisionTableSection").style.display = "block";
        document.getElementById("wmSection").style.display = "block";
        document.getElementById("tableSection").style.display = "block";
        
        // Hide KB and Theory to prevent visual clutter
        document.getElementById("rulesSection").style.display = "none";
        document.getElementById("theorySection").style.display = "none";
        
        window.scrollTo({ top: document.getElementById("section-result").offsetTop - 20, behavior: "smooth" });
    }, 800);
  });

  /* --- 4. Accordion Toggle --- */
  document.getElementById("btnToggleDetail").addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const content = document.getElementById("detailAccordion");
      btn.classList.toggle("open");
      content.classList.toggle("open");
      
      const isOpen = btn.classList.contains("open");
      btn.setAttribute("aria-expanded", isOpen.toString());
      
      // Scroll smoothly if opening
      if (isOpen) {
          setTimeout(() => {
              btn.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
      }
  });

  /* --- 5. Tombol Kembali --- */
  document.getElementById("btnBack").addEventListener("click", () => {
    document.getElementById("section-result").style.display = "none";
    document.getElementById("cfBarFill").style.width = "0%";
    
    // Show KB and Theory again
    document.getElementById("rulesSection").style.display = "block";
    document.getElementById("theorySection").style.display = "block";
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});
