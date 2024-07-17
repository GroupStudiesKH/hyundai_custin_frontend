<script>
import { useRouter, useRoute } from "vue-router";

export default {

  setup() {
    const router = useRouter();

    // const toLastPage = () => {
    //   router.push({ name: "final" });
    //   playBackgroundMusic()
    // };


    // const toNextPage = () => {
    //   router.push({ name: "intro_2" });
    //   playBackgroundMusic()
    // };

    return {
      // toNextPage,
      // toLastPage
    };
  },
};
</script>

<template>
  <main>
    <section id="banner_pc">
      <div class="container">
        123
      </div>
    </section>

    <section id="page_intro_pc">
      <div class="container">
        123
      </div>
    </section>
  </main>
</template>
