import { defineStore } from "pinia";
import requestService from "../services/api/requestService";

export const useFiltersStore = defineStore("filters", {
  state: () => ({
    categories: [],
    currencies: [],
    selectedCategory: {},
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

    // Attribute filters
    selectedAttributes: {}, // { [attributeId]: valueId }
    selectedCheckboxes: {}, // { [attributeId]: [valueIds] }
    selectedCurrency: null,

    // Ads results (fetched from API)
    ads: [],
  }),

  getters: {
    getCategories: (state) => state.categories,
    getSelectedCategory: (state) => state?.selectedCategory,
    getSelectedCurrency: (state) => state?.selectedCurrency,
    getCurrencies: (state) => state?.currencies,
  },

  actions: {
    // 🔹 Fetch filter categories
    async fetchCategories() {
      if (this.categories?.length > 0) return;
      try {
        const res = await requestService.getAll("/categories/filter-page");
        this.categories = res?.data;
        // this.selectedCategory = res?.data?.[0] || {};
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

    setSelectedCategoryById(categoryId) {
      if (!categoryId) {
        this.selectedCategory = {};
        return;
      }

      const categoryIdNum = Number(categoryId);
      const foundCategory = this.categories.find(
        (cat) => cat.id === categoryIdNum
      );

      if (foundCategory) {
        // Use the existing action to apply full object and reset sub-filters
        this.setSelectedCategory(foundCategory);
      } else {
        console.warn(`Category ID ${categoryId} not found in store.`);
        // Optionally, you might clear filters here if the ID is invalid
      }
    },

    // 🔹 Category select
    // setSelectedCategory(category) {
    //   this.selectedCategory = category;
    //   this.selectedAttributes = {};
    //   this.selectedCheckboxes = {};
    //   this.minPrice = null;
    //   this.maxPrice = null;
    //   this.selectedCategory = null;
    // },

    setSelectedCategory(category) {
      this.selectedCategory = category;
      this.selectedAttributes = {};
      this.selectedCheckboxes = {};
      this.minPrice = null;
      this.maxPrice = null;
      this.selectedCurrency = null; // Corrected: was accidentally resetting selectedCategory
    },

    // 🔹 Attribute filters (radio style)
    toggleAttributeValue(attributeId, valueId) {
      if (this.selectedAttributes[attributeId] === valueId) {
        delete this.selectedAttributes[attributeId];
      } else {
        this.selectedAttributes[attributeId] = valueId;
      }
    },
    toggleCurrencyValue(valueId) {
      this.selectedCurrency = valueId;
    },
    isAttributeActive(attributeId, valueId) {
      return this.selectedAttributes[attributeId] === valueId;
    },
    isCurrencyActive(valueId) {
      return this.selectedCurrency === valueId;
    },

    // 🔹 Checkbox filters
    toggleCheckboxValue(attributeId, valueId) {
      if (!this.selectedCheckboxes[attributeId]) {
        this.selectedCheckboxes[attributeId] = [];
      }
      const values = this.selectedCheckboxes[attributeId];
      const index = values.indexOf(valueId);
      if (index !== -1) {
        values.splice(index, 1);
      } else {
        values.push(valueId);
      }
    },
    isCheckboxActive(attributeId, valueId) {
      return this.selectedCheckboxes[attributeId]?.includes(valueId);
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
      this.minPrice = null;
      this.maxPrice = null;
      this.selectedCurrency = null;
      this.sortBy = "";
      this.selectedAttributes = {};
      this.selectedCheckboxes = {};
      this.page = 1; // reset to first page
    },

    // 🔹 Fetch ads with filters + pagination
    async fetchAds(searchQuery = "") {
      this.loading = true;

      try {
        const payload = {
          category_id: this.selectedCategory?.id,
          min_price: this.minPrice,
          max_price: this.maxPrice,
          currency_id: this.selectedCurrency,
          sort_by: this.sortBy,
          attributes: Object.entries(this.selectedAttributes).map(
            ([attributeId, valueId]) => ({
              attributeId: Number(attributeId),
              attributeValueId: Number(valueId),
            })
          ),
          checkboxes: Object.entries(this.selectedCheckboxes).map(
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
