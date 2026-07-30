"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Newspaper } from "lucide-react";
import type { IntelArticle } from "@/types/intel";

interface StateNewsProps {
  state: string;
}

export function StateNews({ state }: StateNewsProps) {
  const [articles, setArticles] = useState<IntelArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }
    const q = encodeURIComponent(`${state} India travel tourism`);
    fetch(
      `https://news.google.com/rss/search?q=${q}&hl=en-IN&gl=IN&ceid=IN:en`,
    )
      .then((r) => r.text())
      .then((xml) => {
        const items: IntelArticle[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
        let match;
        while ((match = itemRegex.exec(xml)) !== null) {
          const item = match[1];
          const title = item.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
          const link = item.match(/<link>(.*?)<\/link>/)?.[1] ?? "";
          const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";
          const desc = item
            .replace(/<[^>]+>/g, "")
            .substring(0, 200)
            .trim();
          if (title && link) {
            items.push({
              title: title.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'"),
              source: link ? new URL(link).hostname.replace("www.", "") : "",
              url: link.replace(/&amp;/g, "&"),
              publishedAt: pubDate,
              snippet: desc.substring(0, 150),
            });
          }
        }
        setArticles(items.slice(0, 10));
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [state]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-bruted border-2 border-ink/10 bg-surface-card p-4">
            <div className="h-4 w-3/4 shimmer rounded" />
            <div className="h-3 w-1/4 shimmer rounded" />
            <div className="h-3 w-full shimmer rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Newspaper className="h-10 w-10 text-ink-muted" />
        <p className="text-sm text-ink-muted">No recent news for {state}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-bruted border-2 border-ink/10 bg-surface-card p-4 transition-colors hover:border-accent"
        >
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-bold leading-tight">{article.title}</h3>
            <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-ink-muted" />
          </div>
          <div className="mb-1 flex items-center gap-2 text-xs text-ink-muted">
            <span>{article.source}</span>
            {article.publishedAt && (
              <>
                <span>·</span>
                <span>{new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </>
            )}
          </div>
          <p className="text-sm text-ink-muted line-clamp-2">{article.snippet}</p>
        </a>
      ))}
    </div>
  );
}
