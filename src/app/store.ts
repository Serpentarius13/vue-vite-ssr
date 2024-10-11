import { defineStore } from "pinia";
import { Place } from "./entities/place";

interface Store {
  places: Place[];
}

export const usePlaceStore = defineStore("place-store", {
  state: (): Store => ({
    places: [],
  }),
  actions: {
    setPlaces(places: Place[]) {
      this.places = places;
    },
  },
});
