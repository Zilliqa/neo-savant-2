<template>
  <q-dialog
    persistent="false"
    no-esc-dismiss="false"
    backdrop-filter="blur(4px)"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Unit Convertor</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="column q-gutter-md">
          <q-input
            class="col"
            type="number"
            label="Zil"
            v-model="zil"
            @change="handleChangeZil"
          />
          <q-input
            class="col"
            type="number"
            label="Li"
            v-model="li"
            @change="handleChangeLi"
          />
          <q-input
            class="col"
            type="number"
            label="Qa"
            v-model="qa"
            @change="handleChangeQa"
          />
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-grey-2">
        <q-btn no-caps flat color="primary" @click="handleConversion"
          >Convert</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { BN, units } from '@zilliqa-js/util';

const zil = ref(0);
const li = ref(0);
const qa = ref(0);

const handleChangeZil = () => {
  const qa_internal = units.toQa(zil.value, units.Units.Zil);
  li.value = units.fromQa(new BN(qa_internal), units.Units.Li);
  qa.value = qa_internal;
};

const handleChangeLi = () => {
  const qa_internal = units.toQa(li.value, units.Units.Li);
  zil.value = units.fromQa(new BN(qa_internal), units.Units.Zil);
  qa.value = qa_internal;
};

const handleChangeQa = () => {
  li.value = units.fromQa(new BN(qa.value), units.Units.Li);
  zil.value = units.fromQa(new BN(qa.value), units.Units.Zil);
};
</script>
