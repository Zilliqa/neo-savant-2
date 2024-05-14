import { defineStore } from 'pinia';
import { defaultScillaContracts } from 'src/contracts';
import { ScillaContract } from 'src/utils';

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [...defaultScillaContracts] as ScillaContract[],
    selected: null as null | ScillaContract,
    openFiles: [] as string[],
  }),
  actions: {
    setSelected(name: string) {
      const file = this.getByName(name);
      if (file === undefined) {
        throw new Error(`No file with id ${name}`);
      }

      if (this.openFiles.indexOf(name) === -1) {
        this.openFiles.push(name);
      }

      this.selected = file;
    },
    removeFromOpenFiles(name: string) {
      this.openFiles = this.openFiles.filter((file) => file !== name);
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
    delete(name: string) {
      if (this.getByName(name) === undefined) {
        throw new Error(`There is no file with name ${name}`);
      }

      if (this.selected && this.selected.name === name) {
        this.selected = null;
      }
      this.files = this.files.filter((file) => file.name !== name);
    },
    updateFileCode(name: string, code: string) {
      const file = this.getByName(name);
      if (file === undefined) {
        throw new Error(`There is no file with name ${name}`);
      }

      file.code = code;
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
