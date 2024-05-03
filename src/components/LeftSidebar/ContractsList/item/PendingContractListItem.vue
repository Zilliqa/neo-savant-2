<template>
  <q-item class="bg-grey-2">
    <q-item-section>
      <q-item-label>
        <div class="row text-bold q-mr-sm text-grey-6">
          {{ props.contract.name }}
          <q-space />
          <q-badge color="grey" text-color="white" label="Pending">
            <q-circular-progress
              class="q-ml-xs"
              indeterminate
              rounded
              size="10px"
            />
          </q-badge>
        </div>
      </q-item-label>
      <q-item-label caption>
        <div>
          <truncated-text
            class="text-grey-5"
            :text="props.contract.txHash"
            :length="22"
            :position="12"
          />
          <copy-to-clipboard-btn :content="props.contract.txHash" />
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import TruncatedText from 'components/TruncatedText.vue';
import CopyToClipboardBtn from 'components/CopyToClipboardBtn.vue';

const props = defineProps(['contract'])
</script>
