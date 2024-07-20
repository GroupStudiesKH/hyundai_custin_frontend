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

    <section id="story_wall">
      <div class="container">
        <div class="row">
          <div class="col-6 story-wall left">
            <div class="row">
              <div class="col-6 story-wall-left left">
                <div class="row">
                  <div class="col-12">
                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6 story-wall-left right">
                <div class="row">
                  <div class="col-12">
                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 story-wall right">
            <div class="row">
              <div class="col-6 story-wall-left left">
                <div class="row">
                  <div class="col-12">
                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6 story-wall-right right">
                <div class="row">
                  <div class="col-12">
                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>

                    <div class="story">
                      <img
                        src="https://picsum.photos/352/352"
                        class="story-img"
                        alt="..."
                      />
                      <div class="story-body">輕鬆駕馭城市街道或蜿蜒山路</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
