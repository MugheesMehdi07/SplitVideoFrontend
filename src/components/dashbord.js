import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import {ProcesVideos, UploadMainVideo, UploadOverlayVideo} from "../api's/network.js";
import useSweetAlert from "../alerts/useSweetAlert.jsx";
import ProgressBar from 'react-bootstrap/ProgressBar';
import AWS from 'aws-sdk';



const Dash = () => {
    const [mainVideo, setMainVideo] = useState(null);
    const [overlayVideo, setOverlayVideo] = useState(null);
    const [variations, setVariations] = useState('');
    const [style, setStyle] = useState('');
    const showAlert = useSweetAlert();
    const [mainFileName, setMainFileName] = useState('');
    const [overlayFileName, setOverlayFileName] = useState('');
    const [mainFileUploading, setMainFileUploading] = useState('');
    const [overlayFileUploading, setOverlayFileUploading] = useState('');
    const navigate = useNavigate();
    const [showFileUploadedText, setShowFileUploadedText] = useState(false);
    const [showOverlayFileUploadedText, setShowOverlayFileUploadedText] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(false); // Flag to show/hide the progress bar
    

    const config = {
        bucketName: 'esr-media',
        region: 'us-east-2',
        accessKeyId: 'AKIAZDPYVJHPXWJCBY7J',
        secretAccessKey: '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',
    }

    const uploadFile = async (key, file, config) => {
        return new Promise((resolve, reject) => {
          const s3 = new AWS.S3(config);
          const params = {
            Bucket: 'esr-media',
            Key: key,
            Body: file, // This is the file data
            ACL: 'public-read',
          };
          s3.upload(params, (err, data) => {
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
        console.log('in main handle')
        const selectedFile = e.target.files[0];
      
        if (selectedFile && selectedFile.type.startsWith('video/')) {
          setMainFileUploading('Uploading...');
          setShowFileUploadedText(true)
          try {
            const filename = generateUniqueFileName(selectedFile)
            const key = `main/${filename}`;
            const data = await uploadFile(key, selectedFile, config);
            console.log('File uploaded:', data);
            setMainFileUploading('File successfully uploaded');
      
            setTimeout(() => {
              setShowFileUploadedText(false);
              setMainFileUploading('');
            }, 5000);
            const s3FileUrl = data.Location;
            console.log('File URL:', s3FileUrl);
            setMainVideo(s3FileUrl)
          } catch (err) {
            console.error('Error uploading file:', err);
            showAlert('error', {
              title: err.name,
            });
            e.target.value = '';
            setShowFileUploadedText(false);
            setMainFileUploading('');
          }
        }
      };

    const handleOverlayFileInputChange = async (e) => {
        console.log('in overlay handle');
        const selectedFile = e.target.files[0];
        console.log('selected file', selectedFile);
    
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setShowOverlayFileUploadedText(true);
            setOverlayFileUploading('Uploading...');
            try {
                const filenm = generateUniqueFileName(selectedFile);
                const key = `overlay/${filenm}`;
                const data = await uploadFile(key, selectedFile, config);
                console.log('overlay File uploaded:', data);
                setOverlayFileUploading('File successfully uploaded');
          
                setTimeout(() => {
                  setShowFileUploadedText(false);
                  setOverlayFileUploading('');
                }, 5000);
                const s3FileUrl = data.Location;
                console.log('File URL:', s3FileUrl);
                setOverlayVideo(s3FileUrl)
              } catch (err) {
                console.error('Error uploading file:', err);
                showAlert('error', {
                  title: err.name,
                });
                e.target.value = '';
                setShowOverlayFileUploadedText(false);
                setOverlayFileUploading('');
              }
            }
          };


    const handleSubmit = (e) =>{
        e.preventDefault();
        if (mainVideo && overlayVideo && variations){
            console.log('in submit handle')
            console.log('main video in submit handle', mainVideo)
            console.log('overlay vidoe in submit handle', overlayVideo)
            const formData = new FormData();
            formData.append('mainVideo', mainVideo);
            formData.append('overlayVideo', overlayVideo);
            formData.append('variations', variations);
            formData.append('style', style);
            
            setProgress(prevProgress => prevProgress + 10);
            ProcesVideos(formData)
            
            .then((res) => {
                const binaryData = res.data;
                setProgress(prevProgress => prevProgress + 40);
                navigate('/downloader', {state: {data: binaryData }}); 
                setShowProgressBar(false);    
            })
            .catch((err) => {
                console.log('error in generate variation', err)
                showAlert('error', {
                    title: err.message   
                })
                setShowProgressBar(false);
            })
        }
        else{
        showAlert('error', {
            title: 'all fields are required'     
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
            <div className= 'row' style={{marginLeft:'70px'}}>
                <div className="col-10 ">
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
                <div className="col-2 ">
                    {showFileUploadedText  && (
                        <div className='helping-text'  style={{ whiteSpace: 'nowrap' }}><p>{mainFileUploading}</p></div>
                    )}
                </div>
            </div> 

            <div  style={{textAlign: 'center', color: '#0A2F73', marginTop: '10px'}}><label><b>Upload overlay video (Long):</b></label></div>
                <div className= 'row' style={{marginLeft:'70px'}}>
                    <div className="col-10">
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
                     <div className="col-2 ">
                        {showOverlayFileUploadedText  && (
                                <div className='helping-text' style={{ whiteSpace: 'nowrap' }}><p>{overlayFileUploading}</p></div>
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
                            <option value="1">Overlay</option>
                            <option value="2">Border</option>
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
                
                    
        </div>
    </div>
</div>
        
    );
};

export default Dash;