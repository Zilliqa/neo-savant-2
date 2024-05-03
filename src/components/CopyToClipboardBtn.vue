<template>
  <q-btn
    icon="content_copy"
    round
    flat
    size="8px"
    @click.stop="copyContentToClipboard(props.content)"
  >
    <q-tooltip>
      {{ contentCopiedToClipboard ? 'Copied' : 'Copy' }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { copyToClipboard } from 'quasar';
import {ref} from 'vue';

const contentCopiedToClipboard = ref(false);
const props = defineProps(['content'])

const copyContentToClipboard = async () => {
  await copyToClipboard(props.content);
  contentCopiedToClipboard.value = true;
  await new Promise((r) => setTimeout(r, 2000));
  contentCopiedToClipboard.value = false;
};

</script>
