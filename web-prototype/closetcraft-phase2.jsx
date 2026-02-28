import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─── Constants ───────────────────────────────────────────────────
const COLORS = {
  bg: '#0f1019', bgCard: '#181825', bgElevated: '#1e1e30',
  gold: '#e2b97f', goldDark: '#c49a5c', goldMuted: 'rgba(226,185,127,0.15)',
  blue: '#6b8e9e', green: '#7b9e6b', red: '#c45c5c', purple: '#9e6b8e',
  text: '#f0e6d3', textSec: '#8899b0', textMut: '#556677',
  border: 'rgba(255,255,255,0.06)', borderActive: 'rgba(226,185,127,0.4)',
};

const ROOM_TYPES = [
  { id: 'primary', label: 'Primary Bedroom', icon: '👑', desc: 'Walk-in or reach-in closet' },
  { id: 'secondary', label: 'Secondary Room', icon: '🚪', desc: 'Standard reach-in closet' },
  { id: 'hallway', label: 'Hallway / Linen', icon: '🏠', desc: 'Narrow utility closet' },
  { id: 'custom', label: 'Custom Space', icon: '✏️', desc: 'Define your own dimensions' },
];

const CLOSET_TYPES = [
  { id: 'walkin', label: 'Walk-In', minWidth: 60, defaultW: 96, defaultD: 72, icon: '🚶' },
  { id: 'reachin', label: 'Reach-In', minWidth: 36, defaultW: 72, defaultD: 24, icon: '📦' },
  { id: 'wardrobe', label: 'Wardrobe', minWidth: 30, defaultW: 48, defaultD: 24, icon: '🗄️' },
];

const MATERIALS = [
  { id: 'mel-white', label: 'White Melamine', color: '#e8e4de', cat: 'Melamine' },
  { id: 'mel-almond', label: 'Almond', color: '#d4c5a9', cat: 'Melamine' },
  { id: 'mel-gray', label: 'Slate Gray', color: '#8a8d8f', cat: 'Melamine' },
  { id: 'wood-oak', label: 'Natural Oak', color: '#c4a265', cat: 'Wood' },
  { id: 'wood-walnut', label: 'Dark Walnut', color: '#5a3e2b', cat: 'Wood' },
  { id: 'wood-maple', label: 'Maple', color: '#d4a76a', cat: 'Wood' },
  { id: 'wood-cherry', label: 'Cherry', color: '#8b4513', cat: 'Wood' },
  { id: 'lam-espresso', label: 'Espresso', color: '#3c2415', cat: 'Laminate' },
  { id: 'wire-chrome', label: 'Chrome Wire', color: '#c0c0c0', cat: 'Wire' },
  { id: 'wire-white', label: 'White Wire', color: '#f0f0f0', cat: 'Wire' },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'hanging', label: 'Hanging', icon: '👔' },
  { id: 'shelving', label: 'Shelving', icon: '📏' },
  { id: 'drawers', label: 'Drawers', icon: '🗃️' },
  { id: 'specialty', label: 'Specialty', icon: '⭐' },
];

const COMPONENTS = [
  { id: 'shelf', label: 'Shelf', icon: '📏', color: '#B8956A', cat: 'shelving', h: 1, dW: 24, minW: 12, maxW: 96, tip: 'Space 10-12" apart for folded clothes' },
  { id: 'double-hang', label: 'Double Hang', icon: '👔', color: '#7B9E6B', cat: 'hanging', h: 40, dW: 24, minW: 18, maxW: 48, tip: 'Top rod at 80", bottom at 40"' },
  { id: 'long-hang', label: 'Long Hang', icon: '👗', color: '#6B8E9E', cat: 'hanging', h: 64, dW: 24, minW: 18, maxW: 48, tip: 'Rod at 68-72" for dresses/coats' },
  { id: 'drawers-3', label: '3 Drawers', icon: '🗃️', color: '#9E6B8E', cat: 'drawers', h: 24, dW: 18, minW: 15, maxW: 30, tip: 'Socks, accessories at waist height' },
  { id: 'drawers-5', label: '5 Drawers', icon: '🗄️', color: '#8E6B9E', cat: 'drawers', h: 40, dW: 18, minW: 15, maxW: 30, tip: 'Folded clothes, linens' },
  { id: 'shoe-rack', label: 'Shoe Rack', icon: '👟', color: '#9E8E6B', cat: 'specialty', h: 18, dW: 24, minW: 18, maxW: 36, tip: '7" per shelf, 15-20° angle' },
  { id: 'cubbies', label: 'Cubbies', icon: '📦', color: '#6B9E8E', cat: 'shelving', h: 36, dW: 24, minW: 18, maxW: 36, tip: '12-14" squares, add baskets' },
  { id: 'basket', label: 'Pull-Out Basket', icon: '🧺', color: '#9E7B6B', cat: 'specialty', h: 12, dW: 18, minW: 12, maxW: 30, tip: 'Laundry, scarves, belts' },
  { id: 'hooks', label: 'Hook Rail', icon: '🪝', color: '#6B7B9E', cat: 'specialty', h: 4, dW: 24, minW: 12, maxW: 48, tip: '60-65" height, 6-8" spacing' },
  { id: 'valet', label: 'Valet Rod', icon: '🔧', color: '#8E9E6B', cat: 'specialty', h: 2, dW: 14, minW: 12, maxW: 18, tip: 'Pull-out rod for outfit planning' },
  { id: 'jewelry', label: 'Jewelry Tray', icon: '💎', color: '#B89E6B', cat: 'specialty', h: 3, dW: 14, minW: 10, maxW: 20, tip: 'Velvet-lined at waist height' },
  { id: 'hamper', label: 'Tilt Hamper', icon: '🧺', color: '#7B8E6B', cat: 'specialty', h: 28, dW: 18, minW: 14, maxW: 24, tip: 'Floor level near entrance' },
];

const SC = 4; // pixels per inch
const inD = (i) => { const f=Math.floor(i/12), r=Math.round(i%12); return f>0?`${f}'${r}"`:r?`${r}"`:`0"`; };
const uid = () => Math.random().toString(36).substr(2,9);
const snap = (v, g=4) => Math.round(v/g)*g;

// ─── Local Storage Helpers ───────────────────────────────────────
const STORE_KEY = 'closetcraft_designs';
const loadDesigns = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }};
const saveDesigns = (d) => localStorage.setItem(STORE_KEY, JSON.stringify(d));
const saveDesign = (design) => {
  const all = loadDesigns();
  const now = new Date().toISOString();
  const idx = all.findIndex(d => d.id === design.id);
  if (idx >= 0) { all[idx] = { ...all[idx], ...design, updatedAt: now }; }
  else { all.push({ ...design, id: design.id || uid(), createdAt: now, updatedAt: now }); }
  saveDesigns(all);
  return all;
};
const deleteDesignById = (id) => { const all = loadDesigns().filter(d => d.id !== id); saveDesigns(all); return all; };

// ─── PDF Generation ──────────────────────────────────────────────
const generatePDF = (design) => {
  const { name, measurements: m, material, components } = design;
  const mat = MATERIALS.find(x => x.id === material) || MATERIALS[0];
  const counts = {};
  components.forEach(c => { if(!counts[c.type]) counts[c.type] = { n:0, items:[] }; counts[c.type].n++; counts[c.type].items.push(c); });

  const html = `<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;color:#2c2c2c;padding:40px}
    .hdr{display:flex;justify-content:space-between;border-bottom:3px solid #c49a5c;padding-bottom:16px;margin-bottom:24px}
    .logo{font-size:24px;font-weight:800;color:#1a1a2e}.date{font-size:11px;color:#888;text-align:right}
    .name{font-size:20px;font-weight:700;margin-bottom:16px}.sec{margin-bottom:22px}
    .sec-t{font-size:11px;font-weight:700;color:#c49a5c;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px}
    .dims{display:flex;gap:12px}.dim{flex:1;background:#f7f4ef;border-radius:8px;padding:14px;text-align:center}
    .dim-l{font-size:10px;color:#888;text-transform:uppercase}.dim-v{font-size:22px;font-weight:800;color:#1a1a2e;margin-top:2px}
    table{width:100%;border-collapse:collapse}th{text-align:left;font-size:10px;color:#888;text-transform:uppercase;padding:8px;border-bottom:2px solid #e8e4de}
    td{padding:8px;border-bottom:1px solid #f0ede8;font-size:12px}.cn{font-weight:600}.cq{font-weight:700;color:#c49a5c;text-align:center}
    .tips{background:#f0f4f7;border-radius:8px;padding:16px;border-left:4px solid #6b8e9e;font-size:11px;color:#555;line-height:1.7}
    .tips b{color:#6b8e9e}.ft{margin-top:32px;padding-top:12px;border-top:1px solid #e8e4de;font-size:9px;color:#aaa;text-align:center}
  </style></head><body>
    <div class="hdr"><div><div class="logo">🏠 ClosetCraft</div><div style="font-size:11px;color:#888">Design Report</div></div>
    <div class="date">Generated: ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div></div>
    <div class="name">${name||'Untitled Design'}</div>
    <div class="sec"><div class="sec-t">Dimensions</div><div class="dims">
      <div class="dim"><div class="dim-l">Width</div><div class="dim-v">${inD(m.width)}</div></div>
      <div class="dim"><div class="dim-l">Height</div><div class="dim-v">${inD(m.height)}</div></div>
      <div class="dim"><div class="dim-l">Depth</div><div class="dim-v">${inD(m.depth)}</div></div>
    </div></div>
    <div class="sec"><div class="sec-t">Material</div><div style="display:flex;align-items:center;gap:8px">
      <div style="width:18px;height:18px;border-radius:4px;background:${mat.color};border:1px solid #ddd"></div>
      <span style="font-size:13px;font-weight:600">${mat.label}</span></div></div>
    <div class="sec"><div class="sec-t">Components (${components.length})</div><table><thead><tr><th></th><th>Component</th><th>Size</th><th>Qty</th></tr></thead><tbody>
      ${Object.entries(counts).map(([t,d])=>{const c=COMPONENTS.find(x=>x.id===t);
        return `<tr><td>${c?.icon||'📦'}</td><td class="cn">${c?.label||t}</td><td style="color:#888;font-size:11px">${d.items.map(i=>`${inD(i.w)}×${inD(i.h)}`).join(', ')}</td><td class="cq">${d.n}</td></tr>`;
      }).join('')}
    </tbody></table></div>
    <div class="sec"><div class="tips"><b>💡 Installation Tips</b><br/><br/>
      • Locate wall studs before installation.<br/>• Level all horizontal components.<br/>
      • Pre-drill holes in melamine/laminate.<br/>• Start from top, work down.<br/>
      • Leave ½" clearance from walls.<br/>• Verify all measurements on-site before cutting.</div></div>
    <div class="ft">Generated by ClosetCraft v2.0 — Verify all measurements before purchasing materials</div>
  </body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(name||'closetcraft-design').replace(/\s+/g,'-').toLowerCase()}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Main App ────────────────────────────────────────────────────
export default function ClosetCraftApp() {
  const [screen, setScreen] = useState('home');
  const [roomType, setRoomType] = useState(null);
  const [closetType, setClosetType] = useState(null);
  const [measurements, setMeasurements] = useState({ width: 72, height: 96, depth: 24 });
  const [material, setMaterial] = useState('mel-white');
  const [components, setComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [designName, setDesignName] = useState('My Closet Design');
  const [designId, setDesignId] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [toast, setToast] = useState(null);
  const [showMaterial, setShowMaterial] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [catFilter, setCatFilter] = useState('all');
  const [dragInfo, setDragInfo] = useState(null);
  const [resizeInfo, setResizeInfo] = useState(null);
  const designerRef = useRef(null);

  const notify = (m, t='info') => { setToast({m,t}); setTimeout(()=>setToast(null), 2500); };

  useEffect(() => { setSavedDesigns(loadDesigns()); }, []);

  const currentDesign = useMemo(() => ({
    id: designId || uid(), name: designName, roomType, closetType,
    measurements, material, components,
  }), [designId, designName, roomType, closetType, measurements, material, components]);

  const handleSave = () => {
    const id = designId || uid();
    setDesignId(id);
    const all = saveDesign({ ...currentDesign, id });
    setSavedDesigns(all);
    notify('Design saved!', 'success');
  };

  const handleLoadDesign = (d) => {
    setDesignId(d.id); setDesignName(d.name); setRoomType(d.roomType);
    setClosetType(d.closetType); setMeasurements(d.measurements);
    setMaterial(d.material || 'mel-white'); setComponents(d.components || []);
    setSelected(null); setScreen('designer');
  };

  const handleDeleteDesign = (id) => {
    const all = deleteDesignById(id);
    setSavedDesigns(all);
    notify('Design deleted', 'info');
  };

  const handleNewDesign = () => {
    setDesignId(null); setDesignName('My Closet Design');
    setRoomType(null); setClosetType(null); setComponents([]);
    setMeasurements({ width: 72, height: 96, depth: 24 });
    setMaterial('mel-white'); setSelected(null); setScreen('room');
  };

  // ─── Shared Styles ─────────────────────────────────────────────
  const btn = (bg, fg, extra={}) => ({
    fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, padding: '14px 28px',
    borderRadius: 12, border: 'none', cursor: 'pointer', background: bg, color: fg, transition: 'all 0.2s', ...extra,
  });
  const card = (active=false) => ({
    background: COLORS.bgCard, borderRadius: 14, cursor: 'pointer', textAlign: 'center',
    border: active ? `2px solid ${COLORS.gold}` : `2px solid transparent`,
    transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif",
  });
  const sectionTitle = { fontSize: 11, fontWeight: 700, color: COLORS.textMut, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 };

  // ─── Screen Wrapper ────────────────────────────────────────────
  const Wrap = ({ title, sub, onBack, children, wide }) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', minHeight:'100vh',
      padding:'40px 20px', background:`linear-gradient(165deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)`,
      fontFamily:"'DM Sans',sans-serif" }}>
      {onBack && <button onClick={onBack} style={{ position:'absolute', top:20, left:20, ...btn('rgba(255,255,255,0.06)', COLORS.textSec, {padding:'8px 16px', fontSize:13}) }}>← Back</button>}
      <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(24px,5vw,34px)', color:COLORS.text, margin:'20px 0 6px', fontWeight:700 }}>{title}</h2>
      <p style={{ color:COLORS.textSec, fontSize:14, margin:'0 0 32px', textAlign:'center' }}>{sub}</p>
      <div style={{ maxWidth: wide ? 900 : 560, width:'100%' }}>{children}</div>
    </div>
  );

  // ─── Home Screen ───────────────────────────────────────────────
  if (screen === 'home') return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      minHeight:'100vh', padding:'40px 20px', textAlign:'center',
      background:'linear-gradient(165deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)' }}>
      <div style={{ width:80, height:80, borderRadius:22, display:'flex', alignItems:'center', justifyContent:'center',
        background:'linear-gradient(135deg,#e2b97f,#c49a5c)', boxShadow:'0 12px 40px rgba(226,185,127,0.3)',
        fontSize:38, marginBottom:28 }}>🏠</div>
      <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(30px,6vw,48px)',
        color:COLORS.text, margin:'0 0 10px', fontWeight:700, letterSpacing:'-0.02em' }}>ClosetCraft</h1>
      <div style={{ background:'rgba(226,185,127,0.15)', borderRadius:6, padding:'4px 14px', marginBottom:12 }}>
        <span style={{ color:COLORS.gold, fontSize:12, fontWeight:600 }}>Phase 2.0</span>
      </div>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(13px,2.5vw,16px)', color:COLORS.textSec,
        maxWidth:420, lineHeight:1.6, margin:'0 0 36px' }}>
        Design your perfect closet with camera measurement, drag-and-drop layout, material selection, and PDF export.
      </p>
      <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:320 }}>
        <button onClick={handleNewDesign} style={btn('linear-gradient(135deg,#e2b97f,#c49a5c)', '#1a1a2e', { fontSize:16, padding:'16px 32px', boxShadow:'0 8px 32px rgba(226,185,127,0.3)' })}>
          + New Design
        </button>
        <button onClick={()=>{ setSavedDesigns(loadDesigns()); setScreen('saved'); }}
          style={btn('rgba(255,255,255,0.06)', COLORS.textSec, { fontSize:14 })}>
          📂 My Saved Designs ({loadDesigns().length})
        </button>
      </div>
      <div style={{ marginTop:52, display:'flex', gap:36, flexWrap:'wrap', justifyContent:'center' }}>
        {[{i:'📷',l:'Camera Measure'},{i:'🎨',l:'Drag & Drop'},{i:'🎨',l:'10 Materials'},{i:'💾',l:'Save & Load'},{i:'📄',l:'PDF Export'}].map((f,i)=>(
          <div key={i} style={{ textAlign:'center', opacity:0.6 }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{f.i}</div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:'#8899b0' }}>{f.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Saved Designs ─────────────────────────────────────────────
  if (screen === 'saved') return (
    <Wrap title="My Designs" sub={`${savedDesigns.length} saved design${savedDesigns.length!==1?'s':''}`} onBack={()=>setScreen('home')} wide>
      {savedDesigns.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, opacity:0.6 }}>
          <div style={{ fontSize:48, marginBottom:12 }}>📐</div>
          <p style={{ color:COLORS.textSec, fontSize:15 }}>No saved designs yet</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {savedDesigns.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).map(d=>{
            const mat = MATERIALS.find(m=>m.id===d.material);
            return (
              <div key={d.id} style={{ display:'flex', background:COLORS.bgCard, borderRadius:14, overflow:'hidden',
                border:`1px solid ${COLORS.border}`, cursor:'pointer' }} onClick={()=>handleLoadDesign(d)}>
                <div style={{ width:70, background: mat?.color||'#444', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:26 }}>🏠</span>
                </div>
                <div style={{ flex:1, padding:'14px 16px' }}>
                  <div style={{ fontWeight:600, fontSize:15, color:COLORS.text, marginBottom:3 }}>{d.name}</div>
                  <div style={{ fontSize:12, color:COLORS.textSec }}>
                    {d.closetType||'custom'} • {inD(d.measurements?.width||0)} × {inD(d.measurements?.height||0)} • {d.components?.length||0} components
                  </div>
                  <div style={{ fontSize:11, color:COLORS.textMut, marginTop:2 }}>
                    Updated {new Date(d.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'0 14px' }}>
                  <button onClick={e=>{ e.stopPropagation(); generatePDF(d); notify('PDF exported','success'); }}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, padding:4 }} title="Export PDF">📄</button>
                  <button onClick={e=>{ e.stopPropagation(); handleDeleteDesign(d.id); }}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, padding:4 }} title="Delete">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={handleNewDesign} style={{ ...btn(COLORS.gold, COLORS.bg), marginTop:20, width:'100%' }}>+ New Design</button>
    </Wrap>
  );

  // ─── Room Type ─────────────────────────────────────────────────
  if (screen === 'room') return (
    <Wrap title="Choose Room Type" sub="What space are you designing?" onBack={()=>setScreen('home')}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
        {ROOM_TYPES.map(r=>(
          <button key={r.id} onClick={()=>{setRoomType(r.id);setScreen('closetType')}}
            style={{ ...card(roomType===r.id), padding:'22px 18px' }}>
            <span style={{ fontSize:30, display:'block', marginBottom:8 }}>{r.icon}</span>
            <span style={{ fontWeight:600, fontSize:15, color:COLORS.text, display:'block' }}>{r.label}</span>
            <span style={{ fontSize:12, color:COLORS.textSec, marginTop:4, display:'block' }}>{r.desc}</span>
          </button>
        ))}
      </div>
    </Wrap>
  );

  // ─── Closet Type ───────────────────────────────────────────────
  if (screen === 'closetType') return (
    <Wrap title="Closet Type" sub="Select the style of your closet" onBack={()=>setScreen('room')}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:14 }}>
        {CLOSET_TYPES.map(c=>(
          <button key={c.id} onClick={()=>{
            setClosetType(c.id); setMeasurements(m=>({...m, width:c.defaultW, depth:c.defaultD})); setScreen('measure');
          }} style={{ ...card(closetType===c.id), padding:'26px 18px' }}>
            <span style={{ fontSize:34, display:'block', marginBottom:8 }}>{c.icon}</span>
            <span style={{ fontWeight:600, fontSize:15, color:COLORS.text, display:'block' }}>{c.label}</span>
            <span style={{ fontSize:11, color:COLORS.textSec, marginTop:4, display:'block' }}>Min width: {inD(c.minWidth)}</span>
          </button>
        ))}
      </div>
    </Wrap>
  );

  // ─── Measurements ──────────────────────────────────────────────
  if (screen === 'measure') return (
    <Wrap title="Enter Measurements" sub="Measure your closet walls carefully" onBack={()=>setScreen('closetType')}>
      <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:18, padding:28, border:`1px solid ${COLORS.border}` }}>
        {/* Design Name */}
        <div style={{ marginBottom:24 }}>
          <div style={sectionTitle}>DESIGN NAME</div>
          <input value={designName} onChange={e=>setDesignName(e.target.value)}
            style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1px solid ${COLORS.border}`,
              background:'rgba(0,0,0,0.3)', color:COLORS.text, fontSize:15, fontFamily:"'DM Sans',sans-serif",
              outline:'none' }} />
        </div>

        {[{k:'width',l:'Width',i:'↔️',d:'Wall to wall',min:24,max:240},
          {k:'height',l:'Height',i:'↕️',d:'Floor to ceiling',min:60,max:120},
          {k:'depth',l:'Depth',i:'↗️',d:'Front to back',min:12,max:96}].map(({k,l,i,d,min,max})=>(
          <div key={k} style={{ marginBottom:22 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div><span style={{fontSize:16,marginRight:6}}>{i}</span>
                <span style={{fontWeight:600,color:COLORS.text,fontSize:14}}>{l}</span>
                <span style={{color:COLORS.textSec,fontSize:11,marginLeft:8}}>{d}</span></div>
              <div style={{ background:COLORS.goldMuted, borderRadius:7, padding:'3px 10px',
                fontWeight:700, color:COLORS.gold, fontSize:14, fontFamily:'monospace' }}>{inD(measurements[k])}</div>
            </div>
            <input type="range" min={min} max={max} value={measurements[k]}
              onChange={e=>setMeasurements(m=>({...m,[k]:Number(e.target.value)}))}
              style={{ width:'100%', accentColor:COLORS.gold }} />
          </div>
        ))}

        {/* Camera measure teaser */}
        <div style={{ background:'rgba(107,142,158,0.08)', borderRadius:12, padding:16, marginTop:8,
          border:'1px solid rgba(107,142,158,0.15)', display:'flex', alignItems:'center', gap:12 }}>
          <span style={{fontSize:24}}>📷</span>
          <div>
            <div style={{ color:COLORS.blue, fontWeight:600, fontSize:13 }}>Camera Measurement</div>
            <div style={{ color:COLORS.textSec, fontSize:12 }}>Available in the mobile app — use a reference object to measure walls with your phone camera</div>
          </div>
        </div>
      </div>
      <button onClick={()=>{setComponents([]);setScreen('designer')}}
        style={{ ...btn('linear-gradient(135deg,#e2b97f,#c49a5c)','#1a1a2e',{width:'100%'}), marginTop:20 }}>Start Designing →</button>
    </Wrap>
  );

  // ─── DESIGNER ──────────────────────────────────────────────────
  if (screen === 'designer') {
    const wallW = measurements.width * SC;
    const wallH = measurements.height * SC;
    const mat = MATERIALS.find(m=>m.id===material) || MATERIALS[0];
    const filtered = catFilter==='all' ? COMPONENTS : COMPONENTS.filter(c=>c.cat===catFilter);

    const addComp = (type) => {
      const c = COMPONENTS.find(x=>x.id===type);
      const nc = { id:uid(), type, x:snap(wallW/2 - c.dW*SC/2), y:snap(wallH - c.h*SC - 8), w:c.dW, h:c.h, label:c.label, color:c.color };
      setComponents(p=>[...p, nc]); setSelected(nc.id); setShowCatalog(false); notify(`Added ${c.label}`,'success');
    };
    const delComp = id => { setComponents(p=>p.filter(c=>c.id!==id)); setSelected(null); notify('Removed','info'); };
    const dupComp = id => { const c=components.find(x=>x.id===id); if(!c) return;
      const nc={...c, id:uid(), x:c.x+20, y:c.y+20}; setComponents(p=>[...p,nc]); setSelected(nc.id); notify('Duplicated','success'); };

    const onMouseMove = useCallback(e => {
      const r = designerRef.current?.getBoundingClientRect(); if(!r) return;
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (dragInfo) {
        setComponents(p=>p.map(c=>{
          if(c.id!==dragInfo.id) return c;
          let nx=snap(x-dragInfo.ox), ny=snap(y-dragInfo.oy);
          nx=Math.max(0,Math.min(nx,wallW-c.w*SC)); ny=Math.max(0,Math.min(ny,wallH-c.h*SC));
          return {...c,x:nx,y:ny};
        }));
      }
      if (resizeInfo) {
        setComponents(p=>p.map(c=>{
          if(c.id!==resizeInfo.id) return c;
          const def=COMPONENTS.find(cc=>cc.id===c.type);
          let nw = snap(Math.max(def.minW*SC, Math.min(def.maxW*SC, x - c.x)));
          return {...c, w:nw/SC};
        }));
      }
    }, [dragInfo, resizeInfo, wallW, wallH]);
    const onMouseUp = () => { setDragInfo(null); setResizeInfo(null); };

    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'#12121e', fontFamily:"'DM Sans',sans-serif" }}>
        {/* Top Bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px',
          background:'rgba(255,255,255,0.03)', borderBottom:`1px solid ${COLORS.border}`, flexWrap:'wrap', gap:8, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button onClick={()=>setScreen('home')} style={btn('rgba(255,255,255,0.06)',COLORS.textSec,{padding:'6px 12px',fontSize:13})}>← Home</button>
            <input value={designName} onChange={e=>setDesignName(e.target.value)} style={{
              background:'transparent', border:'none', color:COLORS.text, fontWeight:700, fontSize:15,
              fontFamily:"'DM Sans',sans-serif", outline:'none', width:180
            }}/>
            <span style={{ color:COLORS.textMut, fontSize:11 }}>{inD(measurements.width)}×{inD(measurements.height)}×{inD(measurements.depth)}</span>
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {/* Material button */}
            <button onClick={()=>setShowMaterial(!showMaterial)} style={{
              ...btn(COLORS.goldMuted, COLORS.gold, {padding:'6px 12px', fontSize:11, display:'flex', alignItems:'center', gap:6}),
            }}>
              <span style={{ width:14, height:14, borderRadius:3, background:mat.color, border:'1px solid rgba(255,255,255,0.2)', display:'inline-block' }}/>
              {mat.label}
            </button>
            <button onClick={()=>setShowCatalog(!showCatalog)} style={{
              ...btn(showCatalog?COLORS.gold:COLORS.goldMuted, showCatalog?COLORS.bg:COLORS.gold, {padding:'6px 14px',fontSize:12}),
            }}>+ Components</button>
            <button onClick={()=>setShow3D(!show3D)} style={btn('rgba(107,142,158,0.15)',COLORS.blue,{padding:'6px 12px',fontSize:12})}>🧊 3D</button>
            <button onClick={handleSave} style={btn('rgba(123,158,107,0.15)',COLORS.green,{padding:'6px 12px',fontSize:12})}>💾 Save</button>
            <button onClick={()=>{ generatePDF(currentDesign); notify('PDF exported!','success'); }}
              style={btn('rgba(158,107,142,0.15)',COLORS.purple,{padding:'6px 12px',fontSize:12})}>📄 PDF</button>
            <button onClick={()=>setScreen('summary')} style={btn('rgba(255,255,255,0.06)',COLORS.textSec,{padding:'6px 12px',fontSize:12})}>📋 Summary</button>
          </div>
        </div>

        <div style={{ display:'flex', flex:1, overflow:'hidden', position:'relative' }}>
          {/* Catalog Sidebar */}
          {showCatalog && (
            <div style={{ width:250, background:'rgba(0,0,0,0.3)', borderRight:`1px solid ${COLORS.border}`, overflowY:'auto', padding:14, flexShrink:0 }}>
              <div style={sectionTitle}>COMPONENTS</div>
              {/* Category filters */}
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
                {CATEGORIES.map(c=>(
                  <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{
                    padding:'4px 10px', borderRadius:6, border:'none', cursor:'pointer', fontSize:11, fontWeight:600,
                    background: catFilter===c.id ? COLORS.gold : 'rgba(255,255,255,0.04)',
                    color: catFilter===c.id ? COLORS.bg : COLORS.textSec,
                  }}>{c.icon} {c.label}</button>
                ))}
              </div>
              {filtered.map(comp=>(
                <button key={comp.id} onClick={()=>addComp(comp.id)} style={{
                  display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px 12px', marginBottom:4,
                  borderRadius:8, border:'none', background:'rgba(255,255,255,0.04)', cursor:'pointer', textAlign:'left',
                }}>
                  <div style={{ width:32, height:32, borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center',
                    background:`${comp.color}22`, fontSize:16 }}>{comp.icon}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:12, color:COLORS.text }}>{comp.label}</div>
                    <div style={{ fontSize:10, color:COLORS.textMut }}>{comp.tip}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Material Picker Sidebar */}
          {showMaterial && (
            <div style={{ width:220, background:'rgba(0,0,0,0.3)', borderRight:`1px solid ${COLORS.border}`, overflowY:'auto', padding:14, flexShrink:0 }}>
              <div style={sectionTitle}>MATERIALS</div>
              {['Melamine','Wood','Laminate','Wire'].map(cat=>(
                <div key={cat} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:COLORS.textMut, marginBottom:6, textTransform:'uppercase', letterSpacing:'0.1em' }}>{cat}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {MATERIALS.filter(m=>m.cat===cat).map(m=>(
                      <button key={m.id} onClick={()=>{setMaterial(m.id);setShowMaterial(false);notify(`Material: ${m.label}`,'success')}}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:6, borderRadius:8,
                          border: material===m.id ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                          background: material===m.id ? COLORS.goldMuted : 'rgba(255,255,255,0.02)', cursor:'pointer', width:56 }}>
                        <div style={{ width:36, height:36, borderRadius:6, background:m.color, border:'1px solid rgba(255,255,255,0.1)', marginBottom:3 }}/>
                        <span style={{ fontSize:8, color: material===m.id ? COLORS.gold : COLORS.textSec, textAlign:'center', lineHeight:1.2 }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Canvas Area */}
          <div style={{ flex:1, overflow:'auto', display:'flex', alignItems:'center', justifyContent:'center', padding:30, position:'relative' }}>
            {/* Selection toolbar */}
            {selected && (()=>{
              const sc = components.find(c=>c.id===selected);
              if(!sc) return null;
              return (
                <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)',
                  background:'rgba(0,0,0,0.85)', borderRadius:10, padding:'6px 14px',
                  display:'flex', alignItems:'center', gap:10, zIndex:10, border:`1px solid ${COLORS.border}` }}>
                  <span style={{ fontWeight:600, fontSize:12, color:COLORS.text }}>{sc.label}</span>
                  <span style={{ fontSize:11, color:COLORS.textSec }}>{inD(sc.w)}×{inD(sc.h)}</span>
                  <button onClick={()=>dupComp(sc.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:COLORS.blue }}>📋</button>
                  <button onClick={()=>delComp(sc.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:COLORS.red }}>🗑️</button>
                </div>
              );
            })()}

            <div ref={designerRef} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
              onClick={e=>{ if(e.target===designerRef.current || e.target.classList.contains('wall-bg')) setSelected(null); }}
              style={{
                position:'relative', width:wallW, height:wallH, userSelect:'none',
                cursor: dragInfo ? 'grabbing' : 'default',
                background:`
                  repeating-linear-gradient(0deg, rgba(226,185,127,0.04) 0px, rgba(226,185,127,0.04) 1px, transparent 1px, transparent ${12*SC}px),
                  repeating-linear-gradient(90deg, rgba(226,185,127,0.04) 0px, rgba(226,185,127,0.04) 1px, transparent 1px, transparent ${12*SC}px),
                  linear-gradient(180deg, ${mat.color}08 0%, ${mat.color}03 100%)`,
                border: `2px solid ${COLORS.borderActive}`, borderRadius:4,
                boxShadow: '0 0 50px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.15)',
              }}>
              {/* Dimension labels */}
              <div className="wall-bg" style={{ position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)',
                fontSize:10, color:COLORS.gold, fontWeight:600, fontFamily:'monospace' }}>{inD(measurements.width)}</div>
              <div className="wall-bg" style={{ position:'absolute', left:-38, top:'50%', transform:'translateY(-50%) rotate(-90deg)',
                fontSize:10, color:COLORS.textSec, fontWeight:600, fontFamily:'monospace' }}>{inD(measurements.height)}</div>
              {/* Floor */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2,
                background:'linear-gradient(90deg, transparent, rgba(226,185,127,0.35), transparent)' }}/>

              {/* Components */}
              {components.map(comp=>{
                const isSel = selected===comp.id;
                const def = COMPONENTS.find(c=>c.id===comp.type);
                return (
                  <div key={comp.id}
                    onMouseDown={e=>{ e.stopPropagation(); setSelected(comp.id);
                      const r=designerRef.current.getBoundingClientRect();
                      setDragInfo({id:comp.id, ox:e.clientX-r.left-comp.x, oy:e.clientY-r.top-comp.y}); }}
                    style={{
                      position:'absolute', left:comp.x, top:comp.y, width:comp.w*SC, height:comp.h*SC,
                      background:`linear-gradient(135deg, ${comp.color}30, ${comp.color}18)`,
                      border:`2px solid ${isSel?COLORS.gold:comp.color+'60'}`, borderRadius:5,
                      cursor: dragInfo?.id===comp.id ? 'grabbing' : 'grab',
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                      transition: dragInfo?.id===comp.id ? 'none' : 'border 0.15s',
                      zIndex: isSel?5:1, boxShadow: isSel?`0 0 16px ${comp.color}30`:'none', overflow:'hidden',
                    }}>
                    <span style={{ fontSize:Math.min(18,comp.h*SC*0.3), opacity:0.8 }}>{def?.icon}</span>
                    {comp.h*SC>28 && <span style={{ fontSize:Math.min(10,comp.w*SC*0.07), color:COLORS.text,
                      fontWeight:600, opacity:0.7, marginTop:1, textAlign:'center', padding:'0 3px',
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' }}>{comp.label}</span>}
                    {comp.h*SC>38 && <span style={{ fontSize:8, color:COLORS.textSec, opacity:0.5, marginTop:1 }}>{inD(comp.w)}×{inD(comp.h)}</span>}
                    {/* Resize handle */}
                    {isSel && <div onMouseDown={e=>{ e.stopPropagation(); setResizeInfo({id:comp.id}); }}
                      style={{ position:'absolute', right:-3, top:'50%', transform:'translateY(-50%)',
                        width:7, height:22, borderRadius:4, background:COLORS.gold, cursor:'ew-resize' }}/>}
                  </div>
                );
              })}

              {/* Empty state */}
              {components.length===0 && (
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', opacity:0.35, pointerEvents:'none' }}>
                  <span style={{ fontSize:36, marginBottom:10 }}>📐</span>
                  <span style={{ color:COLORS.textSec, fontSize:13 }}>Click "+ Components" to start</span>
                </div>
              )}
            </div>
          </div>

          {/* 3D Preview */}
          {show3D && <Preview3D measurements={measurements} components={components} wallW={wallW} wallH={wallH} mat={mat} onClose={()=>setShow3D(false)} />}
        </div>

        {/* Toast */}
        {toast && <div style={{ position:'fixed', bottom:18, left:'50%', transform:'translateX(-50%)',
          background: toast.t==='success' ? 'rgba(123,158,107,0.9)' : 'rgba(107,126,158,0.9)',
          color:'#fff', padding:'8px 22px', borderRadius:8, fontSize:12, fontWeight:600, zIndex:100,
          boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}>{toast.m}</div>}
      </div>
    );
  }

  // ─── Summary ───────────────────────────────────────────────────
  if (screen === 'summary') {
    const counts = {};
    components.forEach(c => { if(!counts[c.type]) counts[c.type]={n:0,items:[]}; counts[c.type].n++; counts[c.type].items.push(c); });
    const mat = MATERIALS.find(m=>m.id===material) || MATERIALS[0];

    return (
      <Wrap title="Design Summary" sub={designName} onBack={()=>setScreen('designer')} wide>
        {/* Dimensions */}
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:22, border:`1px solid ${COLORS.border}`, marginBottom:18 }}>
          <div style={sectionTitle}>DIMENSIONS</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[{l:'Width',v:measurements.width},{l:'Height',v:measurements.height},{l:'Depth',v:measurements.depth}].map(d=>(
              <div key={d.l} style={{ background:'rgba(0,0,0,0.2)', borderRadius:10, padding:'12px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:COLORS.textMut }}>{d.l}</div>
                <div style={{ fontSize:20, fontWeight:700, color:COLORS.text, fontFamily:'monospace' }}>{inD(d.v)}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Material */}
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:22, border:`1px solid ${COLORS.border}`, marginBottom:18 }}>
          <div style={sectionTitle}>MATERIAL</div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:mat.color, border:'1px solid rgba(255,255,255,0.1)' }}/>
            <span style={{ fontWeight:600, color:COLORS.text, fontSize:15 }}>{mat.label}</span>
            <span style={{ fontSize:12, color:COLORS.textSec }}>({mat.cat})</span>
          </div>
        </div>
        {/* Components */}
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:22, border:`1px solid ${COLORS.border}`, marginBottom:18 }}>
          <div style={sectionTitle}>COMPONENTS ({components.length})</div>
          {Object.keys(counts).length===0 ? (
            <p style={{ color:COLORS.textMut, fontSize:13 }}>No components placed yet.</p>
          ) : Object.entries(counts).map(([type,data])=>{
            const def = COMPONENTS.find(c=>c.id===type);
            return (
              <div key={type} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 0', borderBottom:`1px solid ${COLORS.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:7, display:'flex', alignItems:'center',
                    justifyContent:'center', background:`${def?.color}22`, fontSize:16 }}>{def?.icon}</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:COLORS.text }}>{def?.label}</div>
                    <div style={{ fontSize:10, color:COLORS.textMut }}>{data.items.map(i=>`${inD(i.w)}×${inD(i.h)}`).join(', ')}</div>
                  </div>
                </div>
                <div style={{ background:COLORS.goldMuted, borderRadius:7, padding:'3px 10px', fontWeight:700, color:COLORS.gold, fontSize:14 }}>×{data.n}</div>
              </div>
            );
          })}
        </div>
        {/* Actions */}
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <button onClick={()=>setScreen('designer')} style={btn(COLORS.gold, COLORS.bg, {flex:1})}>← Back to Designer</button>
          <button onClick={handleSave} style={btn('rgba(123,158,107,0.2)',COLORS.green,{flex:1})}>💾 Save</button>
          <button onClick={()=>{generatePDF(currentDesign);notify('PDF exported!','success')}}
            style={btn('rgba(158,107,142,0.2)',COLORS.purple,{flex:1})}>📄 Export PDF</button>
        </div>
      </Wrap>
    );
  }

  return null;
}

// ─── 3D Preview ──────────────────────────────────────────────────
function Preview3D({ measurements, components, wallW, wallH, mat, onClose }) {
  const canvasRef = useRef(null);
  const [rot, setRot] = useState({ x: -20, y: 25 });
  const [dragging, setDragging] = useState(false);
  const last = useRef({ x:0, y:0 });

  useEffect(() => {
    const cv = canvasRef.current; if(!cv) return;
    const ctx = cv.getContext('2d');
    const W=cv.width, H=cv.height;
    ctx.clearRect(0,0,W,H);

    const s = Math.min(W,H)/Math.max(measurements.width,measurements.height,measurements.depth)*0.32;
    const cx=W/2, cy=H/2+25;
    const rx=rot.x*Math.PI/180, ry=rot.y*Math.PI/180;
    const proj = (x,y,z) => {
      const cY=Math.cos(ry), sY=Math.sin(ry), cX=Math.cos(rx), sX=Math.sin(rx);
      const x1=x*cY-z*sY, z1=x*sY+z*cY, y1=y*cX-z1*sX;
      return {px:cx+x1*s, py:cy+y1*s};
    };
    const face = (pts, fill, stroke) => {
      ctx.beginPath();
      const pp = pts.map(p=>proj(p[0],p[1],p[2]));
      ctx.moveTo(pp[0].px,pp[0].py);
      pp.forEach(p=>ctx.lineTo(p.px,p.py));
      ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
      ctx.strokeStyle=stroke; ctx.lineWidth=1; ctx.stroke();
    };
    const mw=measurements.width, mh=measurements.height, md=measurements.depth;

    // Walls
    face([[-mw/2,-mh/2,-md/2],[mw/2,-mh/2,-md/2],[mw/2,mh/2,-md/2],[-mw/2,mh/2,-md/2]], `${mat.color}15`, `${mat.color}40`);
    face([[-mw/2,-mh/2,-md/2],[-mw/2,-mh/2,md/2],[-mw/2,mh/2,md/2],[-mw/2,mh/2,-md/2]], `${mat.color}10`, `${mat.color}30`);
    face([[-mw/2,mh/2,-md/2],[mw/2,mh/2,-md/2],[mw/2,mh/2,md/2],[-mw/2,mh/2,md/2]], `${mat.color}08`, `${mat.color}25`);

    // Components
    components.forEach(comp => {
      const nx=(comp.x/wallW)*mw-mw/2, ny=(comp.y/wallH)*mh-mh/2, nw=comp.w, nh=comp.h, nd=Math.min(md*0.7,18);
      const c = comp.color;
      face([[nx,ny,-md/2],[nx+nw,ny,-md/2],[nx+nw,ny+nh,-md/2],[nx,ny+nh,-md/2]], c+'55', c+'88');
      face([[nx,ny,-md/2],[nx,ny,-md/2+nd],[nx,ny+nh,-md/2+nd],[nx,ny+nh,-md/2]], c+'33', c+'66');
      face([[nx,ny,-md/2+nd],[nx+nw,ny,-md/2+nd],[nx+nw,ny+nh,-md/2+nd],[nx,ny+nh,-md/2+nd]], c+'44', c+'77');
      face([[nx,ny,-md/2],[nx+nw,ny,-md/2],[nx+nw,ny,-md/2+nd],[nx,ny,-md/2+nd]], c+'22', c+'55');
    });
  }, [measurements, components, rot, wallW, wallH, mat]);

  return (
    <div style={{ width:340, background:'rgba(0,0,0,0.35)', borderLeft:`1px solid rgba(255,255,255,0.06)`, display:'flex', flexDirection:'column', flexShrink:0 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontWeight:700, color:'#f0e6d3', fontSize:13 }}>🧊 3D Preview</span>
        <button onClick={onClose} style={{ background:'none', border:'none', color:'#8899b0', cursor:'pointer', fontSize:15 }}>✕</button>
      </div>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:10 }}>
        <canvas ref={canvasRef} width={320} height={290} style={{ borderRadius:8, cursor:'grab', background:'rgba(0,0,0,0.2)' }}
          onMouseDown={e=>{ setDragging(true); last.current={x:e.clientX,y:e.clientY}; }}
          onMouseMove={e=>{ if(!dragging) return; setRot(r=>({x:r.x+(e.clientY-last.current.y)*0.5, y:r.y+(e.clientX-last.current.x)*0.5})); last.current={x:e.clientX,y:e.clientY}; }}
          onMouseUp={()=>setDragging(false)} onMouseLeave={()=>setDragging(false)} />
      </div>
      <div style={{ padding:'6px 14px 14px', textAlign:'center' }}>
        <span style={{ fontSize:10, color:'#556677' }}>Drag to rotate</span>
      </div>
    </div>
  );
}
