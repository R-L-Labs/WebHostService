import { create } from 'zustand';

export const useClientStore = create((set) => ({
  clients: [],
  currentClient: null,
  totalCount: 0,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: 'ALL',
    page: 1,
    limit: 10,
  },

  setClients: (clients) => set({ clients }),

  setCurrentClient: (client) => set({ currentClient: client }),

  setTotalCount: (count) => set({ totalCount: count }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),

  resetFilters: () => set({
    filters: {
      search: '',
      status: 'ALL',
      page: 1,
      limit: 10,
    },
  }),

  addClient: (client) => set((state) => ({
    clients: [client, ...state.clients],
    totalCount: state.totalCount + 1,
  })),

  updateClient: (updatedClient) => set((state) => ({
    clients: state.clients.map((client) =>
      client.id === updatedClient.id ? updatedClient : client
    ),
    currentClient: state.currentClient?.id === updatedClient.id ? updatedClient : state.currentClient,
  })),

  removeClient: (clientId) => set((state) => ({
    clients: state.clients.filter((client) => client.id !== clientId),
    totalCount: state.totalCount - 1,
    currentClient: state.currentClient?.id === clientId ? null : state.currentClient,
  })),
}));
