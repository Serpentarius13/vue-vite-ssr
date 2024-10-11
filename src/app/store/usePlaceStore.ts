import { defineStore } from "pinia";
import { Place } from "../entities/place";

interface Store {
  places: Place[];
  attemptedSSR: boolean;
}

export const usePlaceStore = defineStore("place-store", {
  state: (): Store => ({
    places: [],
    attemptedSSR: false,
  }),
  actions: {
    setPlaces(places: Place[]) {
      this.places = places;
    },
    setAttemptedSSR() {
      this.attemptedSSR = true;
    },
  },
});
