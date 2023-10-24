import axios from "axios";
const dev_Url = "http://127.0.0.1:8000/"
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
    return axios.post(dev_Url + "generatevariations/", params, {headers});
}

export function checkTaskStatusApi(taskId) {
  const params = {
    'task_id': taskId
  }

  const headers = {
    'Content-Type': 'application/json',
  };
 
  console.log('in checkTaskStatusApi')
  return axios.post(dev_Url + "checkstatus/", params, {headers});
}
