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
        <div class="row">
          <div class="col-12 text-center">
            <div class="link">故事募集中</div>
            <div class="link">幸福故事集</div>
            <div class="link">名人車主故事&體驗分享</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
