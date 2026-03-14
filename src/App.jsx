import { useState, useCallback } from "react";


// ── Citation Logic ──────────────────────────────────────────
function toAPA(a) {
  if (!a) return "";
  const p = a.trim().split(" ");
  if (p.length === 1) return p[0] + ",";
  return `${p[p.length-1]}, ${p.slice(0,-1).map(n => n[0]?.toUpperCase()+".").join(" ")}`;
}
function toMLA(a) {
  if (!a) return "";
  const p = a.trim().split(" ");
  if (p.length === 1) return p[0];
  return `${p[p.length-1]}, ${p.slice(0,-1).join(" ")}`;
}
function toHarvard(a) {
  if (!a) return "";
  const p = a.trim().split(" ");
  if (p.length === 1) return p[0];
  return `${p[p.length-1]}, ${p.slice(0,-1).map(n => n[0]?.toUpperCase()+".").join("")}`;
}
function fmtDate(d) {
  try { return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}); }
  catch { return d; }
}
function buildCitation(style, type, f) {
  const { author, title, year, url, publisher, journalName, volume, issue, pages, channelName, accessDate, city } = f;
  const y = year ? `(${year})` : "(n.d.)";
  if (style === "APA") {
    if (type === "website")  return [toAPA(author), `${y}.`, title?`*${title}*.`:"", publisher?`${publisher}.`:"", url].filter(Boolean).join(" ");
    if (type === "book")     return [toAPA(author), `${y}.`, title?`*${title}*.`:"", city?`${city}:`:"", publisher?`${publisher}.`:""].filter(Boolean).join(" ");
    if (type === "journal")  return [toAPA(author), `${y}.`, title?`${title}.`:"", `${journalName?`*${journalName}*`:""}${volume&&issue?`, *${volume}*(${issue})`:volume?`, *${volume}*`:""}${pages?`, ${pages}`:""}${url?`. ${url}`:""}`].filter(Boolean).join(" ");
    if (type === "youtube")  return [toAPA(author), channelName?`[${channelName}].`:"", `${y}.`, title?`*${title}* [Video].`:"", url?`YouTube. ${url}`:"YouTube."].filter(Boolean).join(" ");
  }
  if (style === "MLA") {
    if (type === "website")  return [author?`${toMLA(author)}.`:"", title?`"${title}."`:""  , publisher?`*${publisher}*,`:"", year?`${year},`:"", url?`${url}.`:""].filter(Boolean).join(" ");
    if (type === "book")     return [author?`${toMLA(author)}.`:"", title?`*${title}*.`:"", publisher?`${publisher},`:"", year?`${year}.`:""].filter(Boolean).join(" ");
    if (type === "journal")  return [author?`${toMLA(author)}.`:"", title?`"${title}."`:""  , journalName?`*${journalName}*,`:"", volume&&issue?`vol. ${volume}, no. ${issue},`:volume?`vol. ${volume},`:"", year?`${year},`:"", pages?`pp. ${pages}.`:""].filter(Boolean).join(" ");
    if (type === "youtube")  return [author?`${toMLA(author)}.`:"", title?`"${title}."`:""  , channelName?`YouTube, uploaded by ${channelName},`:"YouTube,", year?`${year},`:"", url?`${url}.`:""].filter(Boolean).join(" ");
  }
  if (style === "Harvard") {
    if (type === "website")  return `${toHarvard(author)} ${y}${title?" "+title+".":""} ${url?"Available at: "+url:""}${accessDate?" (Accessed: "+fmtDate(accessDate)+").":"."}`.trim();
    if (type === "book")     return `${toHarvard(author)} ${y}${title?" *"+title+"*.":""}${city?" "+city+":":""}${publisher?" "+publisher+".":""}`.trim();
    if (type === "journal")  return `${toHarvard(author)} ${y}${title?" '"+title+"',":" "}${journalName?" *"+journalName+"*,":""}${volume&&issue?" "+volume+"("+issue+"),":volume?" "+volume+",":""}${pages?" pp. "+pages+".":"."}`.trim();
    if (type === "youtube")  return `${toHarvard(author)} ${y}${title?" "+title+".":""} ${url?"Available at: "+url:""}${accessDate?" (Accessed: "+fmtDate(accessDate)+").":"."}`.trim();
  }
  return "";
}

// ── Config ──────────────────────────────────────────────────
const SOURCES = [
  { key: "website", label: "Website" },
  { key: "book",    label: "Book" },
  { key: "journal", label: "Journal Article" },
  { key: "youtube", label: "YouTube" },
];
const STYLES = [
  { key: "APA",     desc: "Science & Psychology" },
  { key: "MLA",     desc: "Humanities" },
  { key: "Harvard", desc: "Business & Social Science" },
];
const FIELDS = {
  website: [
    { key: "author",     label: "Author Name",         placeholder: "e.g. Ahmad Fauzi",               req: true  },
    { key: "year",       label: "Year Published",       placeholder: "e.g. 2024",                      req: true  },
    { key: "title",      label: "Page Title",           placeholder: "e.g. Introduction to React",     req: true,  full: true },
    { key: "publisher",  label: "Website Name",         placeholder: "e.g. Medium, BBC News",          req: false },
    { key: "url",        label: "URL",                  placeholder: "https://...",                     req: false, full: true },
    { key: "accessDate", label: "Date Accessed",        placeholder: "",                               req: false, type: "date" },
  ],
  book: [
    { key: "author",    label: "Author Name",           placeholder: "e.g. Robert C. Martin",          req: true  },
    { key: "year",      label: "Year Published",        placeholder: "e.g. 2008",                      req: true  },
    { key: "title",     label: "Book Title",            placeholder: "e.g. Clean Code",                req: true,  full: true },
    { key: "publisher", label: "Publisher",             placeholder: "e.g. Pearson Education",         req: true  },
    { key: "city",      label: "City of Publication",   placeholder: "e.g. New York",                  req: false },
    { key: "pages",     label: "Pages Referenced",      placeholder: "e.g. 45–67",                     req: false },
  ],
  journal: [
    { key: "author",      label: "Author Name",         placeholder: "e.g. Siti Aisyah",               req: true  },
    { key: "year",        label: "Year Published",       placeholder: "e.g. 2023",                      req: true  },
    { key: "title",       label: "Article Title",        placeholder: "e.g. Deep Learning in Healthcare", req: true, full: true },
    { key: "journalName", label: "Journal Name",         placeholder: "e.g. Nature Medicine",           req: true  },
    { key: "volume",      label: "Volume",               placeholder: "e.g. 12",                        req: false },
    { key: "issue",       label: "Issue",                placeholder: "e.g. 3",                         req: false },
    { key: "pages",       label: "Pages",                placeholder: "e.g. 101–115",                   req: false },
    { key: "url",         label: "DOI / URL",            placeholder: "https://doi.org/...",            req: false, full: true },
  ],
  youtube: [
    { key: "author",      label: "Creator Name",         placeholder: "e.g. Fireship",                  req: true  },
    { key: "channelName", label: "Channel Name",          placeholder: "e.g. Fireship",                  req: false, hint: "Usually same as creator" },
    { key: "year",        label: "Year Uploaded",         placeholder: "e.g. 2023",                      req: true  },
    { key: "title",       label: "Video Title",           placeholder: "e.g. React in 100 Seconds",      req: true,  full: true },
    { key: "url",         label: "YouTube URL",           placeholder: "https://youtube.com/watch?v=...", req: false, full: true },
    { key: "accessDate",  label: "Date Accessed",         placeholder: "",                               req: false, type: "date" },
  ],
};
const EMPTY = { author:"", title:"", year:"", url:"", publisher:"", journalName:"", volume:"", issue:"", pages:"", channelName:"", accessDate:"", city:"" };

// ── Main ────────────────────────────────────────────────────
export default function CiteMe() {
  const [source, setSource] = useState("website");
  const [style,  setStyle]  = useState("APA");
  const [fields, setFields] = useState(EMPTY);
  const [auto,   setAuto]   = useState([]);
  const [url,    setUrl]    = useState("");
  const [status, setStatus] = useState(null);
  const [msg,    setMsg]    = useState("");
  const [copied, setCopied] = useState(false);
  const [bibliography, setBibliography] = useState([]);
  const [saved, setSaved] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const citation  = buildCitation(style, source, fields);
  const curFields = FIELDS[source];
  const reqFields = curFields.filter(f => f.req);
  const filledReq = reqFields.filter(f => fields[f.key]?.trim()).length;
  const progress  = reqFields.length ? Math.round((filledReq / reqFields.length) * 100) : 0;

  const changeSource = s => { setSource(s); setFields(EMPTY); setAuto([]); setStatus(null); setUrl(""); };
  const changeField  = (k, v) => { setFields(p => ({...p,[k]:v})); setAuto(p => p.filter(x => x !== k)); };

  // ── AI gap filler: asks Claude to extract whatever Microlink missed ──
  const aiGapFill = async (pageUrl, currentFields, missingKeys, sourceType) => {
    const fieldDescriptions = missingKeys.map(k => {
      const labels = { author:"author name", year:"publication year (4 digits only)", publisher:"publisher or website name", journalName:"journal name", volume:"volume number", issue:"issue number", pages:"page range", channelName:"YouTube channel name", city:"city of publication" };
      return `"${k}": "${labels[k] || k}"`;
    }).join(", ");

    const prompt = `You are a citation metadata extractor. Given this URL: ${pageUrl}
Source type: ${sourceType}

Extract ONLY these missing fields: ${missingKeys.join(", ")}

Return a JSON object with only the fields you are confident about. Example format:
{ ${fieldDescriptions} }

Rules:
- If unsure about a value, omit that key entirely
- year must be a 4-digit number as a string
- author should be a full name if possible
- Return ONLY the JSON object, no explanation, no markdown`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  };

  const doFetch = useCallback(async () => {
    if (!url.trim()) return;
    setStatus("loading"); setMsg("Reading page...");
    const isYT = url.includes("youtube.com") || url.includes("youtu.be");
    if (isYT) setSource("youtube");
    try {
      // Layer 1: Microlink
      const data = await (await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}&meta=true`)).json();
      if (data.status !== "success") throw new Error();
      const m = data.data; const nf = {...EMPTY}; const got = [];
      if (m.author)    { nf.author    = m.author;                                 got.push("author");    }
      if (m.title)     { nf.title     = m.title;                                  got.push("title");     }
      if (m.date)      { nf.year      = new Date(m.date).getFullYear().toString(); got.push("year");      }
      if (m.publisher) { nf.publisher = m.publisher;                              got.push("publisher"); }
      nf.url = url; got.push("url");

      // Layer 2: YouTube oEmbed
      if (isYT) {
        try {
          const ytd = await (await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)).json();
          if (ytd.author_name) { nf.channelName = ytd.author_name; nf.author = ytd.author_name; got.push("channelName","author"); }
          if (ytd.title)       { nf.title = ytd.title; if (!got.includes("title")) got.push("title"); }
        } catch {}
      }

      const type = isYT ? "youtube" : source;
      const missingKeys = FIELDS[type]
        .filter(f => !got.includes(f.key) && f.key !== "url" && f.key !== "accessDate" && f.key !== "pages")
        .map(f => f.key);

      // Layer 3: AI gap filler for anything still missing
      if (missingKeys.length > 0) {
        setMsg("AI is filling in the gaps...");
        try {
          const aiResult = await aiGapFill(url, nf, missingKeys, type);
          for (const key of missingKeys) {
            if (aiResult[key] && !nf[key]) {
              nf[key] = aiResult[key];
              got.push(key);
            }
          }
        } catch {}
      }

      setFields(nf); setAuto([...new Set(got)]);
      const stillMissing = FIELDS[type].filter(f => f.req && !got.includes(f.key)).map(f => f.label);
      if (!stillMissing.length) { setStatus("success"); setMsg("All fields filled. Edit anything if needed."); }
      else                       { setStatus("partial"); setMsg(`Please complete: ${stillMissing.join(", ")}`); }
    } catch {
      setFields(p => ({...p, url})); setAuto(["url"]);
      setStatus("error"); setMsg("Could not read this page. Please fill in the fields below.");
    }
  }, [url, source]);

  const doCopy = () => {
    if (!citation) return;
    navigator.clipboard.writeText(citation).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2200); });
  };
  const doSave = () => {
    if (!citation) return;
    setBibliography(prev => [...prev, citation]);
    setSaved(true); setTimeout(() => setSaved(false), 2200);
  };
  const doRemove = i => setBibliography(prev => prev.filter((_, idx) => idx !== i));
  const doCopyAll = () => {
    const text = bibliography.map((c, i) => `${i + 1}. ${c}`).join("\n\n");
    navigator.clipboard.writeText(text).then(() => { setCopiedAll(true); setTimeout(() => setCopiedAll(false), 2200); });
  };
  const doClear = () => { setFields(EMPTY); setAuto([]); setUrl(""); setStatus(null); setMsg(""); };

  const tag = key => {
    const f = curFields.find(x => x.key === key);
    if (auto.includes(key)) return <span className="field-tag t-auto">auto</span>;
    if (f?.req)             return <span className="field-tag t-req">required</span>;
    return                         <span className="field-tag t-opt">optional</span>;
  };

  return (
    <div className="app">

        {/* NAV */}
        <nav className="nav">
          <div className="logo">
            <span className="logo-cite">Cite</span>
            <span className="logo-me">Me</span>
            <span className="logo-period">.</span>
          </div>
          <span className="nav-tag">APA · MLA · Harvard</span>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            Smart Citation Generator
            <span className="eyebrow-line" />
          </div>
          <h1>Every source,<br />perfectly <em>cited</em></h1>
          <p className="hero-sub">
            Paste any URL and we extract the details automatically.
            Or fill in the fields manually — clean, fast, accurate.
          </p>
          <div className="url-wrap">
            <input
              className="url-field"
              placeholder="Paste a URL to auto-fill — or scroll down to fill manually"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && doFetch()}
            />
            <button className="url-btn" onClick={doFetch} disabled={status === "loading" || !url.trim()}>
              {status === "loading" ? <><div className="spin" />Reading</> : "Auto-fill"}
            </button>
          </div>
          <div className="hero-meta">Supports websites · books · journal articles · YouTube</div>
        </div>

        <hr className="page-hr" />

        {/* MAIN */}
        <main className="main">

          {/* Step 1 — Source */}
          <div className="section">
            <div className="section-row">
              <div className="section-left">
                <div className="section-num">Step 01</div>
                <div className="section-title">Source type</div>
                <div className="section-hint">What kind of source are you citing?</div>
              </div>
              <div className="section-right">
                <div className="source-pills">
                  {SOURCES.map(s => (
                    <button key={s.key} className={`source-pill ${source===s.key?"active":""}`} onClick={() => changeSource(s.key)}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 — Style */}
          <div className="section">
            <div className="section-row">
              <div className="section-left">
                <div className="section-num">Step 02</div>
                <div className="section-title">Citation style</div>
                <div className="section-hint">Ask your lecturer if unsure — APA is most common in science.</div>
              </div>
              <div className="section-right">
                <div className="style-pills">
                  {STYLES.map(s => (
                    <button key={s.key} className={`style-pill ${style===s.key?"active":""}`} onClick={() => setStyle(s.key)}>
                      {s.key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 — Fields */}
          <div className="section">
            <div className="section-row">
              <div className="section-left">
                <div className="section-num">Step 03</div>
                <div className="section-title">Source details</div>
                <div className="section-hint">Green fields were auto-filled. Edit freely.</div>
              </div>
              <div className="section-right">

                {status && (
                  <div className={`status-bar ${status==="loading"?"s-loading":status==="success"?"s-success":status==="partial"?"s-partial":"s-error"}`}>
                    {status==="loading" && <div className="spin" />}
                    {msg}
                  </div>
                )}

                {reqFields.length > 0 && (
                  <div className="prog-row">
                    <div className="prog-track"><div className="prog-fill" style={{width:`${progress}%`}} /></div>
                    <div className="prog-text">{filledReq}/{reqFields.length} required</div>
                  </div>
                )}

                <div className="fields-section-label">fields</div>

                <div className="fields-grid">
                  {curFields.map(f => (
                    <div key={f.key} className={`field-wrap ${f.full?"field-full":""}`}>
                      <div className="field-top">
                        <label className="field-label">{f.label}</label>
                        {tag(f.key)}
                      </div>
                      <input
                        className={`field-in ${auto.includes(f.key)?"is-auto":""}`}
                        type={f.type||"text"}
                        placeholder={f.placeholder}
                        value={fields[f.key]||""}
                        onChange={e => changeField(f.key, e.target.value)}
                      />
                      {f.hint && <div className="field-hint-txt">{f.hint}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="output-section">
            <div className="output-label">Your citation</div>
            <div className="output-meta">
              {STYLES.map(s => (
                <span key={s.key} className={`meta-badge ${style===s.key?"live":""}`}>{s.key}</span>
              ))}
              <span className="meta-src">{SOURCES.find(s=>s.key===source)?.label}</span>
            </div>
            <div className="citation-box">
              {citation
                ? <div className="citation-result">{citation}</div>
                : <div className="citation-empty">Your formatted citation will appear here as you fill in the fields above.</div>
              }
            </div>
            <div className="action-row">
              <button className={`btn-copy ${copied?"ok":""}`} onClick={doCopy} disabled={!citation}>
                {copied ? "Copied to clipboard" : "Copy citation"}
              </button>
              <button className={`btn-save ${saved?"ok":""}`} onClick={doSave} disabled={!citation}>
                {saved ? "Saved" : "+ Bibliography"}
              </button>
              <button className="btn-clear" onClick={doClear}>Clear</button>
            </div>
          </div>

          {/* Bibliography */}
          {bibliography.length > 0 && (
            <div className="bib-section">
              <div className="bib-header">
                <span className="bib-title">Bibliography</span>
                <span className="bib-count">{bibliography.length}</span>
                <span className="bib-line" />
              </div>
              <div className="bib-list">
                {bibliography.map((c, i) => (
                  <div key={i} className="bib-item">
                    <span className="bib-num">{i + 1}.</span>
                    <span className="bib-text">{c}</span>
                    <button className="bib-remove" onClick={() => doRemove(i)} title="Remove">✕</button>
                  </div>
                ))}
              </div>
              <div className="bib-actions">
                <button className={`btn-copy-all ${copiedAll?"ok":""}`} onClick={doCopyAll}>
                  {copiedAll ? "Copied to clipboard" : "Copy all citations"}
                </button>
                <button className="btn-clear-bib" onClick={() => setBibliography([])}>Clear all</button>
              </div>
            </div>
          )}

        </main>
      </div>
  );
}
