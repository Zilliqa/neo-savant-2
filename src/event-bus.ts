import { EventBus } from 'quasar';
import { ScillaContract } from './utils';

export const eventBus = new EventBus<{
  'contract-selected': (contract: ScillaContract) => void;
}>();
