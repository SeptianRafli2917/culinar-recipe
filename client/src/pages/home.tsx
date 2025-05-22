import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Recipe } from "@shared/schema";
import { RecipeGrid } from "@/components/recipe/RecipeGrid";
import { SearchBar } from "@/components/ui/search-bar";
import { CategoryTabs } from "@/components/ui/category-tabs";

export default function Home() {
  const [location] = useLocation();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const categoryParam = urlParams.get("category") || "all";
  const searchParam = urlParams.get("search") || "";

  // State for current view
  const [currentCategory, setCurrentCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);

  // Update state when URL changes
  useEffect(() => {
    const newUrlParams = new URLSearchParams(location.split("?")[1] || "");
    const newCategory = newUrlParams.get("category") || "all";
    const newSearch = newUrlParams.get("search") || "";
    
    setCurrentCategory(newCategory);
    setSearchQuery(newSearch);
  }, [location]);

  // Build API query string
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.append("search", searchQuery);
      return params.toString();
    }
    
    if (currentCategory && currentCategory !== "all") {
      params.append("category", currentCategory);
      return params.toString();
    }
    
    return "";
  };

  // Fetch recipes
  const {
    data: recipes = [],
    isLoading,
    isError,
    error,
  } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes", buildQueryString()],
    queryFn: async () => {
      const url = `/api/recipes${buildQueryString() ? `?${buildQueryString()}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json();
    },
  });

  // Page title based on current view
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results: ${searchQuery}`;
    }
    
    if (currentCategory === "all") {
      return "All Recipes";
    }
    
    return `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} Recipes`;
  };

  return (
    <>
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-accent to-primary py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Find & Save Your Favorite Recipes
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-white opacity-90">
              Store your personal recipes or share with a community of food lovers.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBar initialQuery={searchQuery} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs currentCategory={currentCategory} />

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6 font-heading">{getPageTitle()}</h2>
        
        <RecipeGrid
          recipes={recipes}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
          emptyState={
            searchQuery
              ? {
                  title: "No matching recipes found",
                  description: `No recipes found matching "${searchQuery}". Try a different search term.`,
                  showAddButton: true,
                }
              : {
                  title: "No recipes found",
                  description: currentCategory !== "all"
                    ? `You haven't added any ${currentCategory} recipes yet.`
                    : "You haven't added any recipes yet. Add your first recipe to get started!",
                  showAddButton: true,
                }
          }
        />
      </div>
    </>
  );
}
