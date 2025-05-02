import { defineStore } from "pinia";
import { LocalStorage, Notify, uid } from "quasar";
import { computed, nextTick, reactive, ref, watch } from "vue";

export const useStoreEntries = defineStore("entries", () => {
  /*
    state
  */

  const entries = ref([
    // {
    //   id: "uid01",
    //   name: "Salary",
    //   amount: 5999.9,
    //   paid: true,
    // },
    // {
    //   id: "uid02",
    //   name: "Rent",
    //   amount: -999,
    //   paid: false,
    // },
    // {
    //   id: "uid03",
    //   name: "phone",
    //   amount: -13.4,
    //   paid: false,
    // },
    // {
    //   id: "uid04",
    //   name: "unknown",
    //   amount: 0,
    //   paid: false,
    // },
  ]);

  watch(entries.value, () => {
    saveEntries();
  });

  const options = reactive({
    sort: false,
  });

  /*
    getters
  */

  const balance = computed(() => {
    return entries.value.reduce((acc, { amount }) => {
      return acc + amount;
    }, 0);
  });

  const balancePaid = computed(() => {
    return entries.value.reduce((acc, { amount, paid }) => {
      return paid ? acc + amount : acc;
    }, 0);
  });

  const runningBalances = computed(() => {
    let runningBalances = [],
      currentRunningBalance = 0;

    if (entries.value.length) {
      entries.value.forEach((entry) => {
        let entryAmount = entry.amount ? entry.amount : 0;
        currentRunningBalance = currentRunningBalance + entryAmount;
        runningBalances.push(currentRunningBalance);
      });
    }

    return runningBalances;
  });

  /*
    actions
  */

  function addEntry(addEntryForm) {
    const newEntry = Object.assign({}, addEntryForm, { id: uid() });
    if (newEntry.amount === null) newEntry.amount = 0;
    entries.value.push(newEntry);
  }

  function deleteEntry(entryId) {
    const index = getEntryIndexById(entryId);
    entries.value.splice(index, 1);
    removeSlideItemIfExists(entryId);
    Notify.create({
      message: "Entry Deleted",
      position: "top",
    });
  }

  function updateEntry(entryId, updates) {
    const index = getEntryIndexById(entryId);
    Object.assign(entries.value[index], updates);
  }

  const sortEnd = ({ oldIndex, newIndex }) => {
    const movedEntry = entries.value[oldIndex];
    entries.value.splice(oldIndex, 1);
    entries.value.splice(newIndex, 0, movedEntry);
  };

  const saveEntries = () => {
    LocalStorage.set("entries", entries.value);
  };

  const loadEntries = () => {
    const savedEntries = LocalStorage.getItem("entries");
    if (savedEntries) Object.assign(entries.value, savedEntries);
  };

  /*
    helpers
  */

  function getEntryIndexById(entryId) {
    return entries.value.findIndex((entry) => entry.id === entryId);
  }

  const removeSlideItemIfExists = (entryId) => {
    // (after entry removed from entries array)
    nextTick(() => {
      const slideItem = document.querySelector(`#id-${entryId}`);
      if (slideItem) slideItem.remove();
    });
  };

  return {
    // state
    entries,
    options,
    // getters
    balance,
    balancePaid,
    runningBalances,
    // actions
    addEntry,
    deleteEntry,
    updateEntry,
    sortEnd,
    loadEntries,
  };
});
