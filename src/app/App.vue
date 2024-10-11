<script setup lang="ts">
import { placeApi } from "@/api/place";
import { storeToRefs } from "pinia";
import { onServerPrefetch } from "vue";
import { usePlaceStore } from "./store";

const store = usePlaceStore();
const { places } = storeToRefs(store);
const { setPlaces } = store;

onServerPrefetch(async () => {
  setPlaces(await placeApi.getPlaces("s"));
});
</script>

<template>
  <div class="search__wrapper">
    <input class="search__input" type="text" placeholder="Search" />
    <ul class="search__list">
      <li class="search__list-item" v-for="place in places">
        {{ place.addresstype }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.search {
  &__wrapper {
  }

  &__input {
    width: 100%;
  }

  &__list {
    &-item {
    }
  }
}
</style>
