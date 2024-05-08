<template>
  <q-btn-dropdown
    dense
    icon="dns"
    unelevated
    no-caps
    :label="
      blockchainStore.selectedNetwork
        ? blockchainStore.selectedNetwork.name
        : 'Select a Network'
    "
  >
    <managed-by-zilpay v-if="blockchainStore.managedByZilpay"/>
    <q-list dense v-else>
      <q-item-label header class="bg-grey-3 text-bold text-uppercase">
        <div class="row q-gutter-xs items-center justify-between">
          <span>Networks</span>
          <div>
            <q-btn
              v-close-popup
              class="gt-xs"
              size="14px"
              label="Add"
              flat
              dense
              icon="add_circle_outline"
              @click="showNewNetworkDialog"
            >
              <q-tooltip> Add new network </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-item-label>
      <div v-for="network in networksStore.networks" :key="network.name">
        <q-item
          clickable
          v-close-popup
          :active="blockchainStore.selectedNetwork?.name === network.name"
        >
          <q-item-section @click="setSelectedNetwork(network.name)">
            <q-item-label>
              <span class="text-bold">{{ network.name }}</span>
            </q-item-label>
            <q-item-label caption>
              {{ network.url }}
            </q-item-label>
          </q-item-section>
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                class="gt-xs"
                size="10px"
                flat
                dense
                round
                icon="delete"
                @click="deleteNetwork(network.name)"
              />
              <q-btn class="gt-xs" size="10px" flat dense round icon="edit" />
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
      </div>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import NewNetworkDialog from './NewNetworkDialog.vue';
import managedByZilpay from 'components/ManagedByZilpay.vue';
import { useNetworksStore } from 'stores/networks';
import { useBlockchainStore } from 'src/stores/blockchain';
import { useQuasar } from 'quasar';

const q = useQuasar();
const networksStore = useNetworksStore();
const blockchainStore = useBlockchainStore();

const setSelectedNetwork = (name: string) => {
  try {
    blockchainStore.setSelectedNetwork(name);
    q.notify({
      type: 'info',
      message: `<strong>${name}</strong> network selected`,
      html: true,
    });
  } catch (error) {
    q.notify({
      type: 'negative',
      message: `Failed to select <strong>${name}</strong> network. ${error}`,
      html: true,
    });
  }
};

const deleteNetwork = (name: string) => {
  q.dialog({
    title: 'Delete Network',
    message: `Are you sure to delete <strong>${name}</strong>?`,
    html: true,
    cancel: true,
  }).onOk(() => {
    try {
      networksStore.deleteNetwork(name);
      q.notify({
        type: 'info',
        message: `<strong>${name}</strong> network deleted.`,
        html: true,
      });
    } catch (error) {
      q.notify({
        type: 'negative',
        message: `Failed to delete <strong>${name}</strong> network. ${error}`,
        html: true,
      });
    }
  });
};

const showNewNetworkDialog = () => {
  q.dialog({
    component: NewNetworkDialog,
  });
};
</script>

<style lang=""></style>
