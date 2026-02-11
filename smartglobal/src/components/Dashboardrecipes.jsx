import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChefHat,
  X,
  Upload,
  Clock,
  User,
  Star,
  Save,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Utensils,
  Lightbulb,
} from "lucide-react";
import { assets } from "../assets/assets";
import { recipesData } from "../lib/recipesData";

/**
 * DashboardRecipes Component
 * Complete recipe management interface for Kent Boringer Dashboard
 * Features: Recipe CRUD, Rich Editor for Ingredients/Directions, Image Upload, Backend-Ready
 */

// Map image names to actual assets
const getImageFromAssets = (imageName) => {
  const imageMap = {
    top2: assets.top2,
    kent: assets.kent,
    topping: assets.topping,
    spuds: assets.spuds,
    crepes: assets.crepes,
    ice: assets.ice,
  };
  return imageMap[imageName] || assets.top2;
};

// ============================================================================
// RECIPE FORM MODAL COMPONENT
// ============================================================================
function RecipeFormModal({ isOpen, onClose, editRecipe, onSave }) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [formData, setFormData] = useState(
    editRecipe || {
      title: "",
      slug: "",
      category: "",
      image: null,
      imagePreview: null,
      prepTime: "",
      cookTime: "",
      totalTime: "",
      servings: 4,
      difficulty: "Easy",
      rating: 0,
      reviews: 0,
      description: "",
      featured: false,
    },
  );

  const [ingredients, setIngredients] = useState(
    editRecipe?.ingredients || [""],
  );
  const [directions, setDirections] = useState(editRecipe?.directions || [""]);
  const [tips, setTips] = useState(editRecipe?.tips || []);
  const [tags, setTags] = useState(editRecipe?.tags || []);
  const [currentTag, setCurrentTag] = useState("");

  const [nutrition, setNutrition] = useState(
    editRecipe?.nutrition || {
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      fiber: "",
    },
  );

  const categories = [
    "Breakfast",
    "Soups",
    "Desserts",
    "Snacks",
    "Main Course",
    "Appetizers",
    "Beverages",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  const imageOptions = [
    { name: "top2", label: "Pancake Mix" },
    { name: "kent", label: "Kent Soup" },
    { name: "topping", label: "Toppings" },
    { name: "spuds", label: "SPUDS Chips" },
    { name: "crepes", label: "Crepes" },
    { name: "ice", label: "Ice Cream" },
  ];

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Handle image selection
  const handleImageSelect = (imageName) => {
    setFormData({
      ...formData,
      image: imageName,
      imagePreview: getImageFromAssets(imageName),
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Ingredients management
  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const updateIngredient = (index, value) => {
    setIngredients(ingredients.map((ing, i) => (i === index ? value : ing)));
  };

  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const moveIngredient = (index, direction) => {
    const newIngredients = [...ingredients];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newIngredients.length) {
      [newIngredients[index], newIngredients[targetIndex]] = [
        newIngredients[targetIndex],
        newIngredients[index],
      ];
      setIngredients(newIngredients);
    }
  };

  // Directions management
  const addDirection = () => {
    setDirections([...directions, ""]);
  };

  const updateDirection = (index, value) => {
    setDirections(directions.map((dir, i) => (i === index ? value : dir)));
  };

  const removeDirection = (index) => {
    if (directions.length > 1) {
      setDirections(directions.filter((_, i) => i !== index));
    }
  };

  const moveDirection = (index, direction) => {
    const newDirections = [...directions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newDirections.length) {
      [newDirections[index], newDirections[targetIndex]] = [
        newDirections[targetIndex],
        newDirections[index],
      ];
      setDirections(newDirections);
    }
  };

  // Tips management
  const addTip = () => {
    setTips([...tips, ""]);
  };

  const updateTip = (index, value) => {
    setTips(tips.map((tip, i) => (i === index ? value : tip)));
  };

  const removeTip = (index) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  // Tags management
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Auto-calculate total time
  const calculateTotalTime = () => {
    const prep = parseInt(formData.prepTime) || 0;
    const cook = parseInt(formData.cookTime) || 0;
    return `${prep + cook} min`;
  };

  // Form submission
  const handleSubmit = () => {
    const recipeData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      totalTime: calculateTotalTime(),
      ingredients: ingredients.filter((ing) => ing.trim() !== ""),
      directions: directions.filter((dir) => dir.trim() !== ""),
      tips: tips.filter((tip) => tip.trim() !== ""),
      tags,
      nutrition,
      author: {
        name: "Smart Global Team",
        avatar: "SG",
        bio: "Professional chefs and food developers",
      },
      date: "Just now",
      views: 0,
      lastUpdated: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // TODO: Send to backend API
    onSave(recipeData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2
              className="text-3xl font-black text-gray-900"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {editRecipe ? "Edit Recipe" : "Add New Recipe"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the recipe details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
          <button
            onClick={() => setCurrentTab("basic")}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all ${
              currentTab === "basic"
                ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setCurrentTab("ingredients")}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all ${
              currentTab === "ingredients"
                ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setCurrentTab("directions")}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all ${
              currentTab === "directions"
                ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Directions
          </button>
          <button
            onClick={() => setCurrentTab("nutrition")}
            className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all ${
              currentTab === "nutrition"
                ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Nutrition & Tips
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* BASIC INFO TAB */}
          {currentTab === "basic" && (
            <div className="space-y-6">
              {/* Recipe Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  placeholder="e.g., Fluffy Kent Boringer Pancakes with Fresh Berries"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                />
                {formData.title && (
                  <p className="text-xs text-gray-500 mt-1">
                    Slug: {formData.slug}
                  </p>
                )}
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      setFormData({ ...formData, difficulty: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time & Servings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Prep Time (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({ ...formData, prepTime: e.target.value })
                    }
                    placeholder="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Cook Time (minutes) *
                  </label>
                  <input
                    type="number"
                    value={formData.cookTime}
                    onChange={(e) =>
                      setFormData({ ...formData, cookTime: e.target.value })
                    }
                    placeholder="20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Servings *
                  </label>
                  <input
                    type="number"
                    value={formData.servings}
                    onChange={(e) =>
                      setFormData({ ...formData, servings: e.target.value })
                    }
                    placeholder="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Total Time Display */}
              {formData.prepTime && formData.cookTime && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-bold">
                    ✓ Total Time: {calculateTotalTime()}
                  </p>
                </div>
              )}

              {/* Rating & Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: Math.min(5, Math.max(0, e.target.value)),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Number of Reviews
                  </label>
                  <input
                    type="number"
                    value={formData.reviews}
                    onChange={(e) =>
                      setFormData({ ...formData, reviews: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Featured Recipe */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-5 h-5 text-[#BF1A1A] border-gray-300 rounded focus:ring-[#BF1A1A]"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-bold text-gray-700"
                >
                  Mark as Featured Recipe
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Recipe Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="4"
                  placeholder="Write an engaging description of your recipe..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent resize-none"
                />
              </div>

              {/* Image Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Recipe Image *
                </label>

                {/* Product Image Selection */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-3">
                    Select from product images:
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {imageOptions.map((img) => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => handleImageSelect(img.name)}
                        className={`relative border-2 rounded-lg p-2 transition-all ${
                          formData.image === img.name
                            ? "border-[#BF1A1A] ring-2 ring-[#BF1A1A] ring-opacity-50"
                            : "border-gray-200 hover:border-[#BF1A1A]"
                        }`}
                      >
                        <img
                          src={getImageFromAssets(img.name)}
                          alt={img.label}
                          className="w-full h-16 object-contain"
                        />
                        <p className="text-xs text-center mt-1 font-semibold">
                          {img.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center text-sm text-gray-500 mb-3">OR</div>

                {/* Custom Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#BF1A1A] transition-colors">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            image: null,
                            imagePreview: null,
                          })
                        }
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mb-3" />
                      <span className="text-sm font-bold text-gray-600 mb-1">
                        Upload custom image
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* INGREDIENTS TAB */}
          {currentTab === "ingredients" && (
            <div className="space-y-6">
              <div className="bg-[#FFF9E6] rounded-xl p-4 border border-[#FFD41D]">
                <p className="text-sm text-[#7B4019] font-semibold">
                  💡 List all ingredients needed for this recipe. Be specific
                  with measurements!
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Ingredients List
                </h3>
                <button
                  onClick={addIngredient}
                  className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Ingredient
                </button>
              </div>

              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-4 group hover:border-[#BF1A1A] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#FFD41D] rounded-full flex items-center justify-center text-[#7B4019] font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) =>
                          updateIngredient(index, e.target.value)
                        }
                        placeholder="e.g., 2 cups Kent Boringer Pancake Mix"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveIngredient(index, "up")}
                          disabled={index === 0}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveIngredient(index, "down")}
                          disabled={index === ingredients.length - 1}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        {ingredients.length > 1 && (
                          <button
                            onClick={() => removeIngredient(index)}
                            className="p-2 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {ingredients.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 font-semibold">
                    No ingredients added yet. Click "Add Ingredient" to start!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* DIRECTIONS TAB */}
          {currentTab === "directions" && (
            <div className="space-y-6">
              <div className="bg-[#FFF9E6] rounded-xl p-4 border border-[#FFD41D]">
                <p className="text-sm text-[#7B4019] font-semibold">
                  👨‍🍳 Write clear, step-by-step instructions. Each step should be
                  a complete action.
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Cooking Directions
                </h3>
                <button
                  onClick={addDirection}
                  className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Step
                </button>
              </div>

              <div className="space-y-4">
                {directions.map((direction, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-4 group hover:border-[#BF1A1A] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-[#BF1A1A] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-3">
                        {index + 1}
                      </span>
                      <textarea
                        value={direction}
                        onChange={(e) => updateDirection(index, e.target.value)}
                        rows="3"
                        placeholder="Describe this cooking step in detail..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] resize-none"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => moveDirection(index, "up")}
                          disabled={index === 0}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveDirection(index, "down")}
                          disabled={index === directions.length - 1}
                          className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        {directions.length > 1 && (
                          <button
                            onClick={() => removeDirection(index)}
                            className="p-2 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {directions.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 font-semibold">
                    No directions added yet. Click "Add Step" to start!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* NUTRITION & TIPS TAB */}
          {currentTab === "nutrition" && (
            <div className="space-y-8">
              {/* Nutrition Facts */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Utensils className="text-white" size={20} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">
                    Nutrition Facts (per serving)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={nutrition.calories}
                      onChange={(e) =>
                        setNutrition({ ...nutrition, calories: e.target.value })
                      }
                      placeholder="320"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Protein
                    </label>
                    <input
                      type="text"
                      value={nutrition.protein}
                      onChange={(e) =>
                        setNutrition({ ...nutrition, protein: e.target.value })
                      }
                      placeholder="8g"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Carbohydrates
                    </label>
                    <input
                      type="text"
                      value={nutrition.carbs}
                      onChange={(e) =>
                        setNutrition({ ...nutrition, carbs: e.target.value })
                      }
                      placeholder="45g"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Fat
                    </label>
                    <input
                      type="text"
                      value={nutrition.fat}
                      onChange={(e) =>
                        setNutrition({ ...nutrition, fat: e.target.value })
                      }
                      placeholder="12g"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Fiber
                    </label>
                    <input
                      type="text"
                      value={nutrition.fiber}
                      onChange={(e) =>
                        setNutrition({ ...nutrition, fiber: e.target.value })
                      }
                      placeholder="2g"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                    />
                  </div>
                </div>
              </div>

              {/* Pro Tips */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFD41D] rounded-full flex items-center justify-center">
                      <Lightbulb className="text-[#7B4019]" size={20} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900">
                      Pro Tips
                    </h3>
                  </div>
                  <button
                    onClick={addTip}
                    className="flex items-center gap-2 px-4 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Tip
                  </button>
                </div>

                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-[#FFF9E6] border border-[#FFD41D] rounded-xl p-4"
                    >
                      <span className="text-2xl">💡</span>
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => updateTip(index, e.target.value)}
                        placeholder="Add a helpful cooking tip..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] bg-white"
                      />
                      <button
                        onClick={() => removeTip(index)}
                        className="p-2 hover:bg-[#FFD41D] rounded text-[#7B4019]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {tips.length === 0 && (
                    <p className="text-center text-gray-500 py-8 bg-gray-50 rounded-xl">
                      No tips added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-black text-gray-900">Tags</h3>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Type a tag and press Enter"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                  />
                  <button
                    onClick={addTag}
                    className="px-6 py-3 bg-[#BF1A1A] text-white rounded-xl font-bold hover:bg-[#8B1414] transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm font-semibold"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  {tags.length === 0 && (
                    <p className="text-sm text-gray-500">No tags added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Save className="h-4 w-4" />
              {editRecipe ? "Update Recipe" : "Save Recipe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// RECIPE CARD COMPONENT (Dashboard View)
// ============================================================================
function RecipeCard({ recipe, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="relative mb-4">
        <img
          src={getImageFromAssets(recipe.image)}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              recipe.difficulty === "Easy"
                ? "bg-green-100 text-green-700"
                : recipe.difficulty === "Medium"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-[#FFD41D] text-[#7B4019] px-3 py-1 rounded-full text-xs font-black">
            {recipe.category}
          </span>
        </div>
        {recipe.featured && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-[#BF1A1A] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="h-3 w-3 fill-white" />
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-[#BF1A1A]" />
            <span>{recipe.totalTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} className="text-[#BF1A1A]" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span>{recipe.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp size={12} />
          <span>{recipe.views} views</span>
          <span>•</span>
          <span>{recipe.reviews} reviews</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(recipe)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#BF1A1A] text-white rounded-lg hover:bg-[#8B1414] transition-colors"
        >
          <Edit2 className="h-4 w-4" />
          <span className="text-sm font-bold">Edit</span>
        </button>
        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(recipe.id)}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DASHBOARD RECIPES COMPONENT
// ============================================================================
export default function DashboardRecipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipes, setRecipes] = useState(recipesData);

  const categories = [
    "All Recipes",
    "Breakfast",
    "Soups",
    "Desserts",
    "Snacks",
    "Main Course",
  ];

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleDeleteRecipe = (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      setRecipes(recipes.filter((r) => r.id !== id));
      // TODO: Send delete request to backend
    }
  };

  const handleSaveRecipe = (recipeData) => {
    if (editingRecipe) {
      // Update existing recipe
      setRecipes(
        recipes.map((r) =>
          r.id === editingRecipe.id ? { ...recipeData, id: r.id } : r,
        ),
      );
      // TODO: Send update request to backend
    } else {
      // Add new recipe
      const newRecipe = {
        ...recipeData,
        id: Date.now(),
      };
      setRecipes([newRecipe, ...recipes]);
      // TODO: Send create request to backend
    }
  };

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "all-recipes" ||
      recipe.category === selectedCategory ||
      selectedCategory === recipe.category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const totalRecipes = recipes.length;
  const featuredRecipes = recipes.filter((r) => r.featured).length;
  const totalViews = recipes.reduce((sum, r) => sum + r.views, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Recipes
          </h1>
          <p className="text-gray-600 font-semibold">
            Manage your recipe collection
          </p>
        </div>
        <button
          onClick={handleAddRecipe}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          Add Recipe
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category.toLowerCase().replace(/ /g, "-"))
                }
                className={`px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.toLowerCase().replace(/ /g, "-")
                    ? "bg-[#BF1A1A] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#BF1A1A] flex items-center justify-center">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">
                Total Recipes
              </p>
              <p
                className="text-2xl font-black text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {totalRecipes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#FFD41D] flex items-center justify-center">
              <Star className="h-6 w-6 text-[#7B4019] fill-[#7B4019]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Featured</p>
              <p
                className="text-2xl font-black text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {featuredRecipes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Total Views</p>
              <p
                className="text-2xl font-black text-gray-900"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {totalViews.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onEdit={handleEditRecipe}
            onDelete={handleDeleteRecipe}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Get started by adding your first recipe"}
          </p>
          {!searchQuery && (
            <button
              onClick={handleAddRecipe}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#BF1A1A] text-white rounded-xl font-bold hover:bg-[#8B1414] transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Your First Recipe
            </button>
          )}
        </div>
      )}

      {/* Recipe Form Modal */}
      <RecipeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecipe(null);
        }}
        editRecipe={editingRecipe}
        onSave={handleSaveRecipe}
      />
    </div>
  );
}
