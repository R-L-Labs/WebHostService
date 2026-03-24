import { create } from 'zustand';

export const useInquiryStore = create((set) => ({
  inquiries: [],
  newInquiriesCount: 0,
  totalCount: 0,
  isLoading: false,
  error: null,
  filters: {
    status: 'ALL',
    page: 1,
    limit: 10,
  },

  setInquiries: (inquiries) => set({ inquiries }),

  setNewInquiriesCount: (count) => set({ newInquiriesCount: count }),

  setTotalCount: (count) => set({ totalCount: count }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),

  resetFilters: () => set({
    filters: {
      status: 'ALL',
      page: 1,
      limit: 10,
    },
  }),

  updateInquiry: (updatedInquiry) => set((state) => ({
    inquiries: state.inquiries.map((inquiry) =>
      inquiry.id === updatedInquiry.id ? updatedInquiry : inquiry
    ),
  })),

  removeInquiry: (inquiryId) => set((state) => ({
    inquiries: state.inquiries.filter((inquiry) => inquiry.id !== inquiryId),
    totalCount: state.totalCount - 1,
  })),
}));
