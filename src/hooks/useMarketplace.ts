import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createListing,
  createReport,
  deleteListing,
  fetchComments,
  fetchListingById,
  fetchListings,
  fetchMyListings,
  updateListing,
} from '../lib/repository';
import type { AuthUser, ListingFilters, ListingPayload, ReportPayload } from '../lib/types';

export function useListings(filters: ListingFilters) {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: () => fetchListings(filters),
  });
}

export function useListing(listingId?: string) {
  return useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => fetchListingById(listingId ?? ''),
    enabled: Boolean(listingId),
  });
}

export function useComments(listingId?: string) {
  return useQuery({
    queryKey: ['comments', listingId],
    queryFn: () => fetchComments(listingId ?? ''),
    enabled: Boolean(listingId),
  });
}

export function useMyListings(userId?: string) {
  return useQuery({
    queryKey: ['my-listings', userId],
    queryFn: () => fetchMyListings(userId ?? ''),
    enabled: Boolean(userId),
  });
}

export function useCreateListing(user: AuthUser | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ListingPayload) => {
      if (!user) {
        throw new Error('请先登录后再发布。');
      }

      return createListing(payload, user);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export function useUpdateListing(user: AuthUser | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { listingId: string; payload: ListingPayload }) => {
      if (!user) {
        throw new Error('请先登录后再编辑。');
      }

      return updateListing(input.listingId, input.payload, user.id);
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      void queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId] });
    },
  });
}

export function useDeleteListing(user: AuthUser | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      if (!user) {
        throw new Error('请先登录后再删除。');
      }

      return deleteListing(listingId, user.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReportPayload) => createReport(payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['listing', variables.listing_id] });
    },
  });
}
