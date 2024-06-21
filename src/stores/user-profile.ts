import { defineStore } from 'pinia';

export const useUserProfile = defineStore('profile', {
  state: () => ({
    showOldIdeLink: true,
  }),
  actions: {
    setShowOldIdLink(show: boolean) {
      this.showOldIdeLink = show;
    },
  },
  persist: true,
});
