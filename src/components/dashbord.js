import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import {ProcesVideos, UploadMainVideo, UploadOverlayVideo} from "../api's/network.js";
import useSweetAlert from "../alerts/useSweetAlert.jsx";
import ProgressBar from 'react-bootstrap/ProgressBar';



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



    useEffect(() => {

    }, [])
  
      

    const handleMainFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        setMainFileUploading('uploading....')
        setShowFileUploadedText(true);
        formData.append('mainVideo', selectedFile);
        setShowProgressBar(true);
        setTimeout(() => {
                        setProgress(5)   
                    }, 10000);
        UploadMainVideo(formData)
        .then((res) =>{
            if (res.data.success === true){
                setMainFileUploading('file successfully uploaded')
                if (res.data.data) {
                    setMainVideo(res.data.data);
                    setProgress(20)
                    setTimeout(() => {
                        setShowFileUploadedText(false);
                        setMainFileUploading('')
                    }, 10000);
                }
            }
        }).catch((err) => {
            setMainFileUploading('')
            showAlert('error', {
                title: err.message
            })
        })
        setMainFileName(selectedFile.name)
      };

      const handleOverlayFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        setOverlayFileUploading('uploading....')
        setShowOverlayFileUploadedText(true);
        formData.append('overlayVideo', selectedFile);
        setShowProgressBar(true);
        UploadOverlayVideo(formData)
        .then((res) =>{
            if (res.data.success === true){
                setOverlayFileUploading('File successfully uploaded')
                if (res.data.data) {
                    setOverlayVideo(res.data.data);
                    setProgress(45)
                    setTimeout(() => {
                        setShowOverlayFileUploadedText(false);
                        setOverlayFileUploading('');
                        
                    }, 10000);
                }
            }
        }).catch((err) => {
            setOverlayFileUploading('')
            showAlert('error', {
                title: err.message
            })
        })
        setOverlayFileName(selectedFile.name)
      };

    const handleSubmit = (e) =>{
        console.log('in handle submit', e.target.value)
        e.preventDefault();
        if (mainVideo && overlayVideo && variations){
        const formData = new FormData();
        console.log('in handle submit mainvideo', mainVideo)
        console.log('in handle submit overlay video', overlayVideo)
        formData.append('mainVideo', mainVideo);
        formData.append('overlayVideo', overlayVideo);
        formData.append('variations', variations);
        formData.append('style', style);
        console.log('form data in submit handle', formData)
        
        
        ProcesVideos(formData)
        .then((res) => {
            const binaryData = res.data;
            setProgress(100)
            navigate('/downloader', {state: {data: binaryData }}); 
            setShowProgressBar(false);    
        }).catch((err) => {
            showAlert('error', {
                title: err.message
                
            })
        })
    }else{
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
                <div className="form-group" style={{marginLeft: '200px', display: 'flex'}}>
                
                

                    <div className='input-group' style={{width:'70%'}}>
                        <input
                                type="text"
                                className="form-control"
                                value={mainFileName}
                                readOnly
                                style={{borderRight:'none'}}
                            />
                        <input
                            type="file"
                            className="form-control"
                            id='main-file-input'
                            onChange={handleMainFileInputChange}
                            style={{display: 'none'}}
                        />
                        <label htmlFor="main-file-input" className="custom-file-label">
                        <span className='file-button'>Select file</span>
                    </label>
                    </div>
                    {showFileUploadedText  && (
                            <div className='helping-text'><p>{mainFileUploading}</p></div>
                        )}
                    
                    </div> 
                <div  style={{textAlign: 'center', color: '#0A2F73', marginTop: '10px'}}><label><b>Upload overlay video (Long):</b></label></div>
                <div className="form-group" style={{marginLeft: '200px', display: 'flex'}}>
                    <div className='input-group' style={{width:'70%'}}>
                    <input
                            type="text"
                            className="form-control"
                            value={overlayFileName}
                            readOnly
                            style={{borderRight:'none'}}
                        />
                        <input
                            type="file"
                            className="form-control"
                            id='overlay-file-input'
                            onChange={handleOverlayFileInputChange}
                            style={{display: 'none'}}
                        />
                        <label htmlFor="overlay-file-input" className="custom-file-label">
                        <span className='file-button'>Select file</span>
                    </label>
                </div>
                {showOverlayFileUploadedText  && (
                            <div className='helping-text'><p>{overlayFileUploading}</p></div>
                        )}
                </div>
                <div className='container' style={{width: '45%'}}>
                <div className="form-group">
                    <div><label style={{color: '#E3E8F2'}}>select # of variations:</label></div>
                        <div className='input-group'>
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
                <div className="form-group">
                    <div><label style={{color: '#E3E8F2'}}>select style:</label></div>
                        <div className="input-group">
                        <select className='form-select' onChange={(e) => setStyle(e.target.value)} size='1' style={{
                            minHeight:'40px',
                            width:'100%',
                            borderRadius:'5px',
                        }}>
                            <option value="" hidden></option>
                            <option value="1">Overlay</option>
                            <option value="2">Border</option>
                        </select>  
                        </div>
                </div>
                
                <div className='container mt-3' style={{textAlign:'center'}}>
                
                <button type='button' className='btn btn-light' style={{border: '1px solid #D9D9D9', borderRadius:'10px' , marginRight: '10px', backgroundColor:'#D9D9D9', color: 'white' }}><b>Cancel</b></button>
                <button type='button' onClick={handleSubmit} className='btn btn-light' style={{border: '1px solid #00B884', borderRadius:'10px' , backgroundColor:'#00B884', color: 'white'}} disabled={!mainVideo || !overlayVideo}><b>Generate Variations</b></button>
                </div>
                </div>
                 {showProgressBar && (
                    <div className='mt-3' style={{width: '70%', textAlign: 'center', marginLeft: '130px'}}> 
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