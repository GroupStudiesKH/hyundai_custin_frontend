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
        <div class="logo col-12">
          <img src="/assets/img/banner_logo.png" alt="logo" />
        </div>
        <div class="car col-12">
          <img src="/assets/img/banner_car.png" alt="logo" />
        </div>
      </div>
    </section>

    <section id="page_intro_pc">
      <div class="container">
        123
      </div>
    </section>
  </main>
</template>
