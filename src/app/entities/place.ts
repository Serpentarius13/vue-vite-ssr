export interface Address {
  ISO3166_2_lvl4?: string;
  borough?: string;
  city?: string;
  country?: string;
  country_code?: string;
  neighbourhood?: string;
  postcode?: string;
  road?: string;
  shop?: string;
  suburb?: string;
}

export interface BoundingBox {
  lat: number;
  lon: number;
}

export interface PlaceData {
  importance?: number;
  osm_id: number;
  osm_type: string;
  place_id: number;
  place_rank: number;
  type: string;
}

export interface Place extends PlaceData {
  address: Address;
  addresstype: string;
  boundingbox: BoundingBox[];
  category: string;
  display_name: string;
  licence: string;
  lat: number;
  lon: number;
  name: string;
}
