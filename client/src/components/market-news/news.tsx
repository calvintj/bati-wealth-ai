"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";
import { useState, useEffect } from "react";

async function fetchMarketNews() {
  const { data, error } = await supabase
    .from("market_news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  // Map the columns to the expected keys
  return (data ?? []).map((item: any) => ({
    id: item.id,
    text: item.news, // map 'news' to 'text'
    citation: item.citations, // map 'citations' to 'citation'
    created_at: item.created_at,
  }));
}

// Enhanced split function: returns {title, subtitle, content}
function splitNewsSections(html: string) {
  const container = document.createElement("div");
  container.innerHTML = html;

  const sections: { title: string; subtitle?: string; content: string }[] = [];
  let currentSection: HTMLElement | null = null;
  let currentTitle = "";
  let currentSubtitle = "";

  Array.from(container.childNodes).forEach((node) => {
    if (node.nodeName === "H2") {
      if (currentSection) {
        sections.push({
          title: currentTitle,
          subtitle: currentSubtitle,
          content: (currentSection as HTMLElement).innerHTML,
        });
      }
      currentSection = document.createElement("div");
      currentSection.appendChild(node.cloneNode(true));
      currentTitle = (node as HTMLElement).textContent || "";
      currentSubtitle = "";
    } else if (node.nodeName === "H3" && currentSection) {
      currentSection.appendChild(node.cloneNode(true));
      currentSubtitle = (node as HTMLElement).textContent || "";
    } else if (currentSection) {
      currentSection.appendChild(node.cloneNode(true));
    }
  });

  if (currentSection) {
    sections.push({
      title: currentTitle,
      subtitle: currentSubtitle,
      content: (currentSection as HTMLElement).innerHTML,
    });
  }

  return sections;
}

export default function News() {
  const {
    data: news,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["marketNews"],
    queryFn: fetchMarketNews,
  });
  const [sections, setSections] = useState<
    {
      title: string;
      subtitle?: string;
      content: string;
    }[]
  >([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (news && news.length > 0) {
      setSections(splitNewsSections(news[0].text));
      setPage(0);
    }
  }, [news]);

  if (isLoading) {
    return <div className="p-4">Loading market news...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading market news</div>;
  }

  if (!sections.length) {
    return <div className="p-4">No news available.</div>;
  }

  const item = news?.[0];
  const section = sections[page];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#1D283A]">
        <div className="p-8 flex flex-col gap-4" style={{ height: "80vh" }}>
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            {section.title}
          </h2>
          {section.subtitle && (
            <h3 className="text-lg font-semibold text-center text-gray-700 dark:text-gray-300 mb-2">
              {section.subtitle}
            </h3>
          )}
          <div
            className="prose prose-gray dark:prose-invert max-w-none text-base flex-1 overflow-y-auto"
            style={{ minHeight: "0" }}
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
          <div className="flex flex-col items-center gap-1 mt-4">
            <p className="text-xs text-gray-400">
              {item ? new Date(item.created_at).toLocaleDateString() : ""}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <button
                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold transition disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                &larr; Previous
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {page + 1} / {sections.length}
              </span>
              <button
                className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold transition disabled:opacity-50"
                onClick={() =>
                  setPage((p) => Math.min(sections.length - 1, p + 1))
                }
                disabled={page === sections.length - 1}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
