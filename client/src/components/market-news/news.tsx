"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, FileText } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading market news...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Error Loading News
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400">
            {error instanceof Error
              ? error.message
              : "Failed to load market news"}
          </p>
        </div>
      </div>
    );
  }

  if (!sections.length || !news || news.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-md">
          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800">
            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            No News Available
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            There are no market news articles available at this time.
          </p>
        </div>
      </div>
    );
  }

  const item = news[0];
  const section = sections[page];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {section.subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(item.created_at)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
        <div
          className="prose prose-gray dark:prose-invert max-w-none text-base leading-relaxed
            prose-headings:text-gray-900 dark:prose-headings:text-gray-100
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-strong:text-gray-900 dark:prose-strong:text-gray-100
            prose-ul:text-gray-700 dark:prose-ul:text-gray-300
            prose-li:text-gray-700 dark:prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>

      {/* Footer with Pagination */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">
              Section {page + 1} of {sections.length}
            </span>
            {sections.length > 1 && (
              <span className="text-gray-400 dark:text-gray-500">•</span>
            )}
            {sections.length > 1 && (
              <span className="text-xs">
                {Math.round(((page + 1) / sections.length) * 100)}% complete
              </span>
            )}
          </div>

          {/* Navigation */}
          {sections.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg 
                  bg-white dark:bg-gray-700 
                  border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-200 
                  font-medium text-sm
                  transition-all
                  hover:bg-gray-50 dark:hover:bg-gray-600
                  hover:border-gray-400 dark:hover:border-gray-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:bg-white dark:disabled:hover:bg-gray-700"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                title="Previous section"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Page Dots */}
              <div className="flex items-center gap-1.5 px-3">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === page
                        ? "bg-blue-600 dark:bg-blue-400 w-6"
                        : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    title={`Go to section ${index + 1}`}
                    aria-label={`Section ${index + 1}`}
                  />
                ))}
              </div>

              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg 
                  bg-white dark:bg-gray-700 
                  border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-200 
                  font-medium text-sm
                  transition-all
                  hover:bg-gray-50 dark:hover:bg-gray-600
                  hover:border-gray-400 dark:hover:border-gray-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:bg-white dark:disabled:hover:bg-gray-700"
                onClick={() =>
                  setPage((p) => Math.min(sections.length - 1, p + 1))
                }
                disabled={page === sections.length - 1}
                title="Next section"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
