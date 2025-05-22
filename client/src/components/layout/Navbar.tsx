import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useRecipeFormModal } from "@/hooks/use-recipe-form-modal";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useRecipeFormModal();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white dark:bg-dark shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="ml-2 text-lg font-semibold text-primary font-heading">Recipe Keeper</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === '/' ? 'text-primary' : 'text-text-primary hover:text-primary'}`}>
                  Home
                </a>
              </Link>
              <Link href="/?category=all">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${location.includes('?category=') ? 'text-primary' : 'text-text-primary hover:text-primary'}`}>
                  My Recipes
                </a>
              </Link>
              <Button onClick={onOpen} className="ml-4 inline-flex items-center px-4 py-2 text-sm">
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
                Add Recipe
              </Button>
            </div>
            <div className="flex md:hidden items-center">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-text-primary hover:text-primary focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === '/' ? 'text-primary' : 'text-text-primary hover:text-primary'}`}>
                Home
              </a>
            </Link>
            <Link href="/?category=all">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location.includes('?category=') ? 'text-primary' : 'text-text-primary hover:text-primary'}`}>
                My Recipes
              </a>
            </Link>
            <Button 
              onClick={() => {
                onOpen();
                setMobileMenuOpen(false);
              }}
              className="mt-1 w-full flex items-center justify-center px-4 py-2 text-base"
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
              Add Recipe
            </Button>
          </div>
        </div>
      </nav>

      {/* Add Recipe Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <div className="py-2">
            <h3 className="text-lg font-medium text-text-primary font-heading">Add New Recipe</h3>
            <RecipeForm onSuccess={onClose} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
