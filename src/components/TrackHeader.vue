<template lang="pug">
.track-header
    .__name {{ track.name }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ITrack } from "../types";

@Component
export default class TrackHeader extends Vue {

    @Prop()
    track!: ITrack;

}
</script>
