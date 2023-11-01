import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/index.js"
import store from "./store/index.js"
import "@/assets/styles/style.sass"

createApp(App).use(store).use(router).mount("#app")
