  <template>
      <div class="fit">
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        expand-separator
        icon="perm_identity"
        label="Account settings"
        caption="John Doe"
        class="fit"
      >
        <contract-general-info-card :address="props.contract.address" class="fit"/>
      </q-expansion-item>
      <q-expansion-item
        expand-separator
        icon="perm_identity"
        label="Account settings"
        caption="John Doe"
        class="fit"
      >
        <contract-state-dialog :contract="props.contract" class="fit"/>
      </q-expansion-item>
      </q-list>
      </div>

  <!-- <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="general_info" label="General Info" />
      <q-tab name="state" label="State" />
      <q-tab name="transitions" label="Transitions" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="general_info" class="q-pa-none fit">
      </q-tab-panel>

      <q-tab-panel name="state" class="q-pa-none">
        <contract-state-dialog :contract="props.contract" class="fit"/>
      </q-tab-panel>

      <q-tab-panel name="transitions" class="q-pa-none column">
        <call-transition-dialog :contract="props.contract"/>
      </q-tab-panel>
    </q-tab-panels>
  </q-card> -->
</template>
<script setup>
import {ref} from 'vue';
import CallTransitionDialog from './CallTransitionDialog.vue';
import ContractStateDialog from './ContractStateDialog.vue';
import ContractGeneralInfoCard from './ContractGeneralInfoCard.vue';

const props = defineProps(['contract']);

const tab = ref('general_info')
</script>
