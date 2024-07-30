<script>
import { onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import { Vue3Marquee } from "vue3-marquee";

export default {
  components: {
    Vue3Marquee,
  },
  setup() {
    const router = useRouter();
    const animateClassLeft = ref("");
    const animateClassRight = ref("");
    const contentModalData = ref({ title: "", content: "" });
    const animatedNumber = ref(0);
    const stories = ref([[], [], [], []]);
    const storiesMobile = ref([[], []]);
    const runMobileMarquee = ref(false);
    const storiesForm = ref({
      car_owner_name: "",
      license_plate: "",
      contact_phone: "",
      contact_email: "",
      recommendation_title: "",
      recommendation_content: "",
      social_media_link: "",
      carPhotoUpload: null,
      ownerPhotoUpload: null,
    });
    const checkPolicy = ref(false);
    const owner_photo = ref(null);
    const car_photo = ref(null);
    const owner_photo_preview = ref(null);
    const car_photo_preview = ref(null);

    const formErros = ref({
      car_owner_name: "",
      license_plate: "",
      contact_phone: "",
      contact_email: "",
      recommendation_title: "",
      recommendation_content: "",
      social_media_link: "",
      carPhotoUpload: "",
      ownerPhotoUpload: "",
      checkPolicy: "",
    });

    let cleanupInterval;

    const triggerOwnerPhotoUpload = () => {
      owner_photo.value.click();
    };

    const triggerCarPhotoUpload = () => {
      car_photo.value.click();
    };

    const contentModalSetData = (title, content) => {
      contentModalData.value = {
        title,
        content,
      };
    };

    const animateNum = () => {
      const targetNumber = 10000;
      const duration = 5000;
      const stepTime = Math.abs(Math.floor(duration / targetNumber));

      const timer = setInterval(() => {
        animatedNumber.value += 10;
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

        storiesMobile.value = [results.slice(0, 10), results.slice(11, 20)];
      } catch (error) {
        console.log(error);
      }
    };

    const submitStory = async () => {
      try {
        if (!checkForm()) return;
        await apiService.postStories(storiesForm.value);
        alert("提交成功");

        //div id = closePostModal, closePostModal.click()
        const closePostModal = document.getElementById("closePostModal");
        closePostModal.click();
      } catch (error) {
        //check error is object
        if (typeof error === "object") {
          for (let key in error) {
            formErros.value[key] = error[key].join("<br>");
          }
        } else {
          alert("提交失敗");
        }
      }
    };

    const checkForm = () => {
      for (let key in storiesForm.value) {
        formErros.value[key] = "";
      }

      if (!checkPolicy.value) {
        formErros.value.checkPolicy = "請勾選同意";
      } else {
        formErros.value.checkPolicy = "";
      }

      return Object.values(formErros.value).every((error) => !error);
    };

    const handleCarPhotoChange = (event) => {
      storiesForm.value.carPhotoUpload = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        car_photo_preview.value = e.target.result;
      };

      if (!event.target.files[0]) {
        car_photo_preview.value = null;
        return;
      }

      reader.readAsDataURL(event.target.files[0]);
    };

    const handleOwnerPhotoChange = (event) => {
      storiesForm.value.ownerPhotoUpload = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        owner_photo_preview.value = e.target.result;
      };

      if (!event.target.files[0]) {
        owner_photo_preview.value = null;
        return;
      }

      reader.readAsDataURL(event.target.files[0]);
    };

    const cleanupClonedElements = () => {
      const childrenPC1 = document.querySelectorAll(".story-pc1");
      const childrenPC2 = document.querySelectorAll(".story-pc2");
      const childrenPC3 = document.querySelectorAll(".story-pc3");
      const childrenPC4 = document.querySelectorAll(".story-pc4");
      const childrenMobile1 = document.querySelectorAll(".story-mobile1");
      const childrenMobile2 = document.querySelectorAll(".story-mobile2");
      if (childrenPC1.length > 10) {
        for (let i = 10; i < childrenPC1.length; i++) {
          childrenPC1[i].remove();
        }
      }

      if (childrenPC2.length > 10) {
        for (let i = 10; i < childrenPC2.length; i++) {
          childrenPC2[i].remove();
        }
      }

      if (childrenPC3.length > 10) {
        for (let i = 10; i < childrenPC3.length; i++) {
          childrenPC3[i].remove();
        }
      }

      if (childrenPC4.length > 10) {
        for (let i = 10; i < childrenPC4.length; i++) {
          childrenPC4[i].remove();
        }
      }

      if (childrenMobile1.length > 20) {
        for (let i = 20; i < childrenMobile1.length; i++) {
          childrenMobile1[i].remove();
        }
      }

      if (childrenMobile2.length > 20) {
        for (let i = 20; i < childrenMobile2.length; i++) {
          childrenMobile2[i].remove();
        }
      }
    };

    onBeforeUnmount(() => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    });

    onMounted(() => {
      animateNum();
      getStories();

      //detect is 1280px or not
      const is1280 = window.matchMedia("(max-width: 1280px)");
      runMobileMarquee.value = is1280.matches;

      cleanupInterval = setInterval(cleanupClonedElements, 5000); // 每5秒清理一次

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
      storiesMobile,
      runMobileMarquee,
      contentModalData,
      contentModalSetData,
      storiesForm,
      submitStory,
      formErros,
      checkPolicy,
      triggerOwnerPhotoUpload,
      triggerCarPhotoUpload,
      car_photo,
      owner_photo,
      handleCarPhotoChange,
      handleOwnerPhotoChange,
      owner_photo_preview,
      car_photo_preview,
    };
  },
};
</script>

<template>
  <main>
    <section id="banner_pc">
      <div class="container">
        <div class="logo col-12">
          <img src="/assets/img/banner_logo.webp" alt="logo" />
        </div>
        <div class="car col-12">
          <span class="animatedNumber">{{ animatedNumber }}</span>
          <img src="/assets/img/banner_car.webp" alt="logo" />
        </div>
      </div>
    </section>
    <section id="banner_mobile">
      <div class="container">
        <div class="logo col-12">
          <img src="/assets/img/banner_logo_mobile.webp" alt="logo" />
        </div>
        <div class="car col-12">
          <img src="/assets/img/banner_car.webp" alt="logo" />
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
      <div
        class="text-center post_btn"
        data-bs-toggle="modal"
        data-bs-target="#postModal"
      >
        <img src="/assets/img/post_btn.webp" alt="enter" />
      </div>
    </section>
    <section id="page_intro_mobile">
      <div class="container"></div>
      <div
        class="text-center post_btn"
        data-bs-toggle="modal"
        data-bs-target="#postModal"
      >
        <img src="/assets/img/post_btn.webp" alt="enter" />
      </div>
    </section>

    <section id="story_carousel_pc">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div id="story_carousel_title">
              <img src="/assets/img/story_title.webp" alt="title" />
            </div>
            <div
              id="story_carousel"
              class="carousel slide"
              data-ride="carousel"
            >
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <div
                      class="col-6 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          'CUSTIN驚艷體驗:舒適實用家庭',
                          `<img src='/assets/img/temp/01.webp' class='story-img' alt='...'/><br>我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身流線、大器的車頭霸氣設計以及尾燈也很醒目的事尾，都是目前流行的設計元素。整體給我的感覺就是很前衛有型。我也很喜歡它的駕駛座，直立的主機螢幕加上按鍵式排檔，使用上非常直覺便利。<br>
                            但內裝的部分才是讓我決定成為車主的最大原因，VIP皇家座椅第二排座椅、電動滑門、超大雙天窗，真的讓我出乎意料，CUSTIN通通都有，重點是第二排座椅竟然還有通風加熱功能，配備給的實在不手軟！<br>
                            有時候如果要去露營或野餐，要載東西的時候，行李箱空間也很夠用，還有搭配電動尾門，簡直不要太方便。<br>
                            每次看到兩老坐在第二排舒服的享受，小朋友因為天窗打開看見天空而興奮歡呼，都讓我非常有成就感，CUSTIN就像是讓我的心聲一樣，準備很多高級貼心的功能，幫我把家人都照顧得好好的。`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/01.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            CUSTIN驚艷體驗:舒適實用家庭
                          </h5>
                          <p class="story-content">
                            我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身流線、大器的車頭霸氣設計以及尾燈也很醒目的事尾，都是目前流行的設計元素。整體給我的感覺就是很前衛有型。...
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-6 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          '魔法滑門：CUSTIN親子樂趣多',
                          `<img src='/assets/img/temp/02.webp' class='story-img' alt='...'/><br><p>我們家的兩個小朋友，最喜歡的就是CUSTIN的電動側滑門，因為剛換車的時候，我跟他們開了一個小玩笑，讓他們站在車門前大喊「魔法開開」，我在一旁偷偷用鑰匙遙控開啟，他們看著滑門慢慢滑開興奮得驚呼連連。</p>
<p>後來當然還是知道了這個咒語的秘密，但每當我們準備出發，小朋友們還是會興奮地跑到車前高喊「魔法開開」，然後看著車門自動打開，再開心地跳上車，我跟老婆都會心一笑。這個習慣成為了我們每次出遊前的小小儀式，這種互動不僅增加了樂趣，也讓孩子們更加期待每一次的旅行。</p>
<p>當然車子本身各方面的表現都很優秀，老婆也很喜歡，但我更滿意的是一家人在車上開開心心的樣子，CUSTIN和我們一起度過了很多美好時光。</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/02.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            魔法滑門：CUSTIN親子樂趣多
                          </h5>
                          <p class="story-content">
                            我們家的兩個小朋友，最喜歡的就是CUSTIN的電動側滑門，因為剛換車的時候，我跟他們開了一個小玩笑，讓他們站在車門前大喊「魔法開開」，我在一旁偷偷用鑰匙遙控開啟，他們看著滑門慢慢滑開興奮得驚呼連連。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="carousel-item">
                  <div class="row">
                    <div
                      class="col-6 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          'CUSTIN暖心座駕：全家舒適出行',
                          `<img src='/assets/img/temp/03.webp' class='story-img' alt='...'/><br>
                          <p>我爸媽上了年紀後，行動變得沒那麼靈活，原本的車子對他們來說上下車不太方便，坐久了也會有身體痠痛的問題，因緣際會之下看到了CUSTIN，便帶著他們一起去看車。</p>
<p>看車當下，他們比較保守，一坐進去，雖然口頭上沒有說，但從他們的放鬆的姿勢跟表情，我就能感受的出來他們的滿意，電動側滑門跟第二排座椅，完完全全就是我要的。</p>
<p>一開始其實會擔心車子比較大台，會不會不好開，因為我主要是上班通勤或接送家人，只有假日偶爾才會出去玩，大部分時間都是在市區跑。但實際開起來，我覺得整個視野很寬闊，而且A柱那邊還有一個三角窗，減少了很多死角，再加上有SVM環景功能，停車的時候也不用擔心不熟悉的環境，還有其他很多的安全輔助科技，給我滿滿的安全感。</p>
<p>老婆跟小孩也對這台車很喜歡，更讓我覺得開心的是，我爸媽以前總會嫌麻煩，現在變得比較願意出門了。</p>
                          
                          `
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/03.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            CUSTIN暖心座駕：全家舒適出行
                          </h5>
                          <p class="story-content">
                            我爸媽上了年紀後，行動變得沒那麼靈活，原本的車子對他們來說上下車不太方便，坐久了也會有身體痠痛的問題，因緣際會之下看到了CUSTIN，便帶著他們一起去看車。
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-6 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          '全家滿意的選擇：CUSTIN的豐富配備與貼心設計',
                          `<img src='/assets/img/temp/04.webp' class='story-img' alt='...'/><br><p>當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！</p>
<p>當初試過後就被他的豐富配備給吸引，尤其是第二排座椅跟電動滑門，不敢相信在這個價位可以做到這樣。除此之外車內也有很多貼心的小細節，比如說第二排遮陽簾、折疊桌板，甚至還有杯架跟平板架，就像是在搭飛機一樣，就連第三排也有獨立的冷氣出風口跟USB充電孔，小朋友在後面也坐的很舒服。</p>
<p>開著CUSTIN載全家人出去後，大家對它的評價都非常高，覺得這是一台很舒適享受的車，每個位置都可以感受到CUSTIN有在用心替乘客著想，我自己也很高興可以買到一台讓全家人都滿意的車！</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/04.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            全家滿意的選擇：CUSTIN的豐富配備與貼心設計
                          </h5>
                          <p class="story-content">
                            當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！
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
                <img src="/assets/img/story_arrow_left.webp" />
              </a>
              <a
                class="carousel-control-next"
                data-bs-target="#story_carousel"
                role="button"
                data-bs-slide="next"
              >
                <img src="/assets/img/story_arrow_right.webp" />
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
              <img src="/assets/img/story_title_mobile.webp" alt="title" />
            </div>
            <div
              id="story_carousel_mobile_container"
              class="carousel slide"
              data-ride="carousel"
            >
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <div
                      class="col-12 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          'CUSTIN驚艷體驗:舒適實用家庭',
                          `<img src='/assets/img/temp/01.webp' class='story-img' alt='...'/><br>我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身流線、大器的車頭霸氣設計以及尾燈也很醒目的事尾，都是目前流行的設計元素。整體給我的感覺就是很前衛有型。我也很喜歡它的駕駛座，直立的主機螢幕加上按鍵式排檔，使用上非常直覺便利。<br>
                            但內裝的部分才是讓我決定成為車主的最大原因，VIP皇家座椅第二排座椅、電動滑門、超大雙天窗，真的讓我出乎意料，CUSTIN通通都有，重點是第二排座椅竟然還有通風加熱功能，配備給的實在不手軟！<br>
                            有時候如果要去露營或野餐，要載東西的時候，行李箱空間也很夠用，還有搭配電動尾門，簡直不要太方便。<br>
                            每次看到兩老坐在第二排舒服的享受，小朋友因為天窗打開看見天空而興奮歡呼，都讓我非常有成就感，CUSTIN就像是讓我的心聲一樣，準備很多高級貼心的功能，幫我把家人都照顧得好好的。`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/01.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            CUSTIN驚艷體驗:舒適實用家庭
                          </h5>
                          <p class="story-content">
                            我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身流線、大器的車頭霸氣設計以及尾燈也很醒目的事尾，都是目前流行的設計元素。整體給我的感覺就是很前衛有型。...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="carousel-item">
                  <div class="row">
                    <div
                      class="col-12 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          '魔法滑門：CUSTIN親子樂趣多',
                          `<img src='/assets/img/temp/02.webp' class='story-img' alt='...'/><br><p>我們家的兩個小朋友，最喜歡的就是CUSTIN的電動側滑門，因為剛換車的時候，我跟他們開了一個小玩笑，讓他們站在車門前大喊「魔法開開」，我在一旁偷偷用鑰匙遙控開啟，他們看著滑門慢慢滑開興奮得驚呼連連。</p>
<p>後來當然還是知道了這個咒語的秘密，但每當我們準備出發，小朋友們還是會興奮地跑到車前高喊「魔法開開」，然後看著車門自動打開，再開心地跳上車，我跟老婆都會心一笑。這個習慣成為了我們每次出遊前的小小儀式，這種互動不僅增加了樂趣，也讓孩子們更加期待每一次的旅行。</p>
<p>當然車子本身各方面的表現都很優秀，老婆也很喜歡，但我更滿意的是一家人在車上開開心心的樣子，CUSTIN和我們一起度過了很多美好時光。</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/02.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            魔法滑門：CUSTIN親子樂趣多
                          </h5>
                          <p class="story-content">
                            我們家的兩個小朋友，最喜歡的就是CUSTIN的電動側滑門，因為剛換車的時候，我跟他們開了一個小玩笑，讓他們站在車門前大喊「魔法開開」，我在一旁偷偷用鑰匙遙控開啟，他們看著滑門慢慢滑開興奮得驚呼連連。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="carousel-item">
                  <div class="row">
                    <div
                      class="col-12 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          'CUSTIN暖心座駕：全家舒適出行',
                          `<img src='/assets/img/temp/03.webp' class='story-img' alt='...'/><br>
                          <p>我爸媽上了年紀後，行動變得沒那麼靈活，原本的車子對他們來說上下車不太方便，坐久了也會有身體痠痛的問題，因緣際會之下看到了CUSTIN，便帶著他們一起去看車。</p>
<p>看車當下，他們比較保守，一坐進去，雖然口頭上沒有說，但從他們的放鬆的姿勢跟表情，我就能感受的出來他們的滿意，電動側滑門跟第二排座椅，完完全全就是我要的。</p>
<p>一開始其實會擔心車子比較大台，會不會不好開，因為我主要是上班通勤或接送家人，只有假日偶爾才會出去玩，大部分時間都是在市區跑。但實際開起來，我覺得整個視野很寬闊，而且A柱那邊還有一個三角窗，減少了很多死角，再加上有SVM環景功能，停車的時候也不用擔心不熟悉的環境，還有其他很多的安全輔助科技，給我滿滿的安全感。</p>
<p>老婆跟小孩也對這台車很喜歡，更讓我覺得開心的是，我爸媽以前總會嫌麻煩，現在變得比較願意出門了。</p>
                          
                          `
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/03.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            CUSTIN暖心座駕：全家舒適出行
                          </h5>
                          <p class="story-content">
                            我爸媽上了年紀後，行動變得沒那麼靈活，原本的車子對他們來說上下車不太方便，坐久了也會有身體痠痛的問題，因緣際會之下看到了CUSTIN，便帶著他們一起去看車。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="carousel-item">
                  <div class="row">
                    <div
                      class="col-12 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#contentModal"
                      @click="
                        contentModalSetData(
                          '全家滿意的選擇：CUSTIN的豐富配備與貼心設計',
                          `<img src='/assets/img/temp/04.webp' class='story-img' alt='...'/><br><p>當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！</p>
<p>當初試過後就被他的豐富配備給吸引，尤其是第二排座椅跟電動滑門，不敢相信在這個價位可以做到這樣。除此之外車內也有很多貼心的小細節，比如說第二排遮陽簾、折疊桌板，甚至還有杯架跟平板架，就像是在搭飛機一樣，就連第三排也有獨立的冷氣出風口跟USB充電孔，小朋友在後面也坐的很舒服。</p>
<p>開著CUSTIN載全家人出去後，大家對它的評價都非常高，覺得這是一台很舒適享受的車，每個位置都可以感受到CUSTIN有在用心替乘客著想，我自己也很高興可以買到一台讓全家人都滿意的車！</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/temp/04.webp"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            全家滿意的選擇：CUSTIN的豐富配備與貼心設計
                          </h5>
                          <p class="story-content">
                            當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！
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
                  <img src="/assets/img/story_arrow_left.webp" />
                </a>
                <a
                  data-bs-target="#story_carousel_mobile_container"
                  role="button"
                  data-bs-slide="next"
                >
                  <img src="/assets/img/story_arrow_right.webp" />
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
                      v-if="!runMobileMarquee"
                    >
                      <div
                        class="story story-pc1"
                        v-for="(story, index) in stories[0]"
                        :key="index"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            `<img src='${story.car_photo_path}' class='story-img' alt='...'/><br>${story.recommendation_content}`
                          )
                        "
                      >
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
                      v-if="!runMobileMarquee"
                    >
                      <div
                        class="story-pc2 story"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            `<img src='${story.car_photo_path}' class='story-img' alt='...'/><br>${story.recommendation_content}`
                          )
                        "
                        v-for="(story, index) in stories[1]"
                        :key="index"
                      >
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
                      v-if="!runMobileMarquee"
                    >
                      <div
                        class="story story-pc3"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            `<img src='${story.car_photo_path}' class='story-img' alt='...'/><br>${story.recommendation_content}`
                          )
                        "
                        v-for="(story, index) in stories[2]"
                        :key="index"
                      >
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
                      v-if="!runMobileMarquee"
                    >
                      <div
                        class="story story-pc4"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            `<img src='${story.car_photo_path}' class='story-img' alt='...'/><br>${story.recommendation_content}`
                          )
                        "
                        v-for="(story, index) in stories[3]"
                        :key="index"
                      >
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
                      v-if="runMobileMarquee"
                    >
                      <div
                        class="story story-mobile1"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            `<img src='${story.car_photo_path}' class='story-img' alt='...'/><br>${story.recommendation_content}`
                          )
                        "
                        v-for="(story, index) in storiesMobile[0]"
                        :key="index"
                      >
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
                      v-if="runMobileMarquee"
                    >
                      <div
                        class="story story-mobile2"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            `<img src='${story.car_photo_path}' class='story-img' alt='...'/><br>${story.recommendation_content}`
                          )
                        "
                        v-for="(story, index) in storiesMobile[1]"
                        :key="index"
                      >
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
      <p class="text-center"><img src="/assets/img/wall_title.webp" /></p>
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

    <div
      class="modal fade"
      id="contentModal"
      tabindex="-1"
      aria-labelledby="contentModalTitle"
      aria-hidden="true"
      style="display: none; background-color: rgb(173, 205, 221, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="contentModalTitle">
              <img src="/assets/img/tape.webp" />
              {{ contentModalData.title }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-html="contentModalData.content"></div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="postModal"
      tabindex="-1"
      aria-labelledby="postModalTitle"
      aria-hidden="true"
      style="display: none; background-color: rgb(173, 205, 221, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="closePostModal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <div class="post_title">
                    <img src="/assets/img/post_modal_title.webp" alt="post" />
                  </div>
                </div>
                <div class="col-12 col-lg-6 post-form">
                  <div class="form-group">
                    <label for="car_owner_name">車主姓名</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErros.car_owner_name }"
                      id="car_owner_name"
                      placeholder="請填寫車主本人姓名"
                      v-model="storiesForm.car_owner_name"
                    />
                    <span
                      class="invalid-feedback"
                      v-if="formErros.car_owner_name"
                      v-html="formErros.car_owner_name"
                    ></span>
                  </div>
                  <div class="form-group">
                    <label for="contact_phone">車主聯絡電話</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErros.contact_phone }"
                      id="contact_phone"
                      placeholder="請填寫車主聯絡電話"
                      v-model="storiesForm.contact_phone"
                    />
                    <span
                      class="invalid-feedback"
                      v-if="formErros.contact_phone"
                      v-html="formErros.contact_phone"
                    ></span>
                  </div>
                  <div class="form-group">
                    <label for="contact_email">車主聯絡E-Mail</label>
                    <input
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': formErros.contact_email }"
                      id="contact_email"
                      placeholder="請填寫車主聯絡E-Mail"
                      v-model="storiesForm.contact_email"
                    />
                    <span
                      class="invalid-feedback"
                      v-if="formErros.contact_email"
                      v-html="formErros.contact_email"
                    ></span>
                  </div>
                  <div class="form-group">
                    <label for="license_plate">車牌號碼</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErros.license_plate }"
                      id="license_plate"
                      v-model="storiesForm.license_plate"
                      placeholder="請填寫車牌號碼"
                    />
                    <span
                      class="invalid-feedback"
                      v-if="formErros.license_plate"
                      v-html="formErros.license_plate"
                    ></span>
                  </div>
                  <div class="form-group">
                    <label for="recommendation_title">故事標題</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErros.recommendation_title }"
                      id="recommendation_title"
                      placeholder="請填寫故事標題"
                      v-model="storiesForm.recommendation_title"
                    />
                    <span
                      class="invalid-feedback"
                      v-if="formErros.recommendation_title"
                      v-html="formErros.recommendation_title"
                    ></span>
                  </div>
                  <div class="form-group">
                    <label for="recommendation_content"
                      >故事分享（上限300字）</label
                    >
                    <textarea
                      class="form-control"
                      id="recommendation_content"
                      :class="{
                        'is-invalid': formErros.recommendation_content,
                      }"
                      rows="6"
                      placeholder="請填寫您的故事"
                      v-model="storiesForm.recommendation_content"
                    ></textarea>
                    <span
                      class="invalid-feedback"
                      v-if="formErros.recommendation_content"
                      v-html="formErros.recommendation_content"
                    ></span>
                  </div>
                </div>
                <div class="col-12 col-lg-6 post-form">
                  <div class="form-group">
                    <p class="mb-1 pb-1">
                      CUSTIN愛車照 (需呈現車牌號碼，供驗證車牌用)
                    </p>
                    <label id="car_photo_label" @click="triggerCarPhotoUpload"
                      >愛車照片上傳</label
                    >
                    <input
                      type="file"
                      class="form-control"
                      id="car_photo"
                      ref="car_photo"
                      :class="{ 'is-invalid': formErros.carPhotoUpload }"
                      accept="image/*"
                      @change="handleCarPhotoChange($event)"
                    />
                    <div v-if="car_photo_preview" class="image-preview mt-3">
                      <img
                        :src="car_photo_preview"
                        alt="預覽圖片"
                        class="img-fluid"
                        style="max-width: 150px"
                      />
                    </div>
                    <span
                      class="invalid-feedback"
                      v-if="formErros.carPhotoUpload"
                      v-html="formErros.carPhotoUpload"
                    ></span>
                  </div>
                  <div class="form-group mt-3">
                    <p class="mb-1 pb-1">與CUSTIN的生活照或影片(擇一上傳)</p>
                    <label
                      id="owner_photo_label"
                      @click="triggerOwnerPhotoUpload"
                      >生活照上傳</label
                    >
                    <input
                      type="file"
                      class="form-control"
                      id="owner_photo"
                      ref="owner_photo"
                      :class="{ 'is-invalid': formErros.ownerPhotoUpload }"
                      accept="image/*"
                      @change="handleOwnerPhotoChange($event)"
                    />
                    <div v-if="owner_photo_preview" class="image-preview mt-3">
                      <img
                        :src="owner_photo_preview"
                        alt="預覽圖片"
                        class="img-fluid"
                        style="max-width: 150px"
                      />
                    </div>
                    <span
                      class="invalid-feedback"
                      v-if="formErros.ownerPhotoUpload"
                      v-html="formErros.ownerPhotoUpload"
                    ></span>
                  </div>
                  <div class="form-group mt-3">
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErros.social_media_link }"
                      id="social_media_link"
                      placeholder="影片上傳，請輸入FB、IG之影片貼文連結"
                      v-model="storiesForm.social_media_link"
                    />
                    <span
                      class="invalid-feedback"
                      v-if="formErros.social_media_link"
                      v-html="formErros.social_media_link"
                    ></span>
                  </div>
                  <p class="photo_rule">
                    *照片格式：JPG、PNG <br />
                    *檔案大小限制：5MB以下 <br />
                    *圖片尺寸：具有1280x720的解析度，寬度至少為 40像素
                    (手機皆可拍出符合上述標準之作品)<br />
                    *影片分享請先上傳自各人社群平台(FB或IG)，並將
                    該貼文設置為公開後提供連結
                  </p>
                  <div class="form-group">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      v-model="checkPolicy"
                      :class="{ 'is-invalid': formErros.checkPolicy }"
                    />
                    <span class="agree_text">
                      我已閱讀並同意接受蒐集、處理及利用個人資料告知暨同意書內容</span
                    >
                    <span
                      class="invalid-feedback"
                      v-if="formErros.checkPolicy"
                      v-html="formErros.checkPolicy"
                    ></span>
                  </div>
                  <div
                    class="text-left post_modal_submit_btn"
                    @click="submitStory()"
                  >
                    <img src="/assets/img/post_btn.webp" alt="enter" />
                  </div>
                </div>
                <div class="col-12 rule-text pt-3">
                  <h4>/活動辦法/</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum. Sed ut perspiciatis
                    unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
                    illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                    voluptas sit aspernatur aut odit aut fugit, sed quia
                    consequuntur magni dolores eos qui ratione voluptatem sequi
                    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia
                    dolor sit amet, consectetur, adipisci velit, sed quia non
                    numquam eius modi tempora incidunt ut labore et dolore
                    magnam aliquam quaerat voluptatem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section id="story_share_mobile">
      <p class="text-center" id="story_share_mobile_title">
        <img src="/assets/img/wall_title_mobile.webp" />
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
          <img src="/assets/img/champion_title.webp" class="champion_title" />
          <img src="/assets/img/champion_car_left.webp" class="champion_car" />
          <div class="champion-action-list">
            <a
              ><img
                src="/assets/img/champion_testdrive.webp"
                class="champion-action testdrive"
            /></a>
            <a
              ><img
                src="/assets/img/champion_order.webp"
                class="champion-action order"
            /></a>
            <a
              ><img
                src="/assets/img/champion_more.webp"
                class="champion-action more"
            /></a>
          </div>
        </div>
        <div class="col-5 champion_right">
          <img src="/assets/img/champion_right_1.webp" />
          <p>前衛科技座艙</p>
          <img src="/assets/img/champion_right_2.webp" />
          <p>感應式電動側滑門</p>
          <img src="/assets/img/champion_right_3.webp" />
          <p>正七人座寬敞空間</p>
          <img src="/assets/img/champion_right_4.webp" />
          <p>第二排VIP皇家座椅</p>
        </div>
      </div>
    </section>

    <section id="champion_mobile">
      <div class="row">
        <div class="col-12 champion_left">
          <img src="/assets/img/champion_title.webp" class="champion_title" />
          <img src="/assets/img/champion_car_left.webp" class="champion_car" />
        </div>
        <div class="col-12 champion_right">
          <img src="/assets/img/champion_right_1.webp" />
          <p>前衛科技座艙</p>
          <img src="/assets/img/champion_right_2.webp" />
          <p>感應式電動側滑門</p>
          <img src="/assets/img/champion_right_3.webp" />
          <p>正七人座寬敞空間</p>
          <img src="/assets/img/champion_right_4.webp" />
          <p>第二排VIP皇家座椅</p>

          <div class="champion-action-list">
            <a
              ><img
                src="/assets/img/champion_testdrive.webp"
                class="champion-action testdrive"
            /></a>
            <a
              ><img
                src="/assets/img/champion_order.webp"
                class="champion-action order"
            /></a>
            <a
              ><img
                src="/assets/img/champion_more.webp"
                class="champion-action more"
            /></a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
