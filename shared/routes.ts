import { z } from 'zod';

// This is a 100% client-side app, so we have no active backend routes.
// We just export an empty API manifest to satisfy the frontend framework.
export const api = {
  health: {
    method: 'GET' as const,
    path: '/api/health' as const,
    responses: {
      200: z.object({ status: z.string() })
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
