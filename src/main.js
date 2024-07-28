import "./assets/main.scss";
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap"
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3Marquee from 'vue3-marquee'

createApp(App).use(Vue3Marquee).mount('#app')

const app = createApp(App);

app.use(router);
app.use(Vue3Marquee, { name: 'MarqueeComponent' })

app.mount("#app");
