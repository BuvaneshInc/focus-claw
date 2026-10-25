import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  Activity, ArrowUpRight, Bell, Brain, Check, ChevronDown,
  ChevronRight, CircleHelp, Clock3, Eye, Fingerprint, Focus, Gauge, Heart,
  LockKeyhole, Menu, MessageCircle, Moon, MoreHorizontal, Phone,
  Plus, Search, Settings2, Shield, ShieldCheck, SlidersHorizontal, Sparkles,
  Trash2, Users, WalletCards, X
} from "lucide-react";

type Screen = "Focus" | "Others" | "Dashboard" | "Privacy Vault" | "Consent" | "Brain" | "Call Block";
type Tone = "green" | "amber" | "rose" | "blue" | "violet";
type Item = { id: number; title: string; source: string; detail: string; time: string; tone: Tone; category: string; unread: boolean };

const COLORS = {
  paper: "#FEFCF8",
  ink: "#24251F",
  muted: "#77796F",
  line: "#EAE7DF",
  green: "#DDE9D7",
  greenInk: "#335D3D",
  amber: "#F5E8C9",
  rose: "#F2DDDA",
  blue: "#DCE8F1",
  violet: "#E9E0F4"
};

const initialItems: Item[] = [
  { id: 1, title: "Mum", source: "Family · Messages", detail: "Can you call me when you get a moment?", time: "2m", tone: "rose", category: "Family urgent", unread: true },
  { id: 2, title: "Bank alert", source: "Bank · SMS", detail: "Your card payment needs your attention.", time: "11m", tone: "amber", category: "Action required", unread: true },
  { id: 3, title: "Project review", source: "Work · Email", detail: "Review notes are ready for your approval.", time: "28m", tone: "blue", category: "Direct mention", unread: true },
  { id: 4, title: "Weekend plans", source: "Friends · Messages", detail: "Are we still meeting for coffee on Saturday?", time: "1h", tone: "green", category: "Others", unread: false }
];

const navItems: { label: Screen; icon: typeof Focus }[] = [
  { label: "Focus", icon: Focus },
  { label: "Others", icon: MessageCircle },
  { label: "Dashboard", icon: Gauge },
  { label: "Privacy Vault", icon: LockKeyhole },
  { label: "Consent", icon: ShieldCheck },
  { label: "Brain", icon: Brain },
  { label: "Call Block", icon: Phone }
];

function Pill({ children, tone = "green" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="section-title"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button className={`toggle ${checked ? "is-on" : ""}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}><span /></button>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("Focus");
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [focusMode, setFocusMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [consents, setConsents] = useState({ sms: true, calls: true, whatsapp: false, email: true, sync: false });
  const [retention, setRetention] = useState("93 days");
  const [showConsentDetails, setShowConsentDetails] = useState(false);
  const [callProtection, setCallProtection] = useState(true);
  const [blocked, setBlocked] = useState<string[]>(["+1 555 013 1044", "+1 555 018 2091"]);
  const [newNumber, setNewNumber] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const visibleItems = useMemo(() => items.filter((item) => {
    const inScreen = screen === "Others" ? item.category === "Others" : screen === "Focus" ? item.category !== "Others" : true;
    const textMatch = `${item.title} ${item.source} ${item.detail} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    return inScreen && textMatch;
  }), [items, query, screen]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function updateConsent(key: keyof typeof consents, value: boolean) {
    setConsents((current) => ({ ...current, [key]: value }));
    notify(`${key === "sync" ? "Private sync" : key.toUpperCase()} consent ${value ? "enabled" : "disabled"}.`);
  }

  function archiveItem(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
    notify("Item cleared from your view.");
  }

  function addBlockedNumber() {
    const trimmed = newNumber.trim();
    if (!trimmed) return;
    if (blocked.includes(trimmed)) { notify("That number is already on your block list."); return; }
    setBlocked((current) => [trimmed, ...current]);
    setNewNumber("");
    notify("Number added to your local block list.");
  }

  return (
    <div className="app-shell" style={{ "--paper": COLORS.paper, "--ink": COLORS.ink, "--muted": COLORS.muted, "--line": COLORS.line } as CSSProperties}>
      <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Focus size={21} strokeWidth={2.4} /></div><div><strong>focus claw</strong><span>YOUR ATTENTION, YOURS.</span></div><button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => setMobileNavOpen(false)}><X size={18}/></button></div>
        <div className="workspace-switch"><div className="avatar">B</div><div className="workspace-copy"><strong>Personal space</strong><span>Local workspace</span></div><ChevronDown size={15}/></div>
        <div className="nav-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setScreen(label); setMobileNavOpen(false); }} className={`nav-item ${screen === label ? "active" : ""}`}><Icon size={18}/><span>{label}</span>{label === "Focus" && <span className="nav-count">{items.filter(i => i.category !== "Others").length}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-mini"><div className="privacy-mini-icon"><ShieldCheck size={18}/></div><div><strong>Privacy first</strong><span>Processing stays local</span></div><span className="live-dot" /></div>
          <button className="nav-item" onClick={() => notify("Settings are coming soon.")}><Settings2 size={18}/><span>Settings</span></button>
          <div className="profile-row"><div className="avatar avatar-small">B</div><div className="workspace-copy"><strong>Your account</strong><span>Personal plan</span></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar"><button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setMobileNavOpen(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>{screen}</strong></div><div className="topbar-actions"><div className="secure-status"><span className="live-dot"/><span>Local-first mode</span></div><button className="icon-button" aria-label="Help" onClick={() => notify("Focus Claw demo: manage priority, consent and retention from this workspace.")}><CircleHelp size={18}/></button><button className="top-avatar" aria-label="Account menu" onClick={() => setMenuOpen(!menuOpen)}>B</button>{menuOpen && <div className="account-menu"><strong>Personal space</strong><span>Demo workspace</span><button onClick={() => {setScreen("Privacy Vault");setMenuOpen(false);}}>Privacy settings <ChevronRight size={14}/></button></div>}</div></header>

        <div className="content-wrap">
          {screen === "Focus" && <FocusScreen focusMode={focusMode} setFocusMode={setFocusMode} items={visibleItems} query={query} setQuery={setQuery} archiveItem={archiveItem} notify={notify}/>}
          {screen === "Others" && <OthersScreen items={visibleItems} query={query} setQuery={setQuery} archiveItem={archiveItem}/>}
          {screen === "Dashboard" && <DashboardScreen items={items} consents={consents} retention={retention}/>}
          {screen === "Privacy Vault" && <PrivacyVaultScreen retention={retention} setRetention={setRetention} notify={notify}/>}
          {screen === "Consent" && <ConsentScreen consents={consents} updateConsent={updateConsent} showDetails={showConsentDetails} setShowDetails={setShowConsentDetails}/>}
          {screen === "Brain" && <BrainScreen notify={notify}/>}
          {screen === "Call Block" && <CallBlockScreen callProtection={callProtection} setCallProtection={setCallProtection} blocked={blocked} setBlocked={setBlocked} newNumber={newNumber} setNewNumber={setNewNumber} addBlockedNumber={addBlockedNumber}/>}
        </div>
        <footer className="footer"><span><LockKeyhole size={13}/> Your data is yours. Always.</span><span>FOCUS CLAW <i>·</i> PRIVATE BY DESIGN <i>·</i> DEMO BUILD</span></footer>
      </main>
      {toast && <div className="toast" role="status"><Check size={17}/>{toast}</div>}
      {mobileNavOpen && <button className="mobile-scrim" aria-label="Close navigation overlay" onClick={() => setMobileNavOpen(false)}/>}
    </div>
  );
}

function FocusScreen({ focusMode, setFocusMode, items, query, setQuery, archiveItem, notify }: {
  focusMode: boolean; setFocusMode: (v: boolean) => void; items: Item[]; query: string; setQuery: (v: string) => void; archiveItem: (id: number) => void; notify: (message: string) => void;
}) {
  return <>
    <div className="welcome-row"><div><div className="eyebrow"><span className="sun-dot"/> MONDAY, YOUR DAY YOUR WAY</div><h1>Make room for <em>what matters.</em></h1><p className="welcome-sub">A calmer inbox starts with a clearer mind.</p></div><div className="date-chip"><span className="date-number">{new Date().getDate()}</span><span>{new Date().toLocaleDateString("en-US", { month: "short" }).toUpperCase()}<br/><small>{new Date().toLocaleDateString("en-US", { weekday: "short" })}</small></span></div></div>
    <div className={`focus-banner ${focusMode ? "focus-banner-on" : ""}`}><div className="focus-banner-icon"><Sparkles size={21}/></div><div className="focus-banner-copy"><div className="banner-title">{focusMode ? "You're in your focus zone" : "Focus mode is paused"} <Pill tone={focusMode ? "green" : "amber"}>{focusMode ? "ACTIVE" : "PAUSED"}</Pill></div><p>{focusMode ? "Only the people and things that matter are rising to the top." : "Your priority sorting is paused. Switch it back on when you're ready."}</p></div><Toggle checked={focusMode} onChange={setFocusMode} label="Focus mode"/></div>
    <div className="section-head"><div><div className="eyebrow">YOUR ATTENTION, CURATED</div><h2>Today's focus <span className="small-count">{items.length}</span></h2></div><div className="search-box"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your focus..." aria-label="Search your focus"/></div></div>
    <div className="inbox-list">{items.length ? items.map(item => <InboxCard key={item.id} item={item} archiveItem={archiveItem} notify={notify}/>) : <EmptyState title="Nothing pulling at you." body="You're all caught up in this view. Take a breath."/ >}</div>
    <div className="quiet-note"><div className="quiet-icon"><Heart size={17}/></div><div><strong>A gentle reminder</strong><span>You don't have to respond to everything. Just the right things.</span></div><button onClick={() => notify("A quiet moment, just for you.")}>Take a breath <ArrowUpRight size={14}/></button></div>
  </>;
}

function InboxCard({ item, archiveItem, notify }: { item: Item; archiveItem: (id: number) => void; notify: (message: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = item.category === "Family urgent" ? Heart : item.category === "Action required" ? WalletCards : item.category === "Direct mention" ? MessageCircle : Users;
  return <article className="inbox-card"><div className={`source-icon source-${item.tone}`}><Icon size={19}/></div><div className="inbox-main"><div className="inbox-meta"><strong>{item.title}</strong><span>·</span><span>{item.source}</span><span className="item-time">{item.time}</span>{item.unread && <span className="unread-dot"/>}</div><div className="inbox-detail">{item.detail}</div><div className="inbox-tags"><Pill tone={item.tone}>{item.category}</Pill>{item.category === "Family urgent" && <span className="reason"><Sparkles size={12}/> Priority contact</span>}</div>{expanded && <div className="item-expanded"><p><strong>Why it surfaced</strong> — This demo item matches the local priority rule for <b>{item.category.toLowerCase()}</b>.</p><p>Message content is sample data, not connected to any inbox or service.</p></div>}</div><div className="inbox-actions"><button className="icon-button" aria-label={`Why ${item.title} is prioritized`} title="Why this surfaced" onClick={() => setExpanded(!expanded)}><Eye size={17}/></button><button className="icon-button" aria-label={`Clear ${item.title}`} title="Clear item" onClick={() => archiveItem(item.id)}><X size={17}/></button><button className="icon-button card-more" aria-label={`More about ${item.title}`} onClick={() => notify("More actions are not connected in this demo.")}><MoreHorizontal size={17}/></button></div></article>;
}

function OthersScreen({ items, query, setQuery, archiveItem }: { items: Item[]; query: string; setQuery: (v: string) => void; archiveItem: (id: number) => void }) {
  return <><SectionTitle eyebrow="THE REST CAN WAIT" title="Others" subtitle="Everything else, kept in its place. Nothing lost, nothing demanding your attention."/><div className="toolbar"><div className="search-box"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search other items..." aria-label="Search other items"/></div><Pill tone="blue">{items.length} items</Pill></div><div className="inbox-list">{items.length ? items.map(item => <InboxCard key={item.id} item={item} archiveItem={archiveItem} notify={() => {}}/>) : <EmptyState title="Your quiet corner is clear." body="Items that aren't marked as priorities will appear here."/ >}</div><div className="tip-panel"><Moon size={20}/><div><strong>Not ignored. Just not right now.</strong><p>Items in Others remain available whenever you choose to check them.</p></div></div></>;
}

function DashboardScreen({ items, consents, retention }: { items: Item[]; consents: Record<string, boolean>; retention: string }) {
  const priorityCount = items.filter(i => i.category !== "Others").length;
  const enabled = Object.values(consents).filter(Boolean).length;
  return <><SectionTitle eyebrow="A LITTLE MORE CLARITY" title="Your attention, at a glance." subtitle="A simple snapshot of how Focus Claw is helping you keep the important things close."/><div className="metrics-grid"><Metric icon={Focus} label="Priority items" value={String(priorityCount)} trend="In this demo inbox" tone="green"/><Metric icon={Clock3} label="Time reclaimed" value="1.2 hrs" trend="Illustrative demo estimate" tone="blue"/><Metric icon={Shield} label="Consent switches" value={`${enabled}/5`} trend="Enabled on this device" tone="violet"/><Metric icon={Activity} label="Retention policy" value={retention} trend="Your current selection" tone="amber"/></div><div className="dashboard-grid"><div className="panel"><div className="panel-heading"><div><h3>Priority breakdown</h3><p>Based on sample items in your workspace</p></div><SlidersHorizontal size={17}/></div>{[{label:"Family urgent",count:items.filter(i=>i.category==="Family urgent").length,tone:"rose"},{label:"Action required",count:items.filter(i=>i.category==="Action required").length,tone:"amber"},{label:"Direct mention",count:items.filter(i=>i.category==="Direct mention").length,tone:"blue"},{label:"Others",count:items.filter(i=>i.category==="Others").length,tone:"green"}].map(row=><div className="bar-row" key={row.label}><div><span className={`bar-dot bar-${row.tone}`}/><span>{row.label}</span><strong>{row.count}</strong></div><div className="bar-track"><span className={`bar-fill bar-${row.tone}`} style={{width:`${items.length ? row.count/items.length*100 : 0}%`}}/></div></div>)}</div><div className="panel protection-panel"><div className="protection-icon"><ShieldCheck size={23}/></div><h3>Your privacy status</h3><p>Consent controls are managed locally in this demo. No inbox or account integration is active.</p><div className="status-line"><span>Private sync</span><Pill tone={consents.sync ? "green" : "amber"}>{consents.sync ? "ON" : "OFF"}</Pill></div><div className="status-line"><span>Retention</span><strong>{retention}</strong></div></div></div><p className="disclaimer"><CircleHelp size={14}/> Metrics are illustrative UI values, not measured user activity.</p></>;
}

function Metric({ icon: Icon, label, value, trend, tone }: { icon: typeof Focus; label: string; value: string; trend: string; tone: Tone }) {
  return <div className="metric-card"><div className={`metric-icon metric-${tone}`}><Icon size={19}/></div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-trend">{trend}</span></div>;
}

function PrivacyVaultScreen({ retention, setRetention, notify }: { retention: string; setRetention: (v: string) => void; notify: (message: string) => void }) {
  return <><SectionTitle eyebrow="YOUR DATA. YOUR RULES." title="Privacy Vault" subtitle="A clear view of what this demo stores, what it doesn't, and how long sample records are retained."/><div className="vault-hero"><div className="vault-hero-icon"><Fingerprint size={28}/></div><div><Pill tone="green">LOCAL-FIRST DEMO</Pill><h2>Your private space is in your hands.</h2><p>This UI keeps its sample state in memory only. It does not connect to mail, messages, contacts, or cloud storage.</p></div></div><div className="panel vault-panel"><div className="panel-heading"><div><h3>Data diet</h3><p>Choose a sample retention policy</p></div><Trash2 size={18}/></div><div className="retention-options">{["30 days","60 days","93 days","Custom"].map(value=><button key={value} className={`retention-option ${retention===value?"selected":""}`} onClick={()=>{setRetention(value);notify(`Demo retention policy set to ${value}.`);}}><span className="radio-dot"/><span>{value}</span>{value==="93 days" && <Pill tone="green">DEFAULT</Pill>}</button>)}</div><div className="vault-note"><LockKeyhole size={17}/><span>Changing this selection updates the demo UI only. A production retention job must enforce deletion server-side and on-device.</span></div></div><div className="two-col-cards"><div className="info-card"><div className="info-card-icon"><Check size={17}/></div><h3>Designed to keep local</h3><p>Priority classification should run on-device. This starter doesn't ingest real communications.</p></div><div className="info-card"><div className="info-card-icon info-muted"><X size={17}/></div><h3>Never uploaded by this UI</h3><p>No message bodies, contact names, or phone numbers are sent to a backend by this frontend.</p></div></div></>;
}

function ConsentScreen({ consents, updateConsent, showDetails, setShowDetails }: { consents: Record<string, boolean>; updateConsent: (key: keyof typeof consents, value: boolean) => void; showDetails: boolean; setShowDetails: (v: boolean) => void }) {
  const rows: {key:keyof typeof consents; title:string; desc:string; icon:typeof MessageCircle}[] = [
    {key:"sms",title:"SMS priority sorting",desc:"Allow local rules to classify SMS metadata.",icon:MessageCircle},
    {key:"calls",title:"Call protection",desc:"Enable the call protection preference in this demo.",icon:Phone},
    {key:"whatsapp",title:"WhatsApp notifications",desc:"Opt in to a future connector. No connector is active.",icon:MessageCircle},
    {key:"email",title:"Email priority sorting",desc:"Allow local rules to classify email metadata.",icon:Bell},
    {key:"sync",title:"Private sync",desc:"Opt in to the future consent-sync service.",icon:LockKeyhole}
  ];
  return <><SectionTitle eyebrow="PERMISSION, NOT ASSUMPTION" title="Your consent, your call." subtitle="Every channel is optional. Switch off any permission at any time."/><div className="consent-banner"><ShieldCheck size={22}/><div><strong>Nothing is connected yet.</strong><p>These are local demo preferences; they do not grant device permissions or start data collection.</p></div></div><div className="panel consent-list">{rows.map(({key,title,desc,icon:Icon})=><div className="consent-row" key={key}><div className="consent-row-icon"><Icon size={19}/></div><div className="consent-row-copy"><strong>{title}</strong><span>{desc}</span></div><Toggle checked={consents[key]} onChange={(v)=>updateConsent(key,v)} label={title}/></div>)}</div><button className="text-button" onClick={()=>setShowDetails(!showDetails)}>{showDetails?"Hide":"View"} consent data details <ChevronDown size={15}/></button>{showDetails&&<div className="panel consent-detail"><h3>Current local preferences</h3><pre>{JSON.stringify(consents,null,2)}</pre><p>Production sync should transmit only minimal, explicitly consented fields, validate them on the server, and avoid storing message content.</p></div>}</>;
}

function BrainScreen({ notify }: { notify: (message: string) => void }) {
  return <><SectionTitle eyebrow="SMALL RULES, CLEAR REASONS" title="The Focus Brain" subtitle="Transparent rules decide what gets your attention. No external LLM is connected in this starter."/><div className="brain-summary"><div className="brain-orb"><Brain size={30}/></div><div><Pill tone="violet">RULE-BASED DEMO</Pill><h2>Simple, explainable priorities.</h2><p>Each rule has a reason you can understand. In production, run classification on-device and make every rule editable.</p></div></div><div className="rules-list">{[{n:"01",title:"Family urgent",desc:"Priority contacts and urgent family signals surface first.",tag:"HIGH PRIORITY",tone:"rose" as Tone},{n:"02",title:"Action required",desc:"Banking or account alerts that ask for an action rise to the top.",tag:"ACTION",tone:"amber" as Tone},{n:"03",title:"Direct mention",desc:"A direct mention or request is shown above general updates.",tag:"RELEVANT",tone:"blue" as Tone},{n:"04",title:"Everything else",desc:"General updates stay available in Others without demanding a response.",tag:"LOW INTERRUPT",tone:"green" as Tone}].map(rule=><div className="rule-card" key={rule.n}><span className="rule-number">{rule.n}</span><div className="rule-copy"><strong>{rule.title}</strong><p>{rule.desc}</p></div><Pill tone={rule.tone}>{rule.tag}</Pill><button className="icon-button" aria-label={`Edit ${rule.title}`} onClick={()=>notify("Rule editing is a planned extension.")}><Settings2 size={17}/></button></div>)}</div><div className="tip-panel"><Sparkles size={20}/><div><strong>Explainability is a feature.</strong><p>Every surfaced item should show the rule that made it important. This demo uses sample labels, not live inference.</p></div></div></>;
}

function CallBlockScreen({ callProtection, setCallProtection, blocked, setBlocked, newNumber, setNewNumber, addBlockedNumber }: { callProtection:boolean; setCallProtection:(v:boolean)=>void; blocked:string[]; setBlocked:(v:string[])=>void; newNumber:string; setNewNumber:(v:string)=>void; addBlockedNumber:()=>void }) {
  return <><SectionTitle eyebrow="LET THE UNKNOWN WAIT" title="Call protection" subtitle="Manage a local demo block list and choose whether call protection is enabled in the interface."/><div className="call-protection-card"><div className="call-protection-icon"><Phone size={25}/></div><div className="call-protection-copy"><strong>Unknown caller protection</strong><p>{callProtection?"Protection preference is on. No calls are being intercepted.":"Protection preference is off."}</p></div><Toggle checked={callProtection} onChange={setCallProtection} label="Unknown caller protection"/></div><div className="panel blocked-panel"><div className="panel-heading"><div><h3>Block list</h3><p>{blocked.length} demo numbers stored in page state</p></div><Pill tone="rose">{blocked.length} blocked</Pill></div><form className="add-number" onSubmit={(e)=>{e.preventDefault();addBlockedNumber();}}><input value={newNumber} onChange={e=>setNewNumber(e.target.value)} placeholder="Enter number or label" aria-label="Number to block"/><button className="primary-button" type="submit"><Plus size={16}/> Add number</button></form>{blocked.length?blocked.map(number=><div className="blocked-row" key={number}><div className="blocked-number-icon"><Phone size={16}/></div><div><strong>{number}</strong><span>Local demo block list</span></div><button className="remove-button" onClick={()=>setBlocked(blocked.filter(n=>n!==number))}><X size={16}/> Remove</button></div>):<EmptyState title="Your block list is clear." body="Add a number above to see it here."/ >}</div><p className="disclaimer"><Shield size={14}/> Browser apps cannot block cellular calls by themselves. A native OS integration and explicit permissions are required.</p></>;
}

function EmptyState({ title, body }: { title:string; body:string }) {
  return <div className="empty-state"><div className="empty-icon"><Sparkles size={20}/></div><strong>{title}</strong><p>{body}</p></div>;
}
