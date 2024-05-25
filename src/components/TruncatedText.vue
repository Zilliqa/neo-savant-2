<template>
  <a
    v-if="props.link"
    :href="props.link"
    class="text-grey-7"
    @click.stop=""
    target="_blank"
  >
    <span>
      {{
        smartTruncate(props.text, props.length, { position: props.position })
      }}
      <q-tooltip>{{ props.text }}</q-tooltip>
    </span>
  </a>
  <span v-else>
    {{ smartTruncate(props.text, props.length, { position: props.position }) }}
    <q-tooltip>{{ props.text }}</q-tooltip>
  </span>
</template>

<script setup>
import { smartTruncate } from 'src/utils';
const props = defineProps(['text', 'length', 'position', 'link']);
</script>
