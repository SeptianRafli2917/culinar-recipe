import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Recipe } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Heart, Pencil, Trash2 } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/recipes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({
        title: "Recipe deleted",
        description: "The recipe has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete recipe: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  return (
    <>
      <div className="recipe-card bg-white dark:bg-dark rounded-lg overflow-hidden shadow-md">
        <img
          src={recipe.imageUrl || "https://via.placeholder.com/800x500?text=No+Image"}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold font-heading text-text-primary dark:text-white">
              {recipe.title}
            </h3>
            <button
              className={cn(
                "text-gray-400 hover:text-primary",
                favorite && "text-primary"
              )}
              onClick={toggleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className="h-6 w-6" fill={favorite ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="flex items-center mt-2">
            <span className="bg-accent text-xs text-text-primary px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
              {recipe.category}
            </span>
            <div className="flex items-center ml-4 text-sm text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{recipe.cookTimeMinutes} mins</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-text-secondary dark:text-gray-300 line-clamp-2">
            {recipe.description}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <Link href={`/recipes/${recipe.id}`}>
              <a className="text-primary hover:text-primary-dark focus:outline-none font-medium text-sm">
                View Recipe
              </a>
            </Link>
            <div className="flex space-x-2">
              <button
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                aria-label="Edit"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => setShowDeleteAlert(true)}
                aria-label="Delete"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the recipe "{recipe.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleDelete(recipe.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
