<script>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import { Vue3Marquee } from 'vue3-marquee'

export default {
  components: {
    Vue3Marquee,
  },
  setup() {
    const router = useRouter();
    const animateClassLeft = ref("");
    const animateClassRight = ref("");
    const animatedNumber = ref(0);
    const stories = ref([
      [],
      [],
      [],
      []
    ]);
    const storiesMobile = ref([
      [],
      []
    ]);

    const animateNum = () => {
      const targetNumber = 10000;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / targetNumber));

      const timer = setInterval(() => {
        animatedNumber.value += 100;
        if (animatedNumber.value === targetNumber) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    const getStories = async () => {
      try {
        const results = await apiService.getStories();

        stories.value = [
          results.slice(0, 5),
          results.slice(5, 10),
          results.slice(10, 15),
          results.slice(15, 20),
        ];

        storiesMobile.value = [
          results.slice(0, 10),
          results.slice(11, 20),
        ];

        // setInterval(() => {
        //   stories.value.forEach((story, index) => {
        //     const storyPop = story[story.length - 1];
        //     stories.value[index].push(storyPop);
        //     stories.value[index].shift();
        //   });
        //   console.log(stories.value);
        // }, 5000);

      } catch (error) {
        console.log(error);
      }
    };

    onMounted(() => {
      animateNum();
      getStories();

      const scrollContainer = document.querySelector(".story_share_container");

      let isDown = false;
      let startX;
      let scrollLeft;

      scrollContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        scrollContainer.classList.add("active");
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
      });

      scrollContainer.addEventListener("mouseleave", () => {
        isDown = false;
        scrollContainer.classList.remove("active");
      });

      scrollContainer.addEventListener("mouseup", () => {
        isDown = false;
        scrollContainer.classList.remove("active");
      });

      scrollContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2; //scroll-fast
        scrollContainer.scrollLeft = scrollLeft - walk;
      });
    });

    return {
      animateClassLeft,
      animateClassRight,
      animatedNumber,
      stories,
      storiesMobile
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
          <span class="animatedNumber">{{ animatedNumber }}</span>
          <img src="/assets/img/banner_car.png" alt="logo" />
        </div>
      </div>
    </section>
    <section id="banner_mobile">
      <div class="container">
        <div class="logo col-12">
          <img src="/assets/img/banner_logo_mobile.png" alt="logo" />
        </div>
        <div class="car col-12">
          <img src="/assets/img/banner_car.png" alt="logo" />
        </div>
        <div class="col-12">
          <span class="animatedNumber">{{ animatedNumber }}</span>
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
    <section id="page_intro_mobile">
      <div class="container"></div>
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
            <div
              id="story_carousel"
              class="carousel slide"
              data-ride="carousel"
            >
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <div class="col-6 col-story">
                      <div class="story">
                        <img
                          src="https://picsum.photos/537/352"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">陪伴我們全家的最佳神隊友</h5>
                          <p class="story-content">
                            人生第一台車就獻給Custin！全家居住於台中，隻身一人工作於台北的遲先生，為了陪伴老婆與孩子，每周末都會開著Custin帶家人們出遊，享受甜蜜的家庭時光。
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 col-story">
                      <div class="story">
                        <img
                          src="https://picsum.photos/537/352"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            七人座MPV Custin A款交車，滿意!!
                          </h5>
                          <p class="story-content">
                            Custin就是載家人出遊、偶爾滿載、臨時載貨，至於1.5T渦輪引擎開這麼大台的車到底夠不夠力呢?一踩大扭力就出來，使用到目前覺得滿載也不會感受到重拖，順順開來個瞬間加速也夠超車，幾天下來目前是滿意的!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="carousel-item">
                  <div class="row">
                    <div class="col-6 col-story">
                      <div class="story">
                        <img
                          src="https://picsum.photos/537/352"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">1陪伴我們全家的最佳神隊友</h5>
                          <p class="story-content">
                            人生第一台車就獻給Custin！全家居住於台中，隻身一人工作於台北的遲先生，為了陪伴老婆與孩子，每周末都會開著Custin帶家人們出遊，享受甜蜜的家庭時光。
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 col-story">
                      <div class="story">
                        <img
                          src="https://picsum.photos/537/352"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            七人座MPV Custin A款交車，滿意!!
                          </h5>
                          <p class="story-content">
                            Custin就是載家人出遊、偶爾滿載、臨時載貨，至於1.5T渦輪引擎開這麼大台的車到底夠不夠力呢?一踩大扭力就出來，使用到目前覺得滿載也不會感受到重拖，順順開來個瞬間加速也夠超車，幾天下來目前是滿意的!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a
                class="carousel-control-prev"
                data-bs-target="#story_carousel"
                role="button"
                data-bs-slide="prev"
              >
                <img src="/assets/img/story_arrow_left.png" />
              </a>
              <a
                class="carousel-control-next"
                data-bs-target="#story_carousel"
                role="button"
                data-bs-slide="next"
              >
                <img src="/assets/img/story_arrow_right.png" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="story_carousel_mobile">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div id="story_carousel_title">
              <img src="/assets/img/story_title_mobile.png" alt="title" />
            </div>
            <div
              id="story_carousel_mobile_container"
              class="carousel slide"
              data-ride="carousel"
            >
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <div class="col-12 col-story">
                      <div class="story">
                        <img
                          src="https://picsum.photos/537/352"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            七人座MPV Custin A款交車，滿意!!
                          </h5>
                          <p class="story-content">
                            Custin就是載家人出遊、偶爾滿載、臨時載貨，至於1.5T渦輪引擎開這麼大台的車到底夠不夠力呢?一踩大扭力就出來，使用到目前覺得滿載也不會感受到重拖
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="carousel-item">
                  <div class="row">
                    <div class="col-12 col-story">
                      <div class="story">
                        <img
                          src="https://picsum.photos/537/352"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            七人座MPV Custin A款交車，滿意!!
                          </h5>
                          <p class="story-content">
                            Custin就是載家人出遊、偶爾滿載、臨時載貨，至於1.5T渦輪引擎開這麼大台的車到底夠不夠力呢?一踩大扭力就出來，使用到目前覺得滿載也不會感受到重拖，順順開來個瞬間加速也夠超車，幾天下來目前是滿意的!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="carousel-controls">
                <a
                  data-bs-target="#story_carousel_mobile_container"
                  role="button"
                  data-bs-slide="prev"
                >
                  <img src="/assets/img/story_arrow_left.png" />
                </a>
                <a
                  data-bs-target="#story_carousel_mobile_container"
                  role="button"
                  data-bs-slide="next"
                >
                  <img src="/assets/img/story_arrow_right.png" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="story_wall_pc">
      <div class="container">
        <div class="row">
          <div
            class="col-6 story-wall left"
            :class="animateClassLeft"
            @mouseover="animateClassLeft = 'pause'"
            @mouseout="animateClassLeft = ''"
          >
            <div class="row">
              <div class="col-6 story-wall-left left">
                <div class="row">
                  <div class="col-12">

                    <Vue3Marquee 
                      :vertical="true"
                      :pause-on-hover="true"
                      :clone="true"
                      :duration="20"

                    >
                      <div class="story" v-for="(story, index) in stories[0]" :key="index">
                        <img
                          :src="story.car_photo_path"
                          class="story-img"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_content }}
                        </div>
                      </div>
                    </Vue3Marquee>


                  </div>
                </div>
              </div>
              <div class="col-6 story-wall-left right">
                <div class="row">
                  <div class="col-12">
                    <Vue3Marquee 
                      :vertical="true"
                      :pause-on-hover="true"
                      :clone="true"
                      :duration="60"

                    >
                      <div class="story" v-for="(story, index) in stories[1]" :key="index">
                        <img
                          :src="story.car_photo_path"
                          class="story-img"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_content }}
                        </div>
                      </div>
                    </Vue3Marquee>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="col-6 story-wall right"
            :class="animateClassRight"
            @mouseover="animateClassRight = 'pause'"
            @mouseout="animateClassRight = ''"
          >
            <div class="row">
              <div class="col-6 story-wall-left left">
                <div class="row">
                  <div class="col-12">
                    <Vue3Marquee 
                      :vertical="true"
                      :pause-on-hover="true"
                      :clone="true"
                      :duration="40"
                    >
                      <div class="story" v-for="(story, index) in stories[2]" :key="index">
                        <img
                          :src="story.car_photo_path"
                          class="story-img"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_content }}
                        </div>
                      </div>
                    </Vue3Marquee>
                  </div>
                </div>
              </div>
              <div class="col-6 story-wall-right right">
                <div class="row">
                  <div class="col-12">
                    <Vue3Marquee 
                      :vertical="true"
                      :pause-on-hover="true"
                      :clone="true"
                      :duration="30"
                    >
                      <div class="story" v-for="(story, index) in stories[3]" :key="index">
                        <img
                          :src="story.car_photo_path"
                          class="story-img"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_content }}
                        </div>
                      </div>
                    </Vue3Marquee>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="story_wall_mobile">
      <div class="container">
        <div class="row">
          <div
            class="col-12 story-wall left"
            :class="animateClassLeft"
            @mouseover="animateClassLeft = 'pause'"
            @mouseout="animateClassLeft = ''"
          >
            <div class="row">
              <div class="col-6 story-wall-left left">
                <div class="row">
                  <div class="col-12">

                    <Vue3Marquee 
                      :vertical="true"
                      :pause-on-hover="true"
                      :clone="true"
                      :duration="20"

                    >
                      <div class="story" v-for="(story, index) in storiesMobile[0]" :key="index">
                        <img
                          :src="story.car_photo_path"
                          class="story-img"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_content }}
                        </div>
                      </div>
                    </Vue3Marquee>


                  </div>
                </div>
              </div>
              <div class="col-6 story-wall-left right">
                <div class="row">
                  <div class="col-12">


                      <Vue3Marquee 
                        :vertical="true"
                        :pause-on-hover="true"
                        :clone="true"
                        :duration="30"

                      >
                      <div class="story" v-for="(story, index) in storiesMobile[1]" :key="index">
                        <img
                          :src="story.car_photo_path"
                          class="story-img"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_content }}
                        </div>
                      </div>
                    </Vue3Marquee>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="story_share_pc">
      <p class="text-center"><img src="/assets/img/wall_title.png" /></p>
      <div class="story_share_container">
        <div class="story_share_row">
          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
              <span
                ><a href="https://google.com" target="_blank">[More]</a></span
              >
            </p>
          </div>

          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
              <span
                ><a href="https://google.com" target="_blank">[More]</a></span
              >
            </p>
          </div>
          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
              <span
                ><a href="https://google.com" target="_blank">[More]</a></span
              >
            </p>
          </div>
          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
              <span
                ><a href="https://google.com" target="_blank">[More]</a></span
              >
            </p>
          </div>
          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
              <span
                ><a href="https://google.com" target="_blank">[More]</a></span
              >
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="story_share_mobile">
      <p class="text-center" id="story_share_mobile_title">
        <img src="/assets/img/wall_title_mobile.png" />
      </p>
      <div class="story_share_container">
        <div class="story_share_row">
          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
            </p>
            <span class="story_share_link"
              ><a href="https://google.com" target="_blank">[More]</a></span
            >
          </div>

          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
            </p>
            <span class="story_share_link"
              ><a href="https://google.com" target="_blank">[More]</a></span
            >
          </div>

          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
            </p>
            <span class="story_share_link"
              ><a href="https://google.com" target="_blank">[More]</a></span
            >
          </div>

          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
            </p>
            <span class="story_share_link"
              ><a href="https://google.com" target="_blank">[More]</a></span
            >
          </div>

          <div class="story_share_col">
            <img src="https://picsum.photos/579/322" alt="..." />
            <p class="story_share_title">
              <a href="https://google.com" target="_blank">冠儀試車</a>
            </p>
            <p class="story_share_content">
              Custin轉眼之間也開了三個月啦！整理了一些心得感想，也把這台車的馬力以及使用之後的優缺點分享給大家，同時也跟大家分享整車最實用的一些配件，希望對想入手的你有幫助！
            </p>
            <span class="story_share_link"
              ><a href="https://google.com" target="_blank">[More]</a></span
            >
          </div>
        </div>
      </div>
    </section>

    <section id="champion_pc">
      <div class="row">
        <div class="col-7 champion_left">
          <img src="/assets/img/champion_title.png" class="champion_title" />
          <img src="/assets/img/champion_car_left.png" class="champion_car" />
          <div class="champion-action-list">
            <a
              ><img
                src="/assets/img/champion_testdrive.png"
                class="champion-action testdrive"
            /></a>
            <a
              ><img
                src="/assets/img/champion_order.png"
                class="champion-action order"
            /></a>
            <a
              ><img
                src="/assets/img/champion_more.png"
                class="champion-action more"
            /></a>
          </div>
        </div>
        <div class="col-5 champion_right">
          <img src="/assets/img/champion_right_1.png" />
          <p>前衛科技座艙</p>
          <img src="/assets/img/champion_right_2.png" />
          <p>感應式電動側滑門</p>
          <img src="/assets/img/champion_right_3.png" />
          <p>正七人座寬敞空間</p>
          <img src="/assets/img/champion_right_4.png" />
          <p>第二排VIP皇家座椅</p>
        </div>
      </div>
    </section>

    <section id="champion_mobile">
      <div class="row">
        <div class="col-12 champion_left">
          <img src="/assets/img/champion_title.png" class="champion_title" />
          <img src="/assets/img/champion_car_left.png" class="champion_car" />
        </div>
        <div class="col-12 champion_right">
          <img src="/assets/img/champion_right_1.png" />
          <p>前衛科技座艙</p>
          <img src="/assets/img/champion_right_2.png" />
          <p>感應式電動側滑門</p>
          <img src="/assets/img/champion_right_3.png" />
          <p>正七人座寬敞空間</p>
          <img src="/assets/img/champion_right_4.png" />
          <p>第二排VIP皇家座椅</p>

          <div class="champion-action-list">
            <a
              ><img
                src="/assets/img/champion_testdrive.png"
                class="champion-action testdrive"
            /></a>
            <a
              ><img
                src="/assets/img/champion_order.png"
                class="champion-action order"
            /></a>
            <a
              ><img
                src="/assets/img/champion_more.png"
                class="champion-action more"
            /></a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
