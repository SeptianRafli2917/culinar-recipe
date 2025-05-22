import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { RecipeForm as RecipeFormType, recipeFormSchema, RECIPE_CATEGORIES, Recipe } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Upload, Loader2 } from "lucide-react";

interface RecipeFormProps {
  recipe?: Recipe;
  onSuccess?: () => void;
}

export function RecipeForm({ recipe, onSuccess }: RecipeFormProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(
    recipe?.imageUrl || null
  );

  // Initialize form with existing recipe data or defaults
  const form = useForm<RecipeFormType>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe
      ? {
          ...recipe,
          image: undefined,
        }
      : {
          title: "",
          description: "",
          category: "dinner",
          cookTimeMinutes: 30,
          ingredients: [""],
          steps: [""],
          notes: "",
          image: undefined,
          createdAt: new Date().toISOString(),
        },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/recipes", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create recipe");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      toast({
        title: "Recipe created",
        description: "Your recipe has been successfully created.",
      });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/recipes/${data.id}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create recipe: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update recipe");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes", data.id.toString()] });
      toast({
        title: "Recipe updated",
        description: "Your recipe has been successfully updated.",
      });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/recipes/${data.id}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update recipe: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  async function onSubmit(values: RecipeFormType) {
    const formData = new FormData();
    
    // Convert recipe data to JSON and append to form
    const recipeData = { ...values };
    delete recipeData.image;
    
    formData.append("recipe", JSON.stringify(recipeData));
    
    // Append image if provided
    if (values.image) {
      formData.append("image", values.image);
    }
    
    try {
      if (recipe?.id) {
        await updateMutation.mutateAsync({ id: recipe.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("image", undefined);
      setImagePreview(recipe?.imageUrl || null);
    }
  };

  // Handlers for dynamic fields (ingredients and steps)
  const addIngredient = () => {
    const currentIngredients = form.getValues("ingredients");
    form.setValue("ingredients", [...currentIngredients, ""]);
  };

  const removeIngredient = (index: number) => {
    const currentIngredients = form.getValues("ingredients");
    if (currentIngredients.length > 1) {
      form.setValue(
        "ingredients",
        currentIngredients.filter((_, i) => i !== index)
      );
    }
  };

  const addStep = () => {
    const currentSteps = form.getValues("steps");
    form.setValue("steps", [...currentSteps, ""]);
  };

  const removeStep = (index: number) => {
    const currentSteps = form.getValues("steps");
    if (currentSteps.length > 1) {
      form.setValue(
        "steps",
        currentSteps.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        {/* Recipe Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipe Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Homemade Pasta with Fresh Herbs" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recipe Category and Time */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  disabled={isSubmitting}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RECIPE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cookTimeMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preparation Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 30"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Recipe Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Briefly describe your recipe"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recipe Ingredients */}
        <div>
          <FormLabel>Ingredients</FormLabel>
          {form.watch("ingredients").map((_, index) => (
            <div key={`ingredient-${index}`} className="mt-2 flex">
              <FormField
                control={form.control}
                name={`ingredients.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder={`e.g. 2 cups flour`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="ml-2 h-10 w-10"
                onClick={() => removeIngredient(index)}
                disabled={form.watch("ingredients").length <= 1 || isSubmitting}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 text-primary"
            onClick={addIngredient}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Ingredient
          </Button>
        </div>

        {/* Recipe Steps */}
        <div>
          <FormLabel>Preparation Steps</FormLabel>
          {form.watch("steps").map((_, index) => (
            <div key={`step-${index}`} className="mt-2 flex">
              <FormField
                control={form.control}
                name={`steps.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder={`e.g. Mix the flour and eggs in a large bowl`}
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="ml-2 h-10 w-10 self-start"
                onClick={() => removeStep(index)}
                disabled={form.watch("steps").length <= 1 || isSubmitting}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 text-primary"
            onClick={addStep}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Step
          </Button>
        </div>

        {/* Recipe Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or tips for this recipe"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recipe Image Upload */}
        <div>
          <FormLabel>Recipe Image</FormLabel>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="mx-auto h-32 w-auto object-cover rounded"
                  />
                </div>
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="recipe-image"
                  className="relative cursor-pointer bg-white dark:bg-dark rounded-md font-medium text-primary hover:text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                >
                  <span>Upload a file</span>
                  <input
                    id="recipe-image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess || (() => navigate("/"))}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {recipe ? "Update Recipe" : "Save Recipe"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
