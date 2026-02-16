import React, { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { assets } from "../assets/assets";
import { recipeApi, prepareRecipeData } from "../api/recipeApi";

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

const getRecipeImage = (recipe) => {
  if (recipe.image?.url) return recipe.image.url;
  if (recipe.image && typeof recipe.image === "string")
    return getImageFromAssets(recipe.image);
  return assets.top2;
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-[#BF1A1A]" />
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="text-sm font-bold text-red-900 mb-1">Error</h3>
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

function RecipeFormModal({ isOpen, onClose, editRecipe, onSave, products }) {
  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(
    editRecipe || {
      title: "",
      slug: "",
      productId: "",
      category: "",
      image: null,
      imagePreview: null,
      prepTime: "",
      cookTime: "",
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

  useEffect(() => {
    if (editRecipe) {
      setFormData({
        ...editRecipe,
        productId:
          editRecipe.product?._id || editRecipe.product || editRecipe.productId,
        imagePreview: getRecipeImage(editRecipe),
      });
      setIngredients(editRecipe.ingredients || [""]);
      setDirections(editRecipe.directions || [""]);
      setTips(editRecipe.tips || []);
      setTags(editRecipe.tags || []);
      setNutrition(
        editRecipe.nutrition || {
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          fiber: "",
        },
      );
    }
  }, [editRecipe]);

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const handleImageSelect = (imageName) =>
    setFormData({
      ...formData,
      image: imageName,
      imagePreview: getImageFromAssets(imageName),
    });
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, image: file, imagePreview: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const updateIngredient = (index, value) =>
    setIngredients(ingredients.map((ing, i) => (i === index ? value : ing)));
  const removeIngredient = (index) => {
    if (ingredients.length > 1)
      setIngredients(ingredients.filter((_, i) => i !== index));
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

  const addDirection = () => setDirections([...directions, ""]);
  const updateDirection = (index, value) =>
    setDirections(directions.map((dir, i) => (i === index ? value : dir)));
  const removeDirection = (index) => {
    if (directions.length > 1)
      setDirections(directions.filter((_, i) => i !== index));
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

  const addTip = () => setTips([...tips, ""]);
  const updateTip = (index, value) =>
    setTips(tips.map((tip, i) => (i === index ? value : tip)));
  const removeTip = (index) => setTips(tips.filter((_, i) => i !== index));

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };
  const removeTag = (tagToRemove) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));
  const calculateTotalTime = () =>
    `${(parseInt(formData.prepTime) || 0) + (parseInt(formData.cookTime) || 0)} min`;

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Please enter a recipe title");
      setCurrentTab("basic");
      return false;
    }
    if (!formData.productId) {
      setError("Please select a product");
      setCurrentTab("basic");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      setCurrentTab("basic");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Please enter a description");
      setCurrentTab("basic");
      return false;
    }
    if (!formData.prepTime || !formData.cookTime) {
      setError("Please enter prep time and cook time");
      setCurrentTab("basic");
      return false;
    }
    if (!formData.servings) {
      setError("Please enter number of servings");
      setCurrentTab("basic");
      return false;
    }
    if (!formData.image && !formData.imagePreview) {
      setError("Please select or upload an image");
      setCurrentTab("basic");
      return false;
    }
    if (ingredients.filter((ing) => ing.trim()).length === 0) {
      setError("Please add at least one ingredient");
      setCurrentTab("ingredients");
      return false;
    }
    if (directions.filter((dir) => dir.trim()).length === 0) {
      setError("Please add at least one cooking direction");
      setCurrentTab("directions");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const recipeData = prepareRecipeData(
        formData,
        ingredients,
        directions,
        tips,
        tags,
        nutrition,
      );
      const imageFile = formData.image instanceof File ? formData.image : null;
      const result = editRecipe
        ? await recipeApi.updateRecipe(editRecipe._id, recipeData, imageFile)
        : await recipeApi.createRecipe(recipeData, imageFile);
      onSave(result.data);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col my-8">
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
            disabled={isSubmitting}
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          </div>
        )}

        <div className="flex border-b border-gray-200 px-6 overflow-x-auto">
          {["basic", "ingredients", "directions", "nutrition"].map(
            (tab, idx) => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all ${
                  currentTab === tab
                    ? "border-b-2 border-[#BF1A1A] text-[#BF1A1A]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {
                  [
                    "Basic Info",
                    "Ingredients",
                    "Directions",
                    "Nutrition & Tips",
                  ][idx]
                }
              </button>
            ),
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentTab === "basic" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                  placeholder="e.g., Fluffy Kent Boringer Pancakes with Fresh Berries"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                />
                {formData.title && (
                  <p className="text-xs text-gray-500 mt-1">
                    Slug: {formData.slug}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product *
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                  />
                </div>
              </div>

              {formData.prepTime && formData.cookTime && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-bold">
                    ✓ Total Time: {calculateTotalTime()}
                  </p>
                </div>
              )}

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                  />
                </div>
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Recipe Image *
                </label>
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
            </div>
          )}

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
            </div>
          )}

          {currentTab === "nutrition" && (
            <div className="space-y-8">
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
                  {Object.entries(nutrition).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          setNutrition({ ...nutrition, [key]: e.target.value })
                        }
                        placeholder={key === "calories" ? "320" : "8g"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BF1A1A]"
                      />
                    </div>
                  ))}
                </div>
              </div>

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

              <div>
                <h3 className="text-xl font-black text-gray-900 mb-4">Tags</h3>
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

        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF1A1A] to-[#8B1414] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {editRecipe ? "Update Recipe" : "Save Recipe"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onEdit, onDelete, onToggleFeatured }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
      <div className="relative mb-4">
        <img
          src={getRecipeImage(recipe)}
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
            <span>
              {recipe.totalTime || `${recipe.prepTime + recipe.cookTime} min`}
            </span>
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
        <button
          onClick={() => onToggleFeatured(recipe._id)}
          className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
          title="Toggle Featured"
        >
          <Star
            className={`h-4 w-4 ${recipe.featured ? "fill-yellow-700" : ""}`}
          />
        </button>
        <button
          onClick={() => onDelete(recipe._id)}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function DashboardRecipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    featuredRecipes: 0,
    totalViews: 0,
  });

  const categories = [
    "All Recipes",
    "Breakfast",
    "Soups",
    "Desserts",
    "Snacks",
    "Main Course",
    "Appetizers",
    "Beverages",
  ];

  useEffect(() => {
    fetchRecipes();
    fetchProducts();
  }, []);

  const fetchRecipes = async () => {
    try {
      console.log("🍳 DashboardRecipes: Starting to fetch recipes...");
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log(
        "🔑 Token in DashboardRecipes:",
        token ? "EXISTS" : "MISSING",
      );

      const response = await recipeApi.getAllRecipes();
      console.log("✅ Recipes received:", response);

      setRecipes(response.data);
      const featured = response.data.filter((r) => r.featured).length;
      const views = response.data.reduce((sum, r) => sum + (r.views || 0), 0);
      setStats({
        totalRecipes: response.total || response.data.length,
        featuredRecipes: featured,
        totalViews: views,
      });
    } catch (err) {
      console.error("❌ Error in fetchRecipes:", err);
      setError(err.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log("📦 Fetching products...");
      const token = localStorage.getItem("token");
      console.log("🔑 Token for products:", token ? "EXISTS" : "MISSING");

      const response = await fetch(
        "http://localhost:3000/smartglobal/products",
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );
      console.log("📥 Products response status:", response.status);

      const data = await response.json();
      console.log("📦 Products data:", data);

      if (data.success) setProducts(data.data || data.products || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  };
  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleDeleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await recipeApi.deleteRecipe(id);
      setRecipes(recipes.filter((r) => r._id !== id));
      setStats((prev) => ({ ...prev, totalRecipes: prev.totalRecipes - 1 }));
    } catch (err) {
      alert("Failed to delete recipe: " + err.message);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await recipeApi.toggleFeatured(id);
      setRecipes(
        recipes.map((r) =>
          r._id === id ? { ...r, featured: !r.featured } : r,
        ),
      );
      const recipe = recipes.find((r) => r._id === id);
      if (recipe) {
        setStats((prev) => ({
          ...prev,
          featuredRecipes: recipe.featured
            ? prev.featuredRecipes - 1
            : prev.featuredRecipes + 1,
        }));
      }
    } catch (err) {
      alert("Failed to update featured status: " + err.message);
    }
  };

  const handleSaveRecipe = (savedRecipe) => {
    if (editingRecipe) {
      setRecipes(
        recipes.map((r) => (r._id === savedRecipe._id ? savedRecipe : r)),
      );
    } else {
      setRecipes([savedRecipe, ...recipes]);
      setStats((prev) => ({
        ...prev,
        totalRecipes: prev.totalRecipes + 1,
        featuredRecipes: savedRecipe.featured
          ? prev.featuredRecipes + 1
          : prev.featuredRecipes,
      }));
    }
  };

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

  return (
    <div className="space-y-6">
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

      {error && <ErrorMessage message={error} onRetry={fetchRecipes} />}

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: ChefHat,
            label: "Total Recipes",
            value: stats.totalRecipes,
            bg: "bg-[#BF1A1A]",
          },
          {
            icon: Star,
            label: "Featured",
            value: stats.featuredRecipes,
            bg: "bg-[#FFD41D]",
            iconColor: "text-[#7B4019] fill-[#7B4019]",
          },
          {
            icon: TrendingUp,
            label: "Total Views",
            value: stats.totalViews.toLocaleString(),
            bg: "bg-green-600",
          },
        ].map(({ icon: Icon, label, value, bg, iconColor }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center`}
              >
                <Icon className={`h-6 w-6 ${iconColor || "text-white"}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">{label}</p>
                <p
                  className="text-2xl font-black text-gray-900"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <LoadingSpinner />}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      )}

      {!loading && filteredRecipes.length === 0 && (
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
          {!searchQuery && !error && (
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

      <RecipeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecipe(null);
        }}
        editRecipe={editingRecipe}
        onSave={handleSaveRecipe}
        products={products}
      />
    </div>
  );
}
