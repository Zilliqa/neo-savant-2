<template>
  <q-item>
    <q-item-section>
      <q-item-label>
        <div class="text-bold q-mr-sm">{{ props.contract.name }}</div>
      </q-item-label>
      <q-item-label caption>
        <div class="row items-center">
          <truncated-text
            :text="props.contract.address"
            :length="24"
            :position="12"
          />
          <copy-to-clipboard-btn :content="props.contract.address" />
        </div>
      </q-item-label>
      <q-item-label>
        <contract-list-item-actions :contract="props.contract"/>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import ContractListItemActions from './ContractListItemActions.vue'
import TruncatedText from 'components/TruncatedText.vue';
import CopyToClipboardBtn from 'components/CopyToClipboardBtn.vue';

const props = defineProps(['contract'])
</script>
