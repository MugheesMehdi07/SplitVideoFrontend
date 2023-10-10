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
    console.log('res', location.state)
    const filename = 'split_videos.zip'
    // console.log('res1', location.state.data)
    useEffect(() => {
        console.log('res', res)
        setZipFile(res)
    }, [res])

    function downloadFile(zipFileBytes, name) {
const zip = new JSZip();

// Load the zip file
zip.loadAsync(zipFileBytes)
  .then((zip) => {
    // List all the file names in the zip file
    const fileNames = Object.keys(zip.files);

    // Loop through the files in the zip and extract their contents
    fileNames.forEach((fileName) => {
      zip.files[fileName].async("arraybuffer").then((fileData) => {
        // Add the extracted file to a new zip
        zip.file(fileName, fileData);
      });
    });

    // Generate a new zip file containing the extracted data
    return zip.generateAsync({ type: "blob" });
  })
  .then((blob) => {
    // Create a download link for the new zip file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted.zip";
    a.style.display = "none";

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  })
  .catch((error) => {
    console.error("Error loading and extracting zip file:", error);
  });

    }
    

  
    return (
        <div className='parent1'>
            <div className='parent-container2 '>
                <div className='child-container'>
            <h6 style={{textAlign: 'center', color: '#0A2F73', fontFamily:'Plus Jakarta Sans'}}>CONTENT ROLLER</h6>
            <h3 style={{textAlign: 'center', color: '#0A2F73'}}>DOWNLOAD FILES</h3>
                <div className="form-group m-3">
                        <div className="input-group">
                            <input type="text" className="form-control" value={filename}/>    
                        </div> 
                    </div>
                <div className='container mt-3' style={{textAlign:'center'}}>
                {/* <a href={zipFile} download={filename} target='_blank'>
                    Download Zip File  
                    </a> */}
                    <button onClick={downloadFile(zipFile, filename)}>Download zip file</button>
                </div>
                
        </div>
        </div>
        </div>
        
    );
};

export default Downloader;