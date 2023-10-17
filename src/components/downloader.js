import React from 'react';
import axios from "axios";
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import {ProcesVideos} from "../api's/network.js";
import useSweetAlert from "../alerts/useSweetAlert.jsx";
import fileDownload from 'js-file-download';
import JSZip from 'jszip';




const Downloader = () => {
    const showAlert = useSweetAlert();
    const location = useLocation();
    const [zipFile, setZipFile] = useState('')
    const res = location?.state?.data;
    const filename = 'split_videos.zip';
    const navigate = useNavigate();
    useEffect(() => {
        setZipFile(res)
    }, [res])

    function downloadFile(zipFileBytes, name) {  
        const binaryData = zipFileBytes;  
        const zip = new JSZip();
        zip.loadAsync(binaryData)
        .then((zip) => {
            const fileNames = Object.keys(zip.files);
            console.log('filenames', fileNames)
            fileNames.forEach((fileName) => {
            zip.files[fileName].async("arraybuffer").then((fileData) => {
            zip.file(fileName, fileData);
            });
            });

            // Generate a new zip file containing the extracted data
            return zip.generateAsync({ type: "blob", compression: 'DEFLATE' });
        })
        .then((blob) => {
            // SVGAnimatedPreserveAspectRatio(blob, "SplitVideos.zip")
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "SplitVideos.zip";
            a.style.display = "none";

            // Trigger the download
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            setTimeout(() => {
                navigate('/'); 
            }, 10000); // 10 seconds in milliseconds
        
        })
        .catch((error) => {
            console.error("Error loading and extracting zip file:", error);
        });

        }
        

   
    return (
        <div className='parent1'>
            <div className='parent-container '>
                <div className='child-container2'>
            <h6 style={{textAlign: 'center', color: '#0A2F73', fontFamily:'Plus Jakarta Sans'}}>CONTENT ROLLER</h6>
            <h3 style={{textAlign: 'center', color: '#0A2F73'}}>DOWNLOAD FILES</h3>
                <div className="form-group m-3">
                        <div className="input-group">
                            <input type="text" className="form-control" value={filename} style={{borderBlockStyle: 'dotted', textAlign: 'center'}} readOnly/>    
                        </div> 
                    </div>
                <div className='container mt-3' style={{textAlign:'center'}}>
                <button onClick={() => downloadFile(zipFile, filename)} style={{border: '1px solid #00B884', borderRadius:'10px' , backgroundColor:'#00B884', color: 'white', padding: '5px'}}><b>Download Zip File</b></button>
                </div>
                
        </div>
        </div>
        </div>
        
    );
};

export default Downloader;