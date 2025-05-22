import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="sm:flex">
      <div className="flex-grow">
        <label htmlFor="search-recipes" className="sr-only">
          Search recipes
        </label>
        <Input
          id="search-recipes"
          type="text"
          placeholder="Search recipes by title or ingredients"
          className="block w-full px-4 py-3 rounded-md text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="mt-3 sm:mt-0 sm:ml-3">
        <Button
          type="submit"
          className="block w-full py-3 px-4 bg-secondary hover:bg-green-600 text-white font-medium"
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}
