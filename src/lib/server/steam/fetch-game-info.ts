const APP_DETAILS_URL = 'https://store.steampowered.com/api/appdetails';
const APP_REVIEWS_URL = 'https://store.steampowered.com/appreviews';

export default async function fetchGameInfo(appId: string) {
  const detailsUrl = new URL(APP_DETAILS_URL);
  detailsUrl.searchParams.set('appids', appId);

  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) {
    console.error(`App ${appId} details ${detailsResponse.status} ${detailsResponse.statusText}`);
    return null;
  }

  const detailsResult = (await detailsResponse.json()) as AppDetailsResponse;
  if (!detailsResult[appId] || !detailsResult[appId].success || !detailsResult[appId].data) {
    console.error(`App ${appId} details fetch failed`);
    return null;
  }

  const appDetails = detailsResult[appId].data;
  if (appDetails.type != 'game') {
    console.error(`App ${appId} is not a game`);
    return null;
  }

  if (
    appDetails.content_descriptors.ids.includes(ContentDescriptor.FrequentNudityorSexualContent)
  ) {
    console.error(`App ${appId} has FrequentNudityorSexualContent`);
    return null;
  }

  if (appDetails.release_date.coming_soon) {
    console.error(`App ${appId} is not released`);
    return null;
  }

  const reviewsUrl = new URL(`${APP_REVIEWS_URL}/${appId}`);
  reviewsUrl.searchParams.set('json', '1');
  reviewsUrl.searchParams.set('language', 'all');
  reviewsUrl.searchParams.set('purchase_type', 'all');
  reviewsUrl.searchParams.set('num_per_page', '0');

  const reviewsResponse = await fetch(reviewsUrl);
  if (!reviewsResponse.ok) {
    console.error(`App ${appId} details ${reviewsResponse.status} ${reviewsResponse.statusText}`);
    return null;
  }

  const reviewsResult = (await reviewsResponse.json()) as AppReviewsResponse;
  if (reviewsResult.success != 1 || !reviewsResult.query_summary) {
    console.error(`App ${appId} reviews fetch failed`);
    return null;
  }

  const reviewsSummary = reviewsResult.query_summary;
  if (reviewsSummary.total_negative + reviewsSummary.total_positive === 0) {
    console.error(`App ${appId} has zero reviews`);
    return null;
  }

  return { details: appDetails, reviews: reviewsSummary };
}

type AppDetailsResponse = Record<string, { success: boolean; data?: AppDetails }>;

type AppDetails = {
  type: 'game' | 'dlc' | 'demo' | 'advertising' | 'mod' | 'video';
  name: string;
  short_description: string;
  header_image: string;
  developers: string[];
  publishers: string[];
  price_overview: {
    currency: string;
    initial: number;
    initial_formatted: string;
    final_formatted: string;
  };
  categories: { id: number; description: string }[];
  genres: { id: number; description: string }[];
  screenshots: { id: number; path_thumbnail: string; path_full: string }[];
  movies: {
    id: number;
    name: string;
    thumbnail: string;
    webm: { '480': string; max: string };
    mp4: { '480': string; max: string };
    highlight: boolean;
  }[];
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  content_descriptors: { ids: ContentDescriptor[]; notes: string | null };
};

enum ContentDescriptor {
  SomeNudityorSexualContent = 1,
  FrequentViolenceOrGore = 2,
  AdultOnlySexualContent = 3,
  FrequentNudityorSexualContent = 4,
  GeneralMatureContent = 5,
}

type AppReviewsResponse = {
  success: number;
  query_summary?: {
    review_score_desc: string;
    total_positive: number;
    total_negative: number;
    total_reviews: number;
  };
};
