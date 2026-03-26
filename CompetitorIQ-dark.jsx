import { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Area, AreaChart } from "recharts";
import { Search, Download, MessageSquare, TrendingUp, ShoppingBag, Megaphone, Smartphone, Globe, ChevronRight, ChevronDown, ArrowUpRight, ArrowDownRight, X, Send, Bot, User, FileText, BarChart3, Eye, ExternalLink, Clock, Flame, Star, Zap, Bell, Hash, ThumbsUp, Activity, Layers, Radio } from "lucide-react";

/* ════════════════════════════════════════
   DATA
   ════════════════════════════════════════ */
const BRANDS = {
  MCD: { name: "McDonald's", color: "#FF6B35", bg: "rgba(255,107,53,0.12)" },
  KFC: { name: "KFC", color: "#FF3366", bg: "rgba(255,51,102,0.12)" },
  SIMONS: { name: "Simons", color: "#00D4FF", bg: "rgba(0,212,255,0.12)" },
  BAMBA: { name: "Bamba Marha", color: "#00FF94", bg: "rgba(0,255,148,0.12)" },
  ZING: { name: "Zing Burger", color: "#FFB800", bg: "rgba(255,184,0,0.12)" },
};

const MONTHS = ["Oct","Nov","Dec","Jan","Feb","Mar"];
const genTrend = (base, v) => MONTHS.map(m => ({ month: m, value: +(base + (Math.random()-0.3)*v).toFixed(1) }));

const socialData = {
  MCD: { followers: "412K", posts: 47, engagement: "3.2%", trend: genTrend(3.0,1.2), sentiment: { pos:58, neu:30, neg:12 } },
  KFC: { followers: "198K", posts: 34, engagement: "4.1%", trend: genTrend(3.8,1.5), sentiment: { pos:52, neu:33, neg:15 } },
  SIMONS: { followers: "45K", posts: 22, engagement: "6.8%", trend: genTrend(6.2,2.0), sentiment: { pos:71, neu:22, neg:7 } },
  BAMBA: { followers: "38K", posts: 18, engagement: "5.9%", trend: genTrend(5.5,1.8), sentiment: { pos:68, neu:25, neg:7 } },
  ZING: { followers: "52K", posts: 28, engagement: "7.2%", trend: genTrend(6.8,2.2), sentiment: { pos:74, neu:19, neg:7 } },
};

const productChanges = [
  { brand:"MCD", name:"Grand McExtreme Bacon", category:"Burger", price:"2,290 Ft", type:"new", date:"Mar 18", ingredients:"Angus beef, extreme sauce, crispy bacon, aged cheddar", sentiment:82, comments:234 },
  { brand:"KFC", name:"Nashville Hot Wrap", category:"Wrap", price:"1,890 Ft", type:"new", date:"Mar 15", ingredients:"Nashville hot chicken, slaw, ranch, flour tortilla", sentiment:76, comments:187 },
  { brand:"MCD", name:"McCrispy Deluxe", category:"Chicken", price:"2,490 Ft", type:"new", date:"Mar 12", ingredients:"Crispy chicken fillet, lettuce, mayo, sesame bun", sentiment:89, comments:412 },
  { brand:"SIMONS", name:"Truffle Smash", category:"Burger", price:"3,490 Ft", type:"new", date:"Mar 10", ingredients:"Double smashed patty, truffle mayo, gruyère", sentiment:94, comments:156 },
  { brand:"MCD", name:"McRib Seasonal", category:"Burger", price:"1,990 Ft", type:"delisted", date:"Mar 8", ingredients:"Pork patty, BBQ sauce, onions, pickles", sentiment:45, comments:89 },
  { brand:"KFC", name:"Zinger Tower", category:"Burger", price:"2,190 Ft", type:"new", date:"Mar 5", ingredients:"Zinger fillet, hash brown, cheese, tower sauce", sentiment:71, comments:203 },
  { brand:"ZING", name:"Korean BBQ Burger", category:"Burger", price:"3,290 Ft", type:"new", date:"Mar 3", ingredients:"Beef patty, gochujang glaze, kimchi slaw", sentiment:91, comments:178 },
  { brand:"BAMBA", name:"Wagyu Smash", category:"Burger", price:"4,190 Ft", type:"new", date:"Mar 1", ingredients:"Wagyu beef, aged cheddar, house sauce, brioche", sentiment:96, comments:142 },
];

const campaigns = [
  { brand:"MCD", name:"Spring Into Flavor", channels:["TV","Social","OOH"], status:"active", reach:"2.1M", spend:"~45M Ft" },
  { brand:"KFC", name:"So Good Challenge", channels:["Social","TikTok"], status:"active", reach:"890K", spend:"~15M Ft" },
  { brand:"MCD", name:"Happy Meal x Minecraft", channels:["TV","Social","In-store"], status:"active", reach:"1.8M", spend:"~30M Ft" },
  { brand:"SIMONS", name:"Craft Your Way", channels:["Social","Influencer"], status:"active", reach:"320K", spend:"~5M Ft" },
  { brand:"ZING", name:"Smash It Up", channels:["Social","Influencer","OOH"], status:"active", reach:"210K", spend:"~3M Ft" },
];

const appData = [
  { brand:"MCD", type:"coupon", title:"20% off Big Mac menu", code:"BIGMAC20", detail:"12.4K claimed" },
  { brand:"MCD", type:"push", title:"McCrispy Deluxe is here!", detail:"34% opened" },
  { brand:"KFC", type:"coupon", title:"Free Zinger with bucket", code:"FREEZ", detail:"8.2K claimed" },
  { brand:"KFC", type:"loyalty", title:"Double points weekend", detail:"High engagement" },
  { brand:"MCD", type:"coupon", title:"BOGO McNuggets", code:"NUGGET2", detail:"18.7K claimed" },
  { brand:"KFC", type:"push", title:"Nashville Hot is back!", detail:"28% opened" },
];

const priceHistory = MONTHS.map(m => ({
  month: m, MCD: Math.round(1990+Math.random()*400), KFC: Math.round(1890+Math.random()*350),
  SIMONS: Math.round(2990+Math.random()*600), ZING: Math.round(2790+Math.random()*500),
}));

const socialPosts = [
  { brand:"MCD", platform:"Instagram", content:"Introducing the Grand McExtreme Bacon — bold flavors, bigger bites.", likes:4521, comments:234, date:"Mar 18" },
  { brand:"MCD", platform:"TikTok", content:"POV: You're the first to try the McCrispy Deluxe #McCrispy", likes:12800, comments:567, date:"Mar 12" },
  { brand:"KFC", platform:"Instagram", content:"Nashville Hot is BACK. And this time it's wrapped up.", likes:3210, comments:187, date:"Mar 15" },
  { brand:"SIMONS", platform:"Instagram", content:"Truffle season is here. Handcrafted, never mass-produced.", likes:1890, comments:156, date:"Mar 10" },
  { brand:"ZING", platform:"Instagram", content:"Korean BBQ meets Hungarian craft. Limited edition.", likes:2340, comments:178, date:"Mar 3" },
  { brand:"KFC", platform:"TikTok", content:"#SoGoodChallenge — show us your best fried chicken reaction!", likes:8900, comments:432, date:"Mar 10" },
];

const aiResponses = {
  "default": "Ask me anything about competitor activity — products, campaigns, social performance, pricing, or market trends. I have access to all collected data.",
  "mcd": "**McDonald's March 2026 overview:**\n\n5 new products launched, led by Grand McExtreme Bacon (82% positive sentiment) and McCrispy Deluxe (89% positive, 412 social comments). 'Spring Into Flavor' campaign reached 2.1M across TV+Social+OOH with ~45M Ft estimated spend. App activity strong — BOGO McNuggets coupon hit 18.7K claims. Social engagement at 3.2% across 47 posts.",
  "kfc": "**KFC March 2026 overview:**\n\n2 new products — Nashville Hot Wrap (76% sentiment) and Zinger Tower (71%). 'So Good Challenge' on TikTok hit 890K reach with 8.9K likes on the hero video. App: 'Free Zinger with bucket' promo saw 8.2K claims. Double points weekend drove high loyalty engagement. Overall social engagement 4.1%.",
  "price": "**Price analysis March 2026:**\n\nMcDonald's avg burger: ~2,190 Ft (most affordable QSR). KFC: ~2,090 Ft. Artisan gap widening: Simons ~3,290 Ft, Zing ~3,040 Ft, Bamba ~4,190 Ft. MCD raised prices ~3% MoM, KFC held steady, artisan brands +5%. The QSR-artisan price gap is now 50-90%.",
  "social": "**Social media overview:**\n\nZing Burger leads engagement (7.2%) despite fewer followers (52K) vs McDonald's (412K, 3.2%). Artisan brands consistently outperform QSR in engagement. TikTok is KFC's strongest channel. Instagram dominates for artisan brands. Sentiment: Zing 74% positive (highest), KFC 52% (lowest).",
  "trend": "**Key trends March 2026:**\n\n1) Spicy variants dominating (Nashville Hot, Korean BBQ, Spicy McNuggets)\n2) Smash burgers expanding beyond artisan\n3) Collab culture strong (Minecraft Happy Meal)\n4) TikTok challenges = disproportionate reach/spend\n5) Artisan brands going ultra-premium (truffle, wagyu)",
};

function matchAI(q) {
  const l = q.toLowerCase();
  if (l.includes("mcdonald") || l.includes("mcd") || l.includes("meki")) return aiResponses.mcd;
  if (l.includes("kfc")) return aiResponses.kfc;
  if (l.includes("ár") || l.includes("price")) return aiResponses.price;
  if (l.includes("social") || l.includes("insta") || l.includes("tiktok")) return aiResponses.social;
  if (l.includes("trend") || l.includes("insight")) return aiResponses.trend;
  return aiResponses.default;
}

/* ════════════════════════════════════════
   FIRE LOADER COMPONENT
   ════════════════════════════════════════ */
const FireLoader = ({ size = 0.4 }) => (
  <div style={{ position:"relative", transform:`scale(${size})`, width:100, height:100 }}>
    <div style={{
      position:"absolute", top:0, left:0, width:100, height:100, borderRadius:"50%",
      borderTop:"solid 1px #ffbf48", borderBottom:"solid 1px #be4a1d",
      background:"linear-gradient(180deg, #ffbf4740, #bf4a1d80)",
      boxShadow:"inset 0 10px 10px 0 #ffbf4780, inset 0 -10px 10px 0 #bf4a1d80, 0 0 25px 0 #ffbf4780, 0 20px 50px 0 #bf4a1d80",
      animation:"fireColorize 6s ease-in-out infinite",
    }} />
    <svg width="0" height="0" style={{position:"absolute"}}>
      <defs>
        <mask id="fireMask">
          <rect width="100" height="100" fill="white"/>
        </mask>
      </defs>
    </svg>
    <style>{`
      @keyframes fireColorize { 0%{filter:hue-rotate(0deg)} 20%{filter:hue-rotate(-30deg)} 40%{filter:hue-rotate(-60deg)} 60%{filter:hue-rotate(-90deg)} 80%{filter:hue-rotate(-45deg)} 100%{filter:hue-rotate(0deg)} }
      @keyframes firePulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
    `}</style>
  </div>
);

/* ════════════════════════════════════════
   GLASS CARD COMPONENT
   ════════════════════════════════════════ */
const GlassCard = ({ children, style = {}, hover = true, glow = null, onClick }) => (
  <div onClick={onClick} style={{
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 16, padding: "20px",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    cursor: onClick ? "pointer" : "default",
    position: "relative", overflow: "hidden",
    ...(glow ? { boxShadow: `0 0 30px -10px ${glow}` } : {}),
    ...style,
  }}
  onMouseEnter={e => { if(hover) { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}}
  onMouseLeave={e => { if(hover) { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.transform="translateY(0)"; }}}
  >{children}</div>
);

/* ════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════ */
export default function CompetitorIQ() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBrands, setSelectedBrands] = useState(Object.keys(BRANDS));
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role:"ai", text:"Welcome to CompetitorIQ. Ask me anything about your competitors — products, campaigns, pricing, social performance, or market trends." }]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { setTimeout(() => setLoading(false), 2200); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  const toggleBrand = b => setSelectedBrands(p => p.includes(b) ? p.filter(x=>x!==b) : [...p,b]);
  const filtered = productChanges.filter(p => selectedBrands.includes(p.brand));

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMessages(p => [...p, { role:"user", text:msg }]);
    setChatInput("");
    setTimeout(() => setChatMessages(p => [...p, { role:"ai", text:matchAI(msg) }]), 800);
  };

  const TABS = [
    { id:"overview", label:"Overview", icon:Activity },
    { id:"products", label:"Products", icon:ShoppingBag },
    { id:"social", label:"Social", icon:Hash },
    { id:"campaigns", label:"Campaigns", icon:Megaphone },
    { id:"app", label:"App & Loyalty", icon:Smartphone },
    { id:"reports", label:"Reports", icon:FileText },
  ];

  const tooltipStyle = {
    backgroundColor: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, backdropFilter: "blur(10px)", fontSize: 12, color: "#fff",
  };

  // ── LOADING SCREEN ──
  if (loading) return (
    <div style={{
      background: "#0A0A0F", minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <FireLoader size={0.6} />
      <div style={{ marginTop: 40, fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
        Competitor<span style={{ color: "#FFB800" }}>IQ</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
        Initializing intelligence systems
      </div>
      <div style={{ marginTop: 24, width: 200, height: 2, background: "rgba(255,255,255,0.06)", borderRadius: 1, overflow: "hidden" }}>
        <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg, #FFB800, #FF6B35)", borderRadius: 1, animation: "loadBar 2s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes loadBar { 0%{width:0%;margin-left:0} 50%{width:80%;margin-left:0} 100%{width:0%;margin-left:100%} }`}</style>
    </div>
  );

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif", background: "#0A0A0F", minHeight: "100vh", color: "#E8E6E1",
      backgroundImage: "radial-gradient(ellipse at 20% 0%, rgba(255,184,0,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(255,107,53,0.03) 0%, transparent 50%)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glowPulse { 0%,100% { box-shadow: 0 0 20px -5px rgba(255,184,0,0.15); } 50% { box-shadow: 0 0 30px -5px rgba(255,184,0,0.25); } }
        .fade-up { animation: fadeUp 0.5s ease-out both; }
        .glow-pulse { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{
        padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ position:"relative", width:36, height:36 }}>
            <FireLoader size={0.36} />
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:700, letterSpacing:"-0.02em" }}>
              Competitor<span style={{ color:"#FFB800" }}>IQ</span>
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", letterSpacing:"0.05em" }}>COMPETITIVE INTELLIGENCE</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <select style={{
            background:"rgba(255,255,255,0.04)", color:"#E8E6E1", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10, padding:"8px 14px", fontSize:12, fontFamily:"'Outfit'", outline:"none",
          }}>
            <option>Hungary</option><option>Germany</option><option>Austria</option><option>UK</option><option>USA</option>
          </select>
          <select style={{
            background:"rgba(255,255,255,0.04)", color:"#E8E6E1", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:10, padding:"8px 14px", fontSize:12, fontFamily:"'Outfit'", outline:"none",
          }}>
            <option>March 2026</option><option>February 2026</option><option>January 2026</option>
          </select>
          <button onClick={() => setChatOpen(!chatOpen)} className="glow-pulse" style={{
            background: chatOpen ? "linear-gradient(135deg, #FFB800, #FF6B35)" : "rgba(255,184,0,0.1)",
            border: chatOpen ? "none" : "1px solid rgba(255,184,0,0.2)", borderRadius:12,
            padding:"8px 16px", color: chatOpen ? "#0A0A0F" : "#FFB800", fontSize:12, fontWeight:600,
            cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'Outfit'",
          }}>
            <Bot size={14} /> AI Assistant
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        padding:"0 28px", display:"flex", gap:2,
        borderBottom:"1px solid rgba(255,255,255,0.04)", background:"rgba(10,10,15,0.5)",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding:"14px 18px", border:"none", background:"transparent", cursor:"pointer",
            fontSize:13, fontWeight: activeTab===t.id ? 600 : 400, fontFamily:"'Outfit'",
            color: activeTab===t.id ? "#FFB800" : "rgba(255,255,255,0.35)",
            borderBottom: activeTab===t.id ? "2px solid #FFB800" : "2px solid transparent",
            display:"flex", alignItems:"center", gap:6, transition:"all 0.2s",
          }}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex" }}>
        {/* ── MAIN CONTENT ── */}
        <div style={{ flex:1, padding:24, maxWidth: chatOpen ? "calc(100% - 400px)" : "100%", transition:"max-width 0.3s" }}>

          {/* Brand Pills */}
          <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }} className="fade-up">
            {Object.keys(BRANDS).map(b => (
              <button key={b} onClick={() => toggleBrand(b)} style={{
                padding:"6px 16px", borderRadius:20, cursor:"pointer", fontFamily:"'Outfit'",
                border: selectedBrands.includes(b) ? `1px solid ${BRANDS[b].color}` : "1px solid rgba(255,255,255,0.08)",
                background: selectedBrands.includes(b) ? BRANDS[b].bg : "transparent",
                color: selectedBrands.includes(b) ? BRANDS[b].color : "rgba(255,255,255,0.35)",
                fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6, transition:"all 0.2s",
              }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background: BRANDS[b].color, opacity: selectedBrands.includes(b)?1:0.3 }} />
                {BRANDS[b].name}
              </button>
            ))}
          </div>

          {/* ══════ OVERVIEW ══════ */}
          {activeTab === "overview" && (
            <div className="fade-up">
              {/* Metric Cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14, marginBottom:24 }}>
                {[
                  { label:"New products", value: filtered.filter(p=>p.type==="new").length, change:23, icon:ShoppingBag, color:"#FFB800" },
                  { label:"Active campaigns", value: campaigns.filter(c=>selectedBrands.includes(c.brand)&&c.status==="active").length, change:12, icon:Megaphone, color:"#FF6B35" },
                  { label:"Avg engagement", value:"5.2%", change:8, icon:TrendingUp, color:"#00D4FF" },
                  { label:"Price changes", value:"7", change:-5, icon:Flame, color:"#FF3366" },
                ].map((m,i) => (
                  <GlassCard key={i} glow={m.color+"20"} style={{ animationDelay:`${i*0.1}s` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:500 }}>{m.label}</span>
                      <m.icon size={16} color={m.color} style={{ opacity:0.7 }} />
                    </div>
                    <div style={{ fontSize:32, fontWeight:700, color:"#fff", letterSpacing:"-0.03em" }}>{m.value}</div>
                    <div style={{ fontSize:12, marginTop:6, display:"flex", alignItems:"center", gap:4, color: m.change>0 ? "#00FF94" : "#FF3366" }}>
                      {m.change>0 ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {Math.abs(m.change)}% vs last month
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Engagement Trend */}
              <GlassCard style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h3 style={{ margin:0, fontSize:16, fontWeight:600, color:"#fff" }}>Social engagement trend</h3>
                  <button onClick={() => setActiveTab("social")} style={{ fontSize:12, color:"rgba(255,255,255,0.4)", background:"transparent", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"'Outfit'" }}>
                    Details <ChevronRight size={12}/>
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={MONTHS.map((m,i) => {
                    const o = { month:m };
                    Object.keys(BRANDS).forEach(b => { if(selectedBrands.includes(b)) o[b]=socialData[b].trend[i].value; });
                    return o;
                  })}>
                    <defs>
                      {Object.keys(BRANDS).map(b => (
                        <linearGradient key={b} id={`grad-${b}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={BRANDS[b].color} stopOpacity={0.2}/>
                          <stop offset="100%" stopColor={BRANDS[b].color} stopOpacity={0}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:"rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:"rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={tooltipStyle} />
                    {Object.keys(BRANDS).map(b => selectedBrands.includes(b) && (
                      <Area key={b} type="monotone" dataKey={b} stroke={BRANDS[b].color} strokeWidth={2} fill={`url(#grad-${b})`} dot={{ r:3, fill:BRANDS[b].color }} name={BRANDS[b].name} />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {/* Latest Products */}
                <GlassCard>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <h3 style={{ margin:0, fontSize:16, fontWeight:600, color:"#fff" }}>Latest product changes</h3>
                    <button onClick={() => setActiveTab("products")} style={{ fontSize:12, color:"rgba(255,255,255,0.4)", background:"transparent", border:"none", cursor:"pointer", fontFamily:"'Outfit'", display:"flex", alignItems:"center", gap:4 }}>All <ChevronRight size={12}/></button>
                  </div>
                  {filtered.slice(0,5).map((p,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 0", borderBottom: i<4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ width:8, height:8, borderRadius:"50%", background:BRANDS[p.brand]?.color }} />
                      <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:6, background: p.type==="new" ? "rgba(0,255,148,0.1)" : "rgba(255,51,102,0.1)", color: p.type==="new" ? "#00FF94" : "#FF3366" }}>{p.type}</span>
                      <span style={{ fontSize:13, flex:1, fontWeight:500 }}>{p.name}</span>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontFamily:"'JetBrains Mono'" }}>{p.price}</span>
                    </div>
                  ))}
                </GlassCard>

                {/* Sentiment */}
                <GlassCard>
                  <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:600, color:"#fff" }}>Sentiment by brand</h3>
                  {Object.keys(BRANDS).filter(b => selectedBrands.includes(b)).map(b => (
                    <div key={b} style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12 }}>
                        <span style={{ fontWeight:600, color:BRANDS[b].color }}>{BRANDS[b].name}</span>
                        <span style={{ color:"rgba(255,255,255,0.4)", fontFamily:"'JetBrains Mono'", fontSize:11 }}>
                          <span style={{ color:"#00FF94" }}>{socialData[b].sentiment.pos}%</span>{" · "}
                          <span>{socialData[b].sentiment.neu}%</span>{" · "}
                          <span style={{ color:"#FF3366" }}>{socialData[b].sentiment.neg}%</span>
                        </span>
                      </div>
                      <div style={{ display:"flex", height:4, borderRadius:2, overflow:"hidden", background:"rgba(255,255,255,0.04)" }}>
                        <div style={{ width:`${socialData[b].sentiment.pos}%`, background:"#00FF94" }} />
                        <div style={{ width:`${socialData[b].sentiment.neu}%`, background:"rgba(255,255,255,0.15)" }} />
                        <div style={{ width:`${socialData[b].sentiment.neg}%`, background:"#FF3366" }} />
                      </div>
                    </div>
                  ))}
                </GlassCard>
              </div>
            </div>
          )}

          {/* ══════ PRODUCTS ══════ */}
          {activeTab === "products" && (
            <div className="fade-up">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
                {[
                  { label:"New products", value:filtered.filter(p=>p.type==="new").length, icon:ShoppingBag, color:"#00FF94" },
                  { label:"Delisted", value:filtered.filter(p=>p.type==="delisted").length, icon:X, color:"#FF3366" },
                  { label:"Avg sentiment", value:Math.round(filtered.reduce((a,p)=>a+p.sentiment,0)/filtered.length)+"%", icon:Star, color:"#FFB800" },
                ].map((m,i) => (
                  <GlassCard key={i} glow={m.color+"20"}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{m.label}</span>
                      <m.icon size={14} color={m.color} style={{ opacity:0.7 }} />
                    </div>
                    <div style={{ fontSize:28, fontWeight:700, color:"#fff" }}>{m.value}</div>
                  </GlassCard>
                ))}
              </div>

              <GlassCard style={{ marginBottom:20 }}>
                <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:600, color:"#fff" }}>Burger price trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:"rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:"rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} domain={[1500,4500]} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v => `${v} Ft`} />
                    {selectedBrands.filter(b=>["MCD","KFC","SIMONS","ZING"].includes(b)).map(b => (
                      <Line key={b} type="monotone" dataKey={b} stroke={BRANDS[b].color} strokeWidth={2} dot={{ r:3, fill:BRANDS[b].color }} name={BRANDS[b].name} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard hover={false} style={{ padding:0, overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between" }}>
                  <h3 style={{ margin:0, fontSize:16, fontWeight:600, color:"#fff" }}>All product changes</h3>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>{filtered.length} items</span>
                </div>
                {filtered.map((p,i) => (
                  <div key={i}>
                    <div onClick={() => setExpandedProduct(expandedProduct===i?null:i)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.03)", cursor:"pointer", transition:"background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      {expandedProduct===i ? <ChevronDown size={14} color="rgba(255,255,255,0.3)"/> : <ChevronRight size={14} color="rgba(255,255,255,0.3)"/>}
                      <span style={{ width:10, height:10, borderRadius:"50%", background:BRANDS[p.brand]?.color }} />
                      <span style={{ fontSize:12, fontWeight:600, color:BRANDS[p.brand]?.color, minWidth:50 }}>{p.brand}</span>
                      <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:6, background:p.type==="new"?"rgba(0,255,148,0.1)":"rgba(255,51,102,0.1)", color:p.type==="new"?"#00FF94":"#FF3366" }}>{p.type}</span>
                      <span style={{ fontSize:13, fontWeight:500, flex:1 }}>{p.name}</span>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", minWidth:50 }}>{p.category}</span>
                      <span style={{ fontSize:13, fontWeight:600, fontFamily:"'JetBrains Mono'", minWidth:80, textAlign:"right" }}>{p.price}</span>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.25)", minWidth:50, textAlign:"right" }}>{p.date}</span>
                    </div>
                    {expandedProduct===i && (
                      <div style={{ padding:"16px 20px 20px 60px", background:"rgba(255,255,255,0.015)", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, fontSize:13 }}>
                          <div>
                            <div style={{ color:"rgba(255,255,255,0.35)", marginBottom:6, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Ingredients</div>
                            <div style={{ color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>{p.ingredients}</div>
                          </div>
                          <div style={{ display:"flex", gap:24 }}>
                            <div>
                              <div style={{ color:"rgba(255,255,255,0.35)", marginBottom:6, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Sentiment</div>
                              <div style={{ fontSize:28, fontWeight:700, color: p.sentiment>=70?"#00FF94":p.sentiment>=50?"#FFB800":"#FF3366" }}>{p.sentiment}%</div>
                            </div>
                            <div>
                              <div style={{ color:"rgba(255,255,255,0.35)", marginBottom:6, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em" }}>Comments</div>
                              <div style={{ fontSize:28, fontWeight:700, color:"#fff" }}>{p.comments}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </GlassCard>
            </div>
          )}

          {/* ══════ SOCIAL ══════ */}
          {activeTab === "social" && (
            <div className="fade-up">
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${selectedBrands.length > 4 ? 4 : selectedBrands.length}, 1fr)`, gap:14, marginBottom:24 }}>
                {Object.keys(BRANDS).filter(b => selectedBrands.includes(b)).slice(0,4).map(b => (
                  <GlassCard key={b} glow={BRANDS[b].color+"15"}>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>{BRANDS[b].name}</div>
                    <div style={{ fontSize:26, fontWeight:700, color:BRANDS[b].color }}>{socialData[b].engagement}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.25)", marginTop:4 }}>{socialData[b].followers} · {socialData[b].posts} posts</div>
                  </GlassCard>
                ))}
              </div>

              <GlassCard style={{ marginBottom:20 }}>
                <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:600, color:"#fff" }}>Engagement comparison</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={Object.keys(BRANDS).filter(b=>selectedBrands.includes(b)).map(b=>({ name:BRANDS[b].name, eng:parseFloat(socialData[b].engagement), fill:BRANDS[b].color }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fontSize:11, fill:"rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:11, fill:"rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="eng" radius={[8,8,0,0]} name="Engagement">
                      {Object.keys(BRANDS).filter(b=>selectedBrands.includes(b)).map((b,i) => <Cell key={i} fill={BRANDS[b].color} fillOpacity={0.8} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <GlassCard hover={false}>
                <h3 style={{ margin:"0 0 16px", fontSize:16, fontWeight:600, color:"#fff" }}>Recent posts</h3>
                {socialPosts.filter(p=>selectedBrands.includes(p.brand)).map((post,i) => (
                  <div key={i} style={{ padding:"16px 0", borderBottom: i<socialPosts.length-1 ? "1px solid rgba(255,255,255,0.03)" : "none" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                      <span style={{ width:10, height:10, borderRadius:"50%", background:BRANDS[post.brand]?.color }} />
                      <span style={{ fontSize:13, fontWeight:600, color:BRANDS[post.brand]?.color }}>{BRANDS[post.brand]?.name}</span>
                      <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.4)" }}>{post.platform}</span>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.25)", marginLeft:"auto" }}>{post.date}</span>
                    </div>
                    <p style={{ margin:"0 0 10px", fontSize:13, lineHeight:1.6, color:"rgba(255,255,255,0.6)" }}>{post.content}</p>
                    <div style={{ display:"flex", gap:20, fontSize:12, color:"rgba(255,255,255,0.3)" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}><ThumbsUp size={12}/> {post.likes.toLocaleString()}</span>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}><MessageSquare size={12}/> {post.comments}</span>
                    </div>
                  </div>
                ))}
              </GlassCard>
            </div>
          )}

          {/* ══════ CAMPAIGNS ══════ */}
          {activeTab === "campaigns" && (
            <div className="fade-up">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
                {[
                  { label:"Active campaigns", value:campaigns.filter(c=>selectedBrands.includes(c.brand)&&c.status==="active").length, icon:Megaphone, color:"#FF6B35" },
                  { label:"Total reach", value:"5.3M", icon:Eye, color:"#00D4FF" },
                  { label:"Est. total spend", value:"~98M Ft", icon:TrendingUp, color:"#FFB800" },
                ].map((m,i) => (
                  <GlassCard key={i} glow={m.color+"20"}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{m.label}</span>
                      <m.icon size={14} color={m.color} style={{ opacity:0.7 }} />
                    </div>
                    <div style={{ fontSize:28, fontWeight:700, color:"#fff" }}>{m.value}</div>
                  </GlassCard>
                ))}
              </div>
              {campaigns.filter(c=>selectedBrands.includes(c.brand)).map((c,i) => (
                <GlassCard key={i} glow={BRANDS[c.brand]?.color+"10"} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <span style={{ width:10, height:10, borderRadius:"50%", background:BRANDS[c.brand]?.color }} />
                    <span style={{ fontWeight:600, fontSize:13, color:BRANDS[c.brand]?.color }}>{BRANDS[c.brand]?.name}</span>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, background: c.status==="active"?"rgba(0,212,255,0.1)":"rgba(255,255,255,0.05)", color:c.status==="active"?"#00D4FF":"rgba(255,255,255,0.3)" }}>{c.status}</span>
                    <span style={{ fontSize:16, fontWeight:600, flex:1 }}>{c.name}</span>
                  </div>
                  <div style={{ display:"flex", gap:20, fontSize:13, alignItems:"center" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      {c.channels.map((ch,j) => <span key={j} style={{ fontSize:11, padding:"3px 10px", borderRadius:6, background:"rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.5)" }}>{ch}</span>)}
                    </div>
                    <div style={{ marginLeft:"auto", display:"flex", gap:20, fontSize:13, color:"rgba(255,255,255,0.5)" }}>
                      <span><Eye size={12} style={{ verticalAlign:"middle", marginRight:4 }}/>{c.reach}</span>
                      <span style={{ fontFamily:"'JetBrains Mono'", fontSize:12 }}>{c.spend}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* ══════ APP & LOYALTY ══════ */}
          {activeTab === "app" && (
            <div className="fade-up">
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
                {[
                  { label:"Active coupons", value:appData.filter(a=>a.type==="coupon").length, icon:Star, color:"#FFB800" },
                  { label:"Push notifications", value:appData.filter(a=>a.type==="push").length, icon:Bell, color:"#00D4FF" },
                  { label:"Loyalty updates", value:appData.filter(a=>a.type==="loyalty").length, icon:Zap, color:"#FF6B35" },
                ].map((m,i) => (
                  <GlassCard key={i} glow={m.color+"20"}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{m.label}</span>
                      <m.icon size={14} color={m.color} style={{ opacity:0.7 }}/>
                    </div>
                    <div style={{ fontSize:28, fontWeight:700, color:"#fff" }}>{m.value}</div>
                  </GlassCard>
                ))}
              </div>
              <GlassCard hover={false} style={{ padding:0, overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <h3 style={{ margin:0, fontSize:16, fontWeight:600, color:"#fff" }}>App activity feed</h3>
                </div>
                {appData.filter(a=>selectedBrands.includes(a.brand)).map((a,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{ width:10, height:10, borderRadius:"50%", background:BRANDS[a.brand]?.color }} />
                    <span style={{ fontSize:12, fontWeight:600, color:BRANDS[a.brand]?.color, minWidth:40 }}>{a.brand}</span>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, fontWeight:600,
                      background: a.type==="coupon"?"rgba(255,184,0,0.1)":a.type==="push"?"rgba(0,212,255,0.1)":"rgba(255,107,53,0.1)",
                      color: a.type==="coupon"?"#FFB800":a.type==="push"?"#00D4FF":"#FF6B35" }}>{a.type}</span>
                    <span style={{ fontSize:13, flex:1, fontWeight:500 }}>{a.title}</span>
                    {a.code && <span style={{ fontFamily:"'JetBrains Mono'", fontSize:11, background:"rgba(255,255,255,0.05)", padding:"3px 10px", borderRadius:6, color:"#FFB800" }}>{a.code}</span>}
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>{a.detail}</span>
                  </div>
                ))}
              </GlassCard>
            </div>
          )}

          {/* ══════ REPORTS ══════ */}
          {activeTab === "reports" && (
            <div className="fade-up">
              <GlassCard style={{ marginBottom:24 }}>
                <h3 style={{ margin:"0 0 6px", fontSize:20, fontWeight:700, color:"#fff" }}>Generate report</h3>
                <p style={{ margin:"0 0 24px", fontSize:13, color:"rgba(255,255,255,0.4)" }}>Auto-generated from all collected data. AI-written summaries included.</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
                  {[
                    { label:"PDF Report", sub:"Full monthly summary", icon:FileText, color:"#FF3366", glow:"rgba(255,51,102,0.15)" },
                    { label:"PowerPoint", sub:"Presentation deck", icon:Layers, color:"#FFB800", glow:"rgba(255,184,0,0.15)" },
                    { label:"Excel Tracking", sub:"Raw data + history", icon:BarChart3, color:"#00FF94", glow:"rgba(0,255,148,0.15)" },
                  ].map((r,i) => (
                    <div key={i} style={{
                      border:"1px solid rgba(255,255,255,0.06)", borderRadius:14, padding:20, cursor:"pointer",
                      transition:"all 0.3s", background:"rgba(255,255,255,0.02)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=r.color+"40"; e.currentTarget.style.boxShadow=`0 0 30px -10px ${r.glow}`; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background:`${r.color}15`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <r.icon size={18} color={r.color} />
                        </div>
                        <div>
                          <div style={{ fontWeight:600, fontSize:14, color:"#fff" }}>{r.label}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{r.sub}</div>
                        </div>
                      </div>
                      <button style={{
                        width:"100%", padding:"10px 0", borderRadius:10, fontSize:12, fontWeight:600, cursor:"pointer",
                        border:`1px solid ${r.color}30`, background:`${r.color}10`, color:r.color, fontFamily:"'Outfit'",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.2s",
                      }}>
                        <Download size={12}/> Download
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hover={false} style={{ padding:0, overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <h3 style={{ margin:0, fontSize:16, fontWeight:600, color:"#fff" }}>Report history</h3>
                </div>
                {["March 2026","February 2026","January 2026","December 2025","November 2025"].map((m,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.03)" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <Clock size={14} color="rgba(255,255,255,0.25)" />
                    <span style={{ fontSize:13, fontWeight:500, flex:1 }}>{m}</span>
                    <div style={{ display:"flex", gap:6 }}>
                      {[{l:"PDF",c:"#FF3366"},{l:"PPTX",c:"#FFB800"},{l:"XLSX",c:"#00FF94"}].map((f,j) => (
                        <button key={j} style={{ fontSize:11, padding:"4px 12px", borderRadius:8, border:`1px solid ${f.c}25`, background:`${f.c}08`, cursor:"pointer", color:f.c, fontFamily:"'Outfit'", fontWeight:600 }}>{f.l}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </GlassCard>
            </div>
          )}
        </div>

        {/* ── AI CHAT PANEL ── */}
        {chatOpen && (
          <div style={{
            width:390, borderLeft:"1px solid rgba(255,255,255,0.04)", display:"flex", flexDirection:"column",
            position:"sticky", top:0, height:"100vh", flexShrink:0,
            background:"rgba(10,10,15,0.95)", backdropFilter:"blur(30px)",
          }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#00FF94", boxShadow:"0 0 8px #00FF94" }} />
                <span style={{ fontWeight:600, fontSize:14, color:"#fff" }}>AI Assistant</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)" }}>online</span>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background:"transparent", border:"none", cursor:"pointer", padding:4 }}>
                <X size={16} color="rgba(255,255,255,0.3)" />
              </button>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
              {chatMessages.map((msg,i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:msg.role==="user"?"flex-end":"flex-start", flexDirection:msg.role==="user"?"row-reverse":"row" }}>
                  <div style={{
                    width:30, height:30, borderRadius:"50%", flexShrink:0,
                    background: msg.role==="ai" ? "rgba(255,184,0,0.15)" : "rgba(255,255,255,0.05)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    border: msg.role==="ai" ? "1px solid rgba(255,184,0,0.2)" : "1px solid rgba(255,255,255,0.08)",
                  }}>
                    {msg.role==="ai" ? <Bot size={14} color="#FFB800"/> : <User size={14} color="rgba(255,255,255,0.5)"/>}
                  </div>
                  <div style={{
                    maxWidth:"82%", padding:"12px 16px", borderRadius:14,
                    background: msg.role==="ai" ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,107,53,0.1))",
                    border: msg.role==="ai" ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,184,0,0.15)",
                    fontSize:13, lineHeight:1.7, color: msg.role==="ai" ? "rgba(255,255,255,0.8)" : "#E8E6E1",
                    whiteSpace:"pre-wrap",
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding:"14px 16px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                {["McDonald's activity","Price trends","Social overview","Key insights"].map(q => (
                  <button key={q} onClick={() => { setChatMessages(p=>[...p,{role:"user",text:q}]); setTimeout(()=>setChatMessages(p=>[...p,{role:"ai",text:matchAI(q)}]),800); }}
                    style={{ fontSize:11, padding:"5px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)", cursor:"pointer", color:"rgba(255,255,255,0.4)", fontFamily:"'Outfit'", transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,184,0,0.2)"; e.currentTarget.style.color="#FFB800"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.4)"; }}>
                    {q}
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendChat()}
                  placeholder="Ask about competitors..."
                  style={{ flex:1, padding:"10px 16px", borderRadius:12, border:"1px solid rgba(255,255,255,0.06)", fontSize:13, outline:"none", background:"rgba(255,255,255,0.03)", color:"#E8E6E1", fontFamily:"'Outfit'" }} />
                <button onClick={sendChat} style={{ padding:"10px 14px", borderRadius:12, border:"none", background:"linear-gradient(135deg, #FFB800, #FF6B35)", cursor:"pointer", display:"flex", alignItems:"center" }}>
                  <Send size={14} color="#0A0A0F" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
