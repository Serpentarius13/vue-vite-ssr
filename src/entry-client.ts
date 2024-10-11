import { AppFactory } from "@/index";

const { app, pinia, router } = AppFactory.create();

if (window.__pinia) {
  pinia.state.value = JSON.parse(window.__pinia);
}

router.isReady().then(() => {
  app.mount("#app");
});
