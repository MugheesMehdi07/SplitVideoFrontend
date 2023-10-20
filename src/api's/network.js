import axios from "axios";
const Dev_Url = "http://127.0.0.1:8000/"
const prod_url = "http://videoprocessingbackend.rootpointers.net/"

export function ProcesVideos(params) {
    console.log('process video called')
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    // const config = {
    //   headers,
    //   responseType: 'blob',
    // };
    return axios.post(Dev_Url + "generatevariations/", params, {headers});
}

export function checkTaskStatusApi(taskId) {
  const params = {
    'task_id': taskId
  }

  const headers = {
    'Content-Type': 'application/json',
  };
 
  console.log('in checkTaskStatusApi')
  return axios.post(Dev_Url + "checkstatus/", params, {headers});
}

export function generateZip(fileurls) {
  const params = {
    'file_urls': fileurls
  }

  const headers = {
    'Content-Type': 'application/json',
  };
  const config = {
      headers,
      responseType: 'blob',
    };
 
  console.log('in generate zip api')
  return axios.post(Dev_Url + "generatezip/", params, config);
}