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
    const storyModalData = ref({ title: "", content: "" });
    const contentModalData = ref({
      title: "",
      content: "",
      img_url: "",
      social_media_link: "",
    });
    const contentModalYTOpened = ref(false);
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
      ownerPhoto2Upload: null,
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
    };

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

    const contentModalSetData = (
      title,
      img_url,
      content,
      social_media_link = ``
    ) => {
      contentModalData.value = {
        title: title,
        content: content,
        img_url: img_url,
        social_media_link: social_media_link,
      };

      if (social_media_link.length > 0) {
        if (social_media_link.includes("youtube")) {
          contentModalData.value.social_media_link = `https://www.youtube.com/embed/${new URL(
            social_media_link
          ).searchParams.get("v")}`;
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
      const targetNumber = 12357;
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
        // 檢查網址是否為 *.hanyuan.info
        const isHanyuanDomain =
          window.location.hostname.endsWith("hanyuan.info") ||
          window.location.hostname === "localhost";

        let results;
        if (isHanyuanDomain) {
          results = [
            {
              id: 206,
              recommendation_title: "終於有大空間了",
              recommendation_content:
                "原本舊車開了很多年，兩位小朋友長大後空間確實有點不夠，後來為了考量的空間感終於找到喜歡的車子，當初試乘時，兒子一上車就說我都不用彎腰感覺好輕鬆，這也是下訂的理由之一，等了一段時間終於交車，雖然才入手沒多久，但老婆跟兩位小朋友都很滿意",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1746437445_圖片2.jpg",
            },
            {
              id: 203,
              recommendation_title: "三代卡司行",
              recommendation_content:
                "屢次假期出遊去，因為成員的關係，開車只好分兩批，自從有了 CUSTIN ，顛覆傳統廂型車，改寫家庭房車系，視覺性能安全性，空間寬敞大無比。\r\n配合先進的科技，一千五渦輪引擎，車身長達近五米，輕鬆駕馭樂不疲，一家七口座一起，各個都有專屬椅，要坐躺平皆適宜，一鍵輕鬆搞定，遙控靠近車柱 C，滑門自動來開啟，尾門也不用腳踢，人鑰近距就掀起，提升用車人便利。有了 CUSTIN 參與，行駛到婉蜒崎嶇，不再嘔吐與頭暈，幸福旅途有了你，天天都想出遊去，享受天倫之樂趣。車外美景收眼底，車內歡樂聲響起，三代同堂的溫馨，心中歡樂與甜蜜，再多金錢無法比，感謝現代 CUSTIN ，留住美好的回憶。",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1746437230_１.jpg",
            },
            {
              id: 200,
              recommendation_title: "為你沒有遺憾",
              recommendation_content:
                "20230917選擇結婚紀念日來取車，終於可以一家六人一起舒服出遊，你總是不好意思跟我們出門，總說小孩長大坐車太擠，七人座剛好。\r\n每個星期日我們開心😃，持續二年超過100次我們沒有缺席，帶你走過很多地方，每一次都帶你去到定點放你在最近的地方，不用走很多路，你欣賞美景吃美食，開心渡過最後羅癌末期。\r\n你好嗎？這星期🈵百日。\r\n媽媽，為你我們努力過，所以沒有遺憾。",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1745820305_圖片2.jpg",
            },
            {
              id: 201,
              recommendation_title: "陶哲晨蕾的好家人",
              recommendation_content:
                "我家的CUSTIN名字叫小卡，一直以來家裡的車是我們全家的好夥伴，選擇CUSTIN主要是空間大舒適，車內寧靜度好，動力性能好，安全性能佳，載著我們上山下海、颳風下雨都靠它，一台能夠載著全家三代的好車，讓我們全家好幸福。❤️",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1745820149_生活照1.jpg",
            },
            {
              id: 199,
              recommendation_title: "與大甲媽的約定",
              recommendation_content:
                "每年的三月瘋媽祖是我們固定的行程，媽祖起駕後的第一個星期一便是我們跟著媽祖的腳步前往新港拜祖的日子，自從換了這部CUSTIN後就變成了可以全家一起出發的好夥伴，帶著大甲媽祖的進香旗，跟隨著媽祖的腳步一站一站的前行，追隨著我們的信仰，也完成了跟大甲媽的約定",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1745225563_圖片1.jpg",
            },
            {
              id: 194,
              recommendation_title: "Custin的好只有車主才知道",
              recommendation_content:
                "上武嶺 去環島 去露營 大空間配備好馬力夠 價格親民 是台很棒的車",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742971975_圖片2.jpg",
            },
            {
              id: 193,
              recommendation_title: "開車大吉，貓咪也想搭",
              recommendation_content:
                "駕駛著全新的 Hyundai Custin，排隊等待新車祈福過火儀式，悠閒欣賞著熱鬧的街景與紅燈籠高掛的農曆春節氣氛。車內的先進儀表板顯示著平穩的駕駛狀態，對這輛車的舒適感受相當滿意。\r\n\r\n工作午休時，買完午餐進入駕駛座，突然發現擋風玻璃上多了一位「不速之客」——一隻陌生的虎斑貓輕盈地跳上車前緣，睜大眼睛好奇地打量著我的Custin。牠掛著項圈，看起來像是附近居民的愛貓，卻毫不膽怯地踏著車前，仿佛在審視這輛新車是否合格。直到我輕輕按了幾下喇叭，貓咪這才優雅地轉身跳下，留給我一段特別又逗趣的駕駛回憶。",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742801900_生活照2.jpeg",
            },
            {
              id: 190,
              recommendation_title: "最終的乘載",
              recommendation_content:
                "我們原本是豐田的車主，在電視的廣告中被Custin優雅霸氣的外表和寬敞的乘坐空間所吸引，索幸剛好想換車讓高齡的公婆易於上車搭乘，於是決定入列待車行列中，歷經漫長等待終於在四個月後迎來夢想中的新車，在待車的期間婆婆因跌倒臥床無緣搭乘，公公與娘家的媽媽都對Custin的舒適乘坐空間讚不絕口，最令人感到遺憾的是婆婆在擁車後八個月不幸去逝，無緣搭乘只有在她老人家化為一甕骨灰時送婆婆最後一程，這真是趟最終的乘載令人哽咽，筆落至此。",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742550541_圖片1.jpg",
            },
            {
              id: 171,
              recommendation_title: "幸福安親班交通車",
              recommendation_content:
                "我是員林國小對面的昱昇補習班，因為要接員東國小的學生下課來上安親班，需要一台交通車！在我精挑細選之下，Custin是我萬中選一的溫馨豪華車！學生非常開心舒服的坐著中排豪華坐椅臉上露出滿滿驕傲幸福的笑容！連學校老師都覺得在昱昇補習班上課可以坐如此頂級舒適的坐椅，真的幸福滿分💯！為昱昇補習班的形象加分滿滿～^_^",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742439977_圖片1.jpg",
            },
            {
              id: 189,
              recommendation_title: "與我同行",
              recommendation_content:
                "自從換了Custin之後，小孩都很喜歡，上山下海都有Custin作陪，玩累了上車就可以好好休息，到下一個點又可以精力滿滿的繼續玩樂。",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742375799_圖片2.jpg",
            },
            {
              id: 188,
              recommendation_title: "家人與Custin的相遇",
              recommendation_content:
                "第一台車給了Custin\r\n開著最愛的車，載著最愛的家人，到處走走逛逛，舒適的乘坐感，家人一上車就直接睡著了，心裡就覺得心滿意足🥰",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742375790_圖片1.jpg",
            },
            {
              id: 187,
              recommendation_title: "我們這一家與CUSTIN的故事",
              recommendation_content:
                "至從買了CUSTIN,我們全家五人就開啟了與CUSTIN的連結了，他為我們遮風擋雨，保護我們全家的安全，讓這個世界變得更美好，當初如果沒有選擇CUSTIN,或許這段旅程可能沒有了開始。",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742188129_圖片1.jpg",
            },
            {
              id: 186,
              recommendation_title: "笑容",
              recommendation_content:
                "升格成了父母，帶著雙方的父母與兩個寶寶，用這台車開啟每一次出遊的舒適回憶，並期待著下一次的旅程",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742188024_生活照1.jpeg",
            },
            {
              id: 183,
              recommendation_title: "未來的老闆娘",
              recommendation_content:
                "每次出門，爸爸媽媽總是為了自己的子女安全與舒適著想，2024這年想換台舒適一點的車，無意間看到了這台Custin，馬上預約看車與試乘，在業務專業的介紹下，感覺這台車很適合目前我要的，馬上簽約，足足等了三個月才交車，現在出門旅遊看到小孩坐的很舒適，就感覺這錢花的很值得。",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1742181037_生活照2.jpg",
            },
            {
              id: 182,
              recommendation_title: "乘載幸福的車",
              recommendation_content:
                '一部乘載著"家的幸福",當初選擇Custin,一來家中乘員較多，二來除了接送家中寶貝上、下學，也是出門旅遊的相當不錯的交通工具，再來因工作關係，有時還需擔任送貨的任務，所以也占據大部分的時間。\r\n除了短暫時間與小朋友分享上、下學校點滴，因大空間出外踏青還能攜帶所需的衣物及物品，所以除了乘載*家的幸福*外，更是家中不可缺一的生活伴侶，有你真好。',
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1741679554_生活照1.jpg",
            },
            {
              id: 176,
              recommendation_title: "櫻花🌸",
              recommendation_content:
                "每到一個美麗的景點，都不忘幫，也是家裡一份子的CUSTIN紀錄每一個美麗的地標～",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1741156789_圖片1.jpg",
            },
            {
              id: 175,
              recommendation_title: "闔家歡樂一同郊遊趣",
              recommendation_content:
                "自從買了Custin後，我們一家大大小小出遊的機率更頻繁了！\r\n喜歡大家熱熱鬧鬧聚在一起的氛圍，能這樣大家團聚出遊真的很棒很幸福！\r\n一家五口再加上長輩一台車就直接出遊不需再多開一台車，說走就走去哪都開心。\r\n車子真的很舒適，也很好開。以前開個車開較遠程小孩就會哇哇叫怎麼這麼遠，要坐好久，但自從換了Custin後因為座椅太舒適，一家在車上熱熱鬧鬧玩得太開心都不會覺得路途很遙遠了，甚至環島也開心！所以我們出遊機會更多，全台四處趴趴走，也一路認識了不少車友，更值得誇讚的是，因為擁有這台車後還有很多機會參加車聚，適合家庭出遊的車，連車聚都辦得有聲有色，完全符合我們家庭，實在太慶幸了！",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1741156755_圖片2.jpg",
            },
            {
              id: 174,
              recommendation_title: "陪伴我人生後半段",
              recommendation_content:
                "人生的下半段精彩故事就由Custin來陪伴我們一家人繼續走下去 👍",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1741060367_圖片1.jpg",
            },
            {
              id: 173,
              recommendation_title: "戴著思念的Custin",
              recommendation_content:
                "去年，老婆傳來了第二胎的好消息，想想家裡的老瑞獅，看著家裡同住的岳母以及住在內湖的老爸老媽和未來出門至少2大加兩張安全座椅，想再坐第5人根本不可能，確立了放好小孩仍能進出第3排的MPV車型，於暑假就下訂大小勉強可以停路邊車格，又能舒適承載7人的Custin，沒想到11月老婆緊急剖腹，第2隻小可愛提早來到人世，但因為不明原因無法自主呼吸，在出生2天後便結束短短的人生，就在這天接到了新車通知，當下真心痛苦，當初為他而訂的車卻在他走了的時侯到來，幾番掙扎還是牽了回家，看著原本應該滿座的第二排不明悲傷，今年1月，原本空著的位置在南下探親時滿載大舅子一家和令岳母，2月帶著岳母姐妹們泡溫泉，現在，車子滿了",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1741060258_圖片1.jpg",
            },
            {
              id: 165,
              recommendation_title: "家用神車",
              recommendation_content:
                "同級價位首選\r\n家用的大空間\r\n配備盡完美",
              owner_photo:
                "https://api.custin-event.hyundai-motor.com.tw/storage/upload/1740986049_生活照2.jpg",
            },
          ];
        } else {
          // 如果不是 hanyuan.info 網域,呼叫 API
          results = await apiService.getStories();
        }

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
        const formCheck = checkForm();

        if (formCheck) {
          await apiService.postStories(storiesForm.value);
          alert("提交成功");

          //div id = closePostModal, closePostModal.click()
          const closePostModal = document.getElementById("closePostModal");
          closePostModal.click();
        } else {
          console.log(formErros.value);
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
        targetDiv.scrollIntoView({ behavior: "smooth" });
        menuVisible.value = false;
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
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    });

    onMounted(() => {
      window.onload = function () {
        animateNum();

        const modal = document.getElementById("contentModal");

        // 定義一個函數來停止YouTube影片
        function stopVideo() {
          const iframe = modal.querySelector("iframe");
          contentModalYTOpened.value = false;
          if (iframe) {
            const src = iframe.getAttribute("src");
            iframe.setAttribute("src", "");
            iframe.setAttribute("src", src);
          }
        }

        // 監聽modal關閉事件
        // 注意: 這裡的事件名稱可能需要根據你使用的modal庫來調整
        modal.addEventListener("hidden.bs.modal", stopVideo);
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
      if (runMobileMarquee.value) {
        cleanupInterval = setInterval(cleanupClonedElements, 2500); // 每5秒清理一次
      } else {
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
      const storyWallUpArrow = document.querySelector(
        "#story_wall_pc .arrow_up"
      );
      const storyWallDownArrow = document.querySelector(
        "#story_wall_pc .arrow_down"
      );
      const storyWall = document.querySelector("#story_wall_pc");
      const storyWallMobile = document.querySelector("#story_wall_mobile");
      const storyWallMobileUpArrow = document.querySelector(
        "#story_wall_mobile .arrow_up"
      );
      const storyWallMobileArrow = document.querySelector(
        "#story_wall_mobile .arrow_down"
      );

      if (storyWallUpArrow) {
        storyWallUpArrow.addEventListener("click", () => {
          console.log(123);
          if (storyWall) {
            storyWall.scrollBy({
              top: -100,
              behavior: "smooth",
            });
          }
        });
      }

      if (storyWallMobileUpArrow) {
        storyWallMobileUpArrow.addEventListener("click", () => {
          if (storyWallMobile) {
            storyWallMobile.scrollBy({
              top: -100,
              behavior: "smooth",
            });
          }
        });
      }

      if (storyWallDownArrow) {
        storyWallDownArrow.addEventListener("click", () => {
          if (storyWall) {
            storyWall.scrollBy({
              top: 100,
              behavior: "smooth",
            });
          }
        });
      }

      if (storyWallMobileArrow) {
        storyWallMobileArrow.addEventListener("click", () => {
          if (storyWallMobile) {
            storyWallMobile.scrollBy({
              top: 100,
              behavior: "smooth",
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
      menuVisible,
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
            <img src="/assets/img/nav_btn.webp" />
          </div>

          <div
            :class="menuVisible ? 'show' : ''"
            class="offcanvas offcanvas-end"
            tabindex="-1"
            style="visibility: visible"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title">Menu</h5>
              <button
                type="button"
                class="btn-close"
                @click="toggleMenu"
              ></button>
            </div>
            <div class="offcanvas-body">
              <div class="menu-list" @click="scrollTo('page_intro_mobile')">
                故事募集中
              </div>
              <div class="menu-list" @click="scrollTo('story_carousel_mobile')">
                幸福故事集
              </div>
              <div class="menu-list" @click="scrollTo('story_share_mobile')">
                Youtube體驗分享
              </div>
            </div>
          </div>
        </div>

        <div class="logo col-12">
          <img
            src="/assets/img/banner_logo_mobile.webp"
            loading="lazy"
            alt="logo"
          />
        </div>
        <div class="car col-12">
          <img src="/assets/img/banner_car.webp" loading="lazy" alt="logo" />
        </div>
        <div class="col-12">
          <span class="animatedNumber">{{ animatedNumber }}</span>
        </div>
      </div>
    </section>

    <section id="page_intro_pc" class="d-none" ref="page_intro_pc">
      <div class="page-content">
        <div class="row d-none">
          <div class="col-12 text-center">
            <div class="link" @click="scrollTo('page_intro_pc')">
              故事募集中
            </div>
            <div class="link" @click="scrollTo('story_carousel_pc')">
              幸福故事集
            </div>
            <div class="link" @click="scrollTo('story_share_pc')">
              YouTuber體驗分享
            </div>
          </div>
        </div>
      </div>
      <div
        class="text-center post_btn d-none"
        data-bs-toggle="modal"
        data-bs-target="#postModal"
      >
        <img src="/assets/img/post_btn.webp" loading="lazy" alt="enter" />
      </div>
    </section>
    <section
      id="page_intro_mobile"
      ref="page_intro_mobile"
      class="text-center post_btn d-none"
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
              <img
                src="/assets/img/story_title.webp"
                loading="lazy"
                alt="title"
              />
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
                      class="col-4 col-story"
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
                          loading="lazy"
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
                      class="col-4 col-story"
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
                    <div
                      class="col-4 col-story"
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
                            loading="lazy"
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
              <img
                src="/assets/img/story_title_mobile.webp"
                alt="title"
                loading="lazy"
              />
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
      <!-- <div class="arrow arrow_down"></div>
      <div class="arrow arrow_up"></div> -->
      <div class="row">
        <div class="col-6 story-wall left">
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
                        loading="lazy"
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
                        loading="lazy"
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
        <div class="col-6 story-wall right">
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
    </section>

    <section id="story_wall_mobile" ref="story_wall_mobile">
      <!-- <div class="arrow arrow_down"></div>
      <div class="arrow arrow_up"></div> -->
      <div class="container">
        <div class="row">
          <div class="col-12 story-wall">
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

    <section id="story_share_pc" class="d-none" ref="story_share_pc">
      <p class="text-center"><img src="/assets/img/wall_title.webp" /></p>
      <div class="story_share_container">
        <div class="story_share_row">
          <div class="story_share_col">
            <a
              href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy"
              class="d-inline-block"
              target="_blank"
            >
              <img src="/assets/img/kol_01.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a
                href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy"
                target="_blank"
                >彼得爸與蘇珊媽</a
              >
            </p>
            <p class="story_share_content">
              體驗完
              CUSTIN，果然跟當初看到的配備內容一樣，實在是一台好車～不管是主動被動安全配備還是內裝配備，全部都給好給滿！整體體驗下來真的是很不錯的
              <span
                ><a
                  href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy"
                  target="_blank"
                  >[More]</a
                ></span
              >
            </p>
          </div>

          <div class="story_share_col">
            <a
              href="https://www.youtube.com/watch?v=QDQ4iIjVFyY"
              class="d-inline-block"
              target="_blank"
            >
              <img src="/assets/img/kol_02.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a
                href="https://www.youtube.com/watch?v=QDQ4iIjVFyY"
                target="_blank"
                >絕代雙Ｑ</a
              >
            </p>
            <p class="story_share_content">
              薇0要從月子中心回家啦！今天特別給薇0一個驚喜 開全新的 THE ALL-NEW
              CUSTIN 頂級 LMPV 和阿嬤一起來接薇0～
              這台車真的蠻舒服的，很適合三代同堂一起乘坐
              <span
                ><a
                  href="https://www.youtube.com/watch?v=QDQ4iIjVFyY"
                  target="_blank"
                  >[More]</a
                ></span
              >
            </p>
          </div>

          <div class="story_share_col">
            <a
              href="https://www.youtube.com/watch?v=S8ynSa0YVGc"
              class="d-inline-block"
              target="_blank"
            >
              <img src="/assets/img/kol_03.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a
                href="https://www.youtube.com/watch?v=S8ynSa0YVGc"
                target="_blank"
                >小朗哥爸爸</a
              >
            </p>
            <p class="story_share_content">
              我們回台灣後第一禮拜假日帶阿公阿婆出去玩，
              這次剛好有一個好機會體驗7人座 THE ALL-NEW CUSTIN 頂級 LMPV，
              大家坐的很舒服，很有安全感！
              <span
                ><a
                  href="https://www.youtube.com/watch?v=S8ynSa0YVGc"
                  target="_blank"
                  >[More]</a
                ></span
              >
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
              <img src="/assets/img/tape.webp" loading="lazy" />
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
              <img src="/assets/img/tape.webp" loading="lazy" />
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
              <a
                :href="contentModalData.social_media_link"
                target="_blank"
                v-if="!contentModalData.social_media_link.includes('youtube')"
              >
                <img
                  :src="contentModalData.img_url"
                  v-if="contentModalData.img_url != null"
                />
              </a>
              <div v-else>
                <img
                  :src="contentModalData.img_url"
                  @click="contentModalYTOpened = true"
                  v-if="!contentModalYTOpened"
                  role="button"
                />
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
              <img
                :src="contentModalData.img_url"
                v-if="contentModalData.img_url != null"
              />
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
                    <img
                      src="/assets/img/post_modal_title.webp"
                      loading="lazy"
                      alt="post"
                    />
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
                    <div class="text-count">
                      <small
                        :class="{
                          'text-danger':
                            storiesForm.recommendation_content.length > 300,
                        }"
                      >
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
                    <img
                      class="step1_img"
                      src="/assets/img/step1.png"
                      loading="lazy"
                    />
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
                    <img
                      class="step2_img mb-2"
                      loading="lazy"
                      src="/assets/img/step2.png"
                    />
                    <p style="font-size: 18px; font-weight: 500">
                      上傳與CUSTIN的生活照或影片
                    </p>
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
                      style="padding: 0.375rem"
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
                    <span style="color: #000"
                      >*影片上傳請先發布於個人社群平台(FB/IG/YT)，並將該貼文設置為公開後提供分享連結</span
                    ><br />
                    <span style="color: #ff0000"
                      >*請至少上傳兩張與CUSTIN的生活照，生活照形式可參考網站中幸福故事集，以車主與愛車清晰合照為主</span
                    ><br />
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
                    <p>
                      LINE POINTS
                      100點(50位)、CUSTIN模型車(5名)、王品集團1,000元餐券(5名)、IONIQ自動摺疊傘(5名)
                    </p>
                    <h6>■ 投稿說明：</h6>
                    <p>
                      1.
                      投稿內容包含文字故事分享(300字內)以及搭配之圖片或影音(擇一)。
                    </p>
                    <p>
                      2.
                      如選擇上傳生活照，請至少上傳兩張與CUSTIN的生活照，生活照形式可參考網站中幸福故事集，以車主與愛車清晰合照為主。
                    </p>
                    <p>
                      3.
                      照片格式：檔案需提供約5MB內，具有1280*720的解析度(寬度至少為640像素)之圖檔，JPG/PNG。(目前手機都能拍攝出的規格)。
                    </p>
                    <p>
                      4.
                      影音格式：需先將影片上傳至個人社群平台Facebook或Instagram或YouTube，並將該貼文設置為公開後提供分享連結。
                    </p>
                    <p>
                      5.
                      投稿內容須符合上述規定，未符合規定者，主辦單位保有取消投稿資格(含領獎及抽獎資格)之權利。
                    </p>
                    <p>
                      6.
                      車主應確保投稿內容無侵害任何第三人之智慧財產權，不得使用他人照片、影片或截圖，經發現後主辦單位有權立即取消其獲贈資格，相關法律責任，由投稿者自行負責。
                    </p>
                    <p>
                      7.
                      投稿內容不得含有誹謗、侮辱、不雅、威脅、攻擊、色情等違反公共秩序或善良風俗、可能損害本活動進行之病毒檔案或其他任何惡意程式以及盜用他人著作內容或以AI生成方式產生之投稿內容。
                    </p>
                    <p>
                      8.
                      車主參加本活動並提供其個人資料予主辦單位，即視為已同意主辦單位依相關法令蒐集、處理及利用車主之個人資料
                      ，且同意其投稿作品、後續相關拍攝工作等無償永久授權主辦宣傳及使用。範圍包括使用投稿內容於國內外改編、重製、發布、公開傳輸、公開播送及公開上映等。
                    </p>
                    <h6>■ 獎項說明：</h6>
                    <p>
                      1.
                      完成投稿程序後，由主辦單位確認並審閱其內容，經主辦單位通知並成功刊登者，即贈送投稿者LINE
                      POINTS
                      100點(50位)。與CUSTIN模型車(5名)、王品集團1,000元餐券(5名)、IONIQ自動摺疊傘(5名)抽獎資格乙次。
                    </p>
                    <p>
                      2. 投稿者須有LINE帳號始得獲贈LINE
                      POINTS，以填入之手機號碼透過LINE發放，若因資料有誤導致寄送失敗、逾期未完成領取，皆視同放棄以上獎品，LINE
                      POINTS之使用及折扣優惠悉依Line官方使用辦法說明。
                    </p>
                    <p>
                      3.
                      依中華民國稅法規定，機會中獎之獎項價值超過新台幣1,000元以上者，於年度結算時必須計入個人之綜合所得申報，超過新臺幣20,010(含)元以上，需預先扣繳稅款，才可兌換獎項，故獲選車主應提供相關文件予主辦單位，以利主辦單位製作扣繳憑單，始得領取本活動獎項。若獲選車主未提供資料予主辦單位，則視同放棄獲選資格，不另行通知。
                    </p>
                    <h6>■ 獲選車主須知：</h6>
                    <p>
                      1.
                      投稿內容經主辦單位評選後，合適者將安排進一步的深入訪談、攝影或錄影紀錄等，如獲選車主無法全程配合主辦單位之安排，視同放棄獲選資格。
                    </p>
                    <p>
                      2.
                      主辦單位為獲選車主安排深入訪談所拍攝之照片、影片及成果物，其智慧財產權歸屬於主辦單位所有，主辦單位不另支付報酬予獲選車主。
                    </p>
                    <p>
                      ■兌獎與寄送將由主辦單位「南陽實業股份有限公司」指定之活動小組「博報堂思索股份有限公司」統一處理相關事宜，詳細兌獎方式將於得獎者與活動小組聯繫後進行通知，並以主辦單位規劃之方式為主，僅限郵寄至台、澎、金、馬地區。主辦單位有隨時有權取消、終止、修改活動內容，亦有權對本活動之所有事宜做出最終解釋或決定，及保留最後核准與否權利。相關未盡事宜，以Hyundai官網或官方粉絲團公告為準，不另行通知。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section id="story_share_mobile" class="d-none" ref="story_share_mobile">
      <p class="text-center" id="story_share_mobile_title">
        <img src="/assets/img/wall_title_mobile.webp" loading="lazy" />
      </p>
      <div class="story_share_container">
        <div class="story_share_row">
          <div class="story_share_col">
            <a
              href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy"
              class="d-inline-block"
              target="_blank"
            >
              <img src="/assets/img/kol_01.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a
                href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy"
                target="_blank"
                >彼得爸與蘇珊媽</a
              >
            </p>
            <p class="story_share_content">
              體驗完CUSTIN，果然跟當初看到的配備內容一樣，實在是一台好車～不管是主動被動安全配備還是內裝配備，全部都給好給滿！整體體驗下來真的是很不錯的
            </p>
            <span class="story_share_link"
              ><a
                href="https://youtu.be/9LWFInAFJCw?si=SECGqXFRm6Z_q1Jy"
                target="_blank"
                >[More]</a
              ></span
            >
          </div>

          <div class="story_share_col">
            <a
              href="https://www.youtube.com/watch?v=QDQ4iIjVFyY"
              class="d-inline-block"
              target="_blank"
            >
              <img src="/assets/img/kol_02.webp" loading="lazy" alt="..." />
            </a>

            <p class="story_share_title">
              <a
                href="https://www.youtube.com/watch?v=QDQ4iIjVFyY"
                target="_blank"
                >絕代雙Ｑ</a
              >
            </p>
            <p class="story_share_content">
              薇0要從月子中心回家啦！今天特別給薇0一個驚喜<br />
              開全新的THE ALL-NEW CUSTIN 頂級LMPV<br />
              和阿嬤一起來接薇0～<br />
              這台車真的蠻舒服的，很適合三代同堂一起乘坐
            </p>
            <span class="story_share_link"
              ><a
                href="https://www.youtube.com/watch?v=QDQ4iIjVFyY"
                target="_blank"
                >[More]</a
              ></span
            >
          </div>

          <div class="story_share_col">
            <a
              href="https://www.youtube.com/watch?v=S8ynSa0YVGc"
              class="d-inline-block"
              target="_blank"
            >
              <img src="/assets/img/kol_03.webp" loading="lazy" alt="..." />
            </a>
            <p class="story_share_title">
              <a
                href="https://www.youtube.com/watch?v=S8ynSa0YVGc"
                target="_blank"
                >小朗哥爸爸</a
              >
            </p>
            <p class="story_share_content">
              我們回台灣後第一禮拜假日帶阿公阿婆出去玩，<br />
              這次剛好有一個好機會體驗7人座 THE ALL-NEW CUSTIN 頂級LMPV，<br />
              大家坐的很舒服，很有安全感！
            </p>
            <span class="story_share_link"
              ><a
                href="https://www.youtube.com/watch?v=S8ynSa0YVGc"
                target="_blank"
                >[More]</a
              ></span
            >
          </div>
        </div>
      </div>
    </section>

    <section id="champion_pc" ref="champion_pc">
      <div class="row">
        <div class="col-7 champion_left">
          <img src="/assets/img/champion_title.webp" class="champion_title" />
          <img
            src="/assets/img/champion_car_left.webp"
            loading="lazy"
            class="champion_car"
          />
          <div class="champion-action-list">
            <a
              href="https://www.hyundai-motor.com.tw/testdrive.html?utm_source=officialwebsite&utm_medium=testdrive&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_testdrive.webp"
                class="champion-action testdrive"
                loading="lazy"
            /></a>
            <a
              href="https://www.hyundai-motor.com.tw/clicktobuy/custin/customize?utm_source=officialwebsite&utm_medium=clicktobuy&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_order.webp"
                class="champion-action order"
                loading="lazy"
            /></a>
            <a
              href="https://www.hyundai-motor.com.tw/clicktobuy/custin?utm_source=officialwebsite&utm_medium=clicktobuy_custin&utm_campaign=KU_event"
              target="_blank"
              ><img
                src="/assets/img/champion_more.webp"
                class="champion-action more"
                loading="lazy"
            /></a>
          </div>
        </div>
        <div class="col-5 champion_right">
          <img src="/assets/img/champion_right_1.webp" loading="lazy" />
          <p>前衛科技座艙</p>
          <img src="/assets/img/champion_right_2.webp" loading="lazy" />
          <p>感應式電動側滑門</p>
          <img src="/assets/img/champion_right_3.webp" loading="lazy" />
          <p>正七人座寬敞空間</p>
          <img src="/assets/img/champion_right_4.webp" loading="lazy" />
          <p>第二排VIP皇家座椅</p>
        </div>
      </div>
    </section>

    <section id="champion_mobile" ref="champion_mobile">
      <div class="row">
        <div class="col-12 champion_left">
          <img src="/assets/img/champion_title.webp" class="champion_title" />
          <img
            src="/assets/img/champion_car_left.webp"
            class="champion_car"
            loading="lazy"
          />
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
