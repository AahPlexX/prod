// src/components/search/NsbsSearchInputWithSuggestions.tsx
// Developed by Luccas A E | 2025
// Purpose: An advanced search input component that shows type-ahead suggestions as the user types.
// Features: Debounced input, fetches and displays suggestions, keyboard navigation for suggestions, customizable suggestion rendering.
// UI/UX Focus: Enhances search experience by providing immediate relevant suggestions, reducing typing effort.
// Adherence to NSBS Principles: If used for course search, it aligns with helping users find relevant educational content efficiently.

'use client'; // Requires client-side state and effects

import React, { useState, useEffect, useCallback, useRef, ReactNode, KeyboardEvent } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { NsbsButton } from '@/components/ui/NsbsButton'; // For a clear button

// Define a generic suggestion item type
export interface SuggestionItem {
  id: string | number;
  // Other properties will depend on the data source
  [key: string]: any; 
}

export interface NsbsSearchInputWithSuggestionsProps<T extends SuggestionItem> {
  onSearch: (query: string) => Promise<T[]>; // Async function to fetch suggestions
  onSelectSuggestion: (suggestion: T) => void;
  renderSuggestion: (suggestion: T, isHighlighted: boolean) => ReactNode;
  placeholder?: string;
  initialQuery?: string;
  debounceDelay?: number; // Milliseconds
  minCharsForSuggestions?: number;
  inputClassName?: string;
  suggestionsContainerClassName?: string;
  isLoadingInitially?: boolean; // If suggestions should be loaded on mount with initialQuery
  noResultsMessage?: string;
  inputAriaLabel?: string;
}

export const NsbsSearchInputWithSuggestions = <T extends SuggestionItem>({
  onSearch,
  onSelectSuggestion,
  renderSuggestion,
  placeholder = "Search...",
  initialQuery = "",
  debounceDelay = 300,
  minCharsForSuggestions = 2,
  inputClassName,
  suggestionsContainerClassName,
  isLoadingInitially = false,
  noResultsMessage = "No suggestions found.",
  inputAriaLabel = "Search input with suggestions"
}: NsbsSearchInputWithSuggestionsProps<T>) => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(isLoadingInitially);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useCallback(
    // Basic debounce implementation. For production, consider using a library like lodash.debounce.
    (searchFunction: (q: string) => void, delay: number) => {
      let timeoutId: NodeJS.Timeout;
      return (q: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => searchFunction(q), delay);
      };
    },
    []
  );

  const fetchSuggestions = useCallback(async (currentQuery: string) => {
    if (currentQuery.length < minCharsForSuggestions) {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
      return;
    }
    setIsLoading(true);
    try {
      const results = await onSearch(currentQuery);
      setSuggestions(results);
      setIsSuggestionsVisible(results.length > 0 || (currentQuery.length >= minCharsForSuggestions && results.length === 0) ); // Show "no results"
      setHighlightedIndex(-1); // Reset highlight
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
      setIsSuggestionsVisible(false); // Or show an error message in the dropdown
    } finally {
      setIsLoading(false);
    }
  }, [minCharsForSuggestions, onSearch]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchSuggestions = useCallback(debouncedSearch(fetchSuggestions, debounceDelay), [fetchSuggestions, debounceDelay]);

  useEffect(() => {
    if (query.length >= minCharsForSuggestions) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  }, [query, minCharsForSuggestions, debouncedFetchSuggestions]);
  
  useEffect(() => { // Load initial if query provided and flag set
    if (initialQuery && initialQuery.length >= minCharsForSuggestions && isLoadingInitially) {
        fetchSuggestions(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSuggestionClick = (suggestion: T) => {
    onSelectSuggestion(suggestion);
    // Optionally set query to a display field from suggestion, or clear it
    // setQuery(suggestion.name); // Example
    setIsSuggestionsVisible(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isSuggestionsVisible || suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter' && highlightedIndex >= 0) {
      event.preventDefault();
      handleSuggestionClick(suggestions[highlightedIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsSuggestionsVisible(false);
    }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsSuggestionsVisible(false);
    // Optionally call onSelectSuggestion with a null/empty state
  };

  return (
    <div className="nsbs-search-with-suggestions relative w-full" ref={searchContainerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
        <input
          type="search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= minCharsForSuggestions && suggestions.length > 0 && setIsSuggestionsVisible(true)}
          placeholder={placeholder}
          className={cn(
            "block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 sm:text-sm dark:bg-gray-700 dark:text-white",
            inputClassName
          )}
          aria-label={inputAriaLabel}
          aria-autocomplete="list"
          aria-expanded={isSuggestionsVisible}
          aria-controls="search-suggestions-listbox"
          aria-activedescendant={highlightedIndex >=0 ? `suggestion-${highlightedIndex}` : undefined}
        />
        {query.length > 0 && !isLoading && (
           <button 
             type="button" 
             onClick={clearSearch} 
             className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
             aria-label="Clear search"
           >
             <X className="h-5 w-5" />
           </button>
        )}
      </div>

      {isSuggestionsVisible && (
        <ul
          id="search-suggestions-listbox"
          role="listbox"
          className={cn(
            "absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-72 overflow-y-auto",
            suggestionsContainerClassName
          )}
        >
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={cn(
                  "cursor-pointer select-none relative py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700",
                  highlightedIndex === index && "bg-gray-100 dark:bg-gray-700"
                )}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {renderSuggestion(suggestion, highlightedIndex === index)}
              </li>
            ))
          ) : (
            query.length >= minCharsForSuggestions && !isLoading && (
              <li className="py-2 px-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                {noResultsMessage}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default NsbsSearchInputWithSuggestions;
