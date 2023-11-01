import axios from "axios";

const dev_Url = "http://127.0.0.1:8000/"
const default_prod_url = "https://1nkljvfey0.execute-api.us-east-2.amazonaws.com/";



export function ProcesVideos(mainVideoPath, overlayVideoPath, variationsCount, styleType) {
    console.log('process video called');
    const prod_url = localStorage.getItem('prod_url') || default_prod_url;
     // Construct the GET URL
    const requestURL = `${dev_Url}video_processor?video1_path=${encodeURIComponent(mainVideoPath)}&video2_path=${encodeURIComponent(overlayVideoPath)}&split_variations=${variationsCount}&style=${styleType}`;
    console.log(requestURL);
    return axios.get(requestURL);
}

export function checkTaskStatusApi(taskId) {

  const prod_url = localStorage.getItem('prod_url') || default_prod_url;
  const requestURL = `${dev_Url}task_status?task_id=${taskId}`;
  console.log('in checkTaskStatusApi')
  return axios.get(requestURL);
}
