import { Platform } from "quasar";

export default {
  mounted(el) {
    const input = el.querySelector("input"),
      delay = 0;

    setTimeout(() => {
      input.focus();
    }, delay);
  },
};
