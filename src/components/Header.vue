<template lang="pug">
.timeline-header
    .marker(
        v-for="marker, n in markers"
        :key="n"
        :class="[`--${marker.type}`]"
        :style="{ transform: `translateX(calc(${marker.position}px - 50%))` }"
    ) {{ marker.type === "major" ? labelfun(marker.unit) : "" }}
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Header extends Vue {

    @Prop()
    markers!: any;

    @Prop()
    labelfun!: (n: number) => string;

}
</script>