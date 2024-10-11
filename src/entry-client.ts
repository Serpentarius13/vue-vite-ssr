import { AppFactory } from "./app";
import "./app.css";

const { app, pinia } = AppFactory.create();

if (window.__pinia) {
  pinia.state.value = JSON.parse(window.__pinia);
}

app.mount("#app");
