<script>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import { Vue3Marquee } from "vue3-marquee";

export default {
  components: {
    Vue3Marquee,
  },
  setup() {
    const router = useRouter();
    const storyModalData = ref({ title: "", content: ""});
    const contentModalData = ref({ title: "", content: "", img_url: "", social_media_link: "" });
    const contentModalYTOpened = ref(false)
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
      ownerPhoto2Upload: null
    });
    const checkPolicy = ref(false);
    const owner_photo = ref(null);
    const owner_photo2 = ref(null);
    const car_photo = ref(null);
    const owner_photo_preview = ref(null);
    const owner_photo2_preview = ref(null);
    const car_photo_preview = ref(null);
    const randomSpeedMobileLeft = ref(60);
    const randomSpeedMobileRight = ref(60);
    const randomSpeedPCLeft1 = ref(40);
    const randomSpeedPCLeft2 = ref(40);
    const randomSpeedPCRight1 = ref(40);
    const randomSpeedPCRight2 = ref(40);
    const menuVisible = ref(false);
    const toggleMenu = () => {
      menuVisible.value = !menuVisible.value;
    }

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
      ownerPhotoUpload2: "",
      checkPolicy: "",
    });

    let cleanupInterval;

    const triggerOwnerPhotoUpload = () => {
      owner_photo.value.click();
    };

    const triggerOwnerPhoto2Upload = () => {
      owner_photo2.value.click();
    };

    const triggerCarPhotoUpload = () => {
      car_photo.value.click();
    };

    const youtubeEmbedUrl = ref("");

    const contentModalSetData = (title, img_url, content, social_media_link = ``) => {
      contentModalData.value = {
        title: title,
        content: content,
        img_url: img_url,
        social_media_link: social_media_link
      };

      if(social_media_link.length > 0){
        if (social_media_link.includes("youtube")) {
          contentModalData.value.social_media_link = `https://www.youtube.com/embed/${new URL(social_media_link).searchParams.get('v')}`;
        }
      }


    };
    const storyModalSetData = (title, content) => {
      storyModalData.value = {
        title,
        content,
      };
    };
    const animateNum = () => {
      const targetNumber = 11565;
      const duration = 5000;
      const stepTime = Math.abs(Math.floor(duration / targetNumber));
      const slowDownPoint = 9000;
      const slowDownFactor = 50;

      const timer = setInterval(() => {
        animatedNumber.value += slowDownFactor;

      if (animatedNumber.value >= targetNumber) {
        animatedNumber.value = targetNumber;
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

        const formCheck = checkForm()

        if (formCheck){
          await apiService.postStories(storiesForm.value);
          alert("提交成功");

          //div id = closePostModal, closePostModal.click()
          const closePostModal = document.getElementById("closePostModal");
          closePostModal.click();
        }else{
          console.log(formErros.value)
        }

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
      for (let key in formErros.value) {
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

    const handleOwnerPhoto2Change = (event) => {
      storiesForm.value.ownerPhoto2Upload = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        owner_photo2_preview.value = e.target.result;
      };

      if (!event.target.files[0]) {
        owner_photo2_preview.value = null;
        return;
      }

      reader.readAsDataURL(event.target.files[0]);
    };

    const scrollTo = (elementID) => {
      let targetDiv = document.getElementById(elementID);
      if (targetDiv) {
        targetDiv.scrollIntoView({ behavior: 'smooth' });
        menuVisible.value = false
      }
    };

    const cleanupClonedElements = () => {
      const childrenPC1 = document.querySelectorAll(".story-pc1");
      const childrenPC2 = document.querySelectorAll(".story-pc2");
      const childrenPC3 = document.querySelectorAll(".story-pc3");
      const childrenPC4 = document.querySelectorAll(".story-pc4");
      const childrenMobile1 = document.querySelectorAll(
        ".story-mobile1 .marquee.cloned"
      );
      const childrenMobile2 = document.querySelectorAll(
        ".story-mobile2 .marquee.cloned"
      );
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

      if (childrenMobile1.length > 2) {
        for (let i = 2; i < childrenMobile1.length; i++) {
          childrenMobile1[i].remove();
        }
      }

      if (childrenMobile2.length > 2) {
        for (let i = 2; i < childrenMobile2.length; i++) {
          childrenMobile2[i].remove();
        }
      }
    };

    onBeforeUnmount(() => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    });

    watch(menuVisible, (newValue) => {
      if (newValue) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    });

    onMounted(() => {

      window.onload = function () {
        animateNum();

        const modal = document.getElementById('contentModal');

        // 定義一個函數來停止YouTube影片
        function stopVideo() {
          const iframe = modal.querySelector('iframe');
          contentModalYTOpened.value = false
          if (iframe) {
            const src = iframe.getAttribute('src');
            iframe.setAttribute('src', '');
            iframe.setAttribute('src', src);
          }
        }

        // 監聽modal關閉事件
        // 注意: 這裡的事件名稱可能需要根據你使用的modal庫來調整
        modal.addEventListener('hidden.bs.modal', stopVideo);

      };

      getStories();

      // detect is safari or not
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari || true) {
        //temporary
        setTimeout(() => {
          randomSpeedMobileLeft.value += Math.random() > 0.5 ? 1 : -1;
          randomSpeedMobileRight.value += Math.random() > 0.5 ? 1 : -1;
          randomSpeedPCLeft1.value += Math.random() > 0.5 ? 1 : -1;
          randomSpeedPCLeft2.value += Math.random() > 0.5 ? 1 : -1;
          randomSpeedPCRight1.value += Math.random() > 0.5 ? 1 : -1;
          randomSpeedPCRight2.value += Math.random() > 0.5 ? 1 : -1;
        }, 1500);
      }

      //detect is 991px or not
      const is991 = window.matchMedia("(max-width: 991px)");
      runMobileMarquee.value = is991.matches;
      if(runMobileMarquee.value){
        cleanupInterval = setInterval(cleanupClonedElements, 2500); // 每5秒清理一次
      }else{
        cleanupInterval = setInterval(cleanupClonedElements, 5000); // 每5秒清理一次
      }

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

      // 為 story_wall_pc 的箭頭添加點擊事件
      const storyWallUpArrow = document.querySelector('#story_wall_pc .arrow_up');
      const storyWallDownArrow = document.querySelector('#story_wall_pc .arrow_down');
      const storyWall = document.querySelector('#story_wall_pc');
      const storyWallMobile = document.querySelector('#story_wall_mobile');
      const storyWallMobileUpArrow = document.querySelector('#story_wall_mobile .arrow_up');
      const storyWallMobileArrow = document.querySelector('#story_wall_mobile .arrow_down');
        
        if (storyWallUpArrow) {
          storyWallUpArrow.addEventListener('click', () => {
            console.log(123)
            if (storyWall) {
              storyWall.scrollBy({
                top: -100,
                behavior: 'smooth'
              });
            }
          });
        }

        if (storyWallMobileUpArrow) {
          storyWallMobileUpArrow.addEventListener('click', () => {
            if (storyWallMobile) {
              storyWallMobile.scrollBy({
                top: -100,
                behavior:'smooth'
              });
            }
          });
        }
        
        if (storyWallDownArrow) {
          storyWallDownArrow.addEventListener('click', () => {
            if (storyWall) {
              storyWall.scrollBy({
                top: 100,
                behavior: 'smooth'
              });
            }
          });
        }

        if (storyWallMobileArrow) {
          storyWallMobileArrow.addEventListener('click', () => {
            if (storyWallMobile) {
              storyWallMobile.scrollBy({
                top: 100,
                behavior:'smooth'
              });
            }
          });
        }
    });

    return {
      animatedNumber,
      stories,
      storiesMobile,
      runMobileMarquee,
      contentModalData,
      contentModalSetData,
      contentModalYTOpened,
      storyModalData,
      storyModalSetData,
      storiesForm,
      submitStory,
      formErros,
      checkPolicy,
      triggerOwnerPhotoUpload,
      triggerOwnerPhoto2Upload,
      triggerCarPhotoUpload,
      car_photo,
      owner_photo,
      owner_photo2,
      handleCarPhotoChange,
      handleOwnerPhotoChange,
      handleOwnerPhoto2Change,
      owner_photo_preview,
      owner_photo2_preview,
      car_photo_preview,
      randomSpeedMobileLeft,
      randomSpeedMobileRight,
      randomSpeedPCLeft1,
      randomSpeedPCLeft2,
      randomSpeedPCRight1,
      randomSpeedPCRight2,
      scrollTo,
      toggleMenu,
      menuVisible
    };
  },
};
</script>
<template>
  <main>
    <div class="menuMask" v-if="menuVisible"></div>
    <section id="banner_pc" ref="banner_pc">
      <div class="container">
        <div class="logo col-12">
          <img src="/assets/img/banner_logo.webp" loading="lazy" alt="logo" />
        </div>
        <div class="car col-12">
          <span class="animatedNumber">{{ animatedNumber }}</span>
          <img src="/assets/img/banner_car.webp" loading="lazy" alt="logo" />
        </div>
      </div>
    </section>
    <section id="banner_mobile" ref="banner_mobile">
      <div class="container">

        <div>

          <div class="nav-btn" @click="toggleMenu">
            <img src="/assets/img/nav_btn.webp">
          </div>

          <div
            :class="menuVisible ? 'show' : ''"
            class="offcanvas offcanvas-end"
            tabindex="-1"
            style="visibility: visible;"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title">Menu</h5>
              <button type="button" class="btn-close" @click="toggleMenu"></button>
            </div>
            <div class="offcanvas-body">
              <div class="menu-list" @click="scrollTo('page_intro_mobile')">故事募集中</div>
              <div class="menu-list" @click="scrollTo('story_carousel_mobile')">幸福故事集</div>
              <div class="menu-list" @click="scrollTo('story_share_mobile')">Youtube體驗分享</div>
            </div>
          </div>
        </div>
        
        <div class="logo col-12">
          <img src="/assets/img/banner_logo_mobile.webp" loading="lazy" alt="logo" />
        </div>
        <div class="car col-12">
          <img src="/assets/img/banner_car.webp" loading="lazy" alt="logo" />
        </div>
        <div class="col-12">
          <span class="animatedNumber">{{ animatedNumber }}</span>
        </div>
      </div>
    </section>

    <section id="page_intro_pc" ref="page_intro_pc">
      <div class="page-content">
        <div class="row">
          <div class="col-12 text-center">
            <div class="link" @click="scrollTo('page_intro_pc')">故事募集中</div>
            <div class="link" @click="scrollTo('story_carousel_pc')">幸福故事集</div>
            <div class="link" @click="scrollTo('story_share_pc')">YouTuber體驗分享</div>
          </div>
        </div>
      </div>
      <div
        class="text-center post_btn"
        data-bs-toggle="modal"
        data-bs-target="#postModal"
      >
        <img src="/assets/img/post_btn.webp" loading="lazy" alt="enter" />
      </div>
    </section>
    <section id="page_intro_mobile"
      ref="page_intro_mobile"
      class="text-center post_btn"
        data-bs-toggle="modal"
        data-bs-target="#postModal"
    >
      <div class="container"></div>
    </section>

    <section id="story_carousel_pc" ref="story_carousel_pc">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div id="story_carousel_title">
              <img src="/assets/img/story_title.webp" loading="lazy" alt="title" />
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
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '桃園 吳先生｜照顧全家人的貼心夥伴',
                          `<img src='/assets/img/story/a/1.webp' loading='lazy' class='story-img' alt='...'/><br>我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身、大器的車頭霸氣設計以及尾燈也很醒目，都是目前流行的設計元素。整體給我的感覺就是很前衛有型。我也很喜歡它的駕駛座，直立的主機螢幕加上按鍵式排檔，使用上非常直覺便利。<br>
                            <img src='/assets/img/story/a/2.webp' loading='lazy' class='story-img' alt='...'/><br>
                          但內裝的部分才是讓我決定成為車主的最大原因，VIP皇家座椅第二排座椅、電動滑門、超大雙天窗，真的讓我出乎意料，CUSTIN通通都有，重點是第二排座椅竟然還有通風加熱功能，配備給的實在不手軟！<br>
                          <img src='/assets/img/story/a/3.webp' loading='lazy' class='story-img' alt='...'/><br>  
                          有時候如果要去露營或野餐，要載東西的時候，行李箱空間也很夠用，還有搭配電動尾門，簡直不要太方便。<br>
                            每次看到兩老坐在第二排舒服的享受，小朋友因為天窗打開看見天空而興奮歡呼，都讓我非常有成就感，CUSTIN就像是讓我的心聲一樣，準備很多高級貼心的功能，幫我把家人都照顧得好好的。`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/a/1.webp"
                          class="story-img"
                          loading='lazy'
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            桃園 吳先生｜照顧全家人的貼心夥伴
                          </h5>
                          <p class="story-content">
                            我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身、大器的車頭霸氣設計以及尾燈也很醒目，都是目前流行的設計元素。整體給我的感覺就是很前衛有型...
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      class="col-6 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '彰化 周先生 ｜配備給好給滿超有料',
                          `<img src='/assets/img/story/b/1.webp' class='story-img' loading='lazy' alt='...'/><br><p>我們家的兩個小朋友，最喜歡的就是CUSTIN的電動側滑門，因為剛換車的時候，我跟他們開了一個小玩笑，讓他們站在車門前大喊「魔法開開」，我在一旁偷偷用鑰匙遙控開啟，他們看著滑門慢慢滑開興奮得驚呼連連。</p>
                          <img src='/assets/img/story/b/2.webp' class='story-img' loading='lazy' alt='...'/>
                          <p>後來當然還是知道了這個咒語的秘密，但每當我們準備出發，小朋友們還是會興奮地跑到車前高喊「魔法開開」，然後看著車門自動打開，再開心地跳上車，我跟老婆都會心一笑。這個習慣成為了我們每次出遊前的小小儀式，這種互動不僅增加了樂趣，也讓孩子們更加期待每一次的旅行。</p>
                          <img src='/assets/img/story/b/3.webp' class='story-img' loading='lazy' alt='...'/>
                          <p>當然車子本身各方面的表現都很優秀，老婆也很喜歡，但我更滿意的是一家人在車上開開心心的樣子，CUSTIN和我們一起度過了很多美好時光。</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/b/1.webp"
                          class="story-img"
                          loading='lazy'
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            彰化 周先生 ｜配備給好給滿超有料
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
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '高雄 李先生 ｜體貼每一位的家庭神車',
                          `<img src='/assets/img/story/c/1.webp' class='story-img' loading='lazy' alt='...'/><br><p>當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！</p>
                          <img src='/assets/img/story/c/2.webp' class='story-img' loading='lazy' alt='...'/><br>
                          <p>當初試過後就被他的豐富配備給吸引，尤其是第二排座椅跟電動滑門，不敢相信在這個價位可以做到這樣。除此之外車內也有很多貼心的小細節，比如說第二排遮陽簾、折疊桌板，甚至還有杯架跟平板架，就像是在搭飛機一樣，就連第三排也有獨立的冷氣出風口跟USB充電孔，小朋友在後面也坐的很舒服。</p>
                          <img src='/assets/img/story/c/3.webp' class='story-img' loading='lazy' alt='...'/><br>
                          <p>開著CUSTIN載全家人出去後，大家對它的評價都非常高，覺得這是一台很舒適享受的車，每個位置都可以感受到CUSTIN有在用心替乘客著想，我自己也很高興可以買到一台讓全家人都滿意的車！</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/c/1.webp"
                          class="story-img"
                          loading='lazy'
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            高雄 李先生 ｜體貼每一位的家庭神車
                          </h5>
                          <p class="story-content">
                            當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-6 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '新竹 許先生｜每一次旅程都無比享受',
                          `<img src='/assets/img/story/d/1.webp' class='story-img' loading='lazy' alt='...'/><br>
                          <p>我爸媽上了年紀後，行動變得沒那麼靈活，原本的車子對他們來說上下車不太方便，坐久了也會有身體痠痛的問題，因緣際會之下看到了CUSTIN，便帶著他們一起去看車。</p>
                          <img src='/assets/img/story/d/2.webp' class='story-img' loading='lazy' alt='...'/><br>
                          <p>看車當下，他們比較保守，一坐進去，雖然口頭上沒有說，但從他們放鬆的姿勢跟表情，我就能感受的出來他們的滿意，電動側滑門跟第二排座椅，完完全全就是我要的。</p>
                          <img src='/assets/img/story/d/3.webp' class='story-img' loading='lazy' alt='...'/><br>
                          <p>一開始其實會擔心車子比較大台，會不會不好開，因為我主要是上班通勤或接送家人，只有假日偶爾才會出去玩，大部分時間都是在市區跑。但實際開起來，我覺得整個視野很寬闊，而且A柱那邊還有一個三角窗，減少了很多死角，再加上有SVM環景功能，停車的時候也不用擔心不熟悉的環境，還有其他很多的安全輔助科技，給我滿滿的安全感。</p>
                          <p>老婆跟小孩也對這台車很喜歡，更讓我覺得開心的是，我爸媽以前總會嫌麻煩，現在變得比較願意出門了。</p>
                          
                          `
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/d/1.webp"
                          class="story-img"
                          loading='lazy'
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            新竹 許先生｜每一次旅程都無比享受
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
                      class="col-6 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '台北 劉小姐｜寬敞空間輕鬆出遊',
                          `<img src='/assets/img/story/e/1.webp' class='story-img' loading='lazy' alt='...'/><br><p>我們家小朋友有在學跳舞，有一次在路上剛好聽到一首他們前陣子剛學過的音樂，他們很興奮的說這是上禮拜老師教的，然後他們就在後面直接跳起來～</p>
                          <img src='/assets/img/story/e/2.webp' class='story-img' loading='lazy' alt='...'/><br>
                          <p>CUSTIN的空間真的很大，每個位置都可以都坐得很舒服，有時候出去玩會帶多一些行李或其他東西，也都綽綽有餘，而且行李箱是電動尾門，上下東西很方便。</p>
                          <iframe width='100%' height='350' src='https://www.youtube.com/embed/0nNbDBBJ7vc?si=MRTpgpA3hCDYRZH-' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>                     
                          <p>但更重要的是坐起來非常舒適，尤其是第二排的電動座椅，除了家人之外，有坐過的朋友或是同事也都讚譽有加！</p>
                          <p>而我自己因為最近天氣非常熱，對CUSTIN的通風坐椅就非常有感，我自己是比較怕熱的人，好險有這個功能，讓我就算開長途也能保持舒爽不悶熱，而且第一二排的位置都有，真的很貼心。</p>
                          <p>買到現在覺得CUSTIN不僅空間需求上可以滿足我，整體的舒適度跟質感表現也都在水準之上，而且還有很多貼心的設計跟配備，真的是一台非常超值的車！</p>
                          `
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/e/1.webp"
                          loading='lazy'
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            台北 劉小姐｜寬敞空間輕鬆出遊
                          </h5>
                          <p class="story-content">
                            我們家小朋友有在學跳舞，有一次在路上剛好聽到一首他們前陣子剛學過的音樂，他們很興奮的說這是上禮拜老師教的，然後他們就在後面直接跳起來～
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

    <section id="story_carousel_mobile" ref="story_carousel_mobile">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div id="story_carousel_title">
              <img src="/assets/img/story_title_mobile.webp" alt="title" loading="lazy" />
            </div>
            <div
              id="story_carousel_mobile_container"
              class="carousel slide"
              data-ride="carousel"
              data-touch="true"
            >
            <div class="carousel-inner">
                <div class="carousel-item active">
                  <div class="row">
                    <div
                      class="col-12 col-story"
                      data-bs-toggle="modal"
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '桃園 吳先生｜照顧全家人的貼心夥伴',
                          `<img src='/assets/img/story/a/1.webp' loading='lazy' class='story-img' alt='...'/><br>我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身、大器的車頭霸氣設計以及尾燈也很醒目，都是目前流行的設計元素。整體給我的感覺就是很前衛有型。我也很喜歡它的駕駛座，直立的主機螢幕加上按鍵式排檔，使用上非常直覺便利。<br>
                            <img src='/assets/img/story/a/2.webp' loading='lazy' class='story-img' alt='...'/><br>
                          但內裝的部分才是讓我決定成為車主的最大原因，VIP皇家座椅第二排座椅、電動滑門、超大雙天窗，真的讓我出乎意料，CUSTIN通通都有，重點是第二排座椅竟然還有通風加熱功能，配備給的實在不手軟！<br>
                          <img src='/assets/img/story/a/3.webp' loading='lazy' class='story-img' alt='...'/><br>  
                          有時候如果要去露營或野餐，要載東西的時候，行李箱空間也很夠用，還有搭配電動尾門，簡直不要太方便。<br>
                            每次看到兩老坐在第二排舒服的享受，小朋友因為天窗打開看見天空而興奮歡呼，都讓我非常有成就感，CUSTIN就像是讓我的心聲一樣，準備很多高級貼心的功能，幫我把家人都照顧得好好的。`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/a/1.webp"
                          loading="lazy"
                          class="story-img"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            桃園 吳先生｜照顧全家人的貼心夥伴
                          </h5>
                          <p class="story-content">
                            我第一眼就被CUSTIN的顏值外觀給吸引，流線型的車身、大器的車頭霸氣設計以及尾燈也很醒目，都是目前流行的設計元素。整體給我的感覺就是很前衛有型。...
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
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '彰化 周先生 ｜配備給好給滿超有料',
                          `<img src='/assets/img/story/b/1.webp' loading='lazy' class='story-img' alt='...'/><br><p>我們家的兩個小朋友，最喜歡的就是CUSTIN的電動側滑門，因為剛換車的時候，我跟他們開了一個小玩笑，讓他們站在車門前大喊「魔法開開」，我在一旁偷偷用鑰匙遙控開啟，他們看著滑門慢慢滑開興奮得驚呼連連。</p>
                          <img src='/assets/img/story/b/2.webp' loading='lazy' class='story-img' alt='...'/>
                          <p>後來當然還是知道了這個咒語的秘密，但每當我們準備出發，小朋友們還是會興奮地跑到車前高喊「魔法開開」，然後看著車門自動打開，再開心地跳上車，我跟老婆都會心一笑。這個習慣成為了我們每次出遊前的小小儀式，這種互動不僅增加了樂趣，也讓孩子們更加期待每一次的旅行。</p>
                          <img src='/assets/img/story/b/3.webp' loading='lazy' class='story-img' alt='...'/>
                          <p>當然車子本身各方面的表現都很優秀，老婆也很喜歡，但我更滿意的是一家人在車上開開心心的樣子，CUSTIN和我們一起度過了很多美好時光。</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/b/1.webp"
                          class="story-img"
                          loading="lazy"

                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            彰化 周先生 ｜配備給好給滿超有料
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
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '高雄 李先生 ｜體貼每一位的家庭神車',
                          `<img src='/assets/img/story/c/1.webp' loading='lazy' class='story-img' alt='...'/><br><p>當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！</p>
                          <img src='/assets/img/story/c/2.webp' loading='lazy' class='story-img' alt='...'/><br>
                          <p>當初試過後就被他的豐富配備給吸引，尤其是第二排座椅跟電動滑門，不敢相信在這個價位可以做到這樣。除此之外車內也有很多貼心的小細節，比如說第二排遮陽簾、折疊桌板，甚至還有杯架跟平板架，就像是在搭飛機一樣，就連第三排也有獨立的冷氣出風口跟USB充電孔，小朋友在後面也坐的很舒服。</p>
                          <img src='/assets/img/story/c/3.webp' loading='lazy' class='story-img' alt='...'/><br>
                          <p>開著CUSTIN載全家人出去後，大家對它的評價都非常高，覺得這是一台很舒適享受的車，每個位置都可以感受到CUSTIN有在用心替乘客著想，我自己也很高興可以買到一台讓全家人都滿意的車！</p>`
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/c/1.webp"
                          class="story-img"
                          loading="lazy"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            高雄 李先生 ｜體貼每一位的家庭神車
                          </h5>
                          <p class="story-content">
                            當初是因為有空間上的需求，才開始找尋7人座的車，中間陸陸續續有看了很多款，還包含5+2的休旅車，但在都試乘過一遍後，只有CUSTIN在空間上能夠滿足我，而且也讓我印象最深刻！
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
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '新竹 許先生｜每一次旅程都無比享受',
                          `<img src='/assets/img/story/d/1.webp' loading='lazy' class='story-img' alt='...'/><br>
                          <p>我爸媽上了年紀後，行動變得沒那麼靈活，原本的車子對他們來說上下車不太方便，坐久了也會有身體痠痛的問題，因緣際會之下看到了CUSTIN，便帶著他們一起去看車。</p>
                          <img src='/assets/img/story/d/2.webp' loading='lazy' class='story-img' alt='...'/><br>
                          <p>看車當下，他們比較保守，一坐進去，雖然口頭上沒有說，但從他們的放鬆的姿勢跟表情，我就能感受的出來他們的滿意，電動側滑門跟第二排座椅，完完全全就是我要的。</p>
                          <img src='/assets/img/story/d/3.webp' loading='lazy' class='story-img' alt='...'/><br>
                          <p>一開始其實會擔心車子比較大台，會不會不好開，因為我主要是上班通勤或接送家人，只有假日偶爾才會出去玩，大部分時間都是在市區跑。但實際開起來，我覺得整個視野很寬闊，而且A柱那邊還有一個三角窗，減少了很多死角，再加上有SVM環景功能，停車的時候也不用擔心不熟悉的環境，還有其他很多的安全輔助科技，給我滿滿的安全感。</p>
                          <p>老婆跟小孩也對這台車很喜歡，更讓我覺得開心的是，我爸媽以前總會嫌麻煩，現在變得比較願意出門了。</p>
                          
                          `
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/d/1.webp"
                          class="story-img"
                          loading="lazy"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            新竹 許先生｜每一次旅程都無比享受
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
                      data-bs-target="#storyModal"
                      @click="
                        storyModalSetData(
                          '台北 劉小姐｜寬敞空間輕鬆出遊',
                          `<img src='/assets/img/story/e/1.webp' loading='lazy' class='story-img' alt='...'/><br><p>我們家小朋友有在學跳舞，有一次在路上剛好聽到一首他們前陣子剛學過的音樂，他們很興奮的說這是上禮拜老師教的，然後他們就在後面直接跳起來～</p>
                          <img src='/assets/img/story/e/2.webp' loading='lazy' class='story-img' alt='...'/><br>
                          <p>CUSTIN的空間真的很大，每個位置都可以都坐得很舒服，有時候出去玩會帶多一些行李或其他東西，也都綽綽有餘，而且行李箱是電動尾門，上下東西很方便。</p>
                          <iframe width='100%' height='250' src='https://www.youtube.com/embed/0nNbDBBJ7vc?si=MRTpgpA3hCDYRZH-' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>                          <p>但更重要的是坐起來非常舒適，尤其是第二排的電動座椅，除了家人之外，有坐過的朋友或是同事也都讚譽有加！</p>
                          <p>而我自己因為最近天氣非常熱，對CUSTIN的通風坐椅就非常有感，我自己是比較怕熱的人，好險有這個功能，讓我就算開長途也能保持舒爽不悶熱，而且第一二排的位置都有，真的很貼心。</p>
                          <p>買到現在覺得CUSTIN不僅空間需求上可以滿足我，整體的舒適度跟質感表現也都在水準之上，而且還有很多貼心的設計跟配備，真的是一台非常超值的車！</p>
                          `
                        )
                      "
                    >
                      <div class="story">
                        <img
                          src="/assets/img/story/e/1.webp"
                          class="story-img"
                          loading="lazy"
                          alt="..."
                        />
                        <div class="story-body">
                          <h5 class="story-title">
                            台北 劉小姐｜寬敞空間輕鬆出遊
                          </h5>
                          <p class="story-content">
                            我們家小朋友有在學跳舞，有一次在路上剛好聽到一首他們前陣子剛學過的音樂，他們很興奮的說這是上禮拜老師教的，然後他們就在後面直接跳起來～
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

    <section id="story_wall_pc" ref="story_wall_pc">
      <div class="arrow arrow_down"></div>
      <div class="arrow arrow_up"></div>
      <div class="row">
          <div
            class="col-6 story-wall left"
          >
            <div class="row">
              <div class="col-6 story-wall-left left">
                <div class="row">
                  <div class="col-12">
                    <Vue3Marquee
                      :vertical="true"
                      :pause-on-hover="true"
                      :clone="true"
                      :duration="randomSpeedPCLeft1"
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
                            story.owner_photo,
                            story.recommendation_content,
                            story.social_media_link
                          )
                        "
                      >
                        <img
                          :src="story.owner_photo"
                          class="story-img"
                          :alt="story.recommendation_title"
                          loading='lazy'
                        />
                        <div class="story-body">
                          {{ story.recommendation_title }}
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
                      :duration="randomSpeedPCLeft2"
                      v-if="!runMobileMarquee"
                    >
                      <div
                        class="story-pc2 story"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            story.owner_photo,
                            story.recommendation_content,
                            story.social_media_link
                          )
                        "
                        v-for="(story, index) in stories[1]"
                        :key="index"
                      >
                        <img
                          :src="story.owner_photo"
                          class="story-img"
                          :alt="story.recommendation_title"
                          loading='lazy'
                        />
                        <div class="story-body">
                          {{ story.recommendation_title }}
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
          >
            <div class="row">
              <div class="col-6 story-wall-left left">
                <div class="row">
                  <div class="col-12">
                    <Vue3Marquee
                      :vertical="true"
                      :pause-on-hover="true"
                      :clone="true"
                      :duration="randomSpeedPCRight1"
                      v-if="!runMobileMarquee"
                    >
                      <div
                        class="story story-pc3"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            story.owner_photo,
                            story.recommendation_content,
                            story.social_media_link
                          )
                        "
                        v-for="(story, index) in stories[2]"
                        :key="index"
                      >
                        <img
                          :src="story.owner_photo"
                          class="story-img"
                          loading='lazy'
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_title }}
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
                      :duration="randomSpeedPCRight2"
                      v-if="!runMobileMarquee"
                    >
                      <div
                        class="story story-pc4"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            story.owner_photo,
                            story.recommendation_content,
                            story.social_media_link
                          )
                        "
                        v-for="(story, index) in stories[3]"
                        :key="index"
                      >
                        <img
                          :src="story.owner_photo"
                          class="story-img"
                          loading='lazy'
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_title }}
                        </div>
                      </div>
                    </Vue3Marquee>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>

    <section id="story_wall_mobile" ref="story_wall_mobile">
      <div class="arrow arrow_down"></div>
      <div class="arrow arrow_up"></div>
      <div class="container">
        <div class="row">
          <div
            class="col-12 story-wall"
          >
            <div class="row">
              <div class="col-6 story-wall-left left story-mobile1">
                <div class="row">
                  <div class="col-12">
                    <Vue3Marquee
                      :vertical="true"
                      :clone="true"
                      :duration="randomSpeedMobileLeft"
                      v-if="runMobileMarquee"
                    >
                      <div
                        class="story"
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            story.owner_photo,
                            story.recommendation_content,
                            story.social_media_link
                          )
                        "
                        v-for="(story, index) in storiesMobile[0]"
                        :key="index"
                      >
                        <img
                          :src="story.owner_photo"
                          class="story-img"
                          loading="lazy"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_title }}
                        </div>
                      </div>
                    </Vue3Marquee>
                  </div>
                </div>
              </div>
              <div class="col-6 story-wall-right right story-mobile2">
                <div class="row">
                  <div class="col-12">
                    <Vue3Marquee
                      :vertical="true"
                      :clone="true"
                      :duration="randomSpeedMobileRight"

                      v-if="runMobileMarquee"
                    >
                      <div
                        class="story "
                        data-bs-toggle="modal"
                        data-bs-target="#contentModal"
                        @click="
                          contentModalSetData(
                            story.recommendation_title,
                            story.owner_photo,
                            story.recommendation_content,
                            story.social_media_link
                          )
                        "
                        v-for="(story, index) in storiesMobile[1]"
                        :key="index"
                      >
                        <img
                          :src="story.owner_photo"
                          class="story-img"
                          loading="lazy"
                          :alt="story.recommendation_title"
                        />
                        <div class="story-body">
                          {{ story.recommendation_title }}
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

    <section id="story_share_pc" ref="story_share_pc">
      <p class="text-center"><img src="/assets/img/wall_title.webp" /></p>
      <div class="story_share_container">
        <div class="story_share_row">
          <div class="story_share_col">
            <a href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy" class="d-inline-block" target="_blank">
              <img src="/assets/img/kol_01.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy" target="_blank">彼得爸與蘇珊媽</a>
            </p>
            <p class="story_share_content">
              體驗完 CUSTIN，果然跟當初看到的配備內容一樣，實在是一台好車～不管是主動被動安全配備還是內裝配備，全部都給好給滿！整體體驗下來真的是很不錯的
              <span><a href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy" target="_blank">[More]</a></span>
            </p>
          </div>

          <div class="story_share_col">
            <a href="https://www.youtube.com/watch?v=QDQ4iIjVFyY" class="d-inline-block" target="_blank">
              <img src="/assets/img/kol_02.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a href="https://www.youtube.com/watch?v=QDQ4iIjVFyY" target="_blank">絕代雙Ｑ</a>
            </p>
            <p class="story_share_content">
              薇0要從月子中心回家啦！今天特別給薇0一個驚喜
              開全新的 THE ALL-NEW CUSTIN 頂級 LMPV
              和阿嬤一起來接薇0～
              這台車真的蠻舒服的，很適合三代同堂一起乘坐
              <span><a href="https://www.youtube.com/watch?v=QDQ4iIjVFyY" target="_blank">[More]</a></span>
            </p>
          </div>

          <div class="story_share_col">
            <a href="https://www.youtube.com/watch?v=S8ynSa0YVGc" class="d-inline-block" target="_blank">
              <img src="/assets/img/kol_03.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a href="https://www.youtube.com/watch?v=S8ynSa0YVGc" target="_blank">小朗哥爸爸</a>
            </p>
            <p class="story_share_content">
              我們回台灣後第一禮拜假日帶阿公阿婆出去玩，
              這次剛好有一個好機會體驗7人座 THE ALL-NEW CUSTIN 頂級 LMPV，
              大家坐的很舒服，很有安全感！
              <span><a href="https://www.youtube.com/watch?v=S8ynSa0YVGc" target="_blank">[More]</a></span>
            </p>
          </div>


        </div>
      </div>
    </section>
    <div
      class="modal fade"
      id="storyModal"
      tabindex="-1"
      aria-labelledby="storyModalTitle"
      aria-hidden="true"
      style="display: none; background-color: rgb(173, 205, 221, 0.5)"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="contentModalTitle">
              <img src="/assets/img/tape.webp" loading='lazy' />
              {{ storyModalData.title }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-html="storyModalData.content"></div>
        </div>
      </div>
    </div>
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
              <img src="/assets/img/tape.webp" loading='lazy' />
              {{ contentModalData.title }}
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="contentModalData.social_media_link != null">
              <a :href="contentModalData.social_media_link" target="_blank" v-if="!contentModalData.social_media_link.includes('youtube')">
                <img :src="contentModalData.img_url" v-if="contentModalData.img_url != null">
              </a>
              <div v-else>
                <img :src="contentModalData.img_url" @click="contentModalYTOpened = true" v-if="!contentModalYTOpened" role="button">
                <iframe
                  v-if="contentModalYTOpened"
                  width="100%"
                  height="350"
                  :src="contentModalData.social_media_link"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <div v-else>
              <img :src="contentModalData.img_url" v-if="contentModalData.img_url != null">
            </div>

            <p v-html="contentModalData.content"></p>

          </div>
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
                    <img src="/assets/img/post_modal_title.webp" loading='lazy' alt="post" />
                  </div>
                </div>
                <div class="col-12 col-lg-6 post-form">
                  <div class="form-group">
                    <label for="car_owner_name">車主(領牌者)姓名</label>
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
                    <div class="text-count ">
                      <small :class="{ 'text-danger': storiesForm.recommendation_content.length > 300 }">
                        {{ storiesForm.recommendation_content.length }}/300
                      </small>
                    </div>
                    <span
                      class="invalid-feedback"
                      v-if="formErros.recommendation_content"
                      v-html="formErros.recommendation_content"
                    ></span>
                  </div>
                </div>
                <div class="col-12 col-lg-6 post-form">
                  <div class="form-group">
                    <img class="step1_img" src="/assets/img/step1.png" loading='lazy' />
                    <label id="car_photo_label" @click="triggerCarPhotoUpload"
                      >上傳愛車照片</label
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
                    <img class="step2_img mb-2" loading='lazy' src="/assets/img/step2.png" />
                    <p style="font-size: 18px; font-weight: 500;">上傳與CUSTIN的生活照或影片</p>
                    <label
                      id="owner_photo_label"
                      @click="triggerOwnerPhotoUpload"
                      >上傳生活照1</label
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
                  <div class="form-group">
                    <label
                      id="owner_photo2_label"
                      @click="triggerOwnerPhoto2Upload"
                      >上傳生活照2</label
                    >
                    <input
                      type="file"
                      class="form-control"
                      id="owner_photo2"
                      ref="owner_photo2"
                      :class="{ 'is-invalid': formErros.ownerPhotoUpload2 }"
                      accept="image/*"
                      @change="handleOwnerPhoto2Change($event)"
                    />
                    <div v-if="owner_photo2_preview" class="image-preview mt-3">
                      <img
                        :src="owner_photo2_preview"
                        alt="預覽圖片"
                        class="img-fluid"
                        style="max-width: 150px"
                      />
                    </div>
                    <span
                      class="invalid-feedback"
                      v-if="formErros.ownerPhotoUpload2"
                      v-html="formErros.ownerPhotoUpload2"
                    ></span>
                  </div>
                  <div class="form-group mt-3">
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErros.social_media_link }"
                      id="social_media_link"
                      style="padding: 0.375rem;"
                      placeholder="影片上傳，請輸入FB、IG、YT之影片貼文連結"
                      v-model="storiesForm.social_media_link"
                    />
                    <span
                      class="invalid-feedback"
                      v-if="formErros.social_media_link"
                      v-html="formErros.social_media_link"
                    ></span>
                  </div>
                  <p class="photo_rule">
                    <span style="color: #000;">*影片上傳請先發布於個人社群平台(FB/IG/YT)，並將該貼文設置為公開後提供分享連結</span><br />
                    <span style="color: #ff0000;">*請至少上傳兩張與CUSTIN的生活照，生活照形式可參考網站中幸福故事集，以車主與愛車清晰合照為主</span><br>
                    *照片格式：JPG、PNG <br />
                    *檔案大小限制：5MB以下 <br />
                    *圖片尺寸：具有1280x720的解析度，寬度至少為 40像素
                    (手機皆可拍出符合上述標準之作品)
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
                  <div class="rule-text-content">
                    <h6>■ 活動時間：</h6>
                    <p>2025/02/20起至2025/05/20止</p>
                    <h6>■ 參加資格：</h6>
                    <p>Hyundai CUSTIN 車主（以車牌號碼為認定依據）</p>
                    <h6>■ 獎項：</h6>
                    <p>LINE POINTS 100點(50位)、CUSTIN模型車(5名)、王品集團1,000元餐券(5名)、IONIQ自動摺疊傘(5名)</p>
                    <h6>■ 投稿說明：</h6>
                    <p>1.	投稿內容包含文字故事分享(300字內)以及搭配之圖片或影音(擇一)。</p>
                    <p>2. 如選擇上傳生活照，請至少上傳兩張與CUSTIN的生活照，生活照形式可參考網站中幸福故事集，以車主與愛車清晰合照為主。</p>
                    <p>3. 照片格式：檔案需提供約5MB內，具有1280*720的解析度(寬度至少為640像素)之圖檔，JPG/PNG。(目前手機都能拍攝出的規格)。</p>
                    <p>4. 影音格式：需先將影片上傳至個人社群平台Facebook或Instagram或YouTube，並將該貼文設置為公開後提供分享連結。</p>
                    <p>5. 投稿內容須符合上述規定，未符合規定者，主辦單位保有取消投稿資格(含領獎及抽獎資格)之權利。</p>
                    <p>6. 車主應確保投稿內容無侵害任何第三人之智慧財產權，不得使用他人照片、影片或截圖，經發現後主辦單位有權立即取消其獲贈資格，相關法律責任，由投稿者自行負責。</p>
                    <p>7. 投稿內容不得含有誹謗、侮辱、不雅、威脅、攻擊、色情等違反公共秩序或善良風俗、可能損害本活動進行之病毒檔案或其他任何惡意程式以及盜用他人著作內容或以AI生成方式產生之投稿內容。</p>
                    <p>8. 車主參加本活動並提供其個人資料予主辦單位，即視為已同意主辦單位依相關法令蒐集、處理及利用車主之個人資料 ，且同意其投稿作品、後續相關拍攝工作等無償永久授權主辦宣傳及使用。範圍包括使用投稿內容於國內外改編、重製、發布、公開傳輸、公開播送及公開上映等。</p>
                    <h6>■ 獎項說明：</h6>
                    <p>1. 完成投稿程序後，由主辦單位確認並審閱其內容，經主辦單位通知並成功刊登者，即贈送投稿者LINE POINTS 100點(50位)。與CUSTIN模型車(5名)、王品集團1,000元餐券(5名)、IONIQ自動摺疊傘(5名)抽獎資格乙次。</p>
                    <p>2. 投稿者須有LINE帳號始得獲贈LINE POINTS，以填入之手機號碼透過LINE發放，若因資料有誤導致寄送失敗、逾期未完成領取，皆視同放棄以上獎品，LINE POINTS之使用及折扣優惠悉依Line官方使用辦法說明。</p>
                    <p>3. 依中華民國稅法規定，機會中獎之獎項價值超過新台幣1,000元以上者，於年度結算時必須計入個人之綜合所得申報，超過新臺幣20,010(含)元以上，需預先扣繳稅款，才可兌換獎項，故獲選車主應提供相關文件予主辦單位，以利主辦單位製作扣繳憑單，始得領取本活動獎項。若獲選車主未提供資料予主辦單位，則視同放棄獲選資格，不另行通知。</p>
                    <h6>■ 獲選車主須知：</h6>
                    <p>1. 投稿內容經主辦單位評選後，合適者將安排進一步的深入訪談、攝影或錄影紀錄等，如獲選車主無法全程配合主辦單位之安排，視同放棄獲選資格。</p>
                    <p>2. 主辦單位為獲選車主安排深入訪談所拍攝之照片、影片及成果物，其智慧財產權歸屬於主辦單位所有，主辦單位不另支付報酬予獲選車主。</p>
                    <p>■兌獎與寄送將由主辦單位「南陽實業股份有限公司」指定之活動小組「博報堂思索股份有限公司」統一處理相關事宜，詳細兌獎方式將於得獎者與活動小組聯繫後進行通知，並以主辦單位規劃之方式為主，僅限郵寄至台、澎、金、馬地區。主辦單位有隨時有權取消、終止、修改活動內容，亦有權對本活動之所有事宜做出最終解釋或決定，及保留最後核准與否權利。相關未盡事宜，以Hyundai官網或官方粉絲團公告為準，不另行通知。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section id="story_share_mobile" ref="story_share_mobile">
      <p class="text-center" id="story_share_mobile_title">
        <img src="/assets/img/wall_title_mobile.webp" loading="lazy" />
      </p>
      <div class="story_share_container">
        <div class="story_share_row">
          <div class="story_share_col">
            <a href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy" class="d-inline-block" target="_blank">
              <img src="/assets/img/kol_01.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy" target="_blank">彼得爸與蘇珊媽</a>
            </p>
            <p class="story_share_content">
              體驗完CUSTIN，果然跟當初看到的配備內容一樣，實在是一台好車～不管是主動被動安全配備還是內裝配備，全部都給好給滿！整體體驗下來真的是很不錯的
            </p>
            <span class="story_share_link"
              ><a href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy" target="_blank">[More]</a></span
            >
          </div>

          <div class="story_share_col">
            <a href="https://www.youtube.com/watch?v=QDQ4iIjVFyY" class="d-inline-block" target="_blank">
              <img src="/assets/img/kol_02.webp" loading="lazy" alt="..." />
            </a>

            <p class="story_share_title">
              <a href="https://www.youtube.com/watch?v=QDQ4iIjVFyY" target="_blank">絕代雙Ｑ</a>
            </p>
            <p class="story_share_content">
              薇0要從月子中心回家啦！今天特別給薇0一個驚喜<br>
              開全新的THE ALL-NEW CUSTIN 頂級LMPV<br>
              和阿嬤一起來接薇0～<br>
              這台車真的蠻舒服的，很適合三代同堂一起乘坐
            </p>
            <span class="story_share_link"
              ><a href="https://www.youtube.com/watch?v=QDQ4iIjVFyY" target="_blank">[More]</a></span
            >
          </div>

          <div class="story_share_col">
            <a href="https://www.youtube.com/watch?v=S8ynSa0YVGc" class="d-inline-block" target="_blank">
              <img src="/assets/img/kol_03.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a href="https://www.youtube.com/watch?v=S8ynSa0YVGc" target="_blank">小朗哥爸爸</a>
            </p>
            <p class="story_share_content">
              我們回台灣後第一禮拜假日帶阿公阿婆出去玩，<br>
              這次剛好有一個好機會體驗7人座 THE ALL-NEW CUSTIN 頂級LMPV，<br>
              大家坐的很舒服，很有安全感！
            </p>
            <span class="story_share_link"
              ><a href="https://www.youtube.com/watch?v=S8ynSa0YVGc" target="_blank">[More]</a></span
            >
          </div>
        </div>
      </div>
    </section>

    <section id="champion_pc" ref="champion_pc">
      <div class="row">
        <div class="col-7 champion_left">
          <img src="/assets/img/champion_title.webp" class="champion_title" />
          <img src="/assets/img/champion_car_left.webp" loading='lazy' class="champion_car" />
          <div class="champion-action-list">
            <a href="https://www.hyundai-motor.com.tw/testdrive.html?utm_source=officialwebsite&utm_medium=testdrive&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_testdrive.webp"
                class="champion-action testdrive"
                loading='lazy'
            /></a>
            <a
              href="https://www.hyundai-motor.com.tw/clicktobuy/custin/customize?utm_source=officialwebsite&utm_medium=clicktobuy&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_order.webp"
                class="champion-action order"
                loading='lazy'
            /></a>
            <a
              href="https://www.hyundai-motor.com.tw/clicktobuy/custin?utm_source=officialwebsite&utm_medium=clicktobuy_custin&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_more.webp"
                class="champion-action more"
                loading='lazy'
            /></a>
          </div>
        </div>
        <div class="col-5 champion_right">
          <img src="/assets/img/champion_right_1.webp" loading='lazy'/>
          <p>前衛科技座艙</p>
          <img src="/assets/img/champion_right_2.webp" loading='lazy'/>
          <p>感應式電動側滑門</p>
          <img src="/assets/img/champion_right_3.webp" loading='lazy'/>
          <p>正七人座寬敞空間</p>
          <img src="/assets/img/champion_right_4.webp" loading='lazy'/>
          <p>第二排VIP皇家座椅</p>
        </div>
      </div>
    </section>

    <section id="champion_mobile" ref="champion_mobile">
      <div class="row">
        <div class="col-12 champion_left">
          <img src="/assets/img/champion_title.webp" class="champion_title" />
          <img src="/assets/img/champion_car_left.webp" class="champion_car" loading="lazy" />
        </div>
        <div class="col-12 champion_right">
          <img src="/assets/img/champion_right_1.webp" loading="lazy" />
          <p>前衛科技座艙</p>
          <img src="/assets/img/champion_right_2.webp" loading="lazy" />
          <p>感應式電動側滑門</p>
          <img src="/assets/img/champion_right_3.webp" loading="lazy" />
          <p>正七人座寬敞空間</p>
          <img src="/assets/img/champion_right_4.webp" loading="lazy" />
          <p>第二排VIP皇家座椅</p>

          <div class="champion-action-list">
            <a
              href="https://www.hyundai-motor.com.tw/testdrive.html?utm_source=officialwebsite&utm_medium=testdrive&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_testdrive.webp"
                loading="lazy"
                class="champion-action testdrive"
            /></a>
            <a
              href="https://www.hyundai-motor.com.tw/clicktobuy/custin/customize?utm_source=officialwebsite&utm_medium=clicktobuy&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_order.webp"
                loading="lazy"
                class="champion-action order"
            /></a>
            <a
              href="https://www.hyundai-motor.com.tw/clicktobuy/custin?utm_source=officialwebsite&utm_medium=clicktobuy_custin&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_more.webp"
                loading="lazy"
                class="champion-action more"
            /></a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
