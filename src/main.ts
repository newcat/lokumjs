import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

import "./styles/normalize.css";
import "./styles/all.scss";
import "./styles/icons.css";
// import "./assets/fonts/MaterialIcons-Regular.woff2";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
