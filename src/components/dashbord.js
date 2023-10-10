import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import {ProcesVideos} from "../api's/network.js";
import useSweetAlert from "../alerts/useSweetAlert.jsx";



const Dash = () => {
    const [mainVideo, setMainVideo] = useState(null);
    const [overlayVideo, setOverlayVideo] = useState(null);
    const [variations, setVariations] = useState('');
    const [style, setStyle] = useState('');
    const showAlert = useSweetAlert();
    const [mainFileName, setMainFileName] = useState('');
    const [overlayFileName, setOverlayFileName] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
    const customSelect = document.getElementById("customselect");

    customSelect.addEventListener("focus", function () {
        this.size = 5;
    });

    customSelect.addEventListener("change", function () {
        this.blur();
    });

    customSelect.addEventListener("blur", function () {
        this.size = 1;
        this.blur();
    });

    }, [])

    const handleMainFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        setMainFileName(selectedFile.name)
        setMainVideo(selectedFile);
      };
      const handleOverlayFileInputChange = (e) => {
        console.log('in overlay file handle')
        const selectedFile = e.target.files[0];
        setOverlayFileName(selectedFile.name)
        setOverlayVideo(selectedFile);
      };

    const handleSubmit = (e) =>{
        console.log('in handle submit', e.target.value)
        e.preventDefault();

        const formData = new FormData();
        formData.append('mainVideo', mainVideo);
        formData.append('overlayVideo', overlayVideo);
        formData.append('variations', variations);
        formData.append('style', style);
        console.log('form data in submit handle', formData)
        ProcesVideos(formData)
        .then((res) => {
            
            console.log('type of res data', typeof res.data)
            console.log('header of res data', res.headers)
            console.log('status of res data', res.status)
            console.log('res', res.data.data) 
            const bn = res.data.data;
            const binaryData = bn.blob();
                    navigate('/downloader', {state: {data: binaryData }}); 
                
        }).catch((err) => {
            showAlert('error', {
                title: err.message
                
            })
        })
    }
    


    return (
        <div className='parent1'>
            <div className='parent-container '>
                <div className='child-container'>
            <h6 style={{textAlign: 'center', color: '#0A2F73', fontFamily:'Plus Jakarta Sans'}}>CONTENT ROLLER</h6>
            <h3 style={{textAlign: 'center', color: '#0A2F73'}}>UPLOAD FILES</h3>
            <form className='m-5'>
                <div className="form-group m-3">
                    <div style={{textAlign: 'center', color: '#0A2F73'}}><label><b>Upload main video (Short):</b></label></div>
                    <div className='input-group'>
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
                    </div> 
                 <div className="form-group m-3">
                    <div  style={{textAlign: 'center', color: '#0A2F73'}}><label><b>Upload overlay video (Long):</b></label></div>
                    <div className='input-group'>
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
                </div>
                <div className='container' style={{width: '70%'}}>
                <div className="form-group">
                    <div><label style={{color: '#E3E8F2'}}>select # of variations:</label></div>
                        <div className='input-group'>
                        <select  id="customselect" size="1"
                        onChange={(e) => setVariations(e.target.value)}
                        style={{
                            minHeight:'40px',
                            width:'100%',
                            borderRadius:'5px',
                        }}
                        >
                            <option value="" hidden></option>
                            <option value="1">1 variation</option>
                            <option value="2">2 variations</option>
                            <option value="3">3 variations</option>
                            <option value="4">4 variations</option>
                            <option value="5">5 variations</option>
                            <option value="6">6 variations</option>
                            <option value="7">7 variations</option>
                            <option value="8">8 variations</option>
                            <option value="9">9 variations</option>
                            <option value="10">10 variations</option>
                        </select>  
                        </div>
                        
                </div>
                <div className="form-group">
                    <div><label style={{color: '#E3E8F2'}}>select style:</label></div>
                        <div className="input-group">
                        <select  onChange={(e) => setStyle(e.target.value)} size='1' style={{
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
                </div>
                <div className='container mt-3' style={{textAlign:'center'}}>
                <button type='button' className='btn btn-light' style={{border: '1px solid #D9D9D9', borderRadius:'10px' , marginRight: '10px', backgroundColor:'#D9D9D9', color: 'white' }}><b>Cancel</b></button>
                <button type='button' onClick={handleSubmit} className='btn btn-light' style={{border: '1px solid #00B884', borderRadius:'10px' , backgroundColor:'#00B884', color: 'white'}}><b>Generate Variations</b></button>
                </div>
                </form>
                
        </div>
        </div>
        </div>
        
    );
};

export default Dash;