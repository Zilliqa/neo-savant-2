  <template>
  <q-dialog
    v-model="show"
    :persistent="false"
    :no-esc-dismiss="false"
    backdrop-filter="blur(4px)"
  >
    <q-card>
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
        <q-tab-panel name="general_info">
          <div class="text-h6">General Info</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>

        <q-tab-panel name="state" class="q-pa-none">
          <contract-state-dialog :address="props.contract.address"/>
        </q-tab-panel>

        <q-tab-panel name="transitions" class="q-pa-none">
          <call-transition-dialog :contract="props.contract"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>
<script setup>
import {ref} from 'vue';
import CallTransitionDialog from './CallTransitionDialog.vue';
import ContractStateDialog from './ContractStateDialog.vue';
const props = defineProps(['contract']);

const tab = ref('general_info')
</script>
