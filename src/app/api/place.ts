import { Place } from "@/entities/place";

const BASE_URL = "https://nominatim.openstreetmap.org";

const makeUrl = (...paths: string[]) => `${BASE_URL}/${paths.join("")}`;
const makeSearchParams = (params: Record<string, string>) =>
  "?" +
  Object.entries(params)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

const getPlaces = async (query: string) => {
  const places = (await fetch(
    makeUrl(
      "search",
      makeSearchParams({
        q: query,
        format: "json",
      })
    )
  ).then((r) => r.json())) as Place[];

  return places;
};

export const placeApi = {
  getPlaces,
};
