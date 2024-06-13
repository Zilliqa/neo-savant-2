<template>
  <q-dialog
    v-model="show"
    :persistent="false"
    :no-esc-dismiss="false"
    backdrop-filter="blur(4px)"
  >
    <q-card style="width: 500px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Transfer ZIL</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="column q-gutter-md">
          <q-input
            dense
            filled
            class="col"
            label="Recipient Address"
            v-model="recipient"
          />
          <q-input
            dense
            filled
            class="col"
            label="Amount"
            type="number"
            suffix="ZIL"
            v-model="amount"
          />
          <div class="col row">
            <q-space />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" class="bg-grey-2">
        <q-btn
          icon="outbox"
          no-caps
          flat
          :loading="loading"
          color="primary"
          @click="transfer"
          >Transfer</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useBlockchainStore } from 'src/stores/blockchain';
import { units } from '@zilliqa-js/util';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const q = useQuasar();

const recipient = ref('');
const amount = ref(0);
const loading = ref(false);
const blockchainStore = useBlockchainStore();
const show = ref(true);

const transfer = async () => {
  loading.value = true;
  try {
    const id = await blockchainStore.transferZil(
      recipient.value,
      units.toQa(amount.value, units.Units.Zil)
    );
    q.notify({
      type: 'info',
      message: `Transaction created. ${id}`,
    });
    show.value = false;
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to transfer. ${error}`,
    });
  } finally {
    loading.value = false;
  }
};
</script>
