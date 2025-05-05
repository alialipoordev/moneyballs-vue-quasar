import { defineStore } from "pinia";
import { Notify } from "quasar";
import { computed, nextTick, reactive, ref } from "vue";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "src/firebase/firebase";
import { useAuthStore } from "src/stores/storeAuth";

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
    //   order: 1
    // },
    // {
    //   id: "uid02",
    //   name: "Rent",
    //   amount: -999,
    //   paid: false,
    //   order: 2
    // },
    // {
    //   id: "uid03",
    //   name: "phone",
    //   amount: -13.4,
    //   paid: false,
    //   order: 3
    // },
    // {
    //   id: "uid04",
    //   name: "unknown",
    //   amount: 0,
    //   paid: false,
    //   order: 4
    // },
  ]);

  const entriesLoaded = ref(false);

  let unsubscribe = null;

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

  const entriesOrdered = computed(() => {
    return entries.value.sort((a, b) => a.order - b.order);
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

  const loadEntries = async () => {
    entriesLoaded.value = false;
    const entriesCollectionRef = getUserEntriesRef();
    unsubscribe = onSnapshot(entriesCollectionRef, (querySnapshot) => {
      let entriesFB = [];
      querySnapshot.forEach((doc) => {
        let entry = doc.data();
        entry.id = doc.id;
        entriesFB.push(entry);
      });
      entries.value = entriesFB;
      entriesLoaded.value = true;
    });
  };

  async function addEntry(addEntryForm) {
    const entriesCollectionRef = getUserEntriesRef();
    const newEntry = Object.assign({}, addEntryForm, {
      paid: false,
      order: generateOrderNumber(),
    });
    if (newEntry.amount === null) newEntry.amount = 0;
    await addDoc(entriesCollectionRef, newEntry);
  }

  async function deleteEntry(entryId) {
    const entriesCollectionRef = getUserEntriesRef();
    await deleteDoc(doc(entriesCollectionRef, entryId));
    removeSlideItemIfExists(entryId);
    Notify.create({
      message: "Entry Deleted",
      position: "top",
    });
  }

  async function updateEntry(entryId, updates) {
    const entriesCollectionRef = getUserEntriesRef();
    await updateDoc(doc(entriesCollectionRef, entryId), updates);
  }

  function updateEntryOrderNumber() {
    let currentOder = 1;

    entries.value.forEach((entry) => {
      entry.order = currentOder;
      currentOder++;
    });

    entries.value.forEach((entry) => {
      updateEntry(entry.id, { order: entry.order });
    });
  }

  const sortEnd = ({ oldIndex, newIndex }) => {
    const movedEntry = entries.value[oldIndex];
    entries.value.splice(oldIndex, 1);
    entries.value.splice(newIndex, 0, movedEntry);
    updateEntryOrderNumber();
  };

  function clearEntries() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    entries.value = [];
    entriesLoaded.value = false;
  }

  /*
    helpers
  */

  function getUserEntriesRef() {
    const authStore = useAuthStore();
    const userId = authStore.user?.uid;
    if (!userId) throw new Error("User is not authenticated");
    return collection(db, `users/${userId}/entries`);
  }

  function generateOrderNumber() {
    const orderNumbers = entries.value.map((entry) => entry.order),
      newOrderNumber = orderNumbers.length ? Math.max(...orderNumbers) + 1 : 1;

    return newOrderNumber;
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
    entriesLoaded,
    options,
    // getters
    entriesOrdered,
    balance,
    balancePaid,
    runningBalances,
    // actions
    loadEntries,
    addEntry,
    deleteEntry,
    updateEntry,
    sortEnd,
    clearEntries,
  };
});
