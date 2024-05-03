<template>
  <span>
    {{ smartTruncate(props.text, props.length, { position: props.position}) }}
    <q-tooltip>{{ props.text }}</q-tooltip>
  </span>
</template>

<script setup>
import { smartTruncate } from 'src/utils';
const props = defineProps(['text', 'length', 'position'])

</script>
