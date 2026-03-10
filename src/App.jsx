import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   STYLES — injected once
═══════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #04080f;
    --s1:       #0b1120;
    --s2:       #111827;
    --s3:       #1a2234;
    --b1:       #1e2d47;
    --b2:       #2a3f5e;
    --acc:      #3b82f6;
    --acch:     #60a5fa;
    --accg:     #1d4ed8;
    --amber:    #f59e0b;
    --green:    #10b981;
    --violet:   #a78bfa;
    --red:      #ef4444;
    --txt:      #e2e8f0;
    --txtd:     #64748b;
    --txtm:     #94a3b8;
    --star:     #fbbf24;
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--txt);
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(59,130,246,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59,130,246,.03) 1px, transparent 1px);
    background-size: 44px 44px;
  }

  #root { position: relative; z-index: 1; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--s1); }
  ::-webkit-scrollbar-thumb { background: var(--b2); border-radius: 4px; }

  /* Animations */
  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes glowPulse{ 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes blink    { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
  @keyframes scanLine { from{top:-5%} to{top:105%} }

  .fade-up   { animation: fadeUp  .5s ease both; }
  .fade-in   { animation: fadeIn  .4s ease both; }

  /* ── Shared components ── */
  .mono {
    font-family: 'Share Tech Mono', monospace;
  }
  .bebas {
    font-family: 'Bebas Neue', sans-serif;
  }

  .glass-card {
    background: var(--s1);
    border: 1px solid var(--b1);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(59,130,246,.06);
  }

  .panel-hdr {
    padding: 15px 22px;
    background: var(--s2);
    border-bottom: 1px solid var(--b1);
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 17px; letter-spacing: 2px; color: var(--txt);
  }
  .panel-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    background: rgba(59,130,246,.1); color: var(--acch);
    border: 1px solid rgba(59,130,246,.25);
    padding: 3px 10px; border-radius: 3px;
  }

  /* Input */
  .field-label {
    display: block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--txtd); margin-bottom: 7px;
  }
  .field-input {
    width: 100%;
    background: var(--s2); border: 1px solid var(--b1); border-radius: 5px;
    padding: 12px 15px; color: var(--txt);
    font-family: 'Outfit', sans-serif; font-size: 14px;
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .field-input:focus {
    border-color: var(--acc);
    box-shadow: 0 0 0 3px rgba(59,130,246,.12);
  }
  .field-input::placeholder { color: var(--txtd); opacity: .5; }

  /* Buttons */
  .btn-primary {
    width: 100%; padding: 14px;
    background: var(--acc); color: #fff;
    border: none; border-radius: 5px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
    cursor: pointer; transition: all .2s; margin-top: 6px;
  }
  .btn-primary:hover {
    background: var(--acch);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(59,130,246,.35);
  }
  .btn-sm {
    padding: 7px 14px; border-radius: 5px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; font-weight: 600; letter-spacing: 1px;
    cursor: pointer; border: none; transition: all .2s;
  }
  .btn-outline { background: transparent; border: 1px solid var(--b1); color: var(--txtd); }
  .btn-outline:hover { border-color: var(--acc); color: var(--acc); }
  .btn-blue   { background: var(--acc); color: #fff; }
  .btn-blue:hover { background: var(--acch); box-shadow: 0 4px 16px rgba(59,130,246,.3); }

  /* Grid helpers */
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
  .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

  /* Section divider */
  .sec-div {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; letter-spacing: 3px; text-transform: uppercase; color: var(--acc);
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0 16px;
  }
  .sec-div::after { content:''; flex:1; height:1px; background: linear-gradient(90deg,var(--b2),transparent); }

  /* Error */
  .err-txt {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--red); margin-top: 8px;
  }

  /* EOQ preview */
  .eoq-preview {
    background: rgba(59,130,246,.07); border: 1px solid rgba(59,130,246,.25);
    border-radius: 6px; padding: 14px 18px; margin-bottom: 16px;
    animation: fadeIn .3s ease;
  }

  /* TABLE */
  .tbl-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead tr { background: var(--s3); border-bottom: 2px solid var(--acc); }
  thead th {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--txtd); padding: 12px 13px; text-align: center; white-space: nowrap;
  }
  thead th.th-sno { width: 46px; }
  thead th.th-part { text-align: left; padding-left: 20px; min-width: 148px; }
  thead th.th-star { color: var(--star); }
  tbody tr { border-bottom: 1px solid rgba(30,45,74,.8); transition: background .15s; }
  tbody tr:hover { background: rgba(59,130,246,.03); }
  tbody td { padding: 12px 13px; text-align: center; font-family: 'Share Tech Mono', monospace; font-size: 12px; }
  tbody td.td-sno { font-size: 11px; color: var(--txtd); }
  tbody td.td-part { text-align: left; padding-left: 20px; font-family: 'Outfit',sans-serif; font-weight: 500; color: var(--txtm); font-size: 13px; }

  /* cell colours */
  .cv-open   { color: var(--acch); }
  .cv-demand { color: var(--amber); font-weight: 700; }
  .cv-order  { color: var(--violet); font-weight: 700; }
  .cv-rcpt   { color: var(--green); font-weight: 600; }
  .cv-close  { color: var(--txt); }
  .cv-low    { color: var(--red); font-weight: 700; }
  .cv-zero   { color: var(--b2); }

  /* Table summary strip */
  .tbl-summary {
    display: flex;
    background: var(--s3);
    border-top: 2px solid var(--acc);
  }
  .ts-item { flex: 1; padding: 15px 16px; border-right: 1px solid var(--b2); text-align: center; }
  .ts-item:last-child { border-right: none; }
  .ts-lbl {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--txtd); margin-bottom: 7px;
  }
  .ts-val {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px; letter-spacing: 2px; color: var(--acch);
  }
  .ts-val-star { color: var(--star); }

  .star-legend {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--txtd);
    padding: 9px 20px;
    border-top: 1px solid var(--b1);
    display: flex; align-items: center; gap: 8px;
    background: var(--s1);
  }

  /* KPI cards */
  .kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
  .kpi-card {
    background: var(--s1); border: 1px solid var(--b1); border-radius: 7px;
    padding: 18px; position: relative; overflow: hidden;
  }
  .kpi-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--acc), transparent);
  }
  .kpi-lbl { font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--txtd); margin-bottom:10px; }
  .kpi-val { font-family:'Bebas Neue',sans-serif; font-size:34px; letter-spacing:2px; line-height:1; color:var(--acch); }
  .kpi-sub { font-size:11px; color:var(--txtd); margin-top:4px; }

  /* Info list in sidebar */
  .info-row { display:flex; justify-content:space-between; align-items:center; padding:9px 20px; border-bottom:1px solid rgba(30,45,74,.6); font-size:13px; }
  .info-row:last-child { border-bottom:none; }
  .ir-lbl { color:var(--txtd); font-size:12px; }
  .ir-val { font-family:'Share Tech Mono',monospace; font-weight:600; color:var(--acch); font-size:12px; }

  /* Chatbot */
  .chat-msgs { height:260px; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; scroll-behavior:smooth; }
  .msg { max-width:92%; padding:10px 13px; border-radius:5px; font-size:12.5px; line-height:1.55; animation:fadeIn .3s ease; }
  .msg-bot { background:var(--s2); border:1px solid var(--b1); border-left:3px solid var(--acc); align-self:flex-start; }
  .msg-bot-name { font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:2px; color:var(--acc); margin-bottom:5px; text-transform:uppercase; }
  .msg-user { background:rgba(59,130,246,.08); border:1px solid rgba(59,130,246,.2); align-self:flex-end; }
  .chip-row { display:flex; flex-wrap:wrap; gap:6px; padding:10px 14px; border-top:1px solid var(--b1); }
  .chip { font-size:10px; padding:4px 10px; background:var(--s2); border:1px solid var(--b1); border-radius:20px; color:var(--txtd); cursor:pointer; transition:all .2s; font-family:'Share Tech Mono',monospace; }
  .chip:hover { border-color:var(--acc); color:var(--acc); }
  .chat-bar { display:flex; border-top:1px solid var(--b1); }
  .chat-input { flex:1; background:transparent; border:none; padding:13px 15px; color:var(--txt); font-family:'Outfit',sans-serif; font-size:13px; outline:none; }
  .chat-input::placeholder { color:var(--txtd); opacity:.5; }
  .chat-send { background:var(--acc); border:none; padding:0 16px; color:#fff; font-size:15px; cursor:pointer; transition:background .2s; }
  .chat-send:hover { background:var(--acch); }
  .typing-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--acc); margin:0 2px; animation:blink 1.2s infinite; }
  .typing-dot:nth-child(2){animation-delay:.2s}
  .typing-dot:nth-child(3){animation-delay:.4s}

  /* Topbar */
  .topbar { background:var(--s1); border-bottom:1px solid var(--b1); padding:0 28px; height:58px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
  .topbar-brand { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:4px; background:linear-gradient(90deg,var(--acch),var(--acc)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .t-chip { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--txtd); }
  .t-chip span { color:var(--acch); }

  /* Row dot */
  .row-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .td-inner { display:flex; align-items:center; gap:9px; }

  /* EOQ cards */
  .eoq-cards { display:flex; gap:18px; margin:8px 0 24px; flex-wrap:wrap; justify-content:center; }
  .eoq-card {
    width:205px; background:var(--s1); border:2px solid var(--b1); border-radius:8px;
    padding:24px 20px; cursor:pointer; transition:all .25s; text-align:left; position:relative; overflow:hidden;
  }
  .eoq-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(59,130,246,.07) 0%,transparent 60%); opacity:0; transition:opacity .25s; }
  .eoq-card:hover, .eoq-card.sel { border-color:var(--acc); box-shadow:0 12px 40px rgba(59,130,246,.2); transform:translateY(-3px); }
  .eoq-card:hover::before, .eoq-card.sel::before { opacity:1; }
  .eoq-sel-badge { position:absolute; top:10px; right:10px; background:var(--acc); color:#fff; font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:1px; padding:3px 8px; border-radius:3px; }

  @media(max-width:1100px) {
    .dash-body { grid-template-columns: 1fr !important; }
    .kpi-grid  { grid-template-columns: repeat(2,1fr); }
  }
  @media(max-width:600px) {
    .g2,.g3 { grid-template-columns:1fr; }
    .eoq-card { width:100%; }
    .tbl-summary { flex-direction:column; }
    .ts-item { border-right:none; border-bottom:1px solid var(--b2); }
  }
`;

/* ═══════════════════════════════════════════
   PLANNING ENGINE  — verified against reference table
   
   Week 0  = seed week (opening stock only)
   Week 1+ = active weeks

   FORMULA per week:
     Opening[w]  = Closing[w-1]
     Receipt[w]  = EOQ  if order was placed at week (w - lead),  else 0
     Closing[w]  = Opening[w] + Receipt[w] - Demand[w]

   REORDER RULE  (checked after each week's closing is computed):
     Look ahead  lead + 1  weeks of demand from current closing.
     If projected stock hits safety stock at any point → place order NOW.
     Receipt arrives at  w + lead.
     Skip if a receipt is already scheduled within the look-ahead window.
═══════════════════════════════════════════ */
function computePlan({ weeks, lead, opening, safety, eoq, demands }) {
  const T   = weeks + 1;                        // cols: 0 (seed) .. weeks (active)
  const dem = [0, ...demands.slice(0, weeks)];  // dem[0]=0, dem[1..N]=user input
  const ord = new Array(T).fill(0);
  const rec = new Array(T).fill(0);
  const opn = new Array(T).fill(0);
  const cls = new Array(T).fill(0);

  // ── Seed week ──
  opn[0] = opening;
  cls[0] = opening;

  // ── Forward pass ──
  for (let w = 1; w < T; w++) {
    opn[w] = cls[w - 1];
    rec[w]  = (lead > 0 && w - lead >= 1 && ord[w - lead] > 0) ? eoq : 0;
    cls[w]  = Math.max(0, opn[w] + rec[w] - dem[w]);

    // Skip reorder if a receipt is already coming within the lead window
    let pendingReceipt = false;
    for (let f = w + 1; f <= w + lead && f < T; f++) {
      if (rec[f] > 0 || ord[f] > 0) { pendingReceipt = true; break; }
    }

    if (!pendingReceipt && ord[w] === 0) {
      // Look ahead lead+1 weeks — if stock will hit safety at any point, order now
      let proj = cls[w];
      for (let f = 1; f <= lead + 1; f++) {
        const fw = w + f;
        if (fw < T) proj -= dem[fw];
        if (proj <= safety) {
          ord[w] = eoq;
          if (w + lead < T) rec[w + lead] = eoq;  // pre-register arrival
          break;
        }
      }
    }
  }

  // ── Clean recompute with finalised ord[] ──
  cls[0] = opening;
  for (let w = 1; w < T; w++) {
    opn[w] = cls[w - 1];
    rec[w]  = (lead > 0 && w - lead >= 1 && ord[w - lead] > 0) ? eoq : 0;
    cls[w]  = Math.max(0, opn[w] + rec[w] - dem[w]);
  }

  const orderWeeks  = ord.map((v, i) => (v > 0 ? i : -1)).filter(i => i >= 0);
  const daysOrdered = orderWeeks.length;
  const totalUnits  = daysOrdered * eoq;

  return { opening: opn, demand: dem, order: ord, receipt: rec, closing: cls,
           orderWeeks, daysOrdered, totalUnits, totalCols: T };
}

/* ═══════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
═══════════════════════════════════════════ */
function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function SectionDivider({ children }) {
  return <div className="sec-div">{children}</div>;
}

function GlowBg() {
  return (
    <div style={{
      position: "fixed", top: "40%", left: "50%",
      transform: "translate(-50%,-50%)",
      width: 700, height: 700,
      background: "radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)",
      pointerEvents: "none", animation: "glowPulse 4s ease-in-out infinite",
    }} />
  );
}

/* ═══════════════════════════════════════════
   SCREEN 1 — SETUP
═══════════════════════════════════════════ */
function ScreenSetup({ onNext, savedPlans, onLoadSaved }) {
  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [err, setErr] = useState(false);

  const handleNext = () => {
    if (!product.trim() || !supplier.trim()) { setErr(true); return; }
    setErr(false);
    onNext(product.trim(), supplier.trim());
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: savedPlans.length > 0 ? 860 : 480, display: "flex", gap: 24, alignItems: "flex-start" }}>

        {/* Main setup card */}
        <div style={{ flex: 1 }} className="fade-up">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="mono" style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "var(--acc)", opacity: .8, marginBottom: 12 }}>
              ▶ System Initializing · v2.0
            </div>
            <div className="bebas" style={{
              fontSize: 68, letterSpacing: 4, lineHeight: .95,
              background: "linear-gradient(135deg,var(--acch) 0%,var(--acc) 50%,var(--accg) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>JITHU<br />LOGISTICS</div>
            <div style={{ fontSize: 12, color: "var(--txtd)", letterSpacing: 1, marginTop: 8 }}>InHouse Production Planning System</div>
          </div>

          <div className="glass-card">
            <div className="panel-hdr">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏭</div>
                <div>
                  <div className="bebas" style={{ fontSize: 22, letterSpacing: 2 }}>NEW PROJECT</div>
                  <div style={{ fontSize: 12, color: "var(--txtd)", marginTop: 2 }}>Enter product and supplier details to begin</div>
                </div>
              </div>
            </div>
            <div style={{ padding: 28 }}>
              <FieldGroup label="Product Name">
                <input className="field-input" value={product} onChange={e => setProduct(e.target.value)}
                  placeholder="e.g. Steel Frame Assembly"
                  onKeyDown={e => e.key === "Enter" && handleNext()} />
              </FieldGroup>
              <FieldGroup label="Supplier / Vendor">
                <input className="field-input" value={supplier} onChange={e => setSupplier(e.target.value)}
                  placeholder="e.g. Metro Steel Pvt. Ltd."
                  onKeyDown={e => e.key === "Enter" && handleNext()} />
              </FieldGroup>
              {err && <div className="err-txt">⚠ Please fill in both fields</div>}
              <button className="btn-primary" onClick={handleNext}>START PLANNING →</button>
            </div>
          </div>
        </div>

        {/* Saved plans panel — only shows if there are saved plans */}
        {savedPlans.length > 0 && (
          <div style={{ width: 300, flexShrink: 0 }} className="fade-up">
            <div className="glass-card">
              <div className="panel-hdr">
                <div className="panel-title">SAVED PLANS</div>
                <div className="panel-badge">{savedPlans.length} plan{savedPlans.length > 1 ? "s" : ""}</div>
              </div>
              {savedPlans.map((p, i) => (
                <div key={p.id}
                  onClick={() => onLoadSaved(p)}
                  style={{ padding: "13px 18px", borderBottom: "1px solid var(--b1)", cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, color: "var(--txt)" }}>{p.product}</div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--txtd)", marginBottom: 2 }}>
                    {p.supplier} · {p.params.weeks} wks · EOQ {p.params.eoq}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: "var(--acc)" }}>↩ Load · {p.savedAt}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 2 — WELCOME + MODE SELECT
═══════════════════════════════════════════ */
function ScreenWelcome({ product, supplier, onNext, onBack }) {
  const [mode, setMode] = useState("static");

  const modes = [
    {
      id: "static", icon: "📌", name: "Static EOQ",
      desc: "Pre-determined fixed order quantity. Ideal when EOQ is already known from past analysis.",
    },
    {
      id: "dynamic", icon: "⚡", name: "Dynamic EOQ",
      desc: "System calculates optimal EOQ using ordering cost, holding cost & annual demand formula.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px" }}>
      <GlowBg />

      <div className="mono fade-up" style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: "var(--acc)", marginBottom: 24 }}>
        ▶ SYSTEM READY · WELCOME
      </div>

      <div className="bebas fade-up" style={{ fontSize: "clamp(58px,9vw,108px)", letterSpacing: 6, lineHeight: .92, marginBottom: 28 }}>
        <div style={{ color: "var(--txt)" }}>WELCOME TO</div>
        <div style={{
          background: "linear-gradient(90deg,var(--acch),var(--acc))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>JITHU INHOUSE</div>
        <div style={{ color: "var(--txtd)", fontSize: "44%" }}>LOGISTICS PLANNING SYSTEM</div>
      </div>

      {/* Chips */}
      <div style={{ display: "flex", gap: 18, marginBottom: 36, flexWrap: "wrap", justifyContent: "center" }} className="fade-up">
        {[["Product", product], ["Supplier", supplier]].map(([lbl, val]) => (
          <div key={lbl} style={{ background: "var(--s1)", border: "1px solid var(--b1)", borderRadius: 6, padding: "13px 22px", textAlign: "left" }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: 2, color: "var(--txtd)", textTransform: "uppercase", marginBottom: 4 }}>{lbl}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--acch)" }}>{val}</div>
          </div>
        ))}
      </div>

      <div className="mono" style={{ fontSize: 10, letterSpacing: 4, color: "var(--txtd)", textTransform: "uppercase", marginBottom: 18 }}>
        Select Planning Mode
      </div>

      <div className="eoq-cards">
        {modes.map(m => (
          <div key={m.id} className={`eoq-card${mode === m.id ? " sel" : ""}`} onClick={() => setMode(m.id)}>
            {mode === m.id && <div className="eoq-sel-badge">SELECTED ✓</div>}
            <span style={{ fontSize: 30, marginBottom: 14, display: "block" }}>{m.icon}</span>
            <div className="bebas" style={{ fontSize: 22, letterSpacing: 2, color: "var(--acch)", marginBottom: 8 }}>{m.name}</div>
            <div style={{ fontSize: 12, color: "var(--txtd)", lineHeight: 1.6 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, maxWidth: 440, width: "100%" }}>
        <button className="btn-primary" style={{ background: "var(--s2)", border: "1px solid var(--b2)", color: "var(--txtm)", flex: "0 0 auto", width: "auto", padding: "14px 20px" }} onClick={onBack}>← BACK</button>
        <button className="btn-primary" style={{ flex: 1 }} onClick={() => onNext(mode)}>CONFIGURE PARAMETERS →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 3 — CONFIG
═══════════════════════════════════════════ */
function ScreenConfig({ mode, params, onNext, onBack }) {
  const [form, setForm] = useState({
    weeks:      params?.weeks?.toString()        || "",
    lead:       params?.lead?.toString()         || "",
    opening:    params?.opening?.toString()      || "",
    safety:     params?.safety?.toString()       || "0",
    demands:    params?.demands?.join(", ")      || "",
    eoq:        params?.eoq?.toString()          || "",
    costPerCons:params?.costPerCons?.toString()  || "",
    annDem: "", ordCost: "", hldCost: "", dynCost: "",
  });
  const [err, setErr] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calcEOQ = () => {
    const D = parseFloat(form.annDem), S2 = parseFloat(form.ordCost), H = parseFloat(form.hldCost);
    if (D > 0 && S2 > 0 && H > 0) return Math.round(Math.sqrt((2 * D * S2) / H));
    return null;
  };
  const dynEOQ = mode === "dynamic" ? calcEOQ() : null;

  const handleGenerate = () => {
    const weeks   = parseInt(form.weeks) || 0;
    const lead    = parseInt(form.lead);
    const opening = parseInt(form.opening) || 0;
    const safety  = parseInt(form.safety)  || 0;
    const demandsRaw = form.demands.trim();

    if (!weeks || isNaN(lead) || !demandsRaw) {
      setErr("⚠ Please fill in weeks, lead time, and weekly demands"); return;
    }
    const demands = demandsRaw.split(",").map(d => parseInt(d.trim())).filter(d => !isNaN(d));
    if (demands.length < weeks) {
      setErr(`⚠ Need ${weeks} demand values — got ${demands.length}`); return;
    }

    let eoq, costPerCons;
    if (mode === "static") {
      eoq = parseInt(form.eoq) || 0;
      costPerCons = parseInt(form.costPerCons) || 0;
      if (!eoq || !costPerCons) { setErr("⚠ Enter Fixed EOQ and Cost per Consignment"); return; }
    } else {
      const D = parseFloat(form.annDem), S2 = parseFloat(form.ordCost), H = parseFloat(form.hldCost);
      costPerCons = parseFloat(form.dynCost) || 0;
      if (!D || !S2 || !H || !costPerCons) {
        setErr("⚠ Fill Annual Demand, Ordering Cost, Holding Cost and Cost per Consignment"); return;
      }
      eoq = Math.round(Math.sqrt((2 * D * S2) / H));
    }

    setErr("");
    onNext({ weeks, lead, opening, safety, demands, eoq, costPerCons });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 20px" }}>
      <div style={{ width: "100%", maxWidth: 640 }} className="fade-up">
        <div className="glass-card">
          <div className="panel-hdr">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, background: "rgba(59,130,246,.12)", border: "1px solid rgba(59,130,246,.3)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚙️</div>
              <div>
                <div className="bebas" style={{ fontSize: 22, letterSpacing: 2 }}>PLANNING PARAMETERS</div>
                <div style={{ fontSize: 12, color: "var(--txtd)", marginTop: 2 }}>
                  {mode === "static" ? "Static EOQ — enter fixed order quantity" : "Dynamic EOQ — system calculates EOQ"}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: 28 }}>
            <SectionDivider>Production Basics</SectionDivider>
            <div className="g2">
              <FieldGroup label="Weeks of Production">
                <input className="field-input" type="number" min="2" max="52" value={form.weeks} onChange={e => set("weeks", e.target.value)} placeholder="e.g. 8" />
              </FieldGroup>
              <FieldGroup label="Lead Time (weeks)">
                <input className="field-input" type="number" min="0" max="12" value={form.lead} onChange={e => set("lead", e.target.value)} placeholder="e.g. 1" />
              </FieldGroup>
            </div>
            <div className="g2">
              <FieldGroup label="Opening Stock (units)">
                <input className="field-input" type="number" min="0" value={form.opening} onChange={e => set("opening", e.target.value)} placeholder="e.g. 200" />
              </FieldGroup>
              <FieldGroup label="Safety Stock (units)">
                <input className="field-input" type="number" min="0" value={form.safety} onChange={e => set("safety", e.target.value)} placeholder="e.g. 0" />
              </FieldGroup>
            </div>
            <FieldGroup label="Weekly Demand — comma separated (Wk 1, Wk 2, … Wk N)">
              <input className="field-input" value={form.demands} onChange={e => set("demands", e.target.value)}
                placeholder="e.g. 150, 82, 150, 10, 330, 600, 5, 300" />
              <div className="mono" style={{ fontSize: 10, color: "var(--txtd)", marginTop: 5 }}>
                Count must match weeks of production · Week 0 is the seed week (opening stock only)
              </div>
            </FieldGroup>

            {mode === "static" ? (
              <>
                <SectionDivider>Static EOQ Details</SectionDivider>
                <div className="g2">
                  <FieldGroup label="Fixed EOQ (units)">
                    <input className="field-input" type="number" min="1" value={form.eoq} onChange={e => set("eoq", e.target.value)} placeholder="e.g. 500" />
                  </FieldGroup>
                  <FieldGroup label="Cost per Consignment (₹)">
                    <input className="field-input" type="number" min="0" value={form.costPerCons} onChange={e => set("costPerCons", e.target.value)} placeholder="e.g. 25000" />
                  </FieldGroup>
                </div>
              </>
            ) : (
              <>
                <SectionDivider>Dynamic EOQ — Cost Inputs</SectionDivider>
                <div className="g3">
                  <FieldGroup label="Annual Demand (units)">
                    <input className="field-input" type="number" min="1" value={form.annDem} onChange={e => set("annDem", e.target.value)} placeholder="e.g. 10000" />
                  </FieldGroup>
                  <FieldGroup label="Ordering Cost (₹/order)">
                    <input className="field-input" type="number" min="1" value={form.ordCost} onChange={e => set("ordCost", e.target.value)} placeholder="e.g. 5000" />
                  </FieldGroup>
                  <FieldGroup label="Holding Cost (₹/unit/yr)">
                    <input className="field-input" type="number" min="0.01" step="0.01" value={form.hldCost} onChange={e => set("hldCost", e.target.value)} placeholder="e.g. 20" />
                  </FieldGroup>
                </div>
                {dynEOQ !== null && (
                  <div className="eoq-preview">
                    <div className="mono" style={{ fontSize: 10, letterSpacing: 2, color: "var(--acc)", marginBottom: 6 }}>CALCULATED EOQ (LIVE PREVIEW)</div>
                    <div className="bebas" style={{ fontSize: 42, letterSpacing: 3, color: "var(--acch)" }}>{dynEOQ} units</div>
                    <div style={{ fontSize: 11, color: "var(--txtd)", marginTop: 4 }}>√(2 × Annual Demand × Ordering Cost ÷ Holding Cost)</div>
                  </div>
                )}
                <FieldGroup label="Cost per Consignment (₹)">
                  <input className="field-input" type="number" min="0" value={form.dynCost} onChange={e => set("dynCost", e.target.value)} placeholder="e.g. 5000" />
                </FieldGroup>
              </>
            )}

            {err && <div className="err-txt">{err}</div>}
            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <button className="btn-primary" style={{ background: "var(--s2)", border: "1px solid var(--b2)", color: "var(--txtm)", flex: "0 0 auto", width: "auto", padding: "14px 20px" }} onClick={onBack}>← BACK</button>
              <button className="btn-primary" style={{ flex: 1, marginTop: 0 }} onClick={handleGenerate}>GENERATE PLAN ▶</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PLANNING TABLE
   Col 0 = Week 0 (seed — opening stock only, demand/order/receipt blank)
   Col 1..N = Week 1..N (active production weeks)
═══════════════════════════════════════════ */
function PlanTable({ plan, weeks, eoq, costPerCons }) {
  const totalCost  = plan.daysOrdered * costPerCons;
  const totalCols  = weeks + 1; // 0..weeks

  // Which rows show blank (—) for Week 0
  const blankInW0 = new Set(["demand", "order", "receipt"]);

  const rows = [
    { sno: 1, label: "Opening Stock", dot: "#3b82f6", key: "opening",
      cellClass: (v)       => v === 0 ? "cv-zero" : "cv-open",
      display:   (v)       => v },
    { sno: 2, label: "Demand",        dot: "#f59e0b", key: "demand",
      cellClass: (v, col)  => col === 0 ? "" : v === 0 ? "cv-zero" : "cv-demand",
      display:   (v, col)  => col === 0 ? "—" : v },
    { sno: 3, label: "Order",         dot: "#a78bfa", key: "order",
      cellClass: (v, col)  => col === 0 ? "" : v === 0 ? "cv-zero" : "cv-order",
      display:   (v, col)  => col === 0 ? "—" : v === 0 ? 0 : (plan.orderWeeks.includes(col) ? `★ ${v}` : v) },
    { sno: 4, label: "Receipt",       dot: "#10b981", key: "receipt",
      cellClass: (v, col)  => col === 0 ? "" : v === 0 ? "cv-zero" : "cv-rcpt",
      display:   (v, col)  => col === 0 ? "—" : v },
    { sno: 5, label: "Closing Stock", dot: "#60a5fa", key: "closing",
      cellClass: (v, col)  => col === 0 ? "cv-open" : v === 0 ? "cv-zero" : v < 50 ? "cv-low" : "cv-close",
      display:   (v)       => v },
  ];

  return (
    <div className="glass-card">
      <div className="panel-hdr">
        <div className="panel-title">PRODUCTION SCHEDULE TABLE</div>
        <div className="panel-badge">{eoq} UNITS / ORDER</div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th className="th-sno">S.No</th>
              <th className="th-part">Particulars</th>
              {Array.from({ length: totalCols }, (_, col) => {
                const isStar = plan.orderWeeks.includes(col);
                return (
                  <th key={col} className={isStar ? "th-star" : col === 0 ? "th-seed" : ""}>
                    {isStar ? "★ " : ""}Wk {col}
                    {col === 0 && <div style={{ fontSize: 8, opacity: .5, fontWeight: 400, letterSpacing: 0 }}>(seed)</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.sno}>
                <td className="td-sno">{r.sno}</td>
                <td className="td-part">
                  <div className="td-inner">
                    <span className="row-dot" style={{ background: r.dot }} />
                    {r.label}
                  </div>
                </td>
                {plan[r.key].map((val, col) => (
                  <td key={col} className={r.cellClass(val, col)}
                    style={col === 0 ? { background: "rgba(59,130,246,.04)", borderRight: "1px solid var(--b2)" } : {}}>
                    {r.display(val, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="star-legend">
        <span style={{ color: "var(--star)", fontSize: 14 }}>★</span>
        <span>Star on column header &amp; Order row = order placed that week &nbsp;|&nbsp; Wk 0 = seed week (opening stock only)</span>
      </div>

      {/* BELOW-TABLE SUMMARY — auto-calculated from table */}
      <div className="tbl-summary">
        <div className="ts-item">
          <div className="ts-lbl">No. of Days Ordered ★</div>
          <div className="ts-val ts-val-star">{plan.daysOrdered}</div>
        </div>
        <div className="ts-item">
          <div className="ts-lbl">Cost per Consignment</div>
          <div className="ts-val">₹{costPerCons.toLocaleString("en-IN")}</div>
        </div>
        <div className="ts-item">
          <div className="ts-lbl">Total Cost</div>
          <div className="ts-val">₹{totalCost.toLocaleString("en-IN")}</div>
        </div>
        <div className="ts-item">
          <div className="ts-lbl">Total Units Ordered</div>
          <div className="ts-val">{plan.totalUnits}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHATBOT
═══════════════════════════════════════════ */
function ChatBot({ planContext }) {
  const [msgs, setMsgs] = useState([
    { role: "bot", text: "Plan generated! Ask me about your stock levels, costs, risk weeks, or reorder tips 👇" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const sendMsg = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text: msg }]);
    setLoading(true);

    const history = msgs
      .filter(m => m.role !== "bot" || m !== msgs[0])
      .map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
    history.push({ role: "user", content: msg });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 350,
          system: planContext,
          messages: history.slice(-12),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Could not get a response.";
      setMsgs(m => [...m, { role: "bot", text: reply }]);
    } catch {
      setMsgs(m => [...m, { role: "bot", text: "⚠ Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const chips = ["Stock status?", "Risk weeks?", "Cost breakdown?", "Optimize tips?"];

  return (
    <div className="glass-card">
      <div className="panel-hdr">
        <div className="panel-title">AI INSIGHTS</div>
        <div className="panel-badge">JITHU BOT ●</div>
      </div>

      <div className="chat-msgs">
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role === "bot" ? "msg-bot" : "msg-user"}`}>
            {m.role === "bot" && <div className="msg-bot-name">JITHU BOT</div>}
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="msg msg-bot">
            <div className="msg-bot-name">JITHU BOT</div>
            <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chip-row">
        {chips.map(c => (
          <div key={c} className="chip" onClick={() => sendMsg(c)}>{c}</div>
        ))}
      </div>

      <div className="chat-bar">
        <input
          className="chat-input" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMsg()}
          placeholder="Ask about your plan…"
        />
        <button className="chat-send" onClick={() => sendMsg()}>➤</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN 4 — DASHBOARD
═══════════════════════════════════════════ */
function ScreenDashboard({ product, supplier, mode, params, plan, onBack, onSave, saveFlash, onNewPlan, savedPlans, showSaved, setShowSaved, onLoadSaved }) {
  const { weeks, eoq, costPerCons, lead, safety, opening } = params;
  const totalCost = plan.daysOrdered * costPerCons;
  const avgClose  = Math.round(plan.closing.slice(1).reduce((a, b) => a + b, 0) / weeks);
  const modeLabel = mode === "static" ? "STATIC EOQ" : "DYNAMIC EOQ";

  const kpis = [
    { lbl: "EOQ",               val: eoq,              sub: "units per order",   color: "var(--acch)" },
    { lbl: "Days Ordered ★",    val: plan.daysOrdered,  sub: "order weeks fired", color: "var(--star)" },
    { lbl: "Total Cost",        val: `₹${totalCost.toLocaleString("en-IN")}`, sub: "₹ procurement", color: "var(--acch)", small: true },
    { lbl: "Avg Closing Stock", val: avgClose,          sub: "units avg",         color: "var(--acch)" },
  ];

  const paramRows = [
    ["EOQ",                eoq + " units"],
    ["Lead Time",          lead + " week(s)"],
    ["Safety Stock",       safety + " units"],
    ["Opening Stock",      opening + " units"],
    ["Weeks Planned",      weeks],
    ["★ Order Weeks",      plan.orderWeeks.length ? plan.orderWeeks.map(w => "Wk " + w).join(", ") : "None"],
    ["Days Ordered",       plan.daysOrdered],
    ["Total Units Ordered",plan.totalUnits],
    ["Cost / Consignment", "₹" + costPerCons.toLocaleString("en-IN")],
    ["Total Cost",         "₹" + totalCost.toLocaleString("en-IN")],
    ["Avg Closing Stock",  avgClose + " units"],
  ];

  const planContext = `You are JITHU BOT, a logistics AI assistant inside the Jithu InHouse Logistics Planning System.

Plan data:
- Product: ${product} | Supplier: ${supplier}
- Mode: ${mode} | EOQ: ${eoq} units
- Weeks: ${weeks} | Lead Time: ${lead} wk | Safety Stock: ${safety} units | Opening: ${opening}
- Weekly Demands: ${JSON.stringify(plan.demand)}
- Orders (by week): ${JSON.stringify(plan.order)}
- Receipts (by week): ${JSON.stringify(plan.receipt)}
- Closing Stocks (by week): ${JSON.stringify(plan.closing)}
- Order weeks (★): ${JSON.stringify(plan.orderWeeks)}
- Days Ordered: ${plan.daysOrdered} | Total Units: ${plan.totalUnits} | Total Cost: ₹${totalCost}
- Cost per Consignment: ₹${costPerCons} | Avg Closing Stock: ${avgClose}

Answer concisely under 90 words unless detail is asked. Flag stock-out risks, reorder suggestions, cost optimizations.`;

  const exportCSV = () => {
    let csv = `Jithu InHouse Logistics — ${product}\n`;
    csv += `S.No,Particulars,` + Array.from({ length: weeks }, (_, i) =>
      plan.orderWeeks.includes(i) ? `★ Wk ${i}` : `Wk ${i}`).join(",") + "\n";
    [["1","Opening Stock",plan.opening],["2","Demand",plan.demand],
     ["3","Order",plan.order],["4","Receipt",plan.receipt],["5","Closing Stock",plan.closing]]
      .forEach(([n, l, d]) => { csv += `${n},${l},${d.join(",")}\n`; });
    csv += `\n--- SUMMARY ---\nNo. of Days Ordered,${plan.daysOrdered}\nCost per Consignment,₹${costPerCons}\nTotal Cost,₹${totalCost}\nTotal Units Ordered,${plan.totalUnits}\nEOQ,${eoq}\n`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `jithu-logistics-${product.replace(/\s+/g, "-")}.csv`;
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-brand">◈ JITHU LOGISTICS</div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <span className="t-chip">Product: <span>{product}</span></span>
          <span className="t-chip">Supplier: <span>{supplier}</span></span>
          <span className="t-chip">Mode: <span>{modeLabel}</span></span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn-sm btn-outline" onClick={onBack}>← BACK</button>
          <button className="btn-sm btn-outline" onClick={onNewPlan}>＋ NEW PLAN</button>
          {savedPlans.length > 0 && (
            <button className="btn-sm btn-outline" onClick={() => setShowSaved(s => !s)}
              style={{ position: "relative" }}>
              📋 SAVED ({savedPlans.length})
            </button>
          )}
          <button className="btn-sm" onClick={onSave}
            style={{
              background: saveFlash ? "var(--green)" : "rgba(59,130,246,.15)",
              border: `1px solid ${saveFlash ? "var(--green)" : "var(--acc)"}`,
              color: saveFlash ? "#fff" : "var(--acc)",
              transition: "all .3s",
            }}>
            {saveFlash ? "✓ SAVED!" : "💾 SAVE"}
          </button>
          <button className="btn-sm btn-blue" onClick={exportCSV}>⬇ EXPORT</button>
        </div>
      </div>

      {/* Saved plans dropdown */}
      {showSaved && savedPlans.length > 0 && (
        <div style={{
          position: "fixed", top: 58, right: 16, width: 300, zIndex: 200,
          background: "var(--s1)", border: "1px solid var(--b2)",
          borderRadius: 8, boxShadow: "0 16px 48px rgba(0,0,0,.5)",
          overflow: "hidden", animation: "fadeIn .2s ease",
        }}>
          <div className="panel-hdr" style={{ padding: "12px 18px" }}>
            <div className="panel-title" style={{ fontSize: 14 }}>SAVED PLANS</div>
            <div style={{ cursor: "pointer", color: "var(--txtd)", fontSize: 18 }} onClick={() => setShowSaved(false)}>×</div>
          </div>
          {savedPlans.map(p => (
            <div key={p.id}
              onClick={() => { onLoadSaved(p); setShowSaved(false); }}
              style={{ padding: "12px 18px", borderBottom: "1px solid var(--b1)", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{p.product}</div>
              <div className="mono" style={{ fontSize: 10, color: "var(--txtd)" }}>
                {p.supplier} · {p.params.weeks} wks · EOQ {p.params.eoq}
              </div>
              <div className="mono" style={{ fontSize: 10, color: "var(--acc)", marginTop: 2 }}>↩ Load · {p.savedAt}</div>
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="dash-body" style={{ padding: 26, display: "grid", gridTemplateColumns: "1fr 330px", gap: 20, alignItems: "start" }}>

        {/* Main column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* KPIs */}
          <div className="kpi-grid">
            {kpis.map((k, i) => (
              <div key={i} className="kpi-card">
                <div className="kpi-lbl">{k.lbl}</div>
                <div className="kpi-val" style={{ color: k.color, fontSize: k.small ? 22 : 34 }}>{k.val}</div>
                <div className="kpi-sub">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <PlanTable plan={plan} weeks={weeks} eoq={eoq} costPerCons={costPerCons} />
        </div>

        {/* Side column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Params */}
          <div className="glass-card">
            <div className="panel-hdr">
              <div className="panel-title">PARAMETERS</div>
              <div className="panel-badge">{modeLabel}</div>
            </div>
            <div>
              {paramRows.map(([l, v]) => (
                <div key={l} className="info-row">
                  <span className="ir-lbl">{l}</span>
                  <span className="ir-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chatbot */}
          <ChatBot planContext={planContext} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SAVED PLANS SIDEBAR
═══════════════════════════════════════════ */
function SavedPlansDrawer({ plans, onLoad, onClose }) {
  if (plans.length === 0) return (
    <div style={{ padding: "24px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
      <div className="mono" style={{ fontSize: 11, color: "var(--txtd)", letterSpacing: 1 }}>No saved plans yet</div>
    </div>
  );
  return (
    <div>
      {plans.map((p, i) => (
        <div key={i}
          onClick={() => { onLoad(p); onClose(); }}
          style={{
            padding: "14px 20px", borderBottom: "1px solid var(--b1)",
            cursor: "pointer", transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{p.product}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--txtd)" }}>
            {p.supplier} · {p.params.weeks}wk · EOQ {p.params.eoq} · {p.mode.toUpperCase()}
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--acc)", marginTop: 3 }}>
            Saved {p.savedAt}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen]     = useState("setup");
  const [product, setProduct]   = useState("");
  const [supplier, setSupplier] = useState("");
  const [mode, setMode]         = useState("static");
  const [params, setParams]     = useState(null);
  const [plan, setPlan]         = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [showSaved, setShowSaved]   = useState(false);
  const [saveFlash, setSaveFlash]   = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSetup    = (p, s)  => { setProduct(p); setSupplier(s); setScreen("welcome"); };
  const handleMode     = (m)     => { setMode(m); setScreen("config"); };
  const handleGenerate = (p)     => { setParams(p); setPlan(computePlan(p)); setScreen("dashboard"); };

  // Back navigation per screen
  const handleBack = () => {
    if (screen === "welcome")   setScreen("setup");
    if (screen === "config")    setScreen("welcome");
    if (screen === "dashboard") setScreen("config");
  };

  // Save current plan
  const handleSave = () => {
    const now = new Date();
    const savedAt = `${now.getDate()}/${now.getMonth()+1} ${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
    setSavedPlans(prev => [{
      product, supplier, mode, params, plan, savedAt,
      id: Date.now(),
    }, ...prev]);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  // Load a saved plan
  const handleLoad = (saved) => {
    setProduct(saved.product);
    setSupplier(saved.supplier);
    setMode(saved.mode);
    setParams(saved.params);
    setPlan(saved.plan);
    setScreen("dashboard");
  };

  // New plan — go back to setup but keep saved plans
  const handleNewPlan = () => {
    setProduct(""); setSupplier(""); setMode("static");
    setParams(null); setPlan(null); setScreen("setup");
  };

  return (
    <>
      {screen === "setup" && (
        <ScreenSetup onNext={handleSetup} savedPlans={savedPlans} onLoadSaved={handleLoad} />
      )}
      {screen === "welcome" && (
        <ScreenWelcome product={product} supplier={supplier} onNext={handleMode} onBack={handleBack} />
      )}
      {screen === "config" && (
        <ScreenConfig mode={mode} params={params} onNext={handleGenerate} onBack={handleBack} />
      )}
      {screen === "dashboard" && plan && (
        <ScreenDashboard
          product={product} supplier={supplier}
          mode={mode} params={params} plan={plan}
          onBack={handleBack}
          onSave={handleSave}
          saveFlash={saveFlash}
          onNewPlan={handleNewPlan}
          savedPlans={savedPlans}
          showSaved={showSaved}
          setShowSaved={setShowSaved}
          onLoadSaved={handleLoad}
        />
      )}
    </>
  );
}
