import { Recipe } from "@shared/schema";
import { RecipeCard } from "./RecipeCard";
import { Button } from "@/components/ui/button";
import { useRecipeFormModal } from "@/hooks/use-recipe-form-modal";
import { Loader2, FolderPlus } from "lucide-react";

interface RecipeGridProps {
  recipes: Recipe[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  emptyState?: {
    title: string;
    description: string;
    showAddButton?: boolean;
  };
}

export function RecipeGrid({
  recipes,
  isLoading,
  isError,
  errorMessage = "Error loading recipes",
  emptyState = {
    title: "No recipes found",
    description: "Try adjusting your search or add a new recipe.",
    showAddButton: true,
  },
}: RecipeGridProps) {
  const { onOpen } = useRecipeFormModal();

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto" />
        <p className="mt-4 text-text-secondary dark:text-gray-400">Loading recipes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-destructive mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-text-primary dark:text-white">
          Something went wrong
        </h3>
        <p className="mt-1 text-text-secondary dark:text-gray-400">{errorMessage}</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-10">
        <FolderPlus className="h-16 w-16 text-gray-300 mx-auto" />
        <h3 className="mt-2 text-lg font-medium text-text-primary dark:text-white">
          {emptyState.title}
        </h3>
        <p className="mt-1 text-text-secondary dark:text-gray-400">
          {emptyState.description}
        </p>
        {emptyState.showAddButton && (
          <Button
            onClick={onOpen}
            className="mt-4 inline-flex items-center px-4 py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Recipe
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
