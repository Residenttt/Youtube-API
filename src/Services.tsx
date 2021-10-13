import axios from "axios";

const api_token = "AIzaSyD7VfeYKWxeOfxklWIA41Sj6xPOW0DGn9E";
const service = axios.create({
  baseURL: "https://youtube.googleapis.com/youtube/v3/",
});

export function getYoutube(search: string) {
  const params = {
    key: api_token,
    part: "snippet",
    q: search,
    type: "video",
  };
  return service.get(`search`, { params: params });
}

/* Favori videolar */
export function getPopular() {
  const params = {
    key: api_token,
    part: "snippet",
    chart: "mostPopular",
    regionCode: "TR",
    maxResults: 6,
  };
  return service.get(`videos`, { params: params });
}
