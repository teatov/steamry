import type { RequestHandler } from '@sveltejs/kit';
import * as sitemap from 'super-sitemap';
import { env } from '$env/dynamic/private';

export const prerender = true;

export const GET: RequestHandler = async () => {
  return await sitemap.response({
    origin: env.ORIGIN,
    excludeRoutePatterns: ['^/play*', '^/replay*'],
  });
};
