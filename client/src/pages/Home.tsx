import { useState, useMemo } from "react";
import { repositories, Repository } from "@/data/repos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, Star, GitFork, Calendar, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"stars" | "date" | "tools">("date");

  const filteredRepos = useMemo(() => {
    let filtered = repositories.filter((repo) => 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === "stars") return b.stars - a.stars;
      if (sortBy === "tools") return b.toolCount - a.toolCount;
      // Default to date (newest first)
      return new Date(b.lastPushed).getTime() - new Date(a.lastPushed).getTime();
    });
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Header Section - Swiss Style: Large Typography, Grid Alignment */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container py-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-2">
                AI CODING
                <br />
                ARCHIVE
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
                A curated directory of the most significant AI development tool repositories.
                <span className="block mt-1 text-sm uppercase tracking-widest text-primary font-bold">
                  Updated Dec 2025
                </span>
              </p>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search archive..." 
                  className="pl-10 h-12 text-lg border-2 border-border focus-visible:ring-0 focus-visible:border-primary rounded-none transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="h-10 border-2 border-border rounded-none font-medium focus:ring-0">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-border">
                    <SelectItem value="date">Newest Updated</SelectItem>
                    <SelectItem value="stars">Most Stars</SelectItem>
                    <SelectItem value="tools">Tool Count</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex-1 flex items-center justify-end text-sm font-mono text-muted-foreground">
                  {filteredRepos.length} RECORDS
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12">
        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          <AnimatePresence mode="popLayout">
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.url}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-background h-full"
              >
                <Card className="h-full border-0 rounded-none hover:bg-accent/5 transition-colors group flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="font-mono text-xs text-muted-foreground mb-2">
                        NO. {String(repo.rank).padStart(2, '0')}
                      </div>
                      <Badge variant="outline" className="rounded-none border-primary/20 text-primary font-mono text-[10px] uppercase tracking-wider">
                        {repo.lastPushed}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors break-words">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        {repo.name.split('/')[1]}
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </CardTitle>
                    <CardDescription className="font-mono text-xs text-muted-foreground mt-1">
                      {repo.name.split('/')[0]}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                      {repo.description || "No description available."}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span>{repo.stars.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium justify-end">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span>{repo.toolCount} Tools</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredRepos.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-bold text-muted-foreground">NO RECORDS FOUND</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search criteria.</p>
            <Button 
              variant="outline" 
              className="mt-6 rounded-none border-2"
              onClick={() => {setSearchQuery(""); setSortBy("date");}}
            >
              RESET FILTERS
            </Button>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-12 mt-12 bg-secondary/20">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-4">ABOUT THIS ARCHIVE</h2>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              This directory is an automated curation of the most significant GitHub repositories 
              tracking the AI development ecosystem. Data is verified for relevance and tool count.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end justify-between">
            <div className="font-mono text-xs text-muted-foreground">
              GENERATED BY MANUS AI
            </div>
            <div className="font-mono text-xs text-muted-foreground mt-2">
              © 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
