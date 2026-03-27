import React, { useState, useEffect, useRef } from 'react';
import { Page, SearchResult, ContentMatch } from '@/types';

interface SearchBarProps {
  pages: Page[];
  onResultSelect: (page: Page) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  pages,
  onResultSelect,
  placeholder = 'Search the cosmos...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract text from Tiptap content
  const extractTextFromContent = (content: any): string => {
    if (!content || typeof content !== 'object') return '';
    
    let text = '';
    
    if (content.type === 'text') {
      return content.text || '';
    }
    
    if (content.content && Array.isArray(content.content)) {
      text = content.content.map(extractTextFromContent).join(' ');
    }
    
    if (content.text) {
      text += content.text;
    }
    
    return text;
  };

  // Search content for matches
  const searchContent = (content: any, query: string): ContentMatch[] => {
    const matches: ContentMatch[] = [];
    const text = extractTextFromContent(content);
    const regex = new RegExp(query, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        index: match.index,
        context: getContext(text, match.index, 50),
      });
    }

    return matches;
  };

  // Get context around a match
  const getContext = (text: string, index: number, contextLength: number): string => {
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + contextLength + query.length);
    return text.substring(start, end);
  };

  // Calculate search score
  const calculateScore = (titleMatch: boolean, contentMatches: ContentMatch[]): number => {
    let score = 0;
    
    if (titleMatch) score += 100;
    score += contentMatches.length * 10;
    
    // Bonus for exact title matches
    if (titleMatch) score += 50;
    
    return score;
  };

  // Perform search
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const queryLower = searchQuery.toLowerCase();

    pages.forEach(page => {
      const titleMatch = page.title.toLowerCase().includes(queryLower);
      const contentMatches = searchContent(page.content, searchQuery);

      if (titleMatch || contentMatches.length > 0) {
        searchResults.push({
          page,
          matches: contentMatches,
          score: calculateScore(titleMatch, contentMatches),
        });
      }
    });

    setResults(searchResults.sort((a, b) => b.score - a.score));
    setSelectedIndex(0);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    performSearch(value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[selectedIndex]) {
          onResultSelect(results[selectedIndex].page);
          setIsOpen(false);
          setQuery('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    onResultSelect(result.page);
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-surface-container-low border-none rounded-full px-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20 pr-10"
        />
        <span className="material-symbols-outlined absolute right-3 top-1.5 text-outline scale-75 pointer-events-none">
          search
        </span>
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-xl rounded-lg shadow-[0_12px_40px_rgba(25,28,29,0.15)] border border-slate-200/50 max-h-80 overflow-y-auto z-50"
        >
          {results.map((result, index) => (
            <div
              key={result.page.id}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-100/50 last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-on-surface truncate">
                    {result.page.title}
                  </div>
                  
                  {result.matches.length > 0 && (
                    <div className="mt-1 text-xs text-on-surface-variant">
                      {result.matches.slice(0, 2).map((match, matchIndex) => (
                        <div key={matchIndex} className="truncate">
                          ...{match.context}...
                        </div>
                      ))}
                      {result.matches.length > 2 && (
                        <div className="text-primary font-medium">
                          +{result.matches.length - 2} more matches
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-primary font-medium">
                    {result.score} pts
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {result.matches.length} matches
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="px-4 py-2 text-xs text-on-surface-variant border-t border-slate-100/50">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-xl rounded-lg shadow-[0_12px_40px_rgba(25,28,29,0.15)] border border-slate-200/50 z-50"
        >
          <div className="px-4 py-6 text-center">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">
              search_off
            </span>
            <div className="text-sm font-medium text-on-surface mb-1">
              No results found
            </div>
            <div className="text-xs text-on-surface-variant">
              Try different keywords or check spelling
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
