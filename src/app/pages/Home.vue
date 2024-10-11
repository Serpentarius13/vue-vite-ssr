<script setup lang="ts">
import { placeApi } from "@/api/place";
import { usePlaceStore } from "@/store/usePlaceStore";
import { storeToRefs } from "pinia";
import { onServerPrefetch } from "vue";

import { useSSRContext } from "vue";
import { SSRContext } from "~/types";

import { useDebounce } from "@vueuse/core";
import { computed, onMounted, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const store = usePlaceStore();
const { places } = storeToRefs(store);
const { setPlaces } = store;

const router = useRouter();
const route = useRoute();

const fetchState = reactive<{
  error: string | null;
  loading: boolean;
}>({
  error: null,
  loading: false,
});

const search = computed<string>(() => (route.query.search || "") as string);
const debouncedSearch = useDebounce(search, 300);

const handleSetSearch = (ev: Event) => {
  const target = ev.target as HTMLInputElement;
  router.push({ query: { search: target.value } });
};

const getPlaces = async (query: string) => {
  try {
    fetchState.loading = true;
    fetchState.error = null;
    const places = await placeApi.getPlaces(query);
    setPlaces(places);
  } catch (error) {
    fetchState.error = error.message;
  } finally {
    fetchState.loading = false;
  }

  setPlaces(await placeApi.getPlaces(query));
};

if (import.meta.env.SSR) {
  const ctx = useSSRContext<SSRContext>();
  if (ctx) {
    const search = ctx.req.query.search;

    if (search && typeof search === "string") {
      onServerPrefetch(async () => {
        setPlaces(await placeApi.getPlaces(search));
        store.setAttemptedSSR();
      });
    }
  }
}

onMounted(() => {
  if (search.value && !store.attemptedSSR) {
    getPlaces(search.value);
  }
});

watch(debouncedSearch, (value) => {
  if (!value) return;

  getPlaces(value);
});
</script>

<template>
  <div class="search__wrapper">
    <input
      class="search__input"
      type="text"
      placeholder="Search"
      :value="search"
      @input="handleSetSearch"
    />

    <div v-if="fetchState.loading" class="search__loading">Загрузка..</div>
    <div v-else-if="fetchState.error" class="search__error">
      {{ fetchState.error }}
    </div>
    <div v-else-if="!search" class="search__empty">
      Введите слово для поиска
    </div>
    <ul class="search__list" v-else>
      <li class="search__item" v-for="place in places" :key="place.place_id">
        <h3 class="search__item-title">{{ place.name }}</h3>

        <p class="search__item-address">{{ place.display_name }}</p>

        <div class="search__item-footer">
          <span class="search__item-type">{{ place.addresstype }}</span>
          <div class="search__item-coords">
            <span> Lat: {{ place.lat }} </span>
            <span> Lon: {{ place.lon }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
$primary-color: #3498db;

$white: #ffffff;
$black: #1d1d22;
$gray_1: #ecf0f1;

.search {
  &__wrapper {
    max-width: min(600px, 95vw);
    margin: 30px auto 0 auto;
    padding: 0 12px;
  }

  &__input {
    width: 100%;
    padding: 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    margin-bottom: 12px;
    border: 2px solid $gray_1;

    &:hover {
      border-color: rgba($primary-color, 0.8);
    }

    &:focus {
      outline: none;
      border-color: $primary-color;
    }
  }

  &__list {
    list-style-type: none;
    padding: 0;
  }

  &__item {
    background-color: $white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba($black, 0.1);
    margin-bottom: 1rem;
    padding: 1rem;
    transition: all 0.3s ease;
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 10px;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 8px rgba($black, 0.15);
    }

    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &-coords {
      font-size: 10px;
      display: flex;
      flex-direction: column;
    }

    &-title {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c3e50;
    }

    &-address {
      font-size: 0.9rem;
      color: #7f8c8d;
    }

    &-type {
      background-color: #ecf0f1;
      color: #34495e;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      width: fit-content;
    }

    &-type {
      background-color: #3498db;
      color: #ffffff;
    }
  }
}
</style>
