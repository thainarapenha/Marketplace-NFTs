import { QueryClient } from "@tanstack/react-query";

export const PRIVATE_QUERY_META = { scope: "private" } as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

/**
 * Remove only queries explicitly marked as user-private.
 * Public catalog queries intentionally remain cached across auth changes.
 */
export const clearPrivateQueryCache = (client: QueryClient) => {
  client.removeQueries({
    predicate: (query) => query.meta?.scope === PRIVATE_QUERY_META.scope,
  });
};
