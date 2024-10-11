import { createPinia } from "pinia";
import { createSSRApp } from "vue";
import App from "./App.vue";

export class AppFactory {
  static create() {
    const app = createSSRApp(App);
    const pinia = createPinia();
    app.use(pinia);

    return {
      app,
      pinia,
    };
  }
}
