<script>
import { RouterLink, RouterView } from "vue-router";
import { onMounted, reactive } from "vue";
export default {

  setup() {
    const states = reactive({
      deferredPrompt: null,
    });
    onMounted(() => {
      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        states.deferredPrompt = e;
      });
      window.addEventListener("appinstalled", () => {
        states.deferredPrompt = null;
        alert("app installed");
      });
      document.querySelector("#app").addEventListener("click", () => { 
        if (states.deferredPrompt) {
          states.deferredPrompt.prompt();
          states.deferredPrompt = null;
        }
      });
    });

  },
};

</script>

<template>
  <RouterView />
</template>