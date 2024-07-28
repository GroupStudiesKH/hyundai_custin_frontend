import axios from "axios";

let apiUrl = "https://api.hyundai.hanyuan.info/api/";
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


export default {
  getStories
};
