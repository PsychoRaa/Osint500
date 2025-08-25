import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter, Star, Link as LinkIcon, Copy, Check, Bookmark, Moon, Sun, Github, ExternalLink, ListFilter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ------------------------------------------------------------
// 🧭 OSINT Tools Directory — Single-Page App (React + Tailwind)
// ------------------------------------------------------------
// Features
// - Fast client-side search across name, description, tags
// - Filter by category, tags, and capabilities
// - Sort by name or trending score
// - Bookmark/favorites (persisted in localStorage)
// - Copy URL, open in new tab, quick preview dialog
// - Dark mode toggle
// - Responsive grid and keyboard-friendly navigation
// - Extendable: replace SAMPLE_TOOLS with your dataset or a JSON fetch
// ------------------------------------------------------------

// 🔧 Sample data (replace/extend). Keep entries simple and human-curated.
const SAMPLE_TOOLS = [
  {
    id: "shodan",
    name: "Shodan",
    url: "https://www.shodan.io/",
    category: "Infrastructure",
    description: "Search engine for internet-connected devices and services.",
    tags: ["ip", "port-scan", "iot", "recon"],
    trending: 98,
  },
  {
    id: "censys",
    name: "Censys",
    url: "https://search.censys.io/",
    category: "Infrastructure",
    description: "Discover and monitor hosts and certificates across the internet.",
    tags: ["certificates", "assets", "surface"],
    trending: 87,
  },
  {
    id: "hunter",
    name: "Hunter.io",
    url: "https://hunter.io/",
    category: "People & Email",
    description: "Find professional email addresses and verify deliverability.",
    tags: ["email", "people", "company"],
    trending: 74,
  },
  {
    id: "maltego",
    name: "Maltego",
    url: "https://www.maltego.com/",
    category: "Link Analysis",
    description: "Graph-based link analysis for relationships between entities.",
    tags: ["graphs", "analysis", "intel"],
    trending: 81,
  },
  {
    id: "crtsh",
    name: "crt.sh",
    url: "https://crt.sh/",
    category: "Certificates",
    description: "Query Certificate Transparency logs for domain certificates.",
    tags: ["ct-logs", "domains"],
    trending: 69,
  },
  {
    id: "archive",
    name: "Wayback Machine",
    url: "https://web.archive.org/",
    category: "Archives",
    description: "View historical snapshots of websites.",
    tags: ["history", "snapshots"],
    trending: 77,
  },
  {
    id: "gh-dorks",
    name: "GitHub Dorks",
    url: "https://github.com/techgaun/github-dorks",
    category: "Code Intelligence",
    description: "Curated search patterns to find sensitive info on GitHub.",
    tags: ["secrets", "source-code", "dorks"],
    trending: 72,
  },
  {
    id: "builtwith",
    name: "BuiltWith",
    url: "https://builtwith.com/",
    category: "Technology Lookup",
    description: "Identify the tech stack behind websites.",
    tags: ["stack", "recon", "fingerprinting"],
    trending: 64,
  },
  {
    id: "dnsdumpster",
    name: "DNSDumpster",
    url: "https://dnsdumpster.com/",
    category: "DNS",
    description: "Enumerate subdomains, DNS records and infrastructure mapping.",
    tags: ["dns", "subdomains", "mapping"],
    trending: 70,
  },
  {
    id: "osintframework",
    name: "OSINT Framework",
    url: "https://osintframework.com/",
    category: "Meta",
    description: "A directory of OSINT resources organized by topics.",
    tags: ["directory", "reference"],
    trending: 83,
  },
];

const ALL_CATEGORIES = [
  "Infrastructure",
  "People & Email",
  "Link Analysis",
  "Certificates",
  "Archives",
  "Code Intelligence",
  "Technology Lookup",
  "DNS",
  "Meta",
];

const ALL_TAGS = Array.from(
  new Set(SAMPLE_TOOLS.flatMap((t) => t.tags))
).sort();

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

function ToolCard({ tool, onBookmark, isBookmarked }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tool.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <Card className="group overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all border-muted bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight hover:underline"
            >
              {tool.name}
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isBookmarked ? "default" : "secondary"}
                    size="icon"
                    className="rounded-full"
                    onClick={() => onBookmark(tool.id)}
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isBookmarked ? "Remove from Favorites" : "Add to Favorites"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? "Copied!" : "Copy URL"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{tool.category}</Badge>
          {tool.tags?.map((tg) => (
            <Badge key={tg} variant="secondary" className="capitalize">
              {tg}
            </Badge>
          ))}
          <span className="ml-auto inline-flex items-center text-xs text-muted-foreground">
            <Star className="mr-1 h-4 w-4" /> {tool.trending}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Toolbar({ q, setQ, activeCats, setActiveCats, activeTags, setActiveTags, sortBy, setSortBy, onlyFavs, setOnlyFavs }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tools, tags, descriptions…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9 h-11"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-11">
            <ListFilter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ALL_CATEGORIES.map((c) => (
            <DropdownMenuCheckboxItem
              key={c}
              checked={activeCats.includes(c)}
              onCheckedChange={(ch) =>
                setActiveCats((prev) => (ch ? [...prev, c] : prev.filter((x) => x !== c)))
              }
            >
              {c}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Quick Toggles</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={onlyFavs}
            onCheckedChange={(ch) => setOnlyFavs(!!ch)}
          >
            Only Favorites
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-11">
            <Filter className="mr-2 h-4 w-4" /> Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setSortBy("name")}>Name (A→Z)</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy("trending")}>Trending (High→Low)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Header({ dark, setDark }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold leading-tight">OSINT Tools Directory</h1>
        <p className="text-muted-foreground mt-1">Fast, clean, and organized. Add your own tools or plug in a JSON feed.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="secondary">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
            <Github className="h-4 w-4" /> Contribute
          </a>
        </Button>
        <Button variant="outline" size="icon" className="rounded-full" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="text-center text-xs text-muted-foreground py-8">
      Built with ❤️ for investigators. Replace sample data with your catalog, export as static site, or drop into Next.js.
    </div>
  );
}

function EmptyState({ label = "No results", hint = "Try adjusting filters or search." }) {
  return (
    <div className="text-center py-16">
      <div className="text-2xl font-semibold">{label}</div>
      <div className="mt-1 text-muted-foreground">{hint}</div>
    </div>
  );
}

function ImportJsonDialog({ open, setOpen, onImport }) {
  const [text, setText] = useState("");
  const handleImport = () => {
    try {
      const data = JSON.parse(text);
      if (!Array.isArray(data)) throw new Error("Expected an array of tools");
      onImport(data);
      setOpen(false);
      setText("");
    } catch (e) {
      alert("Invalid JSON: " + e.message);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import tools from JSON</DialogTitle>
          <DialogDescription>Paste an array of {`{id,name,url,category,description,tags[],trending}`}</DialogDescription>
        </DialogHeader>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='[ {"id":"tool-1","name":"…","url":"…","category":"…","description":"…","tags":["…"],"trending":50} ]'
          className="w-full h-56 rounded-xl border bg-background p-3 font-mono text-sm"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [dark, setDark] = useLocalStorage("osint.dark", false);
  const [q, setQ] = useLocalStorage("osint.q", "");
  const [activeCats, setActiveCats] = useLocalStorage("osint.cats", []);
  const [activeTags, setActiveTags] = useLocalStorage("osint.tags", []);
  const [sortBy, setSortBy] = useLocalStorage("osint.sort", "trending");
  const [favs, setFavs] = useLocalStorage("osint.favs", []);
  const [onlyFavs, setOnlyFavs] = useLocalStorage("osint.onlyFavs", false);
  const [data, setData] = useLocalStorage("osint.data", SAMPLE_TOOLS);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const toggleFav = (id) => {
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filtered = useMemo(() => {
    const lowerQ = q.trim().toLowerCase();
    let items = data;
    if (lowerQ) {
      items = items.filter((t) =>
        [t.name, t.description, t.category, ...(t.tags || [])]
          .filter(Boolean)
          .join(" \u200b ")
          .toLowerCase()
          .includes(lowerQ)
      );
    }
    if (activeCats.length) items = items.filter((t) => activeCats.includes(t.category));
    if (activeTags.length) items = items.filter((t) => t.tags?.some((tg) => activeTags.includes(tg)));
    if (onlyFavs) items = items.filter((t) => favs.includes(t.id));

    items = [...items].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "trending") return (b.trending ?? 0) - (a.trending ?? 0);
      return 0;
    });
    return items;
  }, [q, activeCats, activeTags, sortBy, onlyFavs, favs, data]);

  // Tag cloud from current dataset
  const tagCloud = useMemo(() => {
    const map = new Map();
    data.forEach((t) => (t.tags || []).forEach((tg) => map.set(tg, (map.get(tg) || 0) + 1)));
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24);
  }, [data]);

  const clearAll = () => {
    setQ("");
    setActiveCats([]);
    setActiveTags([]);
    setOnlyFavs(false);
    setSortBy("trending");
  };

  const handleImport = (arr) => {
    // minimal sanitize and merge (by id)
    const byId = new Map(data.map((d) => [d.id, d]));
    arr.forEach((t) => {
      if (t && t.id) byId.set(t.id, { ...byId.get(t.id), ...t });
    });
    const merged = Array.from(byId.values());
    setData(merged);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <header className="py-8">
            <Header dark={dark} setDark={setDark} />
          </header>

          <section className="mb-6">
            <Toolbar
              q={q}
              setQ={setQ}
              activeCats={activeCats}
              setActiveCats={setActiveCats}
              activeTags={activeTags}
              setActiveTags={setActiveTags}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onlyFavs={onlyFavs}
              setOnlyFavs={setOnlyFavs}
            />

            {/* Active filters chips */}
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              {activeCats.map((c) => (
                <Badge key={c} variant="outline" className="cursor-pointer" onClick={() => setActiveCats((p) => p.filter((x) => x !== c))}>
                  {c} ✕
                </Badge>
              ))}
              {activeTags.map((t) => (
                <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => setActiveTags((p) => p.filter((x) => x !== t))}>
                  {t} ✕
                </Badge>
              ))}
              {(activeCats.length || activeTags.length || q || onlyFavs) ? (
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear all
                </Button>
              ) : null}
              <div className="ml-auto flex gap-2">
                <Button variant="outline" onClick={() => setImportOpen(true)}>
                  Import JSON
                </Button>
                <Button onClick={() => handleImport(SAMPLE_TOOLS)}>Reset</Button>
              </div>
            </div>
          </section>

          {/* Tag Cloud */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Popular Tags</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagCloud.map(([tg, count]) => (
                <Badge
                  key={tg}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setActiveTags((prev) => (prev.includes(tg) ? prev : [...prev, tg]))}
                >
                  {tg} <span className="ml-1 text-muted-foreground">({count})</span>
                </Badge>
              ))}
            </div>
          </section>

          {/* Results Grid */}
          <main className="pb-8">
            {filtered.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onBookmark={toggleFav}
                    isBookmarked={favs.includes(tool.id)}
                  />
                ))}
              </div>
            )}
          </main>

          <Footer />
        </div>

        <ImportJsonDialog open={importOpen} setOpen={setImportOpen} onImport={handleImport} />
      </div>
    </TooltipProvider>
  );
}
