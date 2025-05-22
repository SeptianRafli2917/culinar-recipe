import { useState } from "react";
import { useLocation } from "wouter";
import { Recipe } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart, Pencil, Printer } from "lucide-react";

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [, navigate] = useLocation();
  const [favorite, setFavorite] = useState(false);

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-dark p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Recipe Image Column */}
        <div className="md:w-2/5 mb-6 md:mb-0 md:mr-6">
          <img
            src={recipe.imageUrl || "https://via.placeholder.com/800x800?text=No+Image"}
            alt={recipe.title}
            className="w-full h-auto rounded-lg shadow-md object-cover max-h-96"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="bg-accent text-sm text-text-primary px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
              {recipe.category}
            </span>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
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
          <div className="flex mt-4 space-x-2">
            <Button
              onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
              className="flex-1 inline-flex justify-center items-center"
            >
              <Pencil className="h-5 w-5 mr-1" />
              Edit Recipe
            </Button>
            <Button
              variant="secondary"
              className="inline-flex justify-center items-center px-4 py-2"
              onClick={handlePrint}
            >
              <Printer className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Recipe Content Column */}
        <div className="md:w-3/5">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-text-primary dark:text-white font-heading">
              {recipe.title}
            </h2>
            <button
              className={`text-gray-400 hover:text-primary ${
                favorite ? "text-primary" : ""
              }`}
              onClick={toggleFavorite}
              aria-label="Toggle favorite"
            >
              <Heart className="h-6 w-6" fill={favorite ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="mt-4 text-text-secondary dark:text-gray-300">
            {recipe.description}
          </p>

          {/* Ingredients */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-text-primary dark:text-white font-heading">
              Ingredients
            </h3>
            <ul className="mt-2 space-y-2 text-text-secondary dark:text-gray-300">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-secondary mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-text-primary dark:text-white font-heading">
              Instructions
            </h3>
            <ol className="mt-2 space-y-4 text-text-secondary dark:text-gray-300 list-decimal ml-5">
              {recipe.steps.map((step, index) => (
                <li key={index}>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Notes */}
          {recipe.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-text-primary dark:text-white font-heading">
                Notes
              </h3>
              <p className="mt-2 text-text-secondary dark:text-gray-300 italic">
                {recipe.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
