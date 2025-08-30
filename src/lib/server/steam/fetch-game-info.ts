import { ContentDescriptor } from '$lib';
import * as schema from '../db/schema';

const APP_DETAILS_URL = 'https://store.steampowered.com/api/appdetails';
const APP_REVIEWS_URL = 'https://store.steampowered.com/appreviews';

export default async function fetchGameInfo(appid: string): Promise<schema.NewGameInfoOnly | null> {
  const detailsUrl = new URL(APP_DETAILS_URL);
  detailsUrl.searchParams.set('appids', appid);

  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) {
    console.error(`App ${appid} details ${detailsResponse.status} ${detailsResponse.statusText}`);
    return null;
  }

  const detailsResult = (await detailsResponse.json()) as AppDetailsResponse;
  if (!detailsResult[appid] || !detailsResult[appid].success || !detailsResult[appid].data) {
    console.error(`App ${appid} details fetch failed`);
    return null;
  }

  const appDetails = detailsResult[appid].data;
  if (appDetails.type != 'game') {
    console.error(`App ${appid} is not a game`);
    return null;
  }

  if (
    appDetails.content_descriptors &&
    appDetails.content_descriptors.ids &&
    appDetails.content_descriptors.ids.includes(ContentDescriptor.FrequentNudityOrSexualContent)
  ) {
    console.error(`App ${appid} has FrequentNudityOrSexualContent`);
    return null;
  }

  if (!appDetails.release_date || appDetails.release_date.coming_soon) {
    console.error(`App ${appid} is not released`);
    return null;
  }

  if (!appDetails.short_description) {
    console.error(`App ${appid} has no description`);
    return null;
  }

  const reviewsUrl = new URL(`${APP_REVIEWS_URL}/${appid}`);
  reviewsUrl.searchParams.set('json', '1');
  reviewsUrl.searchParams.set('language', 'all');
  reviewsUrl.searchParams.set('purchase_type', 'all');
  reviewsUrl.searchParams.set('num_per_page', '0');

  const reviewsResponse = await fetch(reviewsUrl);
  if (!reviewsResponse.ok) {
    console.error(`App ${appid} details ${reviewsResponse.status} ${reviewsResponse.statusText}`);
    return null;
  }

  const reviewsResult = (await reviewsResponse.json()) as AppReviewsResponse;
  if (reviewsResult.success != 1 || !reviewsResult.query_summary) {
    console.error(`App ${appid} reviews fetch failed`);
    return null;
  }

  const reviewsSummary = reviewsResult.query_summary;
  if (
    (!reviewsSummary.total_negative && !reviewsSummary.total_positive) ||
    reviewsSummary.total_negative + reviewsSummary.total_positive === 0
  ) {
    console.error(`App ${appid} has zero reviews`);
    return null;
  }

  return {
    appid: appDetails.steam_appid,
    name: appDetails.name,
    reviewsPositive: reviewsSummary.total_positive,
    reviewsNegative: reviewsSummary.total_negative,
    description: appDetails.short_description,
    price:
      appDetails.is_free || !appDetails.price_overview
        ? null
        : appDetails.price_overview.initial_formatted ||
          appDetails.price_overview.final_formatted ||
          null,
    releaseDate: appDetails.release_date.date,
    headerImage: appDetails.header_image,
    developers: appDetails.developers ? appDetails.developers : [],
    publishers: appDetails.publishers ? appDetails.publishers : [],
    categories: appDetails.categories
      ? appDetails.categories.toSorted((a, b) => a.id - b.id).map((value) => value.description)
      : [],
    genres: appDetails.genres
      ? appDetails.genres.toSorted((a, b) => a.id - b.id).map((value) => value.description)
      : [],
    screenshots: appDetails.screenshots
      ? appDetails.screenshots.toSorted((a, b) => a.id - b.id).map((value) => value.path_full)
      : [],
    trailers: appDetails.movies
      ? appDetails.movies
          .toSorted((a, b) => a.id - b.id)
          .filter((value) => value.highlight && (value.webm || value.mp4))
          .map((value) => {
            const trailer: schema.NewGameInfoOnly['trailers'][number] = {
              thumbnail: value.thumbnail,
            };
            if (value.webm) {
              if (value.webm.max) {
                trailer.webm = value.webm.max;
              } else if (Object.keys(value.webm).length > 0) {
                trailer.webm = value.webm[Object.keys(value.webm)[0] as string];
              }
            }
            if (value.mp4) {
              if (value.mp4.max) {
                trailer.mp4 = value.mp4.max;
              } else if (Object.keys(value.mp4).length > 0) {
                trailer.mp4 = value.mp4[Object.keys(value.mp4)[0] as string];
              }
            }
            return trailer;
          })
      : [],
    contentDescriptors:
      appDetails.content_descriptors && appDetails.content_descriptors.ids
        ? appDetails.content_descriptors.ids
        : [],
  };
}

type AppDetailsResponse = Record<string, { success: boolean; data?: AppDetails }>;

type AppDetails = {
  type: 'game' | 'dlc' | 'demo' | 'advertising' | 'mod' | 'video';
  name: string;
  steam_appid: number;
  is_free: boolean;
  short_description?: string;
  header_image: string;
  developers?: string[];
  publishers?: string[];
  price_overview?: {
    currency: string;
    initial: number;
    initial_formatted?: string;
    final_formatted: string;
  };
  categories?: { id: number; description: string }[];
  genres?: { id: number; description: string }[];
  screenshots?: { id: number; path_thumbnail: string; path_full: string }[];
  movies?: {
    id: number;
    name: string;
    thumbnail: string;
    webm?: Record<string, string>;
    mp4?: Record<string, string>;
    highlight: boolean;
  }[];
  release_date?: {
    coming_soon: boolean;
    date: string;
  };
  content_descriptors?: { ids?: ContentDescriptor[]; notes?: string | null };
};

type AppReviewsResponse = {
  success: number;
  query_summary?: {
    review_score_desc: string;
    total_positive: number;
    total_negative: number;
    total_reviews: number;
  };
};
