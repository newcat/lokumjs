export { default as Timeline } from "./components/Timeline.vue";
export * from "./Editor";

import OurVue, { VueConstructor } from "vue";
import Timeline from "./components/Timeline.vue";

const Lokum = {
    install(Vue: VueConstructor, args?: any): void {
        if (OurVue !== Vue) {
            // tslint:disable-next-line:no-console
            console.error("Multiple instances of Vue detected\n" +
                "See https://github.com/vuetifyjs/vuetify/issues/4068\n\n" +
                'If you\'re seeing "$attrs is readonly", it\'s caused by this');
        }
        Vue.component("lokum-timeline", Timeline);
    }
};

export const LokumVuePlugin = Lokum;

