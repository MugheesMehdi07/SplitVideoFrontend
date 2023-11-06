import axios from "axios";

const dev_Url = "http://127.0.0.1:5000/"
const default_prod_url = "https://1nkljvfey0.execute-api.us-east-2.amazonaws.com/";



export function ProcesVideos(mainVideoPath, overlayVideoPath, variationsCount, styleType, checked, userId, captionText) {
    console.log('process video called');
    const params = {
      'video1_path': mainVideoPath,
      'video2_path': overlayVideoPath,
      'split_variations': variationsCount,
      'style': styleType,
      'watermark': checked,
      'userId': userId,
      'caption': captionText
    }
    const prod_url = localStorage.getItem('prod_url') || default_prod_url;
    console.log('production url', prod_url)
     // Construct the GET URL
    const requestURL = `${dev_Url}video_processor?video1_path=${encodeURIComponent(mainVideoPath)}&video2_path=${encodeURIComponent(overlayVideoPath)}&split_variations=${variationsCount}&style=${styleType}`;
    return axios.post(default_prod_url + "video_processor", params);
}

export function checkTaskStatusApi(taskId) {

  const prod_url = localStorage.getItem('prod_url') || default_prod_url;
  const requestURL = `${default_prod_url}task_status?task_id=${taskId}`;
  console.log('in checkTaskStatusApi')
  return axios.get(requestURL);
}
