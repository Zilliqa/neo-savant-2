<template>
  <span class="text-orange-5 text-weight-light">
    <span>{{ props.account.balance }} ZIL</span>
    <q-btn
      @click.stop="refreshBalance"
      :loading="loading"
      icon="refresh"
      round
      flat
      dense
      size="sm"
    />
  </span>
</template>

<script setup>
import { ref } from 'vue';
import { useAccountsStore } from 'stores/accounts';

const loading = ref(false);

const props = defineProps(['account']);
const accountsStore = useAccountsStore();

const refreshBalance = async () => {
  loading.value = true;
  try {
    await accountsStore.refreshBalance(props.account.name);
  } catch (error) {
    q.notify({
      type: 'warning',
      message: `Failed to update the balance. ${error}`,
    });
  } finally {
    loading.value = false;
  }
};
</script>
