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
      <div class="text-center post_btn">
        <a href="#">
          <img src="/assets/img/post_btn.png" alt="enter" />
        </a>
      </div>
    </section>

    <section id="story_carousel_pc">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div id="story_carousel_title">
              <img src="/assets/img/story_title.png" alt="title" />
            </div>
            <div id="story_carousel" class="carousel slide" data-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <div class="col-6 col-story">
                      <div class="story">
                        <img src="https://picsum.photos/537/352" class="story-img" alt="..." />
                        <div class="story-body">
                          <h5 class="story-title">Title 1</h5>
                          <p class="story-text">Description 1</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 col-story">
                      <div class="story">
                        <img src="https://picsum.photos/537/352" class="story-img" alt="..." />
                        <div class="story-body">
                          <h5 class="story-title">Title 1</h5>
                          <p class="story-text">Description 1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <a
                class="carousel-control-prev"
                href="#story_carousel"
                role="button"
                data-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">Previous</span>
              </a>
              <a
                class="carousel-control-next"
                href="#story_carousel"
                role="button"
                data-slide="next"
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
