import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Recipe } from "@shared/schema";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditRecipe() {
  const { id } = useParams();
  const [, navigate] = useLocation();

  const {
    data: recipe,
    isLoading,
    isError,
    error,
  } = useQuery<Recipe>({
    queryKey: [`/api/recipes/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }
      return response.json();
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        className="mb-6 text-gray-600 dark:text-gray-300"
        onClick={() => navigate(`/recipes/${id}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to recipe
      </Button>

      <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 font-heading">Edit Recipe</h1>
        
        {isLoading && (
          <div className="text-center py-10">
            <Loader2 className="animate-spin h-10 w-10 text-primary mx-auto" />
            <p className="mt-4 text-text-secondary dark:text-gray-400">Loading recipe...</p>
          </div>
        )}

        {isError && (
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
              Error Loading Recipe
            </h3>
            <p className="mt-1 text-text-secondary dark:text-gray-400">
              {error instanceof Error ? error.message : "Failed to load recipe"}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Go back to recipes
            </Button>
          </div>
        )}

        {recipe && <RecipeForm recipe={recipe} />}
      </div>
    </div>
  );
}
