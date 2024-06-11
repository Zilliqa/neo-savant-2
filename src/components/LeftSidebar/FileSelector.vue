<template>
  <q-tree
    dense
    :nodes="fileNodes"
    node-key="key"
    selected-color="orange"
    v-model:selected="selected"
    default-expand-all
    no-connectors
    @update:selected="change"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useFilesStore } from 'src/stores/files';
import { ScillaFile } from 'src/utils';
import { eventBus } from 'src/event-bus';
import { useQuasar } from 'quasar';

const q = useQuasar();
const selected = ref('');
const filesStore = useFilesStore();

const fileNodes = computed(() => {
  return [
    {
      label: 'Contracts',
      key: 'default-contracts',
      selectable: false,
      expandable: true,
      children: filesStore.files.map((contract: ScillaFile) => ({
        label: contract.name,
        key: contract.name,
        icon: 'description',
        iconColor: 'grey-7',
      })),
    },
  ];
});

function change(target: string) {
  try {
    filesStore.openAndSelect(target);
  } catch (error) {
    q.notify({
      type: 'warning',
      message: `${error}`,
    });
  }
  const file = filesStore.getByName(target);
  if (file) eventBus.emit('scilla-file-selected', file);
}
</script>
