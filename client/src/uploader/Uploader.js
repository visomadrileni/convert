import React from "react";
import {Component} from 'react';
import {post} from 'axios';
import toastr from 'toastr';
import "./Uploader.scss";
import Progress from "../Progress";

export default class Uploader extends Component{
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            uploading: false,
            progress : 0,
            upload_ext : null,
            convert_ext : '',
            allowed_types : [
                'webm', 'mkv', 'flv', 'ogg',
                'avi', 'mov' , 'wmv', 'mp4',
                'm4v', 'm4p', 'mpeg', '3gp',
                '3g2'
            ]
        };
        this.fileInput = React.createRef();
    }

    getFileExtension = (name) => {
        return /(?:\.([^.]+))?$/.exec(name)[1];
    }

    validateFile = (ext) => {
        return this.state.allowed_types.includes(ext);
    }

    onFileChange = e => {
        if(!e.target.files.length){
            return;
        }

        let file = e.target.files[0],
            ext = this.getFileExtension(file.name);

        if (this.validateFile(ext)) {
            this.setState({
                file: file,
                upload_ext : ext
            })
        }else{
            toastr.error('Error: Invalid file format')
        }
    }

    setConversionFormat = e => {
        if(!e.target.value.length){
            this.setState({convert_ext : '' });
            return;
        }

        this.setState({ convert_ext : e.target.value });
    }

    initFileUpload = e => {
        this.fileInput.current.click();
    }

    cancelUpload  = e => {
        this.setState({
            file: null,
            uploading: false,
            progress : 0,
            upload_ext : null,
            convert_ext : '',
        });
        this.fileInput.current.value = '';
    }

    uploadFile = e => {
        const {file,convert_ext} = this.state;
        if(file && convert_ext){
            this.setState({uploading: true});
            let data = new FormData();
            data.append('file', file);
            data.append('convert_ext',convert_ext);

            post('/upload', data, {
                onUploadProgress: (progressEvent) => {
                    let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                    this.setState({ progress : percentCompleted });
                }
            }).then(res => {
                let file = res.data;
                if(file.uploaded){
                    this.props.initEncoding(file.path,convert_ext);
                }
            }).catch(err => { console.log(err);});
        }else{
            toastr.error('Error: Select a conversion format')
        }
    }

    render(){
        const {uploading,file,convert_ext,allowed_types,upload_ext,progress} = this.state;
        return(
            <div className="uploader">
                {!uploading ?
                    <div>
                        <div>
                            {file ? <button  onClick={this.uploadFile}>Upload File</button>
                                  : <button  onClick={this.initFileUpload}>Select Video File</button> }
                            {file && <button onClick={this.cancelUpload}>Cancel</button>  }
                        </div>

                        {file &&
                            <div>
                                <select value={convert_ext} onChange={this.setConversionFormat}>
                                    <option value="">Convert To</option>
                                    {allowed_types.map((ext) => {
                                            if(ext !== upload_ext){
                                                return <option key={ext} value={ext}>{ext}</option>
                                            }
                                        })
                                    }
                                </select>
                            </div>
                        }

                        <input type="file" name="file" className="form-control-file" ref={this.fileInput} onChange={this.onFileChange}/>
                    </div>
                    : <Progress title="Uploading, please wait" progress={progress}/>
                }
            </div>
        );
    }
}