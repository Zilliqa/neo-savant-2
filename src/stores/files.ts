import { defineStore } from 'pinia';
import { defaultScillaContracts } from 'src/contracts';
import { ScillaContract } from 'src/utils';

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [...defaultScillaContracts] as ScillaContract[],
    selected: null as null | ScillaContract,
  }),
  actions: {
    setSelected(name: string) {
      const file = this.getByName(name);
      if (file === undefined) {
        throw new Error(`No file with id ${name}`);
      }
      this.selected = file;
    },
    addNew(name: string, code: string) {
      if (this.getByName(name) !== undefined) {
        throw new Error(`There is already a scilla file with name ${name}`);
      }
      this.files.push({
        name,
        code,
      });
    },
    updateSelectedFileCode(code: string) {
      if (this.selected === null) {
        throw new Error(`There is not file with name ${name}`);
      }

      this.selected.code = code;
    },
    updateCode(name: string, code: string) {
      const file = this.getByName(name);
      if (file === undefined) {
        throw new Error(`There is not file with name ${name}`);
      }

      file.code = code;
    },
  },
  getters: {
    getByName:
      (state) =>
      (name: string): ScillaContract | undefined => {
        return state.files.find((item: ScillaContract) => item.name === name);
      },
  },
  persist: true,
});
