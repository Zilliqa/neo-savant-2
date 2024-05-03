<template>
  <q-input
    filled
    dense
    :label="`${props.vname}: ${props.type}`"
    :type="quasarType"
    v-model="model"
  >
    <template v-slot:append>
      <q-btn round flat dense icon="help">
        <q-popup-proxy>
          <q-banner dense>
            {{ help.description }}
            <template #action>
              <q-btn
                :href="help.link"
                target="_blank"
                flat
                color="primary"
                label="More Info"
              />
            </template>
          </q-banner>
        </q-popup-proxy>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup>
import { getParamType } from 'src/utils/validation';
import { computed } from 'vue';
const model = defineModel()

const props = defineProps(['vname', 'type']);
const type = getParamType(props.type);

const help = computed(() => {
  return helps.find((h) => h.type === type);
});

const quasarType = computed(() => {
  switch (type) {
    case 'ByStr20':
    case 'String':
      return 'text';
    case 'Uint':
      return 'number';
    default:
      console.log(`Unknown type: ${type}`);
      return 'text';
  }
});

const helps = [
  {
    type: 'Uint',
    description:
      'Scilla defines signed and unsigned integer types of 32, 64, 128, and 256 bits. These integer types can be specified with the keywords IntX and UintX where X can be 32, 64, 128, or 256. For example, the type of an unsigned integer of 32 bits is Uint32.',
    link: 'https://scilla.readthedocs.io/en/latest/scilla-in-depth.html#integer-types',
  },
  {
    type: 'String',
    description:
      'String literals in Scilla are expressed using a sequence of characters enclosed in double quotes. Variables can be declared by specifying using keyword String.',
    link: 'https://scilla.readthedocs.io/en/latest/scilla-in-depth.html#strings',
  },
  {
    type: 'ByStr20',
    description:
      'An address in Scilla is declared using the data type ByStr20. ByStr20 represents a hexadecimal byte string of 20 bytes (40 hexadecimal characters). A ByStr20 literal is prefixed with 0x',
    link: 'https://scilla.readthedocs.io/en/latest/scilla-in-depth.html#addresses',
  },
  {
    type: 'List',
    description:
      'Lists of values are specified using the type List t, where t is some type. All elements in a list must be of the same type t. In other words, two values of different types cannot be added to the same list.',
    link: 'https://scilla.readthedocs.io/en/latest/scilla-in-depth.html#list',
  },
];
</script>
