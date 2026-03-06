"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300&family=Instrument+Sans:wght@400;500;600&display=swap');
  :root {
    --ink:#0e1a14; --paper:#f0ede6; --sage:#5a7a5e; --sage2:#7fa882;
    --moss:#3d5c42; --gold:#c8a84b; --fog:#8fa890;
    --serif:'Fraunces',Georgia,serif; --sans:'Instrument Sans',system-ui,sans-serif;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ripple { 0%{transform:scale(0.6);opacity:0.6} 100%{transform:scale(2.8);opacity:0} }
  @keyframes checkPop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
  @keyframes pulse-gentle { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.04);opacity:0.85} }
  @keyframes burst { 0%{transform:scale(0) rotate(0deg);opacity:1} 100%{transform:scale(2.5) rotate(180deg);opacity:0} }
  @keyframes wiggle { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
`;

const STEPS = [
  { n:5, sense:"SEE", verb:"see", icon:"👁", color:"#5a7a5e", bg:"linear-gradient(135deg,#e8f0e8,#d4e4d4)", accent:"#3d5c42",
    prompt:"Look around slowly. Name 5 things you can see right now.",
    hint:"A crack in the wall, the light switch, your own hands…",
    science:"Visual grounding anchors your nervous system to the present moment, interrupting the amygdala's threat loop." },
  { n:4, sense:"TOUCH", verb:"physically feel", icon:"✋", color:"#7a6545", bg:"linear-gradient(135deg,#f0e8d8,#e4d8c4)", accent:"#5a4530",
    prompt:"Notice your body. Name 4 things you can physically feel.",
    hint:"The weight of your feet, fabric on skin, warmth in your hands…",
    science:"Somatic awareness activates body-based processing pathways that counter dissociation during high-stress moments." },
  { n:3, sense:"HEAR", verb:"hear", icon:"👂", color:"#4a6578", bg:"linear-gradient(135deg,#dce8f0,#c8d8e8)", accent:"#2a4558",
    prompt:"Go quiet for a moment. What are 3 sounds around you?",
    hint:"Traffic outside, your own breath, the hum of a device…",
    science:"Auditory attention expands the Window of Tolerance — moving you from reactive back to regulated." },
  { n:2, sense:"SMELL", verb:"smell", icon:"👃", color:"#6a5878", bg:"linear-gradient(135deg,#e8dcea,#d8cce0)", accent:"#4a3858",
    prompt:"Breathe in. Notice 2 scents — even faint ones.",
    hint:"Your own skin, fresh air, coffee, fabric…",
    science:"Olfactory processing has the most direct pathway to the limbic system — the fastest route to emotional regulation." },
  { n:1, sense:"TASTE", verb:"taste", icon:"👅", color:"#785a4a", bg:"linear-gradient(135deg,#f0e4dc,#e8d4c8)", accent:"#583a2a",
    prompt:"Pay attention to your mouth. What's 1 taste you notice?",
    hint:"Water, toothpaste, the air itself — anything counts.",
    science:"This final anchor completes the full sensory sweep, signalling to your prefrontal cortex that you are safe right now." },
];

const GAME_DURATION = 10;

function DistractionGame({ onComplete }: { onComplete: () => void }) {
  const [targets, setTargets] = useState<{id:number;x:number;y:number;size:number;color:string}[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [particles, setParticles] = useState<{id:number;x:number;y:number;color:string}[]>([]);
  const [phase, setPhase] = useState<"ready"|"playing"|"done">("ready");
  const nextId = useRef(0);

  const spawnTarget = useCallback(() => {
    const id = nextId.current++;
    const colors = ["#5a7a5e","#c8a84b","#7a6545","#4a6578","#785a4a"];
    setTargets(t => [...t, {
      id, x: 5 + Math.random()*82, y: 10 + Math.random()*72,
      size: 44 + Math.random()*28, color: colors[Math.floor(Math.random()*colors.length)]
    }]);
    setTimeout(() => setTargets(t => t.filter(i => i.id !== id)), 1400 + Math.random()*600);
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const si = setInterval(spawnTarget, 500);
    const ci = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(si); clearInterval(ci); setTimeout(() => setPhase("done"), 300); return 0; }
        return t - 1;
      });
    }, 1000);
    spawnTarget();
    return () => { clearInterval(si); clearInterval(ci); };
  }, [phase, spawnTarget]);

  const handleTap = (e: React.MouseEvent, target: typeof targets[0]) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pid = Date.now();
    setParticles(p => [...p, { id:pid, x:rect.left+rect.width/2, y:rect.top+rect.height/2, color:target.color }]);
    setTargets(t => t.filter(i => i.id !== target.id));
    setScore(s => s + 1);
    setTimeout(() => setParticles(p => p.filter(i => i.id !== pid)), 600);
  };

  if (phase === "ready") return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:20,padding:'32px 24px',animation:'scaleIn 0.4s ease'}}>
      <div style={{fontSize:'3rem',animation:'float 2s ease-in-out infinite'}}>🎯</div>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.5rem',color:'var(--ink)',textAlign:'center',fontWeight:300}}>10-Second Tap Game</div>
      <p style={{fontSize:'0.85rem',color:'var(--fog)',textAlign:'center',maxWidth:260,lineHeight:1.7}}>Tap every circle as fast as you can. Forces your brain to shift attention — one of the fastest urge-interrupt techniques known.</p>
      <button onClick={()=>setPhase("playing")} style={{background:'var(--moss)',color:'#fff',border:'none',fontFamily:'var(--sans)',fontSize:'0.95rem',fontWeight:600,padding:'13px 32px',borderRadius:30,cursor:'pointer',boxShadow:'0 4px 20px rgba(61,92,66,0.35)',transition:'transform 0.15s'}}
        onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.05)')} onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
        Start!
      </button>
    </div>
  );

  if (phase === "done") return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18,padding:'32px 24px',animation:'fadeUp 0.4s ease'}}>
      <div style={{fontSize:'2.5rem',animation:'wiggle 0.5s ease'}}>🏅</div>
      <div style={{fontFamily:'var(--serif)',fontSize:'1.4rem',color:'var(--ink)',fontWeight:300}}>You tapped {score} circles!</div>
      <p style={{fontSize:'0.82rem',color:'var(--fog)',textAlign:'center',maxWidth:270,lineHeight:1.7}}>Your brain just shifted into action mode. That's attentional redirection — a core CBT urge-interruption technique.</p>
      <div style={{display:'flex',gap:10}}>
        <button onClick={()=>{setScore(0);setTimeLeft(GAME_DURATION);setTargets([]);setPhase("ready");}}
          style={{background:'transparent',border:'1.5px solid var(--fog)',color:'var(--fog)',fontFamily:'var(--sans)',fontSize:'0.82rem',padding:'10px 20px',borderRadius:24,cursor:'pointer',transition:'transform 0.15s'}}
          onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.05)')} onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
          Play again
        </button>
        <button onClick={onComplete}
          style={{background:'var(--moss)',color:'#fff',border:'none',fontFamily:'var(--sans)',fontSize:'0.85rem',fontWeight:600,padding:'10px 24px',borderRadius:24,cursor:'pointer',transition:'transform 0.15s'}}
          onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.05)')} onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
          Continue →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{position:'relative',width:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 20px 8px'}}>
        <div style={{fontFamily:'var(--serif)',fontSize:'1rem',color:'var(--ink)',fontWeight:300}}>
          Tap them fast! <span style={{color:'var(--gold)',fontWeight:500}}>{score} ✓</span>
        </div>
        <svg width="48" height="48" style={{transform:'rotate(-90deg)'}}>
          <circle cx="24" cy="24" r="20" fill="none" stroke="#e0dbd4" strokeWidth="4"/>
          <circle cx="24" cy="24" r="20" fill="none" stroke="var(--sage)" strokeWidth="4"
            strokeDasharray="125.6" strokeDashoffset={125.6*(1-timeLeft/GAME_DURATION)}
            style={{transition:'stroke-dashoffset 1s linear'}}/>
          <text x="24" y="28" textAnchor="middle" fontSize="11" fill="var(--ink)"
            fontFamily="var(--sans)" fontWeight="600"
            style={{transform:'rotate(90deg)',transformOrigin:'24px 24px'}}>{timeLeft}</text>
        </svg>
      </div>
      <div style={{position:'relative',width:'100%',height:240,background:'linear-gradient(135deg,#e8f0e8,#dce8dc)',borderRadius:'0 0 16px 16px',overflow:'hidden'}}>
        {targets.map(t => (
          <button key={t.id} onClick={e=>handleTap(e,t)} style={{
            position:'absolute',left:`${t.x}%`,top:`${t.y}%`,width:t.size,height:t.size,
            borderRadius:'50%',background:t.color,border:'3px solid rgba(255,255,255,0.5)',
            cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.15)',animation:'scaleIn 0.2s ease',
            transform:'translate(-50%,-50%)',transition:'transform 0.1s',
          }}
            onMouseEnter={e=>(e.currentTarget.style.transform='translate(-50%,-50%) scale(1.15)')}
            onMouseLeave={e=>(e.currentTarget.style.transform='translate(-50%,-50%) scale(1)')}
          />
        ))}
        {particles.map(p => (
          <div key={p.id} style={{position:'fixed',left:p.x,top:p.y,width:28,height:28,borderRadius:'50%',
            background:p.color,marginLeft:-14,marginTop:-14,animation:'burst 0.5s ease-out forwards',
            pointerEvents:'none',zIndex:9999}}/>
        ))}
      </div>
    </div>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div style={{display:'flex',gap:8,justifyContent:'center'}}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{width:i===current?24:8,height:8,borderRadius:4,
          background:i<current?'var(--sage)':i===current?'var(--moss)':'#ccc9c2',
          transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)'}}/>
      ))}
    </div>
  );
}

interface GroundingExerciseProps {
  onClose?: () => void;
}

export default function GroundingExercise({ onClose }: GroundingExerciseProps) {
  const [mode, setMode] = useState<"intro"|"game"|"grounding"|"complete">("intro");
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(Array(5).fill([]));
  const [inputVal, setInputVal] = useState("");
  const [stepKey, setStepKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const step = STEPS[stepIdx];

  useEffect(() => {
    if (mode === "grounding") setTimeout(() => inputRef.current?.focus(), 500);
  }, [mode, stepIdx]);

  const addAnswer = () => {
    const val = inputVal.trim();
    if (!val || answers[stepIdx].length >= step.n) return;
    setAnswers(prev => { const n=[...prev]; n[stepIdx]=[...n[stepIdx],val]; return n; });
    setInputVal("");
    inputRef.current?.focus();
  };

  const goNext = () => {
    if (stepIdx < STEPS.length-1) { setStepIdx(s=>s+1); setStepKey(k=>k+1); setInputVal(""); }
    else setMode("complete");
  };

  const wrap = (children: React.ReactNode) => (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{minHeight:'100vh',background:'var(--paper)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:'var(--sans)'}}>
        {children}
      </div>
    </>
  );

  const card = (children: React.ReactNode, extra: React.CSSProperties = {}) => (
    <div style={{maxWidth:440,width:'100%',background:'#fff',borderRadius:24,boxShadow:'0 8px 48px rgba(14,26,20,0.08)',overflow:'hidden',...extra}}>
      {children}
    </div>
  );

  if (mode === "intro") return wrap(card(
    <>
      <div style={{background:'linear-gradient(135deg,#e8f0e8,#d4e4d4)',padding:'36px 32px 28px',textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:14,animation:'float 3s ease-in-out infinite'}}>🌿</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.9rem',color:'var(--ink)',fontWeight:300,lineHeight:1.3}}>
          You&apos;re safe.<br/>Let&apos;s come back <em>right here.</em>
        </div>
      </div>
      <div style={{padding:'24px 28px 28px',display:'flex',flexDirection:'column',gap:16}}>
        <p style={{fontSize:'0.88rem',color:'var(--fog)',lineHeight:1.75,textAlign:'center'}}>The 5-4-3-2-1 technique re-engages all five senses to interrupt urge cycles.</p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {STEPS.map(s=>(
            <div key={s.n} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:12,background:s.bg,fontSize:'0.85rem',color:'var(--ink)'}}>
              <span style={{fontSize:'1.2rem'}}>{s.icon}</span>
              <span><strong style={{fontFamily:'var(--serif)',fontWeight:500}}>{s.n}</strong> things you can <strong>{s.verb}</strong></span>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:10,marginTop:4}}>
          <button onClick={()=>setMode("game")} style={{flex:1,background:'transparent',border:'1.5px solid var(--sage)',color:'var(--sage)',fontFamily:'var(--sans)',fontSize:'0.85rem',fontWeight:600,padding:'12px',borderRadius:24,cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='var(--sage)';(e.currentTarget as HTMLButtonElement).style.color='#fff';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent';(e.currentTarget as HTMLButtonElement).style.color='var(--sage)';}}>
            🎯 Quick game
          </button>
          <button onClick={()=>setMode("grounding")} style={{flex:2,background:'var(--moss)',color:'#fff',border:'none',fontFamily:'var(--sans)',fontSize:'0.9rem',fontWeight:600,padding:'12px',borderRadius:24,cursor:'pointer',boxShadow:'0 4px 20px rgba(61,92,66,0.3)',transition:'transform 0.15s'}}
            onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.03)')} onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
            Start 5-4-3-2-1 →
          </button>
        </div>
        {onClose && <button onClick={onClose} style={{background:'none',border:'none',color:'var(--fog)',fontSize:'0.82rem',cursor:'pointer',textAlign:'center',marginTop:4}}>← Back to app</button>}
      </div>
    </>
  ));

  if (mode === "game") return wrap(card(
    <div style={{padding:'20px 0 0'}}><DistractionGame onComplete={()=>setMode("grounding")}/></div>
  ));

  if (mode === "grounding") {
    const stepAnswers = answers[stepIdx];
    const isComplete = stepAnswers.length >= step.n;
    return wrap(card(
      <>
        <div style={{height:4,background:'#ede9e2'}}>
          <div style={{height:'100%',background:`linear-gradient(90deg,var(--sage),var(--moss))`,
            width:`${(stepAnswers.length/step.n)*(1/5)*100 + stepIdx*20}%`,transition:'width 0.5s ease'}}/>
        </div>
        <div key={`h-${stepKey}`} style={{padding:'24px 24px 16px',background:step.bg,animation:'fadeUp 0.4s ease'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <StepDots total={STEPS.length} current={stepIdx}/>
            <span style={{fontSize:'0.7rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:step.color}}>Step {stepIdx+1} of 5</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:12}}>
            <div style={{width:64,height:64,borderRadius:'50%',flexShrink:0,background:`${step.accent}22`,border:`2.5px solid ${step.color}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',animation:'float 3s ease-in-out infinite',position:'relative'}}>
              {step.icon}
              {[0,1].map(i=><div key={i} style={{position:'absolute',inset:-8,borderRadius:'50%',border:`2px solid ${step.color}30`,animation:`ripple 2.4s ease-out ${i*1.2}s infinite`,pointerEvents:'none'}}/>)}
            </div>
            <div>
              <div style={{fontSize:'0.68rem',fontWeight:600,letterSpacing:'0.15em',textTransform:'uppercase',color:step.color,marginBottom:3}}>{step.sense}</div>
              <div style={{fontFamily:'var(--serif)',fontSize:'1.4rem',color:'var(--ink)',fontWeight:300,lineHeight:1.2}}>Name <em style={{color:step.accent}}>{step.n}</em> things<br/>you can {step.verb}</div>
            </div>
          </div>
          <p style={{fontSize:'0.8rem',color:step.accent,lineHeight:1.65}}>💡 {step.hint}</p>
        </div>
        <div key={`b-${stepKey}`} style={{padding:'18px 22px',animation:'fadeUp 0.35s ease 0.15s both'}}>
          {stepAnswers.length > 0 && (
            <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
              {stepAnswers.map((a,i)=>(
                <div key={i} style={{display:'inline-flex',alignItems:'center',gap:6,background:`${step.color}12`,border:`1.5px solid ${step.color}55`,borderRadius:20,padding:'5px 12px',animation:'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',fontSize:'0.83rem',color:'var(--ink)'}}>
                  <span style={{width:16,height:16,borderRadius:'50%',background:step.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.6rem',color:'#fff'}}>✓</span>
                  {a}
                  <button onClick={()=>setAnswers(prev=>{const n=[...prev];n[stepIdx]=n[stepIdx].filter((_,j)=>j!==i);return n;})} style={{background:'none',border:'none',cursor:'pointer',color:`${step.color}88`,fontSize:'0.85rem'}}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <div style={{fontSize:'0.76rem',color:'var(--fog)'}}>{stepAnswers.length}/{step.n} answered</div>
            <div style={{display:'flex',gap:4}}>
              {Array.from({length:step.n}).map((_,i)=>(
                <div key={i} style={{width:20,height:20,borderRadius:'50%',background:i<stepAnswers.length?step.color:'#ece8e1',border:`2px solid ${i<stepAnswers.length?step.color:'#d4cfc8'}`,transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.6rem',color:'#fff'}}>{i<stepAnswers.length?'✓':''}</div>
              ))}
            </div>
          </div>
          {!isComplete && (
            <div style={{display:'flex',gap:8,marginBottom:12}}>
              <input ref={inputRef} value={inputVal} onChange={e=>setInputVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addAnswer()} placeholder={step.prompt}
                style={{flex:1,background:'#f7f5f2',border:`1.5px solid ${inputVal?step.color+'88':'#ddd8d0'}`,borderRadius:12,color:'var(--ink)',fontFamily:'var(--sans)',fontSize:'0.88rem',padding:'10px 14px',outline:'none',transition:'border-color 0.2s'}}/>
              <button onClick={addAnswer} disabled={!inputVal.trim()} style={{background:inputVal.trim()?step.color:'#ddd8d0',color:'#fff',border:'none',borderRadius:12,width:42,flexShrink:0,cursor:inputVal.trim()?'pointer':'default',fontSize:'1.1rem',transition:'all 0.2s'}}>+</button>
            </div>
          )}
          <div style={{background:'#f7f5f2',borderRadius:10,padding:'10px 14px',marginBottom:14,borderLeft:`3px solid ${step.color}55`}}>
            <p style={{fontSize:'0.75rem',color:'var(--fog)',lineHeight:1.65}}><strong style={{color:'var(--ink)'}}>Why this works: </strong>{step.science}</p>
          </div>
          <div style={{display:'flex',gap:10}}>
            {stepIdx>0&&<button onClick={()=>{setStepIdx(s=>s-1);setStepKey(k=>k+1);setInputVal("");}} style={{background:'transparent',border:'1.5px solid #ddd8d0',color:'var(--fog)',fontFamily:'var(--sans)',fontSize:'0.85rem',padding:'11px 16px',borderRadius:24,cursor:'pointer'}}>← Back</button>}
            <button onClick={goNext} disabled={stepAnswers.length===0} style={{flex:1,background:isComplete?`linear-gradient(135deg,${step.color},${step.accent})`:stepAnswers.length>0?step.color:'#ddd8d0',color:'#fff',border:'none',fontFamily:'var(--sans)',fontSize:'0.88rem',fontWeight:600,padding:'12px',borderRadius:24,cursor:stepAnswers.length>0?'pointer':'default',transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',boxShadow:stepAnswers.length>0?`0 4px 20px ${step.color}44`:'none',animation:isComplete?'pulse-gentle 1.5s ease-in-out infinite':'none'}}>
              {isComplete?(stepIdx<4?'✓ Next sense →':'✓ Complete'):`Continue (${stepAnswers.length}/${step.n})`}
            </button>
          </div>
        </div>
      </>
    ));
  }

  const allAnswers = answers.flat();
  return wrap(card(
    <>
      <div style={{background:'linear-gradient(135deg,#e8f0e8,#d4e4d4)',padding:'32px 28px 24px',textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:12,animation:'float 2.5s ease-in-out infinite'}}>🌱</div>
        <div style={{fontFamily:'var(--serif)',fontSize:'1.7rem',color:'var(--ink)',fontWeight:300,lineHeight:1.3}}>You surfed <em style={{color:'var(--moss)'}}>the entire wave.</em></div>
        <p style={{fontSize:'0.83rem',color:'var(--fog)',marginTop:10,lineHeight:1.7}}>Your parasympathetic nervous system is now activated. The urge peak has passed.</p>
      </div>
      <div style={{padding:'22px 24px 28px',display:'flex',flexDirection:'column',gap:14}}>
        <div style={{fontFamily:'var(--serif)',fontSize:'1rem',color:'var(--ink)'}}>Your grounding anchors:</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
          {STEPS.map((s,si)=>answers[si].map((a,ai)=>(
            <div key={`${si}-${ai}`} style={{display:'inline-flex',alignItems:'center',gap:6,background:`${s.color}12`,border:`1px solid ${s.color}44`,borderRadius:16,padding:'5px 12px',fontSize:'0.8rem',color:'var(--ink)',animation:`scaleIn 0.3s ease ${(si*3+ai)*0.06}s both`}}>
              <span>{s.icon}</span>{a}
            </div>
          )))}
        </div>
        <div style={{background:'#f7f5f2',borderRadius:12,padding:'12px 14px',borderLeft:'3px solid var(--sage)'}}>
          <p style={{fontSize:'0.8rem',color:'var(--fog)',lineHeight:1.7}}><strong style={{color:'var(--ink)'}}>Remember: </strong>You named {allAnswers.length} real things in your real world right now. This moment is survivable. The urge was a wave. You&apos;re still here.</p>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={()=>{setMode("intro");setStepIdx(0);setAnswers(Array(5).fill([]));setInputVal("");setStepKey(0);}}
            style={{flex:1,background:'transparent',border:'1.5px solid var(--sage)',color:'var(--sage)',fontFamily:'var(--sans)',fontSize:'0.85rem',fontWeight:600,padding:'12px',borderRadius:24,cursor:'pointer',transition:'all 0.2s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='var(--sage)';(e.currentTarget as HTMLButtonElement).style.color='#fff';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='transparent';(e.currentTarget as HTMLButtonElement).style.color='var(--sage)';}}>
            Start over
          </button>
          {onClose && (
            <button onClick={onClose} style={{flex:2,background:'var(--moss)',color:'#fff',border:'none',fontFamily:'var(--sans)',fontSize:'0.88rem',fontWeight:600,padding:'12px',borderRadius:24,cursor:'pointer',boxShadow:'0 4px 20px rgba(61,92,66,0.3)',transition:'transform 0.15s'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.03)')} onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
              Back to dashboard →
            </button>
          )}
        </div>
      </div>
    </>
  ));
}
