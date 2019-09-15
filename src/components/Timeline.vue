<template lang="pug">
.timeline
    .timeline-track
        .timeline-item(
            :class="{ '--selected': selected }",
            style="width: 300px; transform: translate(100px, 10px)"
            @click="selected = !selected"
        )
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Timeline extends Vue {

    selected = false;

}
</script>