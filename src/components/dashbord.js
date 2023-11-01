import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import {ProcesVideos, UploadMainVideo, UploadOverlayVideo, checkTaskStatusApi, generateZip, checkZipStatusApi} from "../api's/network.js";
import useSweetAlert from "../alerts/useSweetAlert.jsx";
import ProgressBar from 'react-bootstrap/ProgressBar';
import AWS from 'aws-sdk';
import axios from "axios";
import JSZip from 'jszip';


const Dash = () => {
    const [mainVideo, setMainVideo] = useState(null);
    const [overlayVideo, setOverlayVideo] = useState(null);
    const [variations, setVariations] = useState('');
    const [style, setStyle] = useState('');
    const showAlert = useSweetAlert();
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [mainUploadProgress, setMainUploadProgress] = useState(0);
    const [overlayUploadProgress, setOverlayUploadProgress] = useState(0);
    const [videoUrls, setVideoUrls] = useState([]);

    const tolerance = 0.01;




    AWS.config.update({
      bucketName: 'processed-videos-1',
      accessKeyId: 'AKIA5IDIDMGRDADUBS5E',
      secretAccessKey: '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',
      region: 'us-east-1',
      });
  
    const s3 = new AWS.S3();
    const uploadFile = async (key, file) => {
        const params = {
            Bucket:'processed-videos-1',
            Key: key,
            Body: file,
            ACL: 'public-read',
        };

        return new Promise((resolve, reject) => {
            const request = s3.upload(params);

            request.on('httpUploadProgress', (progress) => {
                const loaded = progress.loaded;
                const total = progress.total;
                const percentage = Math.round((loaded / total) * 100);
                console.log('percentage', percentage)
                if (key.includes('main')){
                setMainUploadProgress(percentage);
                } else{
                setOverlayUploadProgress(percentage);

                }
            });

            request.send((err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    };

    const generateUniqueFileName = (file) => {
      const currentDateTime = new Date().toISOString().replace(/[-:.T]/g, '');
      const fileExtension = file.name.split('.').pop(); 
      const uniqueFileName = `${currentDateTime}.${fileExtension}`;
      return uniqueFileName;
    };
      
    const handleMainFileInputChange = async (e) => {
        const selectedFile = e.target.files[0];
      
        if (selectedFile && selectedFile.type.startsWith('video/')) {
          try {
            const filename = generateUniqueFileName(selectedFile)
            const key = `main/${filename}`;
            const data = await  uploadFile(key, selectedFile);
            if (data?.Location){
            const s3FileUrl = data.Location;
            console.log('s3 file url', s3FileUrl)
            setMainVideo(s3FileUrl)
            }
          } catch (err) {
            console.error('Error uploading file:', err);
            showAlert('error', {
              title: err.name,
            });
            e.target.value = '';
          }
        }
        else{
          showAlert('error', {
            title: 'Please upload video file',
          });
          e.target.value = '';
        }
      };


    const handleOverlayFileInputChange = async (e) => {
        console.log('in overlay handle');
        const selectedFile = e.target.files[0];
        console.log('selected file', selectedFile);
    
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            try {
                const filenm = generateUniqueFileName(selectedFile);
                const key = `overlay/${filenm}`;
                const data = await  uploadFile(key, selectedFile);
                console.log('overlay File uploaded:', data);
                if (data?.Location){
                const s3FileUrl = data.Location;
                console.log('File URL:', s3FileUrl);
                setOverlayVideo(s3FileUrl)
                }
              } catch (err) {
                showAlert('error', {
                  title: err.name,
                });
                e.target.value = '';
              }
            }
            else{
              showAlert('error', {
                title: 'Please upload video file',
              });
              e.target.value = '';
            }
          };

          
    async function generateZipData(zipFileUrls) {
      try{
      const zipGenerationStartTime = Date.now()/1000;
      console.log('zip start time', zipGenerationStartTime)
        console.log('file urls', zipFileUrls)
        const response = await fetch(zipFileUrls);
        console.log('response', response)
        if (response.ok) {
          const zipBlob = await response.blob();
          const zipGenerationEndTime = Date.now() / 1000;
          console.log('zip end time', zipGenerationEndTime);
          const elapsedSeconds = zipGenerationEndTime - zipGenerationStartTime;
          console.log(`Zip generation took ${elapsedSeconds} seconds`);
          return zipBlob;
        } else {
          console.error(`Failed to download file`);
        }
    }
    catch (error) {
      showAlert('error', {
        title: 'Something went wrong'  
    })
    }
  }



      const checkStatus = (taskId) => {
          checkTaskStatusApi(taskId)
              .then((response) => {
               
                  setProgress(prevProgress => Math.min(prevProgress + 5, 95));
                  if (response && response.video_urls) {
                    setVideoUrls(response.video_urls);
                  }
                  
                  if (response.data.task_status === "Completed") {
                      setProgress(100);
                      if (response?.data?.zip_url) {
                          navigate('/downloader', { state: { zipData: response.data.zip_url } });
                      }
                  } else if (response.data.task_status === "Failed") {
                      showAlert('error', {
                          title: 'Video processing failed'
                      });
                      setShowProgressBar(false);
                  } else {
                      // If status is neither "Completed" nor "Failed", keep checking.
                      setTimeout(() => checkStatus(taskId), 10000);
                  }
              })
              .catch((err) => {
                  showAlert('error', {
                      title: err.message
                  });
                  setShowProgressBar(false);
              });
        };
        
    
  
          const handleSubmit = (e) => {
            if (mainVideo && overlayVideo && variations) {
                e.preventDefault();
 
                setShowProgressBar(true)
                setTimeout(() => {
                    setProgress(prevProgress => prevProgress + 5);
                }, 10000);
        
                ProcesVideos(mainVideo, overlayVideo, variations, style)
                    .then((res) => {
                        console.log(res);
                        if (res?.data?.task_id) {
                            console.log("Got Task ID");
                            const taskId = res.data.task_id;
                            setProgress(prevProgress => prevProgress + 5);
                            checkStatus(taskId)
                        }
                    })
                    .catch((err) => {
                        showAlert('error', {
                            title: err.message
                        })
                        setShowProgressBar(false);
                    })
            }
            else {
                showAlert('error', {
                    title: 'All fields are required'
                })
            }
          }


    return (
        <div className='parent1'>
            <div className='parent-container '>
            <div className='child-container '>
            <h6 style={{textAlign: 'center', color: '#0A2F73', fontFamily:'Plus Jakarta Sans'}}>CONTENT ROLLER</h6>
            <h3 style={{textAlign: 'center', color: '#0A2F73'}}>UPLOAD FILES</h3>
            
            <form className='m-5'>
            <div style={{textAlign: 'center', color: '#0A2F73'}}><label><b>Upload main video (Short):<span style={{color:'red'}}></span></b></label></div>
            <div className= 'row' style={{marginLeft:'100px'}}>
                <div className="col-9 ">
                    <div className="form-group" style={{ position: 'relative' }}>
                        <input
                            type="file"
                            className="form-control"
                            id="main-file-input"
                            onChange={handleMainFileInputChange}
                        />
                        <label htmlFor="main-file-input" className="custom-file-label" style={{ position: 'absolute', right: '0', top: '0', bottom: '0' }}>
                            <span className='file-button'>Select file</span>
                        </label>
                    </div>
                </div>
                <div className="col-3 ">
                {mainUploadProgress > 0 && mainUploadProgress < 100 - tolerance && (
                <ProgressBar now={parseInt(mainUploadProgress)} label={`${parseInt(mainUploadProgress)}%`} variant = "success" animated />
            )}  
                </div>
            </div> 

            <div  style={{textAlign: 'center', color: '#0A2F73', marginTop: '10px'}}><label><b>Upload overlay video (Long):</b></label></div>
                <div className= 'row' style={{marginLeft:'100px'}}>
                    <div className="col-9">
                        <div className="form-group" style={{ position: 'relative' }}>
                            <input
                                type="file"
                                className="form-control"
                                id="overlay-file-input"
                                onChange={handleOverlayFileInputChange}
                                
                            />
                            <label htmlFor="overlay-file-input" className="custom-file-label" style={{ position: 'absolute', right: '0', top: '0', bottom: '0' }}>
                                <span className='file-button'>Select file</span>
                            </label>
                        </div>
                    </div>
                     <div className="col-3">
                     {overlayUploadProgress > 0 && overlayUploadProgress < 100 - tolerance && (
                        <ProgressBar now={parseInt(overlayUploadProgress)} label={`${parseInt(overlayUploadProgress)}%`} variant = "success" animated />
                    )}
                    </div>  
                </div>

            <div className='row mt-3'>
                <div className="col-6 mx-auto">
                     <div className="form-group">
                        <div><label style={{color: '#E3E8F2'}}>select # of variations:</label></div>
                        <select  class="form-select" 
                        onChange={(e) => setVariations(e.target.value)}
                        >
                            <option value="" hidden></option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>  
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className="col-6 mx-auto">
                    <div className="form-group">
                        <div><label style={{color: '#E3E8F2'}}>select style:</label></div>
                        <select className='form-select' onChange={(e) => setStyle(e.target.value)}>
                            <option value="" hidden></option>
                            <option value="overlay">Overlay</option>
                            <option value="shrink">Shrink</option>
                        </select>    
                    </div>
                </div>
            </div>

            <div className='container mt-3' style={{textAlign:'center'}}>   
                <button type='button' className='btn btn-light' style={{border: '1px solid #D9D9D9', borderRadius:'10px' , marginRight: '10px', backgroundColor:'#D9D9D9', color: 'white' }}><b>Cancel</b></button>
                <button type='button' onClick={handleSubmit} className='btn btn-light' style={{border: '1px solid #00B884', borderRadius:'10px' , backgroundColor:'#00B884', color: 'white'}} disabled={!mainVideo || !overlayVideo}><b>Generate Variations</b></button>
            </div>  
            
            {showProgressBar && (
            <div className='mt-3' style={{width: '70%', textAlign: 'center', marginLeft: '70px'}}> 
                        <ProgressBar now={progress} label={`${progress}%` } variant = "success"/>
                        <p>Processing Videos</p>
                        </div>
                    )}
            </form>
            <div>
                <ul>
                    {videoUrls.map((url, index) => (
                        <li key={index}>
                            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                        </li>
                    ))}
                </ul>
            </div>   
                    
        </div>
    </div>
</div>
        
    );
};

export default Dash;