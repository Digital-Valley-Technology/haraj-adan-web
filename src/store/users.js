import { defineStore } from "pinia";

export const useUsersStore = defineStore("users", {
  state: () => ({
    customers: [
      {
        id: 1,
        firstname: "عمر",
        lastname: "الخوري",
        username: "username",
        email: "omar@gmail.com",
        phone: "966573839483",
      },
      {
        id: 2,
        firstname: "عياش",
        lastname: "أحمد",
        username: "username",
        email: "ayash@gmail.com",
        phone: "966573827689",
      },
      {
        id: 3,
        firstname: "هاشم",
        lastname: "بن مبارك",
        username: "username",
        email: "hashim@gmail.com",
        phone: "966574469483",
      },
      {
        id: 4,
        firstname: "نايف",
        lastname: "الخضري",
        username: "username",
        email: "naif@gmail.com",
        phone: "966573569480",
      },
      {
        id: 5,
        firstname: "ناصر",
        lastname: "الحربي",
        username: "username",
        email: "nasir@gmail.com",
        phone: "966571254383",
      },
      {
        id: 6,
        firstname: "جمال",
        lastname: "السعدي",
        username: "username",
        email: "jamal@gmail.com",
        phone: "966571256948",
      },
      {
        id: 7,
        firstname: "صالح",
        lastname: "بن هاشم",
        username: "username",
        email: "salih@gmail.com",
        phone: "966543839488",
      },
      {
        id: 8,
        firstname: "سامر",
        lastname: "القرني",
        username: "username",
        email: "samir@gmail.com",
        phone: "966598365483",
      },
      {
        id: 9,
        firstname: "محمد",
        lastname: "القحطاني",
        username: "username",
        email: "mohamed@gmail.com",
        phone: "966573839465",
      },
      {
        id: 10,
        firstname: "أحمد",
        lastname: "الجهني",
        username: "username",
        email: "ahmed@gmail.com",
        phone: "966573756483",
      },
    ],
    page: 0,
    limit: 10,
    total: 10,
  }),
  getters: {
    getCustomers: (state) => state.customers,
    getPage: (state) => state.page,
    getLimit: (state) => state.limit,
    getTotal: (state) => state.total,
  },
  actions: {
    async fetchCustomers() {
      // fetch the date and store the result in customers (this.customers = result)
    },
  },
});
