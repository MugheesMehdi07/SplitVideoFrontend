import axios from "axios";
const Dev_Url = "http://127.0.0.1:8000/"

export function ProcesVideos(params) {

    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    console.log('in process video api main video', params.get('mainVideo'))
    return axios.post(Dev_Url, params, {headers});
}