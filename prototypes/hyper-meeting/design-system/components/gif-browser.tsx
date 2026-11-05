/* eslint-disable @next/next/no-img-element -- Editor and GIF images use user-supplied/blob URLs with intrinsic dimensions. */
"use client";

import { VirtuosoMasonry } from "@virtuoso.dev/masonry";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import {
  LucideArrowLeft,
  LucideLoader2,
  LucideSearch,
} from "../icons/index";

import { isValidGifUrl } from "../lib/gif-url";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Input } from "./input";

interface KlipyMedia {
  height?: number;
  url: string;
  width?: number;
}

interface KlipyFileSize {
  gif?: KlipyMedia;
  jpg?: KlipyMedia;
  mp4?: KlipyMedia;
  webp?: KlipyMedia;
}

interface KlipyFile {
  hd?: KlipyFileSize;
  md?: KlipyFileSize;
  sm?: KlipyFileSize;
  xs?: KlipyFileSize;
}

interface KlipyGif {
  blur_preview?: string;
  file?: KlipyFile;
  id?: number;
  slug: string;
  tags?: string[];
  title: string;
  type?: string;
}

type KlipySearchResponse = {
  result?: unknown;
  data?: {
    data?: KlipyGif[];
    has_next?: boolean;
  };
};

export interface GifBrowserProps {
  apiKey?: string;
  onOpenChange: (open: boolean) => void;
  onSelectGif: (gifUrl: string) => void;
  open: boolean;
}

// Popular GIF categories
const DEFAULT_CATEGORIES = [
  { name: "Trending", emoji: "🔥", searchTerm: "" },
  { name: "Happy", emoji: "😊", searchTerm: "happy" },
  { name: "Sad", emoji: "😢", searchTerm: "sad" },
  { name: "Love", emoji: "❤️", searchTerm: "love" },
  { name: "Angry", emoji: "😠", searchTerm: "angry" },
  { name: "Surprised", emoji: "😮", searchTerm: "surprised" },
  { name: "Thinking", emoji: "🤔", searchTerm: "thinking" },
  { name: "Celebrate", emoji: "🎉", searchTerm: "celebrate" },
  { name: "Dance", emoji: "💃", searchTerm: "dance" },
  { name: "Thumbs Up", emoji: "👍", searchTerm: "thumbs up" },
  { name: "Applause", emoji: "👏", searchTerm: "applause" },
  { name: "Facepalm", emoji: "🤦", searchTerm: "facepalm" },
  { name: "Eye Roll", emoji: "🙄", searchTerm: "eye roll" },
  { name: "High Five", emoji: "🙏", searchTerm: "high five" },
  { name: "Mind Blown", emoji: "🤯", searchTerm: "mind blown" },
  { name: "Thank You", emoji: "🙏", searchTerm: "thank you" },
];

type ViewMode = "categories" | "gifs";

function useGifBrowserController({
  open,
  onOpenChange,
  onSelectGif,
  apiKey,
}: GifBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [gifs, setGifs] = useState<KlipyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const hasMore = useRef(true);
  const currentSearchTerm = useRef("");
  const activeRequestGenerationRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      activeRequestGenerationRef.current += 1;
      // Reset hidden dialog state after dismissal, including in-flight requests.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery("");
      setSelectedCategory(null);
      setViewMode("categories");
      setGifs([]);
      setLoading(false);
      setLoadingMore(false);
      setError(null);
      setCurrentPage(1);
      hasMore.current = true;
      currentSearchTerm.current = "";
    }
  }, [open]);

  // Handle responsive columns
  useEffect(() => {
    const handleResize = () => {
      setColumns(window.innerWidth < 640 ? 2 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchGifs = useCallback(
    async (query: string, append = false) => {
      if (!open) {
        return;
      }

      const requestGeneration = activeRequestGenerationRef.current + 1;
      activeRequestGenerationRef.current = requestGeneration;

      if (!apiKey) {
        if (requestGeneration === activeRequestGenerationRef.current) {
          setError("GIF API key not configured");

          setLoading(false);

          setLoadingMore(false);
        }
        return;
      }

      if (append) {
        setLoadingMore(true);
      } else {
        // Reset scroll position to top for new searches
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
        // Always show loading spinner for new searches
        setLoading(true);
        setGifs([]); // Clear previous results immediately
        setCurrentPage(1);
        hasMore.current = true;
      }
      setError(null);

      const page = append ? currentPage : 1;
      const perPage = 24;

      try {
        let endpoint: string;
        const baseUrl = "https://api.klipy.co/api/v1";

        // For trending, use the trending endpoint
        if (query === "") {
          // Trending GIFs
          endpoint = `${baseUrl}/${apiKey}/gifs/trending?page=${page}&per_page=${perPage}`;
        } else {
          // LucideSearch GIFs
          endpoint = `${baseUrl}/${apiKey}/gifs/search?q=${encodeURIComponent(
            query
          )}&page=${page}&per_page=${perPage}`;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch GIFs");
        }

        // SAFETY: this response comes from Klipy's versioned v1 GIF endpoint;
        // Klipy establishes the documented result/data envelope and media fields,
        // while the existing check below rejects a missing envelope before use.
        const json = (await response.json()) as KlipySearchResponse;

        // Klipy API response structure
        if (!(json.result && json.data)) {
          throw new Error("Invalid API response");
        }

        const newGifs = (json.data.data || []).filter(
          (gif: KlipyGif) => gif?.file
        );

        if (requestGeneration !== activeRequestGenerationRef.current) {
          return;
        }

        if (append) {
          setGifs((prev) => [...prev, ...newGifs]);
        } else {
          // Replace results smoothly
          setGifs(newGifs);
        }

        currentSearchTerm.current = query;
        setCurrentPage(page + 1);
        hasMore.current = json.data.has_next ?? false;
        setViewMode("gifs");
      } catch (err) {
        if (requestGeneration !== activeRequestGenerationRef.current) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load GIFs");
        if (!append) {
          setGifs([]);
        }
      } finally {
        // The stale-request guard must not let an older request clear a newer spinner.
        if (requestGeneration === activeRequestGenerationRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [apiKey, currentPage, open]
  );
  const searchGifsEvent = useEffectEvent(searchGifs);

  // Handle search with debouncing
  useEffect(() => {
    if (searchQuery) {
      const timer = setTimeout(() => {
        searchGifsEvent(searchQuery);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleCategoryClick = (searchTerm: string, categoryName: string) => {
    setSelectedCategory(categoryName);
    searchGifs(searchTerm || "");
  };

  const handleSearchQueryChange = (query: string) => {
    activeRequestGenerationRef.current += 1;
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleBackToCategories = () => {
    activeRequestGenerationRef.current += 1;
    setViewMode("categories");
    setSelectedCategory(null);
    setGifs([]);
    setSearchQuery("");
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setCurrentPage(1);
    hasMore.current = true;
    currentSearchTerm.current = "";
    // Reset scroll position
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore.current && !loading) {
      searchGifs(currentSearchTerm.current, true);
    }
  }, [loadingMore, loading, searchGifs]);

  const handleSelectGif = (gif: KlipyGif) => {
    // Use medium size to match what's displayed in image-element for caching
    const gifUrl =
      gif.file?.md?.gif?.url ||
      gif.file?.md?.webp?.url ||
      gif.file?.sm?.gif?.url ||
      gif.file?.sm?.webp?.url ||
      gif.file?.xs?.gif?.url ||
      gif.file?.xs?.webp?.url ||
      "";

    // Only allow http(s) URLs to prevent base64/data: URLs from being stored
    if (gifUrl && isValidGifUrl(gifUrl)) {
      onSelectGif(gifUrl);
      onOpenChange(false);
    }
  };

  return {
    searchQuery,
    selectedCategory,
    viewMode,
    gifs,
    loading,
    loadingMore,
    error,
    columns,
    scrollContainerRef,
    hasMore,
    handleBackToCategories,
    handleSearchQueryChange,
    handleLoadMore,
    handleCategoryClick,
    handleSelectGif,
  };
}

function getGifImage(gif: KlipyGif) {
  // Get dimensions from medium or small size for better quality
  const width =
    gif.file?.md?.webp?.width ||
    gif.file?.md?.gif?.width ||
    gif.file?.sm?.webp?.width ||
    gif.file?.sm?.gif?.width ||
    gif.file?.xs?.webp?.width ||
    gif.file?.xs?.gif?.width ||
    200;
  const height =
    gif.file?.md?.webp?.height ||
    gif.file?.md?.gif?.height ||
    gif.file?.sm?.webp?.height ||
    gif.file?.sm?.gif?.height ||
    gif.file?.xs?.webp?.height ||
    gif.file?.xs?.gif?.height ||
    200;
  const aspectRatio = height / width;

  // Use medium size images to match what will be inserted (for caching)
  const imageUrl =
    gif.file?.md?.webp?.url ||
    gif.file?.md?.gif?.url ||
    gif.file?.sm?.webp?.url ||
    gif.file?.sm?.gif?.url ||
    gif.file?.xs?.webp?.url ||
    gif.file?.xs?.gif?.url ||
    gif.blur_preview ||
    "";

  return { width, height, aspectRatio, imageUrl };
}

function GifMasonryItem({
  data: gif,
  context: onSelect,
}: {
  data: KlipyGif;
  context: (gif: KlipyGif) => void;
}) {
  // Check if gif has required file data
  if (!gif?.file) {
    return null;
  }

  const { width, height, aspectRatio, imageUrl } = getGifImage(gif);

  return (
    <button
      aria-label={`Insert GIF: ${gif.title || "Untitled GIF"}`}
      className={cn(
        "group relative mb-2 w-full overflow-hidden rounded-md",
        "border-2 border-transparent transition-[border-color,box-shadow] motion-reduce:transition-none",
        "hover:border-primary hover:shadow-md",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      onClick={() => onSelect(gif)}
      style={{
        aspectRatio: `1 / ${aspectRatio}`,
      }}
      type="button"
    >
      <img
        alt={gif.title || "GIF"}
        className="size-full object-cover"
        height={height}
        loading="lazy"
        src={imageUrl}
        width={width}
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex size-full items-center justify-center">
          <span className="text-white text-xs">Insert</span>
        </div>
      </div>
    </button>
  );
}

function GifBrowserResults({
  controller,
}: {
  controller: ReturnType<typeof useGifBrowserController>;
}) {
  const {
    loading,
    error,
    viewMode,
    searchQuery,
    gifs,
    columns,
    loadingMore,
    handleCategoryClick,
    handleSelectGif,
  } = controller;
  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <LucideLoader2 className="size-6 animate-spin" />
      </div>
    );
  if (error)
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  if (viewMode === "categories" && !searchQuery)
    return (
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4">
        {DEFAULT_CATEGORIES.map((category) => (
          <button
            aria-label={`Browse ${category.name} GIFs`}
            className={cn(
              "group relative flex h-24 flex-col items-center justify-center gap-2 rounded-lg",
              "border-2 border-transparent bg-muted/50 transition-[border-color,background-color,box-shadow] motion-reduce:transition-none",
              "hover:border-primary hover:bg-muted hover:shadow-md",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
            key={category.name}
            onClick={() =>
              handleCategoryClick(category.searchTerm, category.name)
            }
            type="button"
          >
            <span className="text-2xl">{category.emoji}</span>
            <span className="font-medium text-sm">{category.name}</span>
          </button>
        ))}
      </div>
    );
  if (gifs.length === 0)
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>No GIFs found</p>
      </div>
    );
  return (
    <>
      <VirtuosoMasonry
        className="p-4 [&>div]:gap-2"
        columnCount={columns}
        data={gifs}
        ItemContent={GifMasonryItem}
        context={handleSelectGif}
      />
      {loadingMore && (
        <div className="flex items-center justify-center py-4">
          <LucideLoader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </>
  );
}

export function GifBrowser(props: GifBrowserProps) {
  const controller = useGifBrowserController(props);
  const { open, onOpenChange } = props;
  const {
    searchQuery,
    selectedCategory,
    viewMode,
    gifs,
    loading,
    loadingMore,
    scrollContainerRef,
    hasMore,
    handleBackToCategories,
    handleSearchQueryChange,
    handleLoadMore,
  } = controller;
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {viewMode === "gifs" && !searchQuery && (
              <Button
                aria-label="Back to GIF categories"
                className="h-8 w-8 p-0"
                onClick={handleBackToCategories}
                size="sm"
                variant="ghost"
              >
                <LucideArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {viewMode === "categories"
                ? "Choose a category"
                : selectedCategory
                  ? selectedCategory
                  : searchQuery
                    ? `Results for "${searchQuery}"`
                    : "Insert GIF"}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            {viewMode === "categories"
              ? "Select a category to browse GIFs or use the search bar to find specific GIFs"
              : "Click on a GIF to insert it into your message"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <LucideSearch className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              onChange={(event) => handleSearchQueryChange(event.target.value)}
              aria-label="Search for GIFs"
              placeholder="Search for GIFs..."
              value={searchQuery}
            />
          </div>

          <div
            className="h-[400px] overflow-y-auto rounded-md border"
            onScroll={(e) => {
              // Handle infinite scroll for GIFs view
              if (
                viewMode === "gifs" &&
                gifs.length > 0 &&
                !loadingMore &&
                hasMore.current
              ) {
                const element = e.currentTarget;
                const threshold = 200;
                if (
                  element.scrollHeight - element.scrollTop <=
                  element.clientHeight + threshold
                ) {
                  handleLoadMore();
                }
              }
            }}
            ref={scrollContainerRef}
          >
            <GifBrowserResults controller={controller} />
          </div>

          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Powered by Klipy</span>
            {!loading && viewMode === "gifs" && gifs.length > 0 && (
              <span>{gifs.length} GIFs</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
