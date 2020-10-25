import React,{Component} from 'react';
import {get} from 'axios';
import './History.scss';
import Cookie from 'js-cookie';

export default class History extends Component{
    state = { encodes : [] }

    componentDidMount = () => {
        get('/history').then(res => {
                this.setState({ encodes : res.data });
            });
    }

    render(){
        const {encodes} = this.state;
        let uid = Cookie('_uid');
        
        return (
            <div className="encodes">
                <h2>Encode History</h2>
                {encodes.map(encode => {
                    return (
                        <div key={encode} className="encode">
                            {encode.substring(encode.indexOf('_') + 1)}
                            <a href={'/encoded/' + uid + '/' + encode} className="download" download>Download</a>
                        </div>
                    )
                })}

                {!encodes.length && (<div className="message">No Encodes Found</div> )}
            </div>
        )
    }
}