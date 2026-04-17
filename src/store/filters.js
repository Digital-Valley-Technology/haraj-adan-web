import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

// Debounce utility
let debounceTimer = null;
const debounce = (fn, delay = 300) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, delay);
};

export const useFiltersStore = defineStore("filters", {
  state: () => ({
    // Parent categories with children
    parentCategories: [],
    selectedParentCategory: null,
    selectedSubCategory: null,

    // Legacy - flat categories list (for filter-page endpoint)
    categories: [],
    selectedCategory: {},

    currencies: [],
    page: 1,
    limit: 10,
    total: 0,
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
    search: "",
    loading: false,

    // Filters
    minPrice: null,
    maxPrice: null,
    sortBy: "",

    // Attribute filters - ALL are now multi-select
    selectedAttributes: {}, // { [attributeId]: [valueIds] } - Now array-based for multi-select
    selectedCurrencies: [], // Array of currency IDs for multi-select

    // Ads results (fetched from API)
    ads: [],

    // Track if auto-fetch is enabled
    autoFetchEnabled: true,
  }),

  getters: {
    getCategories: (state) => state.categories,
    getParentCategories: (state) => state.parentCategories,
    getSelectedParentCategory: (state) => state.selectedParentCategory,
    getSubCategories: (state) => {
      if (!state.selectedParentCategory) return [];
      // API returns children as 'other_categories'
      return state.selectedParentCategory.other_categories || state.selectedParentCategory.children || [];
    },
    getSelectedSubCategory: (state) => state.selectedSubCategory,
    getSelectedCategory: (state) => state?.selectedCategory,
    getSelectedCurrencies: (state) => state?.selectedCurrencies,
    getCurrencies: (state) => state?.currencies,
    // The effective category for filtering (subcategory if selected, otherwise parent)
    getEffectiveCategory: (state) => {
      return state.selectedSubCategory || state.selectedParentCategory;
    },
  },

  actions: {
    // 🔹 Fetch parent categories with children
    async fetchParentCategories() {
      if (this.parentCategories?.length > 0) return;
      try {
        const res = await requestService.getAll("/categories/parents?includes=children");
        this.parentCategories = res?.data || [];
      } catch (error) {
        console.error("Error fetching parent categories:", error);
      }
    },

    // 🔹 Fetch filter categories (flat list with attributes)
    async fetchCategories() {
      if (this.categories?.length > 0) return;
      try {
        const res = await requestService.getAll("/categories/filter-page");
        this.categories = res?.data;
        if (
          !this.selectedCategory ||
          !Object.keys(this.selectedCategory).length
        ) {
          this.selectedCategory = {};
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },

    // 🔹 Select parent category
    setSelectedParentCategory(parentCategory) {
      this.selectedParentCategory = parentCategory;
      this.selectedSubCategory = null;
      this.selectedAttributes = {};
      this.minPrice = null;
      this.maxPrice = null;
      this.selectedCurrencies = [];

      // Also update the legacy selectedCategory to match
      // Find in flat categories list if available
      if (parentCategory) {
        const found = this.categories.find((c) => c.id === parentCategory.id);
        this.selectedCategory = found || parentCategory;
      } else {
        this.selectedCategory = {};
      }

      // Auto-fetch
      this.debouncedFetch();
    },

    // 🔹 Select subcategory
    setSelectedSubCategory(subCategory) {
      this.selectedSubCategory = subCategory;
      this.selectedAttributes = {};

      // Also update the legacy selectedCategory to match
      if (subCategory) {
        const found = this.categories.find((c) => c.id === subCategory.id);
        this.selectedCategory = found || subCategory;
      } else if (this.selectedParentCategory) {
        const found = this.categories.find((c) => c.id === this.selectedParentCategory.id);
        this.selectedCategory = found || this.selectedParentCategory;
      } else {
        this.selectedCategory = {};
      }

      // Auto-fetch
      this.debouncedFetch();
    },

    setSelectedCategoryById(categoryId) {
      if (!categoryId) {
        this.selectedCategory = {};
        this.selectedParentCategory = null;
        this.selectedSubCategory = null;
        return;
      }

      const categoryIdNum = Number(categoryId);

      // First try to find in flat categories
      const foundCategory = this.categories.find(
        (cat) => cat.id === categoryIdNum
      );

      if (foundCategory) {
        this.setSelectedCategory(foundCategory);
      }

      // Also try to set parent/sub categories
      for (const parent of this.parentCategories) {
        if (parent.id === categoryIdNum) {
          this.selectedParentCategory = parent;
          this.selectedSubCategory = null;
          return;
        }
        // API returns children as 'other_categories'
        const children = parent.other_categories || parent.children || [];
        const child = children.find((c) => c.id === categoryIdNum);
        if (child) {
          this.selectedParentCategory = parent;
          this.selectedSubCategory = child;
          return;
        }
      }
    },

    setSelectedCategory(category) {
      this.selectedCategory = category;
      this.selectedAttributes = {};
      this.minPrice = null;
      this.maxPrice = null;
      this.selectedCurrencies = [];
      // Auto-fetch with debounce
      this.debouncedFetch();
    },

    // 🔹 Attribute filters (multi-select)
    toggleAttributeValue(attributeId, valueId) {
      if (!this.selectedAttributes[attributeId]) {
        this.selectedAttributes[attributeId] = [];
      }
      const values = this.selectedAttributes[attributeId];
      const index = values.indexOf(valueId);
      if (index !== -1) {
        values.splice(index, 1);
        // Clean up empty arrays
        if (values.length === 0) {
          delete this.selectedAttributes[attributeId];
        }
      } else {
        values.push(valueId);
      }
      // Auto-fetch with debounce
      this.debouncedFetch();
    },
    isAttributeActive(attributeId, valueId) {
      return this.selectedAttributes[attributeId]?.includes(valueId) || false;
    },

    // 🔹 Currency filters (multi-select)
    toggleCurrencyValue(valueId) {
      const index = this.selectedCurrencies.indexOf(valueId);
      if (index !== -1) {
        this.selectedCurrencies.splice(index, 1);
      } else {
        this.selectedCurrencies.push(valueId);
      }
      // Auto-fetch with debounce
      this.debouncedFetch();
    },
    isCurrencyActive(valueId) {
      return this.selectedCurrencies.includes(valueId);
    },

    // 🔹 Debounced fetch for auto-apply
    debouncedFetch() {
      if (!this.autoFetchEnabled) return;
      this.page = 1; // Reset to first page when filters change
      debounce(() => {
        this.fetchAds(this.search);
      }, 300);
    },

    // 🔹 Pagination handlers
    setPage(page) {
      this.page = page;
    },
    setLimit(limit) {
      this.limit = limit;
    },

    // 🔹 Clear all filters
    clearFilters() {
      this.selectedParentCategory = null;
      this.selectedSubCategory = null;
      this.selectedCategory = {};
      this.minPrice = null;
      this.maxPrice = null;
      this.selectedCurrencies = [];
      this.sortBy = "";
      this.selectedAttributes = {};
      this.page = 1; // reset to first page
      // Auto-fetch
      this.fetchAds(this.search);
    },

    // 🔹 Fetch ads with filters + pagination
    async fetchAds(searchQuery = "") {
      this.loading = true;

      try {
        // Build category filter:
        // - If subcategory is selected, use single category_id
        // - If only parent is selected, send all subcategory IDs as category_ids
        // - Otherwise use legacy selectedCategory
        let categoryId = null;
        let categoryIds = null;

        if (this.selectedSubCategory?.id) {
          // Subcategory selected - filter by that specific subcategory
          categoryId = this.selectedSubCategory.id;
        } else if (this.selectedParentCategory) {
          // Only parent selected - get all subcategory IDs
          const children = this.selectedParentCategory.other_categories || this.selectedParentCategory.children || [];
          if (children.length > 0) {
            categoryIds = children.map((c) => c.id);
          } else {
            // Parent has no children, use parent ID
            categoryId = this.selectedParentCategory.id;
          }
        } else if (this.selectedCategory?.id) {
          // Legacy fallback
          categoryId = this.selectedCategory.id;
        }

        const payload = {
          category_id: categoryId,
          category_ids: categoryIds,
          min_price: this.minPrice,
          max_price: this.maxPrice,
          currency_ids: this.selectedCurrencies.length > 0 ? this.selectedCurrencies : null,
          sort_by: this.sortBy,
          // All attributes are now multi-select (sent as checkboxes)
          checkboxes: Object.entries(this.selectedAttributes).map(
            ([attributeId, valueIds]) => ({
              attributeId: Number(attributeId),
              attributeValueIds: valueIds.map(Number),
            })
          ),
          page: this.page,
          limit: this.limit,
          search: searchQuery || this.search,
        };

        const res = await requestService.create("/ads/filter", payload);

        this.ads = res?.data || [];
        this.total = res?.meta?.total || 0;
        this.meta = {
          total: res?.meta?.total || 0,
          page: res?.meta?.page || this.page,
          limit: res?.meta?.limit || this.limit,
          totalPages: res?.meta?.totalPages || 0,
        };
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrencies() {
      this.loading = true;

      try {
        const res = await requestService.getAll("/currencies");
        this.currencies = res?.data || [];
      } catch (error) {
        console.error("Error fetching currencies:", error);
      } finally {
        this.loading = false;
      }
    },

    async handleSearchChange(searchQuery) {
      this.fetchAds(searchQuery);
    },
  },
});
