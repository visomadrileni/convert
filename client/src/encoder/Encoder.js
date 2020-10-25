import React,{Component} from "react";
import toastr from 'toastr';
import "./Encoder.scss";
import Progress from '../Progress';
import Cookie from 'js-cookie';
import socketIOClient from 'socket.io-client';

 class Encoder extends Component {
    state = {
            file: this.props.file,
            encoded_file: '',
            convert_ext: this.props.convert_ext,
            progress: 0,
            eta: '',
        }


    componentDidMount = () => {
        this.socket = socketIOClient('ws://127.0.0.1:3000');

        this.socket.emit('encode', {
            file : this.state.file,
            user : Cookie('_uid'),
            convert_ext : this.state.convert_ext
        });

        this.socket.on('progress',(data) => {
            this.setState({
                progress : data.percentage,
                eta : data.eta
            });
        });

        this.socket.on('complete',(data) => {
            this.setState({ encoded_file : data.encoded_file });
            toastr.success('Encoding complete');
        });
    }

    componentWillUnmount = () => {
        this.socket.disconnect();
        this.props.newEncode();
    }

    render(){
        const {file,eta,progress,encoded_file} = this.state;
        const {newEncode} = this.props;

        return (
            <div className="encoder">
                <h3>
                    {file.substring(file.indexOf('_') + 1)} <br/>
                    <small>
                        ETA : {eta.trim().length ? eta : 'calculating ... ' }
                    </small>
                </h3>
                <Progress title="" progress={progress}/>

                {encoded_file ? (
                    <div>
                        <a href={ '/encoded/' + Cookie('_uid') + '/' + encoded_file} download>
                            <button>Download</button>
                        </a>
                        <button onClick={newEncode}>New Upload</button>
                    </div>
                ) : <button onClick={newEncode}>Cancel Encoding</button>}
            </div>
        )
    }
}

export default Encoder;