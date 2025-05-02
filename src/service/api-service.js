import axios from "axios";

let apiUrl = "https://api.custin-event.hyundai-motor.com.tw/api/";
// let apiUrl = "http://localhost:8000/api/";

//Cookie ExpireDate
let expire = new Date();
expire.setTime(expire.getTime() + 7 * 24 * 60 * 60 * 1000);
let expireString = "expires=" + expire.toGMTString();


//分散出去的API，建議改寫到測試環境
const homeUrl = "http://localhost:5173/";


const scGet = (url) => {
  return {
    url: url,
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      "Content-type": "application/json",
      // Server_Token: getServerToken(),
    },
  };
};

const scPost = (url, params, isJsonContent = true) => {
  const headers = {
    "Cache-Control": "no-cache",
    // Server_Token: getServerToken(),
  };
  if (isJsonContent) headers["Content-type"] = "application/json";
  return {
    url: url,
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      // Server_Token: getServerToken(),
    },
    data: params,
  };
};

const scPatch = (url, params) => {
  return {
    url: url,
    method: "PATCH",
    headers: {
      "Cache-Control": "no-cache",
      "Content-type": "application/json",
      // Server_Token: getServerToken(),
    },
    data: params,
  };
};

const scPut = (url, params) => {
  return {
    url: url,
    method: "PUT",
    headers: {
      "Cache-Control": "no-cache",
      "Content-type": "application/json",
      // Server_Token: getServerToken(),
    },
    data: params,
  };
};

const scDelete = (url, params) => {
  return {
    url: url,
    method: "DELETE",
    headers: {
      "Cache-Control": "no-cache",
      "Content-type": "application/json",
      // Server_Token: getServerToken(),
    },
    data: params,
  };
};

const scOption = (url, params) => {
  return {
    url: url,
    method: "OPTION",
    headers: {
      "Cache-Control": "no-cache",
      "Content-type": "application/json",
      // Server_Token: getServerToken(),
    },
    data: params,
  };
};

const checkServerResponse = (responseData) => {
  if (responseData.data.status != 'success' || responseData.status != 200) {
    // Error response
    throw responseData.data.message;
  }
  return responseData.data.content;
};

const objectToQueryString = (obj) => {
  const queryParams = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      queryParams.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return queryParams.join('&');
}

const getStories = async () => {
  const requestConfig = scGet(`${apiUrl}stories/list`);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

//[POST] stories
const postStories = async (params) => {
  // 创建一个 FormData 对象
  const formData = new FormData();
  formData.append('car_owner_name', params.car_owner_name);
  formData.append('license_plate', params.license_plate);
  formData.append('contact_phone', params.contact_phone);
  formData.append('contact_email', params.contact_email);
  formData.append('recommendation_title', params.recommendation_title);
  formData.append('recommendation_content', params.recommendation_content);
  formData.append('social_media_link', params.social_media_link);
  
  // 添加文件到 FormData 对象
  if (params.carPhotoUpload) {
    formData.append('carPhotoUpload', params.carPhotoUpload);
  }
  if (params.ownerPhotoUpload) {
    formData.append('ownerPhotoUpload', params.ownerPhotoUpload);
  }

  if (params.ownerPhoto2Upload) {
    formData.append('ownerPhotoUpload2', params.ownerPhoto2Upload);
  }

  // 配置请求
  const requestConfig = {
    method: 'post',
    url: `${apiUrl}stories`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};


export default {
  getStories,
  postStories
};
