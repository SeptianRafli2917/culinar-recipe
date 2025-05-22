import { useLocation } from "wouter";
import { RECIPE_CATEGORIES } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryTabsProps {
  currentCategory?: string;
}

export function CategoryTabs({ currentCategory = "all" }: CategoryTabsProps) {
  const [, navigate] = useLocation();

  const handleCategoryChange = (category: string) => {
    navigate(`/?category=${category}`);
  };

  return (
    <div className="bg-white dark:bg-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sm:hidden py-3">
          <Select
            value={currentCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recipes</SelectItem>
              {RECIPE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="/?category=all"
                className={`${
                  currentCategory === "all"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                } py-4 px-1 border-b-2 font-medium text-sm`}
                aria-current={currentCategory === "all" ? "page" : undefined}
              >
                All Recipes
              </a>
              {RECIPE_CATEGORIES.map((category) => (
                <a
                  key={category}
                  href={`/?category=${category}`}
                  className={`${
                    currentCategory === category
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  } py-4 px-1 border-b-2 font-medium text-sm`}
                  aria-current={currentCategory === category ? "page" : undefined}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
