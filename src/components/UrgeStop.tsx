"use client";
import { useState, useEffect, useRef } from "react";
import GroundingExercise from "./GroundingExercise";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0a1628; --surface:#0f2040; --card:#152b52; --border:#1e3d6e;
    --teal:#2dd4bf; --teal-dim:#1a8a7a; --amber:#f59e0b; --rose:#fb7185;
    --text:#e2eaf6; --muted:#7a9bc4;
    --serif:'DM Serif Display',Georgia,serif; --sans:'DM Sans',system-ui,sans-serif;
    --r:14px; --glow-t:0 0 30px rgba(45,212,191,0.25);
  }
  body { background:var(--bg); color:var(--text); font-family:var(--sans); }
  .app { min-height:100vh; background:radial-gradient(ellipse at 20% 10%,#0f2a4a,#0a1628 60%); display:flex; flex-direction:column; align-items:center; padding:0 0 80px; }
  .header { width:100%; max-width:520px; padding:28px 24px 0; display:flex; justify-content:space-between; align-items:center; }
  .logo { font-family:var(--serif); font-size:1.5rem; color:var(--teal); letter-spacing:-0.02em; }
  .logo span { color:var(--text); opacity:0.6; font-style:italic; }
  .crisis-btn { background:transparent; border:1.5px solid var(--rose); color:var(--rose); font-family:var(--sans); font-size:0.72rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; padding:7px 14px; border-radius:20px; cursor:pointer; transition:all 0.2s; }
  .crisis-btn:hover { background:var(--rose); color:#0a1628; }
  .nav { width:100%; max-width:520px; display:flex; padding:20px 24px 0; gap:6px; }
  .tab { flex:1; background:transparent; border:none; color:var(--muted); font-family:var(--sans); font-size:0.72rem; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; padding:10px 4px; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.2s; }
  .tab.active { color:var(--teal); border-bottom-color:var(--teal); }
  .tab:hover:not(.active) { color:var(--text); }
  .content { width:100%; max-width:520px; padding:24px; display:flex; flex-direction:column; gap:16px; }
  .card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); padding:24px; position:relative; overflow:hidden; }
  .card::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(45,212,191,0.04),transparent 60%); pointer-events:none; }
  .card-label { font-size:0.68rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
  .card-title { font-family:var(--serif); font-size:1.4rem; color:var(--text); line-height:1.3; margin-bottom:6px; }
  .card-sub { font-size:0.85rem; color:var(--muted); line-height:1.6; }
  .urge-wrap { display:flex; flex-direction:column; align-items:center; padding:32px 24px; gap:16px; }
  @keyframes pulse-ring { 0%{width:80px;height:80px;opacity:0.6} 100%{width:200px;height:200px;opacity:0} }
  .urge-pulse-ring { position:absolute; border-radius:50%; border:2px solid var(--teal); opacity:0; animation:pulse-ring 2.4s ease-out infinite; }
  .urge-btn { position:relative; width:140px; height:140px; border-radius:50%; background:linear-gradient(135deg,#1e6e63,#2dd4bf); border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:var(--glow-t),0 8px 32px rgba(0,0,0,0.4); transition:transform 0.15s,box-shadow 0.15s; z-index:1; }
  .urge-btn:hover { transform:scale(1.04); box-shadow:0 0 50px rgba(45,212,191,0.4),0 12px 40px rgba(0,0,0,0.5); }
  .urge-btn:active { transform:scale(0.97); }
  .urge-btn-icon { font-size:2rem; }
  .urge-btn-text { font-family:var(--sans); font-size:0.7rem; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#0a1628; }
  .urge-sub { font-size:0.82rem; color:var(--muted); text-align:center; max-width:280px; }
  .tracker-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .tracker-main { grid-column:1/-1; text-align:center; padding:24px; }
  .tracker-big { font-family:var(--serif); font-size:3.5rem; color:var(--teal); line-height:1; }
  .tracker-unit { font-size:0.8rem; color:var(--muted); letter-spacing:0.1em; text-transform:uppercase; margin-top:4px; }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:16px; text-align:center; }
  .stat-value { font-family:var(--serif); font-size:1.6rem; color:var(--amber); }
  .stat-label { font-size:0.72rem; color:var(--muted); letter-spacing:0.08em; text-transform:uppercase; margin-top:4px; }
  .milestone-list { display:flex; flex-direction:column; gap:10px; margin-top:4px; }
  .milestone-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--surface); border:1px solid var(--border); border-radius:10px; font-size:0.85rem; }
  .milestone-item.done { border-color:var(--teal-dim); }
  .journal-form { display:flex; flex-direction:column; gap:14px; }
  .field-label { font-size:0.75rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; display:block; }
  .field-input,.field-textarea { width:100%; background:var(--surface); border:1px solid var(--border); border-radius:10px; color:var(--text); font-family:var(--sans); font-size:0.9rem; padding:12px 16px; outline:none; transition:border-color 0.2s; }
  .field-input:focus,.field-textarea:focus { border-color:var(--teal-dim); }
  .field-textarea { min-height:90px; resize:vertical; line-height:1.6; }
  .tag-row { display:flex; flex-wrap:wrap; gap:8px; }
  .tag { background:var(--surface); border:1px solid var(--border); border-radius:20px; color:var(--muted); font-size:0.78rem; padding:6px 14px; cursor:pointer; transition:all 0.2s; }
  .tag.active { background:rgba(45,212,191,0.12); border-color:var(--teal-dim); color:var(--teal); }
  .ai-insight { background:linear-gradient(135deg,rgba(45,212,191,0.08),rgba(45,212,191,0.03)); border:1px solid var(--teal-dim); border-radius:10px; padding:16px; font-size:0.85rem; color:var(--muted); line-height:1.7; position:relative; }
  .ai-insight::before { content:'✦ AI Coach'; display:block; font-size:0.7rem; color:var(--teal); letter-spacing:0.1em; font-weight:600; margin-bottom:8px; }
  .past-entries { display:flex; flex-direction:column; gap:10px; margin-top:4px; }
  .entry-chip { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px 16px; font-size:0.82rem; color:var(--muted); }
  .pledge-items { display:flex; flex-direction:column; gap:10px; }
  .pledge-item { display:flex; align-items:flex-start; gap:14px; padding:14px 16px; background:var(--surface); border:1px solid var(--border); border-radius:10px; cursor:pointer; transition:all 0.2s; }
  .pledge-item.checked { border-color:var(--teal-dim); background:rgba(45,212,191,0.05); }
  .pledge-checkbox { width:22px; height:22px; border-radius:6px; border:2px solid var(--border); flex-shrink:0; display:flex; align-items:center; justify-content:center; margin-top:1px; transition:all 0.2s; }
  .pledge-item.checked .pledge-checkbox { background:var(--teal); border-color:var(--teal); }
  .pledge-text { font-size:0.88rem; color:var(--text); line-height:1.5; }
  .pledge-text small { display:block; color:var(--muted); font-size:0.78rem; margin-top:2px; }
  .mood-row { display:flex; gap:10px; justify-content:center; margin:8px 0; }
  .mood-btn { font-size:1.5rem; background:var(--surface); border:2px solid var(--border); border-radius:50%; width:50px; height:50px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s; }
  .mood-btn.active { border-color:var(--teal); background:rgba(45,212,191,0.12); transform:scale(1.15); }
  .btn-primary { background:linear-gradient(135deg,var(--teal-dim),var(--teal)); color:#0a1628; border:none; font-family:var(--sans); font-size:0.85rem; font-weight:600; padding:13px 28px; border-radius:30px; cursor:pointer; transition:all 0.2s; box-shadow:var(--glow-t); }
  .btn-primary:hover { transform:translateY(-1px); }
  .btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--border); font-family:var(--sans); font-size:0.85rem; font-weight:500; padding:13px 24px; border-radius:30px; cursor:pointer; transition:all 0.2s; }
  .btn-ghost:hover { color:var(--text); border-color:var(--muted); }
  .crisis-overlay { position:fixed; inset:0; background:rgba(10,22,40,0.98); z-index:200; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; padding:40px 24px; overflow-y:auto; }
  .hotline-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; width:100%; max-width:400px; }
  .coach-messages { display:flex; flex-direction:column; gap:12px; max-height:360px; overflow-y:auto; padding-right:4px; }
  .coach-messages::-webkit-scrollbar { width:4px; }
  .coach-messages::-webkit-scrollbar-thumb { background:var(--border); border-radius:2px; }
  .msg { max-width:82%; padding:12px 16px; border-radius:14px; font-size:0.88rem; line-height:1.6; }
  .msg.coach { background:var(--surface); border:1px solid var(--border); color:var(--text); align-self:flex-start; border-bottom-left-radius:4px; }
  .msg.user { background:rgba(45,212,191,0.12); border:1px solid var(--teal-dim); color:var(--text); align-self:flex-end; border-bottom-right-radius:4px; }
  .msg-from { font-size:0.68rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
  .chat-input-row { display:flex; gap:10px; margin-top:8px; }
  .chat-input { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:24px; color:var(--text); font-family:var(--sans); font-size:0.88rem; padding:12px 18px; outline:none; transition:border-color 0.2s; }
  .chat-input:focus { border-color:var(--teal-dim); }
  .chat-send { background:var(--teal); border:none; border-radius:50%; width:44px; height:44px; flex-shrink:0; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:1.1rem; transition:all 0.2s; color:#0a1628; font-weight:700; }
  .chat-send:hover { transform:scale(1.08); }
  @keyframes dot-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
  .typing-dots span { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--muted); margin:0 2px; animation:dot-bounce 1.2s infinite; }
  .typing-dots span:nth-child(2) { animation-delay:0.2s; }
  .typing-dots span:nth-child(3) { animation-delay:0.4s; }
  .info-chip { font-size:0.75rem; padding:5px 12px; border-radius:20px; background:rgba(45,212,191,0.08); border:1px solid var(--teal-dim); color:var(--teal); }
  .section-title { font-family:var(--serif); font-size:1.15rem; color:var(--text); }
  .pledge-time { display:flex; gap:10px; margin-bottom:16px; }
  .pledge-time-btn { flex:1; background:var(--surface); border:1px solid var(--border); color:var(--muted); font-family:var(--sans); font-size:0.8rem; font-weight:600; padding:10px; border-radius:10px; cursor:pointer; transition:all 0.2s; }
  .pledge-time-btn.active { background:rgba(45,212,191,0.1); border-color:var(--teal-dim); color:var(--teal); }
`;

const MILESTONES = [
  {days:1,icon:"🌱",label:"First 24 hours"},
  {days:3,icon:"💧",label:"3-day detox complete"},
  {days:7,icon:"⭐",label:"One week strong"},
  {days:14,icon:"🔥",label:"Two weeks free"},
  {days:30,icon:"🏆",label:"30-day milestone"},
  {days:90,icon:"💎",label:"90 days — a new life"},
  {days:180,icon:"🦋",label:"6 months of freedom"},
  {days:365,icon:"🌟",label:"One full year"},
];

const MORNING_PLEDGES = [
  {id:"m1",text:"I will reach out before I pick up.",sub:"Connection is the opposite of addiction"},
  {id:"m2",text:"I will identify one trigger today and prepare a response.",sub:"Awareness is my first defense"},
  {id:"m3",text:"I will practice one grounding technique if an urge arises.",sub:"5-4-3-2-1 or box breathing"},
  {id:"m4",text:"I treat myself with the compassion I'd give a friend.",sub:"Recovery is not linear, and that's okay"},
];

const EVENING_REFLECTIONS = [
  {id:"e1",text:"I handled today's challenges without using.",sub:"Even imperfectly — it still counts"},
  {id:"e2",text:"I recognize what supported my recovery today.",sub:"Gratitude reinforces neural pathways"},
  {id:"e3",text:"Tomorrow I will keep going.",sub:"One intention is enough"},
  {id:"e4",text:"I release today without judgment.",sub:"Sleep is recovery too"},
];

const TRIGGER_TAGS = ["Stress","Loneliness","Boredom","Social pressure","Anxiety","Celebration","Pain","Anger","Sadness","Exhaustion"];

const HOTLINES = [
  {name:"SAMHSA Helpline",num:"1-800-662-4357",desc:"24/7 free, confidential treatment referral (US)"},
  {name:"988 Crisis Lifeline",num:"Call or text 988",desc:"Suicide & crisis support, 24/7"},
  {name:"Crisis Text Line",num:"Text HOME to 741741",desc:"24/7 text-based crisis support"},
  {name:"NA World Services",num:"1-818-773-9999",desc:"Narcotics Anonymous fellowship line"},
];

const CBT_THOUGHTS = [
  "Urges are temporary — they peak at about 20 minutes and then fade, like a wave.",
  "This feeling is uncomfortable but not dangerous. You've survived every urge so far.",
  "What would you tell a close friend in this exact moment?",
  "Name the urge. Naming it reduces its power over you.",
  "You are not your urge. It is a signal, not a command.",
];

function CrisisOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="crisis-overlay">
      <div style={{fontFamily:'var(--serif)',fontSize:'2rem',color:'var(--rose)',textAlign:'center'}}>You are not alone.</div>
      <div style={{fontSize:'0.9rem',color:'var(--muted)',textAlign:'center',maxWidth:340,lineHeight:1.7}}>If you&apos;re in immediate danger, call 911. These confidential lines are free, 24/7.</div>
      {HOTLINES.map(h=>(
        <div key={h.num} className="hotline-card">
          <div>
            <div style={{fontWeight:600,fontSize:'0.9rem',color:'var(--text)'}}>{h.name}</div>
            <div style={{fontSize:'0.75rem',color:'var(--muted)',marginTop:2}}>{h.desc}</div>
          </div>
          <div style={{fontFamily:'var(--serif)',fontSize:'0.95rem',color:'var(--teal)',fontWeight:600,textAlign:'right',maxWidth:160}}>{h.num}</div>
        </div>
      ))}
      <button className="btn-ghost" onClick={onClose}>Return to app</button>
    </div>
  );
}

function DashboardTab({ days, onUrge, onCrisis }: { days: number; onUrge: () => void; onCrisis: () => void }) {
  return (
    <div className="content">
      <div className="card urge-wrap">
        <div className="card-label" style={{textAlign:'center'}}>Urge Protocol · CBT / DBT</div>
        <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center',width:200,height:200}}>
          <div className="urge-pulse-ring"/>
          <button className="urge-btn" onClick={onUrge}>
            <div className="urge-btn-icon">🌊</div>
            <div className="urge-btn-text">I have an urge</div>
          </button>
        </div>
        <div className="urge-sub">Tap to begin a 5-minute grounding &amp; urge surfing session.</div>
      </div>
      <div className="card" style={{display:'flex',alignItems:'center',gap:16,padding:'18px 24px'}}>
        <div style={{fontSize:'2.2rem'}}>🏅</div>
        <div>
          <div className="card-label" style={{marginBottom:2}}>Current Streak</div>
          <div style={{fontFamily:'var(--serif)',fontSize:'1.5rem',color:'var(--amber)'}}>{days} days sober</div>
          <div style={{fontSize:'0.78rem',color:'var(--muted)',marginTop:2}}>Next: {MILESTONES.find(m=>m.days>days)?.label}</div>
        </div>
      </div>
      <div className="card">
        <div className="card-label">Today&apos;s DBT Skill: TIPP</div>
        <div className="card-title">Distress Tolerance</div>
        <div className="card-sub"><strong>T</strong>emperature · <strong>I</strong>ntense exercise · <strong>P</strong>aced breathing · <strong>P</strong>aired muscle relaxation</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:14}}>
          {["Cold water","Jumping jacks","Box breathing","Body scan"].map(c=><span key={c} className="info-chip">{c}</span>)}
        </div>
      </div>
      <div className="card">
        <div className="card-label">CBT Thought of the Day</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.1rem',color:'var(--text)',lineHeight:1.6,fontStyle:'italic'}}>
          &ldquo;{CBT_THOUGHTS[new Date().getDay()%CBT_THOUGHTS.length]}&rdquo;
        </div>
      </div>
      <button className="crisis-btn" style={{width:'100%',padding:'14px',borderRadius:'12px',fontSize:'0.85rem'}} onClick={onCrisis}>🆘 I need immediate help — crisis resources</button>
    </div>
  );
}

function SobrietyTab({ days }: { days: number }) {
  return (
    <div className="content">
      <div className="card tracker-main">
        <div className="card-label">Time Clean</div>
        <div className="tracker-big">{days}</div>
        <div className="tracker-unit">Days Sober</div>
        <div style={{marginTop:14,display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
          <span className="info-chip">🕐 {(days*24).toLocaleString()} hours</span>
          <span className="info-chip">⏱ {(days*24*60).toLocaleString()} minutes</span>
        </div>
      </div>
      <div className="tracker-grid">
        <div className="stat-card"><div className="stat-value">${(days*18).toFixed(0)}</div><div className="stat-label">Estimated saved</div></div>
        <div className="stat-card"><div className="stat-value">{(days*1.2).toFixed(1)}h</div><div className="stat-label">Better sleep</div></div>
      </div>
      <div className="card">
        <div className="section-title" style={{marginBottom:14}}>Milestones</div>
        <div className="milestone-list">
          {MILESTONES.map(m=>(
            <div key={m.days} className={`milestone-item ${days>=m.days?'done':''}`}>
              <div style={{fontSize:'1.2rem'}}>{days>=m.days?m.icon:'○'}</div>
              <div style={{flex:1,opacity:days>=m.days?1:0.45}}>{m.label}</div>
              <div style={{fontSize:'0.75rem',color:'var(--muted)'}}>{m.days}d</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function JournalTab() {
  const [where,setWhere]=useState("");
  const [why,setWhy]=useState("");
  const [intensity,setIntensity]=useState(5);
  const [tags,setTags]=useState<string[]>([]);
  const [submitted,setSubmitted]=useState(false);
  const toggle=(t: string)=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  const entries=[
    {date:"Mar 4",trigger:"Stress",body:"After a difficult meeting. Went for a walk instead."},
    {date:"Mar 2",trigger:"Loneliness",body:"Weekend evening. Called my sponsor — really helped."},
  ];
  return (
    <div className="content">
      {!submitted?(
        <div className="card">
          <div className="card-label">Log an Urge</div>
          <div className="card-title">Where, Who &amp; Why</div>
          <div className="card-sub" style={{marginBottom:20}}>Logging builds self-awareness — the foundation of CBT-based recovery.</div>
          <div className="journal-form">
            <div><label className="field-label">Where are you right now?</label><input className="field-input" placeholder="e.g. Home alone, at a party..." value={where} onChange={e=>setWhere(e.target.value)}/></div>
            <div><label className="field-label">What&apos;s happening? (Why the urge?)</label><textarea className="field-textarea" placeholder="Describe the thoughts, feelings or situation..." value={why} onChange={e=>setWhy(e.target.value)}/></div>
            <div><label className="field-label">Urge intensity (1–10): <span style={{color:'var(--teal)'}}>{intensity}</span></label><input type="range" min="1" max="10" value={intensity} onChange={e=>setIntensity(+e.target.value)} style={{width:'100%',accentColor:'var(--teal)',marginTop:8}}/></div>
            <div><label className="field-label">Trigger tags</label><div className="tag-row">{TRIGGER_TAGS.map(t=><button key={t} className={`tag ${tags.includes(t)?'active':''}`} onClick={()=>toggle(t)}>{t}</button>)}</div></div>
            <button className="btn-primary" style={{width:'100%'}} onClick={()=>{if(where||why)setSubmitted(true);}}>Save Entry</button>
          </div>
        </div>
      ):(
        <div className="card">
          <div className="ai-insight">You&apos;ve been logging urges related to <strong>{tags[0]||'stress'}</strong> in <strong>{where||'various'}</strong> settings. Consider a &ldquo;When-Then&rdquo; plan: <em>&ldquo;When I feel {tags[0]||'this'}, THEN I will call my sponsor.&rdquo;</em></div>
          <button className="btn-ghost" style={{marginTop:14,width:'100%'}} onClick={()=>setSubmitted(false)}>Log another</button>
        </div>
      )}
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}><div className="section-title">Recent Entries</div></div>
        <div className="past-entries">
          {entries.map((e,i)=>(
            <div key={i} className="entry-chip">
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                <span style={{fontSize:'0.72rem',color:'var(--muted)'}}>{e.date}</span>
                <span style={{fontSize:'0.7rem',background:'rgba(245,158,11,0.15)',color:'var(--amber)',padding:'2px 8px',borderRadius:10}}>{e.trigger}</span>
              </div>
              <div style={{color:'var(--text)',lineHeight:1.5}}>{e.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PledgeTab() {
  const [time,setTime]=useState<"morning"|"evening">("morning");
  const [checked,setChecked]=useState<Record<string,boolean>>({});
  const [mood,setMood]=useState<number|null>(null);
  const pledges=time==="morning"?MORNING_PLEDGES:EVENING_REFLECTIONS;
  const toggle=(id: string)=>setChecked(p=>({...p,[id]:!p[id]}));
  const done=pledges.filter(p=>checked[p.id]).length;
  return (
    <div className="content">
      <div className="card">
        <div className="card-label">{time==="morning"?"☀️ Morning Check-In":"🌙 Evening Reflection"}</div>
        <div className="pledge-time">
          <button className={`pledge-time-btn ${time==='morning'?'active':''}`} onClick={()=>setTime('morning')}>Morning</button>
          <button className={`pledge-time-btn ${time==='evening'?'active':''}`} onClick={()=>setTime('evening')}>Evening</button>
        </div>
        <div className="card-label" style={{marginBottom:8}}>How are you feeling?</div>
        <div className="mood-row">
          {["😔","😟","😐","🙂","😊"].map((m,i)=><button key={i} className={`mood-btn ${mood===i?'active':''}`} onClick={()=>setMood(i)}>{m}</button>)}
        </div>
        <div className="pledge-items" style={{marginTop:14}}>
          {pledges.map(p=>(
            <div key={p.id} className={`pledge-item ${checked[p.id]?'checked':''}`} onClick={()=>toggle(p.id)}>
              <div className="pledge-checkbox">{checked[p.id]&&<span style={{color:'#0a1628',fontSize:'0.9rem'}}>✓</span>}</div>
              <div className="pledge-text">{p.text}<small>{p.sub}</small></div>
            </div>
          ))}
        </div>
        {done===pledges.length&&done>0&&(
          <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(245,158,11,0.1)',border:'1px solid rgba(245,158,11,0.3)',borderRadius:12,padding:'14px 18px',marginTop:16}}>
            <div style={{fontSize:'1.5rem'}}>🔥</div>
            <div style={{fontSize:'0.85rem',color:'var(--text)'}}><strong style={{color:'var(--amber)'}}>Check-in complete!</strong> You&apos;re building a real habit.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CoachTab() {
  const [messages,setMessages]=useState([{from:"coach",text:"Hi — I'm your Recovery Coach. I'm not a therapist or doctor, but I'm here to offer evidence-based support, 24/7. What's on your mind today?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [crisis,setCrisis]=useState(false);
  const bottomRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);

  const sendMessage=async()=>{
    if(!input.trim()||loading) return;
    const userMsg=input.trim();
    setInput("");
    setLoading(true);
    setMessages(m=>[...m,{from:"user",text:userMsg}]);
    try {
      const history=messages.map(m=>({role:m.from==="user"?"user":"assistant",content:m.text}));
      const res=await fetch("/api/coach",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[...history,{role:"user",content:userMsg}]})});
      const data=await res.json();
      if(data.crisisDetected) setCrisis(true);
      setMessages(m=>[...m,{from:"coach",text:data.reply}]);
    } catch {
      setMessages(m=>[...m,{from:"coach",text:"I'm having trouble connecting. If you're in crisis, please call SAMHSA at 1-800-662-4357 or text HOME to 741741."}]);
    } finally { setLoading(false); }
  };

  return (
    <div className="content">
      {crisis&&(
        <div style={{background:'rgba(251,113,133,0.1)',border:'1px solid var(--rose)',borderRadius:'14px',padding:'14px 16px'}}>
          <div style={{color:'var(--rose)',fontWeight:600,marginBottom:4}}>🆘 Crisis resources</div>
          <div style={{fontSize:'0.82rem',color:'var(--muted)'}}>Call 988 · Text HOME to 741741 · Call 911 if in immediate danger</div>
        </div>
      )}
      <div className="card">
        <div className="card-label">AI Recovery Coach · CBT + DBT</div>
        <div className="coach-messages">
          {messages.map((m,i)=>(
            <div key={i} className={`msg ${m.from}`}>
              <div className="msg-from">{m.from==="coach"?"✦ Recovery Coach":"You"}</div>
              {m.text}
            </div>
          ))}
          {loading&&<div className="msg coach"><div className="msg-from">✦ Recovery Coach</div><div className="typing-dots"><span/><span/><span/></div></div>}
          <div ref={bottomRef}/>
        </div>
        <div className="chat-input-row">
          <input className="chat-input" placeholder="Share what's on your mind…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage()}/>
          <button className="chat-send" onClick={sendMessage}>↑</button>
        </div>
      </div>
      <div className="card" style={{padding:'16px 20px'}}>
        <div className="card-label" style={{marginBottom:6}}>Privacy Promise</div>
        <div style={{fontSize:'0.8rem',color:'var(--muted)',lineHeight:1.6}}>Conversations are encrypted in transit. Your API key is server-side only. You can delete everything at any time.</div>
      </div>
    </div>
  );
}

export default function UrgeStop() {
  const [tab,setTab]=useState("home");
  const [showGrounding,setShowGrounding]=useState(false);
  const [showCrisis,setShowCrisis]=useState(false);
  const days=47; // TODO: replace with real value from Supabase

  const TABS=[
    {id:"home",label:"Home"},
    {id:"sober",label:"Tracker"},
    {id:"journal",label:"Journal"},
    {id:"pledge",label:"Pledges"},
    {id:"coach",label:"Coach"},
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="logo">Urge<span>Stop</span></div>
          <button className="crisis-btn" onClick={()=>setShowCrisis(true)}>🆘 Crisis Help</button>
        </div>
        <div className="nav">
          {TABS.map(t=><button key={t.id} className={`tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        </div>

        {tab==="home"    && <DashboardTab days={days} onUrge={()=>setShowGrounding(true)} onCrisis={()=>setShowCrisis(true)}/>}
        {tab==="sober"   && <SobrietyTab days={days}/>}
        {tab==="journal" && <JournalTab/>}
        {tab==="pledge"  && <PledgeTab/>}
        {tab==="coach"   && <CoachTab/>}

        {showGrounding && (
          <div style={{position:'fixed',inset:0,zIndex:100,overflowY:'auto'}}>
            <GroundingExercise onClose={()=>setShowGrounding(false)}/>
          </div>
        )}
        {showCrisis && <CrisisOverlay onClose={()=>setShowCrisis(false)}/>}
      </div>
    </>
  );
}
