import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&family=Outfit:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:     #04080f;
    --s1:     #0b1120;
    --s2:     #111827;
    --s3:     #1a2234;
    --b1:     #1e2d47;
    --b2:     #2a3f5e;
    --acc:    #3b82f6;
    --acch:   #60a5fa;
    --accg:   #1d4ed8;
    --amber:  #f59e0b;
    --green:  #10b981;
    --violet: #a78bfa;
    --red:    #ef4444;
    --txt:    #e2e8f0;
    --txtd:   #64748b;
    --txtm:   #94a3b8;
    --star:   #fbbf24;
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

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--s1); }
  ::-webkit-scrollbar-thumb { background: var(--b2); border-radius: 4px; }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
  @keyframes glowPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes blink     { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
  @keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

  .fade-up { animation: fadeUp .5s ease both; }
  .fade-in { animation: fadeIn .4s ease both; }

  .mono  { font-family: 'Share Tech Mono', monospace; }
  .bebas { font-family: 'Bebas Neue', sans-serif; }

  .glass-card {
    background: var(--s1); border: 1px solid var(--b1);
    border-radius: 10px; overflow: hidden;
    box-shadow: 0 0 60px rgba(59,130,246,.06);
  }

  .panel-hdr {
    padding: 15px 22px; background: var(--s2);
    border-bottom: 1px solid var(--b1);
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-title { font-family:'Bebas Neue',sans-serif; font-size:17px; letter-spacing:2px; color:var(--txt); }
  .panel-badge {
    font-family:'Share Tech Mono',monospace; font-size:10px;
    background:rgba(59,130,246,.1); color:var(--acch);
    border:1px solid rgba(59,130,246,.25); padding:3px 10px; border-radius:3px;
  }

  .field-label {
    display:block; font-family:'Share Tech Mono',monospace;
    font-size:10px; letter-spacing:2px; text-transform:uppercase;
    color:var(--txtd); margin-bottom:7px;
  }
  .field-input {
    width:100%; background:var(--s2); border:1px solid var(--b1); border-radius:6px;
    padding:12px 15px; color:var(--txt); font-family:'Outfit',sans-serif; font-size:14px;
    outline:none; transition:border-color .2s, box-shadow .2s;
  }
  .field-input:focus { border-color:var(--acc); box-shadow:0 0 0 3px rgba(59,130,246,.12); }
  .field-input::placeholder { color:var(--txtd); opacity:.5; }

  select.field-input { cursor:pointer; }
  select.field-input option { background:var(--s2); }

  .btn-primary {
    width:100%; padding:14px; background:var(--acc); color:#fff;
    border:none; border-radius:6px; font-family:'Share Tech Mono',monospace;
    font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;
    cursor:pointer; transition:all .2s; margin-top:6px;
  }
  .btn-primary:hover { background:var(--acch); transform:translateY(-1px); box-shadow:0 8px 28px rgba(59,130,246,.35); }
  .btn-ghost {
    width:100%; padding:14px; background:transparent; color:var(--txtm);
    border:1px solid var(--b2); border-radius:6px; font-family:'Share Tech Mono',monospace;
    font-size:12px; letter-spacing:2px; cursor:pointer; transition:all .2s; margin-top:6px;
  }
  .btn-ghost:hover { border-color:var(--acc); color:var(--acc); }
  .btn-sm {
    padding:7px 14px; border-radius:5px; font-family:'Share Tech Mono',monospace;
    font-size:10px; font-weight:600; letter-spacing:1px; cursor:pointer; border:none; transition:all .2s;
  }
  .btn-outline { background:transparent; border:1px solid var(--b1); color:var(--txtd); }
  .btn-outline:hover { border-color:var(--acc); color:var(--acc); }
  .btn-blue { background:var(--acc); color:#fff; }
  .btn-blue:hover { background:var(--acch); box-shadow:0 4px 16px rgba(59,130,246,.3); }

  .g2 { display:grid; grid-template-columns:1fr 1fr; gap:15px; }
  .g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

  .sec-div {
    font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:3px;
    text-transform:uppercase; color:var(--acc);
    display:flex; align-items:center; gap:12px; margin:22px 0 16px;
  }
  .sec-div::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,var(--b2),transparent); }

  .err-txt { font-family:'Share Tech Mono',monospace; font-size:11px; color:var(--red); margin-top:8px; }

  .eoq-preview {
    background:rgba(59,130,246,.07); border:1px solid rgba(59,130,246,.25);
    border-radius:6px; padding:14px 18px; margin-bottom:16px; animation:fadeIn .3s ease;
  }

  /* TABLE */
  .tbl-wrap { overflow-x:auto; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  thead tr { background:var(--s3); border-bottom:2px solid var(--acc); }
  thead th {
    font-family:'Share Tech Mono',monospace; font-size:10px; letter-spacing:1.5px;
    text-transform:uppercase; color:var(--txtd); padding:12px 13px; text-align:center; white-space:nowrap;
  }
  thead th.th-sno { width:46px; }
  thead th.th-part { text-align:left; padding-left:20px; min-width:148px; }
  thead th.th-star { color:var(--star); }
  thead th.th-seed { color:var(--b2); }
  tbody tr { border-bottom:1px solid rgba(30,45,74,.8); transition:background .15s; }
  tbody tr:hover { background:rgba(59,130,246,.03); }
  tbody td { padding:12px 13px; text-align:center; font-family:'Share Tech Mono',monospace; font-size:12px; }
  tbody td.td-sno { font-size:11px; color:var(--txtd); }
  tbody td.td-part { text-align:left; padding-left:20px; font-family:'Outfit',sans-serif; font-weight:500; color:var(--txtm); font-size:13px; }
  .cv-open   { color:var(--acch); }
  .cv-demand { color:var(--amber); font-weight:700; }
  .cv-order  { color:var(--violet); font-weight:700; }
  .cv-rcpt   { color:var(--green); font-weight:600; }
  .cv-close  { color:var(--txt); }
  .cv-low    { color:var(--red); font-weight:700; }
  .cv-zero   { color:var(--b2); }

  .tbl-summary { display:flex; background:var(--s3); border-top:2px solid var(--acc); }
  .ts-item { flex:1; padding:15px 16px; border-right:1px solid var(--b2); text-align:center; }
  .ts-item:last-child { border-right:none; }
  .ts-lbl { font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--txtd); margin-bottom:7px; }
  .ts-val { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:2px; color:var(--acch); }
  .ts-val-star { color:var(--star); }
  .star-legend { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--txtd); padding:9px 20px; border-top:1px solid var(--b1); display:flex; align-items:center; gap:8px; background:var(--s1); }

  /* KPI */
  .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
  .kpi-card { background:var(--s1); border:1px solid var(--b1); border-radius:7px; padding:18px; position:relative; overflow:hidden; }
  .kpi-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--acc),transparent); }
  .kpi-lbl { font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--txtd); margin-bottom:10px; }
  .kpi-val { font-family:'Bebas Neue',sans-serif; font-size:34px; letter-spacing:2px; line-height:1; color:var(--acch); }
  .kpi-sub { font-size:11px; color:var(--txtd); margin-top:4px; }

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

  .row-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .td-inner { display:flex; align-items:center; gap:9px; }

  .eoq-cards { display:flex; gap:18px; margin:8px 0 24px; flex-wrap:wrap; justify-content:center; }
  .eoq-card {
    width:205px; background:var(--s1); border:2px solid var(--b1); border-radius:8px;
    padding:24px 20px; cursor:pointer; transition:all .25s; text-align:left; position:relative; overflow:hidden;
  }
  .eoq-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(59,130,246,.07) 0%,transparent 60%); opacity:0; transition:opacity .25s; }
  .eoq-card:hover,.eoq-card.sel { border-color:var(--acc); box-shadow:0 12px 40px rgba(59,130,246,.2); transform:translateY(-3px); }
  .eoq-card:hover::before,.eoq-card.sel::before { opacity:1; }
  .eoq-sel-badge { position:absolute; top:10px; right:10px; background:var(--acc); color:#fff; font-family:'Share Tech Mono',monospace; font-size:9px; letter-spacing:1px; padding:3px 8px; border-radius:3px; }

  /* Company cards on landing */
  .company-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
  .company-card {
    background:var(--s1); border:1px solid var(--b1); border-radius:10px;
    padding:22px; cursor:pointer; transition:all .25s; position:relative; overflow:hidden;
  }
  .company-card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(59,130,246,.05),transparent); opacity:0; transition:opacity .25s; }
  .company-card:hover { border-color:var(--acc); transform:translateY(-3px); box-shadow:0 16px 48px rgba(59,130,246,.15); }
  .company-card:hover::before { opacity:1; }
  .company-card-icon { width:48px; height:48px; background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.25); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:14px; }
  .company-card-name { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:2px; color:var(--txt); margin-bottom:4px; }
  .company-card-meta { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--txtd); margin-bottom:3px; }
  .company-card-badge { display:inline-block; margin-top:10px; font-family:'Share Tech Mono',monospace; font-size:9px; background:rgba(59,130,246,.1); color:var(--acch); border:1px solid rgba(59,130,246,.2); padding:3px 10px; border-radius:20px; }

  /* Schedule cards in company dashboard */
  .sched-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
  .sched-card {
    background:var(--s2); border:1px solid var(--b1); border-radius:8px;
    padding:18px; cursor:pointer; transition:all .2s; position:relative;
  }
  .sched-card:hover { border-color:var(--acc); background:var(--s1); box-shadow:0 8px 32px rgba(59,130,246,.12); }
  .sched-card-product { font-weight:700; font-size:15px; color:var(--txt); margin-bottom:4px; }
  .sched-card-supplier { font-size:12px; color:var(--txtd); margin-bottom:12px; }
  .sched-card-stat { display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px; }
  .sched-card-stat-lbl { color:var(--txtd); }
  .sched-card-stat-val { font-family:'Share Tech Mono',monospace; color:var(--acch); font-weight:600; }
  .sched-card-date { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--txtd); margin-top:10px; padding-top:10px; border-top:1px solid var(--b1); }

  /* Company dashboard header */
  .co-header {
    background: linear-gradient(135deg, var(--s1) 0%, var(--s2) 100%);
    border-bottom: 1px solid var(--b1);
    padding: 32px 36px;
  }

  @media(max-width:1100px) {
    .dash-body { grid-template-columns:1fr !important; }
    .kpi-grid  { grid-template-columns:repeat(2,1fr); }
  }
  @media(max-width:700px) {
    .g2,.g3 { grid-template-columns:1fr; }
    .eoq-card { width:100%; }
    .tbl-summary { flex-direction:column; }
    .ts-item { border-right:none; border-bottom:1px solid var(--b2); }
    .company-grid { grid-template-columns:1fr; }
    .kpi-grid { grid-template-columns:repeat(2,1fr); }
  }
`;

/* ═══════════════════════════════════════════
   PLANNING ENGINE
═══════════════════════════════════════════ */
function computePlan({ weeks, lead, opening, safety, eoq, demands }) {
  const T   = weeks + 1;
  const dem = [0, ...demands.slice(0, weeks)];
  const ord = new Array(T).fill(0);
  const rec = new Array(T).fill(0);
  const opn = new Array(T).fill(0);
  const cls = new Array(T).fill(0);

  opn[0] = opening; cls[0] = opening;

  for (let w = 1; w < T; w++) {
    opn[w] = cls[w - 1];
    rec[w]  = (lead > 0 && w - lead >= 1 && ord[w - lead] > 0) ? eoq : 0;
    cls[w]  = Math.max(0, opn[w] + rec[w] - dem[w]);

    let pendingReceipt = false;
    for (let f = w + 1; f <= w + lead && f < T; f++) {
      if (rec[f] > 0 || ord[f] > 0) { pendingReceipt = true; break; }
    }

    if (!pendingReceipt && ord[w] === 0) {
      let proj = cls[w];
      for (let f = 1; f <= lead + 1; f++) {
        const fw = w + f;
        if (fw < T) proj -= dem[fw];
        if (proj <= safety) {
          ord[w] = eoq;
          if (w + lead < T) rec[w + lead] = eoq;
          break;
        }
      }
    }
  }

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
   HELPERS
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
      position:"fixed", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
      width:700, height:700,
      background:"radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)",
      pointerEvents:"none", animation:"glowPulse 4s ease-in-out infinite",
    }} />
  );
}
function fmt(n) { return Number(n).toLocaleString("en-IN"); }
function nowStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

/* ═══════════════════════════════════════════
   SCREEN A — LANDING (company select)
═══════════════════════════════════════════ */
function ScreenLanding({ companies, onSelect, onRegister }) {
  return (
    <div style={{ minHeight:"100vh", padding:"60px 40px" }}>
      <GlowBg />

      {/* Brand */}
      <div style={{ textAlign:"center", marginBottom:56 }} className="fade-up">
        <div className="mono" style={{ fontSize:10, letterSpacing:5, color:"var(--acc)", opacity:.8, marginBottom:14 }}>
          ▶ SYSTEM READY · v3.0
        </div>
        <div className="bebas" style={{
          fontSize:"clamp(52px,8vw,96px)", letterSpacing:6, lineHeight:.92,
          background:"linear-gradient(135deg,var(--acch) 0%,var(--acc) 50%,var(--accg) 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        }}>
          JITHU INHOUSE<br />LOGISTICS
        </div>
        <div style={{ fontSize:13, color:"var(--txtd)", letterSpacing:2, marginTop:10 }}>
          Production Planning System
        </div>
      </div>

      {companies.length === 0 ? (
        /* No companies yet */
        <div style={{ maxWidth:480, margin:"0 auto", textAlign:"center" }} className="fade-up">
          <div style={{ fontSize:64, marginBottom:20 }}>🏭</div>
          <div className="bebas" style={{ fontSize:28, letterSpacing:3, color:"var(--txtm)", marginBottom:10 }}>
            No Companies Registered
          </div>
          <div style={{ fontSize:13, color:"var(--txtd)", marginBottom:32 }}>
            Register your first company to start planning
          </div>
          <button className="btn-primary" onClick={onRegister}>
            ＋ REGISTER COMPANY
          </button>
        </div>
      ) : (
        <div style={{ maxWidth:1100, margin:"0 auto" }} className="fade-up">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
            <div>
              <div className="bebas" style={{ fontSize:22, letterSpacing:3, color:"var(--txt)" }}>
                SELECT COMPANY
              </div>
              <div style={{ fontSize:12, color:"var(--txtd)", marginTop:3 }}>
                {companies.length} registered · click to open dashboard
              </div>
            </div>
            <button className="btn-sm btn-blue" onClick={onRegister}>＋ NEW COMPANY</button>
          </div>

          <div className="company-grid">
            {companies.map(c => (
              <div key={c.id} className="company-card" onClick={() => onSelect(c)}>
                <div className="company-card-icon">🏭</div>
                <div className="company-card-name">{c.name}</div>
                <div className="company-card-meta">{c.industry}</div>
                <div className="company-card-meta">Est. {c.year}</div>
                <div className="company-card-badge">
                  {c.schedules?.length || 0} schedule{(c.schedules?.length || 0) !== 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN B — COMPANY REGISTRATION
═══════════════════════════════════════════ */
const INDUSTRIES = [
  "Manufacturing","Automotive","Electronics","Pharmaceuticals",
  "Food & Beverage","Textile","Construction","Chemical","Logistics","Other",
];

function ScreenRegister({ onDone, onBack }) {
  const [form, setForm] = useState({ name:"", industry:"Manufacturing", year:"" });
  const [err, setErr]   = useState("");
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const handle = () => {
    if (!form.name.trim()) { setErr("⚠ Company name is required"); return; }
    if (!form.year || isNaN(+form.year) || +form.year < 1900 || +form.year > new Date().getFullYear()) {
      setErr("⚠ Enter a valid year of establishment"); return;
    }
    setErr("");
    onDone({ id: Date.now(), name: form.name.trim(), industry: form.industry, year: form.year, schedules: [] });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <GlowBg />
      <div style={{ width:"100%", maxWidth:520 }} className="fade-up">

        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div className="bebas" style={{
            fontSize:64, letterSpacing:4, lineHeight:.92,
            background:"linear-gradient(135deg,var(--acch),var(--acc))",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>JITHU<br />LOGISTICS</div>
          <div style={{ fontSize:12, color:"var(--txtd)", letterSpacing:1, marginTop:8 }}>InHouse Production Planning System</div>
        </div>

        <div className="glass-card">
          <div className="panel-hdr">
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.3)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏭</div>
              <div>
                <div className="bebas" style={{ fontSize:22, letterSpacing:2 }}>COMPANY REGISTRATION</div>
                <div style={{ fontSize:12, color:"var(--txtd)", marginTop:2 }}>Set up your organisation profile</div>
              </div>
            </div>
          </div>

          <div style={{ padding:28 }}>
            <FieldGroup label="Company Name">
              <input className="field-input" value={form.name} onChange={e => set("name", e.target.value)}
                placeholder="e.g. Jithu Industries Pvt. Ltd."
                onKeyDown={e => e.key === "Enter" && handle()} />
            </FieldGroup>

            <div className="g2">
              <FieldGroup label="Industry / Sector">
                <select className="field-input" value={form.industry} onChange={e => set("industry", e.target.value)}>
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="Year of Establishment">
                <input className="field-input" type="number" min="1900" max={new Date().getFullYear()}
                  value={form.year} onChange={e => set("year", e.target.value)}
                  placeholder={`e.g. ${new Date().getFullYear() - 10}`} />
              </FieldGroup>
            </div>

            {err && <div className="err-txt">{err}</div>}
            <button className="btn-primary" onClick={handle}>REGISTER ＋</button>
            {onBack && <button className="btn-ghost" onClick={onBack}>← BACK TO COMPANIES</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN C — COMPANY DASHBOARD
═══════════════════════════════════════════ */
function ScreenCompanyDash({ company, onNewSchedule, onOpenSchedule, onBack, onDeleteSchedule }) {
  const schedules = company.schedules || [];
  const age = new Date().getFullYear() - parseInt(company.year);

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-brand">◈ JITHU LOGISTICS</div>
        <div style={{ display:"flex", gap:20, alignItems:"center" }}>
          <span className="t-chip">Company: <span>{company.name}</span></span>
          <span className="t-chip">Industry: <span>{company.industry}</span></span>
        </div>
        <button className="btn-sm btn-outline" onClick={onBack}>← ALL COMPANIES</button>
      </div>

      {/* Company header */}
      <div className="co-header">
        <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:20 }}>
          <div>
            <div className="mono" style={{ fontSize:10, letterSpacing:3, color:"var(--acc)", marginBottom:8 }}>
              COMPANY DASHBOARD
            </div>
            <div className="bebas" style={{ fontSize:48, letterSpacing:4, color:"var(--txt)", lineHeight:1 }}>
              {company.name}
            </div>
            <div style={{ display:"flex", gap:24, marginTop:12, flexWrap:"wrap" }}>
              {[
                ["Industry", company.industry],
                ["Est.", company.year],
                ["Operating", `${age} yr${age !== 1 ? "s" : ""}`],
                ["Schedules", schedules.length],
              ].map(([l,v]) => (
                <div key={l}>
                  <div className="mono" style={{ fontSize:9, letterSpacing:2, color:"var(--txtd)", marginBottom:3 }}>{l}</div>
                  <div style={{ fontSize:15, fontWeight:600, color:"var(--acch)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <button className="btn-sm btn-blue" style={{ padding:"12px 24px", fontSize:12 }} onClick={onNewSchedule}>
            ＋ NEW SCHEDULE
          </button>
        </div>
      </div>

      {/* Schedules */}
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 36px" }}>
        {schedules.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:52, marginBottom:16 }}>📋</div>
            <div className="bebas" style={{ fontSize:26, letterSpacing:3, color:"var(--txtm)", marginBottom:8 }}>
              No Schedules Yet
            </div>
            <div style={{ fontSize:13, color:"var(--txtd)", marginBottom:28 }}>
              Create your first production schedule for {company.name}
            </div>
            <button className="btn-primary" style={{ maxWidth:260, margin:"0 auto" }} onClick={onNewSchedule}>
              ＋ CREATE FIRST SCHEDULE
            </button>
          </div>
        ) : (
          <>
            <div className="mono" style={{ fontSize:10, letterSpacing:3, color:"var(--txtd)", marginBottom:18 }}>
              {schedules.length} SAVED SCHEDULE{schedules.length !== 1 ? "S" : ""} — click to open
            </div>
            <div className="sched-grid">
              {schedules.map(s => (
                <div key={s.id} className="sched-card" onClick={() => onOpenSchedule(s)}>
                  <div style={{ position:"absolute", top:12, right:12 }}>
                    <div onClick={e => { e.stopPropagation(); onDeleteSchedule(s.id); }}
                      style={{ width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center",
                        background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.2)",
                        borderRadius:4, cursor:"pointer", fontSize:11, color:"var(--red)" }}
                      title="Delete schedule">✕</div>
                  </div>

                  <div className="sched-card-product">{s.product}</div>
                  <div className="sched-card-supplier">{s.supplier}</div>

                  <div className="sched-card-stat">
                    <span className="sched-card-stat-lbl">Total Cost</span>
                    <span className="sched-card-stat-val">₹{fmt(s.totalCost)}</span>
                  </div>
                  <div className="sched-card-stat">
                    <span className="sched-card-stat-lbl">EOQ</span>
                    <span className="sched-card-stat-val">{s.eoq} units</span>
                  </div>
                  <div className="sched-card-stat">
                    <span className="sched-card-stat-lbl">Weeks</span>
                    <span className="sched-card-stat-val">{s.weeks} wks</span>
                  </div>
                  <div className="sched-card-stat">
                    <span className="sched-card-stat-lbl">Mode</span>
                    <span className="sched-card-stat-val">{s.mode.toUpperCase()}</span>
                  </div>

                  <div className="sched-card-date">Saved {s.savedAt}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN D — PRODUCT + SUPPLIER SETUP
═══════════════════════════════════════════ */
function ScreenSetup({ company, onNext, onBack }) {
  const [product, setProduct]   = useState("");
  const [supplier, setSupplier] = useState("");
  const [err, setErr]           = useState(false);

  const handle = () => {
    if (!product.trim() || !supplier.trim()) { setErr(true); return; }
    setErr(false);
    onNext(product.trim(), supplier.trim());
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
      <GlowBg />
      <div style={{ width:"100%", maxWidth:520 }} className="fade-up">

        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div className="mono" style={{ fontSize:10, letterSpacing:4, color:"var(--acc)", marginBottom:10 }}>
            {company.name} · NEW SCHEDULE
          </div>
          <div className="bebas" style={{ fontSize:42, letterSpacing:4, color:"var(--txt)" }}>
            PRODUCT SETUP
          </div>
        </div>

        <div className="glass-card">
          <div className="panel-hdr">
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.3)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📦</div>
              <div>
                <div className="bebas" style={{ fontSize:20, letterSpacing:2 }}>PRODUCT & SUPPLIER</div>
                <div style={{ fontSize:12, color:"var(--txtd)", marginTop:2 }}>Enter details for this schedule</div>
              </div>
            </div>
          </div>
          <div style={{ padding:28 }}>
            <FieldGroup label="Product Name">
              <input className="field-input" value={product} onChange={e => setProduct(e.target.value)}
                placeholder="e.g. Steel Frame Assembly"
                onKeyDown={e => e.key === "Enter" && handle()} />
            </FieldGroup>
            <FieldGroup label="Supplier / Vendor">
              <input className="field-input" value={supplier} onChange={e => setSupplier(e.target.value)}
                placeholder="e.g. Metro Steel Pvt. Ltd."
                onKeyDown={e => e.key === "Enter" && handle()} />
            </FieldGroup>
            {err && <div className="err-txt">⚠ Please fill in both fields</div>}
            <button className="btn-primary" onClick={handle}>SELECT EOQ MODE →</button>
            <button className="btn-ghost" onClick={onBack}>← BACK</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN E — EOQ MODE
═══════════════════════════════════════════ */
function ScreenMode({ product, supplier, onNext, onBack }) {
  const [mode, setMode] = useState("static");

  const modes = [
    { id:"static",  icon:"📌", name:"Static EOQ",  desc:"Pre-determined fixed order quantity. Ideal when EOQ is already known." },
    { id:"dynamic", icon:"⚡", name:"Dynamic EOQ", desc:"System calculates optimal EOQ using cost formula √(2DS/H)." },
  ];

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"60px 24px" }}>
      <GlowBg />

      <div className="mono fade-up" style={{ fontSize:11, letterSpacing:5, color:"var(--acc)", marginBottom:20 }}>
        ▶ {product} · {supplier}
      </div>

      <div className="bebas fade-up" style={{ fontSize:"clamp(42px,7vw,80px)", letterSpacing:5, lineHeight:.92, marginBottom:32 }}>
        <div style={{ color:"var(--txt)" }}>SELECT PLANNING</div>
        <div style={{ background:"linear-gradient(90deg,var(--acch),var(--acc))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>MODE</div>
      </div>

      <div className="eoq-cards">
        {modes.map(m => (
          <div key={m.id} className={`eoq-card${mode === m.id ? " sel" : ""}`} onClick={() => setMode(m.id)}>
            {mode === m.id && <div className="eoq-sel-badge">SELECTED ✓</div>}
            <span style={{ fontSize:30, marginBottom:14, display:"block" }}>{m.icon}</span>
            <div className="bebas" style={{ fontSize:22, letterSpacing:2, color:"var(--acch)", marginBottom:8 }}>{m.name}</div>
            <div style={{ fontSize:12, color:"var(--txtd)", lineHeight:1.6 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:12, maxWidth:440, width:"100%" }}>
        <button className="btn-primary" style={{ background:"var(--s2)", border:"1px solid var(--b2)", color:"var(--txtm)", flex:"0 0 auto", width:"auto", padding:"14px 20px" }} onClick={onBack}>← BACK</button>
        <button className="btn-primary" style={{ flex:1 }} onClick={() => onNext(mode)}>CONFIGURE →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN F — CONFIG / PARAMETERS
═══════════════════════════════════════════ */
function ScreenConfig({ mode, params, onNext, onBack }) {
  const [form, setForm] = useState({
    weeks:       params?.weeks?.toString()       || "",
    lead:        params?.lead?.toString()        || "",
    opening:     params?.opening?.toString()     || "",
    safety:      params?.safety?.toString()      || "0",
    demands:     params?.demands?.join(", ")     || "",
    eoq:         params?.eoq?.toString()         || "",
    costPerCons: params?.costPerCons?.toString() || "",
    annDem:"", ordCost:"", hldCost:"", dynCost:"",
  });
  const [err, setErr] = useState("");
  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const calcEOQ = () => {
    const D=parseFloat(form.annDem), S=parseFloat(form.ordCost), H=parseFloat(form.hldCost);
    if (D>0&&S>0&&H>0) return Math.round(Math.sqrt((2*D*S)/H));
    return null;
  };
  const dynEOQ = mode === "dynamic" ? calcEOQ() : null;

  const handle = () => {
    const weeks   = parseInt(form.weeks)   || 0;
    const lead    = parseInt(form.lead);
    const opening = parseInt(form.opening) || 0;
    const safety  = parseInt(form.safety)  || 0;
    const raw     = form.demands.trim();

    if (!weeks || isNaN(lead) || !raw) { setErr("⚠ Fill in weeks, lead time and weekly demands"); return; }
    const demands = raw.split(",").map(d => parseInt(d.trim())).filter(d => !isNaN(d));
    if (demands.length < weeks) { setErr(`⚠ Need ${weeks} demand values — got ${demands.length}`); return; }

    let eoq, costPerCons;
    if (mode === "static") {
      eoq = parseInt(form.eoq) || 0;
      costPerCons = parseInt(form.costPerCons) || 0;
      if (!eoq || !costPerCons) { setErr("⚠ Enter Fixed EOQ and Cost per Consignment"); return; }
    } else {
      const D=parseFloat(form.annDem), S=parseFloat(form.ordCost), H=parseFloat(form.hldCost);
      costPerCons = parseFloat(form.dynCost) || 0;
      if (!D||!S||!H||!costPerCons) { setErr("⚠ Fill Annual Demand, Ordering Cost, Holding Cost and Cost per Consignment"); return; }
      eoq = Math.round(Math.sqrt((2*D*S)/H));
    }
    setErr("");
    onNext({ weeks, lead, opening, safety, demands, eoq, costPerCons });
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"60px 20px" }}>
      <div style={{ width:"100%", maxWidth:660 }} className="fade-up">
        <div className="glass-card">
          <div className="panel-hdr">
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, background:"rgba(59,130,246,.12)", border:"1px solid rgba(59,130,246,.3)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>⚙️</div>
              <div>
                <div className="bebas" style={{ fontSize:22, letterSpacing:2 }}>PLANNING PARAMETERS</div>
                <div style={{ fontSize:12, color:"var(--txtd)", marginTop:2 }}>
                  {mode === "static" ? "Static EOQ — fixed order quantity" : "Dynamic EOQ — system calculates EOQ"}
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding:28 }}>
            <SectionDivider>Production Basics</SectionDivider>
            <div className="g2">
              <FieldGroup label="Weeks of Production">
                <input className="field-input" type="number" min="2" max="52" value={form.weeks} onChange={e => set("weeks",e.target.value)} placeholder="e.g. 8" />
              </FieldGroup>
              <FieldGroup label="Lead Time (weeks)">
                <input className="field-input" type="number" min="0" max="12" value={form.lead} onChange={e => set("lead",e.target.value)} placeholder="e.g. 1" />
              </FieldGroup>
            </div>
            <div className="g2">
              <FieldGroup label="Opening Stock (units)">
                <input className="field-input" type="number" min="0" value={form.opening} onChange={e => set("opening",e.target.value)} placeholder="e.g. 150" />
              </FieldGroup>
              <FieldGroup label="Safety Stock (units)">
                <input className="field-input" type="number" min="0" value={form.safety} onChange={e => set("safety",e.target.value)} placeholder="e.g. 0" />
              </FieldGroup>
            </div>
            <FieldGroup label="Weekly Demand — comma separated (Wk 1, Wk 2 … Wk N)">
              <input className="field-input" value={form.demands} onChange={e => set("demands",e.target.value)}
                placeholder="e.g. 100, 0, 150, 140, 200, 140, 0, 300" />
              <div className="mono" style={{ fontSize:10, color:"var(--txtd)", marginTop:5 }}>
                Count must match weeks · Week 0 is seed (opening stock only)
              </div>
            </FieldGroup>

            {mode === "static" ? (
              <>
                <SectionDivider>Static EOQ Details</SectionDivider>
                <div className="g2">
                  <FieldGroup label="Fixed EOQ (units)">
                    <input className="field-input" type="number" min="1" value={form.eoq} onChange={e => set("eoq",e.target.value)} placeholder="e.g. 300" />
                  </FieldGroup>
                  <FieldGroup label="Cost per Consignment (₹)">
                    <input className="field-input" type="number" min="0" value={form.costPerCons} onChange={e => set("costPerCons",e.target.value)} placeholder="e.g. 25000" />
                  </FieldGroup>
                </div>
              </>
            ) : (
              <>
                <SectionDivider>Dynamic EOQ — Cost Inputs</SectionDivider>
                <div className="g3">
                  <FieldGroup label="Annual Demand (units)">
                    <input className="field-input" type="number" min="1" value={form.annDem} onChange={e => set("annDem",e.target.value)} placeholder="e.g. 10000" />
                  </FieldGroup>
                  <FieldGroup label="Ordering Cost (₹/order)">
                    <input className="field-input" type="number" min="1" value={form.ordCost} onChange={e => set("ordCost",e.target.value)} placeholder="e.g. 5000" />
                  </FieldGroup>
                  <FieldGroup label="Holding Cost (₹/unit/yr)">
                    <input className="field-input" type="number" min="0.01" step="0.01" value={form.hldCost} onChange={e => set("hldCost",e.target.value)} placeholder="e.g. 20" />
                  </FieldGroup>
                </div>
                {dynEOQ !== null && (
                  <div className="eoq-preview">
                    <div className="mono" style={{ fontSize:10, letterSpacing:2, color:"var(--acc)", marginBottom:6 }}>CALCULATED EOQ</div>
                    <div className="bebas" style={{ fontSize:42, letterSpacing:3, color:"var(--acch)" }}>{dynEOQ} units</div>
                    <div style={{ fontSize:11, color:"var(--txtd)", marginTop:4 }}>√(2 × Annual Demand × Ordering Cost ÷ Holding Cost)</div>
                  </div>
                )}
                <FieldGroup label="Cost per Consignment (₹)">
                  <input className="field-input" type="number" min="0" value={form.dynCost} onChange={e => set("dynCost",e.target.value)} placeholder="e.g. 5000" />
                </FieldGroup>
              </>
            )}

            {err && <div className="err-txt">{err}</div>}
            <div style={{ display:"flex", gap:12, marginTop:6 }}>
              <button className="btn-primary" style={{ background:"var(--s2)", border:"1px solid var(--b2)", color:"var(--txtm)", flex:"0 0 auto", width:"auto", padding:"14px 20px" }} onClick={onBack}>← BACK</button>
              <button className="btn-primary" style={{ flex:1, marginTop:0 }} onClick={handle}>GENERATE PLAN ▶</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PLAN TABLE
═══════════════════════════════════════════ */
function PlanTable({ plan, weeks, eoq, costPerCons }) {
  const totalCost = plan.daysOrdered * costPerCons;
  const T = weeks + 1;

  const rows = [
    { sno:1, label:"Opening Stock", dot:"#3b82f6", key:"opening",
      cellClass:(v,col) => col===0?"cv-open":v===0?"cv-zero":"cv-open",
      display:(v)=>v },
    { sno:2, label:"Demand",        dot:"#f59e0b", key:"demand",
      cellClass:(v,col) => col===0?"":v===0?"cv-zero":"cv-demand",
      display:(v,col) => col===0?"—":v },
    { sno:3, label:"Order",         dot:"#a78bfa", key:"order",
      cellClass:(v,col) => col===0?"":v===0?"cv-zero":"cv-order",
      display:(v,col) => col===0?"—":v===0?0:(plan.orderWeeks.includes(col)?`★ ${v}`:v) },
    { sno:4, label:"Receipt",       dot:"#10b981", key:"receipt",
      cellClass:(v,col) => col===0?"":v===0?"cv-zero":"cv-rcpt",
      display:(v,col) => col===0?"—":v },
    { sno:5, label:"Closing Stock", dot:"#60a5fa", key:"closing",
      cellClass:(v,col) => col===0?"cv-open":v===0?"cv-zero":v<50?"cv-low":"cv-close",
      display:(v)=>v },
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
              {Array.from({ length:T }, (_,col) => {
                const isStar = plan.orderWeeks.includes(col);
                return (
                  <th key={col} className={isStar?"th-star":col===0?"th-seed":""}>
                    {isStar?"★ ":""}Wk {col}
                    {col===0&&<div style={{ fontSize:8, opacity:.5, fontWeight:400, letterSpacing:0 }}>(seed)</div>}
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
                    <span className="row-dot" style={{ background:r.dot }} />
                    {r.label}
                  </div>
                </td>
                {plan[r.key].map((val,col) => (
                  <td key={col} className={r.cellClass(val,col)}
                    style={col===0?{ background:"rgba(59,130,246,.04)", borderRight:"1px solid var(--b2)" }:{}}>
                    {r.display(val,col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="star-legend">
        <span style={{ color:"var(--star)", fontSize:14 }}>★</span>
        <span>Star = order placed that week &nbsp;|&nbsp; Wk 0 = seed (opening stock only)</span>
      </div>
      <div className="tbl-summary">
        <div className="ts-item">
          <div className="ts-lbl">Days Ordered ★</div>
          <div className="ts-val ts-val-star">{plan.daysOrdered}</div>
        </div>
        <div className="ts-item">
          <div className="ts-lbl">Cost / Consignment</div>
          <div className="ts-val">₹{fmt(costPerCons)}</div>
        </div>
        <div className="ts-item">
          <div className="ts-lbl">Total Cost</div>
          <div className="ts-val">₹{fmt(totalCost)}</div>
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
  const [msgs, setMsgs]   = useState([{ role:"bot", text:"Hi! I'm Jithu Bot 🤖 Ask me anything about this production schedule." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const chips = ["Risk weeks?","Total cost breakdown","When is next order?","Avg closing stock","Optimise EOQ"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  const sendMsg = async (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput(""); setLoading(true);
    setMsgs(m => [...m, { role:"user", text:q }]);
    try {
      const history = msgs.filter(m => m.role !== "typing").map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:350,
          system: planContext,
          messages: [...history.slice(-10), { role:"user", content:q }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text||"").join("") || "Sorry, I couldn't process that.";
      setMsgs(m => [...m, { role:"bot", text:reply }]);
    } catch {
      setMsgs(m => [...m, { role:"bot", text:"Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="glass-card">
      <div className="panel-hdr">
        <div className="panel-title">JITHU BOT</div>
        <div className="panel-badge">AI ASSISTANT</div>
      </div>
      <div className="chat-msgs">
        {msgs.map((m,i) => (
          <div key={i} className={`msg ${m.role==="bot"?"msg-bot":"msg-user"}`}>
            {m.role==="bot" && <div className="msg-bot-name">JITHU BOT</div>}
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="msg msg-bot">
            <div className="msg-bot-name">JITHU BOT</div>
            <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chip-row">
        {chips.map(c => <div key={c} className="chip" onClick={() => sendMsg(c)}>{c}</div>)}
      </div>
      <div className="chat-bar">
        <input className="chat-input" value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && sendMsg()}
          placeholder="Ask about your plan…" />
        <button className="chat-send" onClick={() => sendMsg()}>➤</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREEN G — PLAN DASHBOARD
═══════════════════════════════════════════ */
function ScreenPlanDash({ company, product, supplier, mode, params, plan, onBack, onSaved, isSaved }) {
  const { weeks, eoq, costPerCons, lead, safety, opening } = params;
  const totalCost = plan.daysOrdered * costPerCons;
  const avgClose  = Math.round(plan.closing.slice(1).reduce((a,b) => a+b, 0) / weeks);
  const modeLabel = mode === "static" ? "STATIC EOQ" : "DYNAMIC EOQ";
  const [saveFlash, setSaveFlash] = useState(false);

  const kpis = [
    { lbl:"EOQ",               val:eoq,                                       sub:"units per order",   color:"var(--acch)" },
    { lbl:"Days Ordered ★",    val:plan.daysOrdered,                          sub:"order weeks fired", color:"var(--star)" },
    { lbl:"Total Cost",        val:`₹${fmt(totalCost)}`,                      sub:"procurement cost",  color:"var(--acch)", small:true },
    { lbl:"Avg Closing Stock", val:avgClose,                                   sub:"units average",     color:"var(--acch)" },
  ];

  const paramRows = [
    ["Company", company.name],
    ["EOQ", eoq+" units"],
    ["Mode", modeLabel],
    ["Lead Time", lead+" week(s)"],
    ["Safety Stock", safety+" units"],
    ["Opening Stock", opening+" units"],
    ["Weeks Planned", weeks],
    ["★ Order Weeks", plan.orderWeeks.length ? plan.orderWeeks.map(w => "Wk "+w).join(", ") : "None"],
    ["Total Units", plan.totalUnits],
    ["Cost/Consignment", "₹"+fmt(costPerCons)],
    ["Total Cost", "₹"+fmt(totalCost)],
    ["Avg Closing", avgClose+" units"],
  ];

  const planContext = `You are JITHU BOT inside Jithu InHouse Logistics Planning System.
Company: ${company.name} (${company.industry}, est. ${company.year})
Product: ${product} | Supplier: ${supplier}
Mode: ${mode} | EOQ: ${eoq} units | Lead Time: ${lead} wk | Safety Stock: ${safety}
Weeks: ${weeks} | Opening: ${opening}
Weekly Demands (Wk0..N): ${JSON.stringify(plan.demand)}
Orders: ${JSON.stringify(plan.order)}
Receipts: ${JSON.stringify(plan.receipt)}
Closing Stocks: ${JSON.stringify(plan.closing)}
Order Weeks ★: ${JSON.stringify(plan.orderWeeks)}
Days Ordered: ${plan.daysOrdered} | Total Units: ${plan.totalUnits} | Total Cost: ₹${totalCost} | Avg Close: ${avgClose}
Answer concisely under 90 words unless detail asked. Flag stockout risks and cost optimisations.`;

  const handleSave = () => {
    onSaved();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2500);
  };

  const exportCSV = () => {
    const T = weeks + 1;
    let csv = `Jithu InHouse Logistics — ${company.name}\nProduct: ${product} | Supplier: ${supplier}\n\n`;
    csv += `S.No,Particulars,` + Array.from({length:T},(_,i) => plan.orderWeeks.includes(i)?`★ Wk ${i}`:`Wk ${i}`).join(",") + "\n";
    [["1","Opening Stock",plan.opening],["2","Demand",plan.demand],
     ["3","Order",plan.order],["4","Receipt",plan.receipt],["5","Closing Stock",plan.closing]]
      .forEach(([n,l,d]) => { csv += `${n},${l},${d.join(",")}\n`; });
    csv += `\n--- SUMMARY ---\nDays Ordered,${plan.daysOrdered}\nCost/Consignment,₹${costPerCons}\nTotal Cost,₹${totalCost}\nTotal Units,${plan.totalUnits}\nEOQ,${eoq}\n`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
    a.download = `${product.replace(/\s+/g,"-")}-logistics.csv`;
    a.click();
  };

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-brand">◈ JITHU LOGISTICS</div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <span className="t-chip">Company: <span>{company.name}</span></span>
          <span className="t-chip">Product: <span>{product}</span></span>
          <span className="t-chip">Mode: <span>{modeLabel}</span></span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button className="btn-sm btn-outline" onClick={onBack}>← BACK</button>
          <button className="btn-sm" onClick={handleSave}
            style={{
              background: isSaved || saveFlash ? "rgba(16,185,129,.15)" : "rgba(59,130,246,.15)",
              border: `1px solid ${isSaved || saveFlash ? "var(--green)" : "var(--acc)"}`,
              color: isSaved || saveFlash ? "var(--green)" : "var(--acc)",
              transition:"all .3s",
            }}>
            {isSaved || saveFlash ? "✓ SAVED" : "💾 SAVE TO DASHBOARD"}
          </button>
          <button className="btn-sm btn-blue" onClick={exportCSV}>⬇ EXPORT CSV</button>
        </div>
      </div>

      {/* Body */}
      <div className="dash-body" style={{ padding:26, display:"grid", gridTemplateColumns:"1fr 330px", gap:20, alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div className="kpi-grid">
            {kpis.map((k,i) => (
              <div key={i} className="kpi-card">
                <div className="kpi-lbl">{k.lbl}</div>
                <div className="kpi-val" style={{ color:k.color, fontSize:k.small?22:34 }}>{k.val}</div>
                <div className="kpi-sub">{k.sub}</div>
              </div>
            ))}
          </div>
          <PlanTable plan={plan} weeks={weeks} eoq={eoq} costPerCons={costPerCons} />
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div className="glass-card">
            <div className="panel-hdr">
              <div className="panel-title">PARAMETERS</div>
              <div className="panel-badge">{modeLabel}</div>
            </div>
            {paramRows.map(([l,v]) => (
              <div key={l} className="info-row">
                <span className="ir-lbl">{l}</span>
                <span className="ir-val">{v}</span>
              </div>
            ))}
          </div>
          <ChatBot planContext={planContext} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
const LS_KEY = "jithu_logistics_companies";

export default function App() {
  // Load companies from localStorage
  const [companies, setCompanies] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  });

  const [screen, setScreen]       = useState("landing");   // landing|register|companyDash|setup|mode|config|planDash
  const [activeCompany, setActiveCompany] = useState(null);
  const [product, setProduct]     = useState("");
  const [supplier, setSupplier]   = useState("");
  const [mode, setMode]           = useState("static");
  const [params, setParams]       = useState(null);
  const [plan, setPlan]           = useState(null);
  const [activeScheduleId, setActiveScheduleId] = useState(null);

  // Persist companies to localStorage whenever they change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(companies)); }
    catch {}
  }, [companies]);

  // Inject CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Update activeCompany when companies array changes
  useEffect(() => {
    if (activeCompany) {
      const updated = companies.find(c => c.id === activeCompany.id);
      if (updated) setActiveCompany(updated);
    }
  }, [companies]);

  const saveCompany = (company) => {
    setCompanies(prev => [...prev, company]);
    setActiveCompany(company);
    setScreen("companyDash");
  };

  const selectCompany = (company) => {
    setActiveCompany(company);
    setScreen("companyDash");
  };

  const handleNewSchedule = () => {
    setProduct(""); setSupplier(""); setMode("static");
    setParams(null); setPlan(null); setActiveScheduleId(null);
    setScreen("setup");
  };

  const handleOpenSchedule = (s) => {
    setProduct(s.product);
    setSupplier(s.supplier);
    setMode(s.mode);
    setParams(s.params);
    setPlan(s.plan);
    setActiveScheduleId(s.id);
    setScreen("planDash");
  };

  const handleDeleteSchedule = (id) => {
    setCompanies(prev => prev.map(c =>
      c.id === activeCompany.id
        ? { ...c, schedules: c.schedules.filter(s => s.id !== id) }
        : c
    ));
  };

  const handleSaveSchedule = () => {
    if (activeScheduleId) return; // already saved
    const totalCost = plan.daysOrdered * params.costPerCons;
    const schedule = {
      id: Date.now(),
      product, supplier, mode, params, plan,
      eoq: params.eoq, weeks: params.weeks,
      totalCost, savedAt: nowStr(),
    };
    setCompanies(prev => prev.map(c =>
      c.id === activeCompany.id
        ? { ...c, schedules: [schedule, ...(c.schedules || [])] }
        : c
    ));
    setActiveScheduleId(schedule.id);
  };

  const handleBack = () => {
    if (screen === "planDash")    setScreen("companyDash");
    if (screen === "config")      setScreen("mode");
    if (screen === "mode")        setScreen("setup");
    if (screen === "setup")       setScreen("companyDash");
    if (screen === "companyDash") setScreen("landing");
    if (screen === "register")    setScreen("landing");
  };

  return (
    <>
      {screen === "landing" && (
        <ScreenLanding companies={companies} onSelect={selectCompany} onRegister={() => setScreen("register")} />
      )}
      {screen === "register" && (
        <ScreenRegister onDone={saveCompany} onBack={() => setScreen("landing")} />
      )}
      {screen === "companyDash" && activeCompany && (
        <ScreenCompanyDash
          company={activeCompany}
          onNewSchedule={handleNewSchedule}
          onOpenSchedule={handleOpenSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onBack={() => setScreen("landing")}
        />
      )}
      {screen === "setup" && activeCompany && (
        <ScreenSetup company={activeCompany} onNext={(p,s) => { setProduct(p); setSupplier(s); setScreen("mode"); }} onBack={handleBack} />
      )}
      {screen === "mode" && (
        <ScreenMode product={product} supplier={supplier} onNext={(m) => { setMode(m); setScreen("config"); }} onBack={handleBack} />
      )}
      {screen === "config" && (
        <ScreenConfig mode={mode} params={params} onNext={(p) => { setParams(p); setPlan(computePlan(p)); setScreen("planDash"); }} onBack={handleBack} />
      )}
      {screen === "planDash" && plan && activeCompany && (
        <ScreenPlanDash
          company={activeCompany}
          product={product} supplier={supplier}
          mode={mode} params={params} plan={plan}
          onBack={handleBack}
          onSaved={handleSaveSchedule}
          isSaved={!!activeScheduleId}
        />
      )}
    </>
  );
}
