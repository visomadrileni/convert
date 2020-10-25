import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Uploader from '../uploader/Uploader';
import Encoder from '../encoder/Encoder';
import History from '../history/History';
import './App.scss';

class App extends Component {
      state = {
            encoder : false,
            uploader : true,
            file: '',
            convert_ext : ''
        }


    initEncoding = (file,convert_ext) => {
        this.setState({
            encoder: true,
            uploader: false,
            file,
            convert_ext
        });
    }

    clearEncode = () => {
        this.setState({
            encoder : false,
            uploader : true,
            file: '',
            convert_ext : ''
        })
    }

    render() {
        const {file,convert_ext,uploader} = this.state;

        return (
            <div className="App">
                <Navbar/>
                <Route exact path="/" render={(props) => (
                    <div className="wrapper">
                        {uploader ? (<Uploader initEncoding={this.initEncoding}/>
                          ) : <Encoder file={file} convert_ext={convert_ext} newEncode={this.clearEncode}/>
                        }
                    </div> )}/>
                <Route exact path="/encodes" component={History}/>
            </div>
        );
    }
}

export default App;