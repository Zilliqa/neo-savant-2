import { EventBus } from 'quasar';
import { ScillaFile } from './utils';

export const eventBus = new EventBus<{
  'scilla-file-selected': (file: ScillaFile) => void;
}>();
