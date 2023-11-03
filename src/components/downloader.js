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
    const res = location?.state?.zipData;
    const filename = 'split_videos.zip';
    const navigate = useNavigate();
    useEffect(() => {
        setZipFile(res)
    }, [res])

   
    function downloadFile(zipFileBytes, name) {
        const blob = new Blob([zipFileBytes], { type: 'application/octet-stream' });
      
        const zip = new JSZip();
        zip.loadAsync(blob)
          .then((zip) => {
            const flattenedFiles = {};
      
            zip.forEach((relativePath, file) => {
              // Remove any folder structure, keeping only the file name
              const parts = relativePath.split('/');
              const fileName = parts[parts.length - 1];
              flattenedFiles[fileName] = file;
            });
      
            return flattenedFiles;
          })
          .then((flattenedFiles) => {
            const zip = new JSZip();
            Object.keys(flattenedFiles).forEach((fileName) => {
              zip.file(fileName, flattenedFiles[fileName].async('arraybuffer'));
            });
      
            return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
          })
          .then((flattenedZipBlob) => {
            // Here you can do something with the flattened ZIP blob
            // For example, you can initiate a download
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            const url = window.URL.createObjectURL(flattenedZipBlob);
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
            setTimeout(() => {
                navigate('/'); 
            }, 10000);
          });
      }
      
      
    function downloadFile(zipFile, filename) {
        const link = document.createElement('a');
        link.href = zipFile;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
          
          
    // function downloadFile(zipBlob, name) {
    //     if (zipBlob) {
    //         // Use the zipBlob for download or any further processing
    //         // For example, initiating a download:
    //         const url = window.URL.createObjectURL(zipBlob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = 'videos.zip'; // Set the ZIP file name
    //         document.body.appendChild(a);
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //     }
    // }
    
          
          
        

   
    return (
        <div className='parent1'>
            <div  class="parent-container">
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