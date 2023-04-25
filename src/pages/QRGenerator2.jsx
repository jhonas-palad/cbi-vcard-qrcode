import React, {useReducer, useRef, useCallback, useState} from 'react'
import { downloadFile, FILETYPES_OPTS, makeFormat } from '../utils';
import { v4 as uuidv4 } from 'uuid';

import Container from '../components/Container';
import ButtonSelect from '../components/ButtonSelect';
import FormGroup from '../components/FormGroup';
import * as QRCode from 'easyqrcodejs';

const initState = {
    inputs: {
        fname: {label: 'First Name', value: ''},
        lname: {label: 'Last Name', value: ''},
        cellphone: {label: 'Cellphone number', value: ''},
        email: {label: 'E-mail address', value: ''},
        company: {label: 'Company', value: ''},
        designation: {label: 'Designation', value: ''},
    },

    toConvert: '',
    fileType: 'png',
    showDownload: false
}

const optionalInputs = [
    {name:'landline', label: 'Landline number'},
    {name:'linkedin', label: 'LinkedIn'},
    {name:'instagram', label: 'Instagram'},
    {name:'facebook', label: 'Facebook'},
    {name:'twitter', label: 'Twitter'},
    {name:'youtube', label: 'Youtube'},
]
const reducer = (state, action) => {
    const {type, payload} = action;
    const {inputs} = state;
    switch(type) {
        case 'ADD_INPUT':
            if(payload.key in inputs) return {...state};
            
            const newInputs = {...inputs}
            newInputs[payload.name] = {name: payload.name, label: payload.label, value: ''};
            return {
                ...state, inputs: newInputs
            }
        case 'INPUT_ONCHANGE':
            const inputUpdatedState = {...inputs};
            inputUpdatedState[payload.name].value = payload.value;
            return {...state, inputs: inputUpdatedState }
        case 'CHANGE_FILE_TYPE':
            return {
                ...state,
                fileType: action.value
            }
        case 'GENERATEQR':
            const {fname, lname, cellphone, email ,company, designation, linkedin, instagram, facebook, twitter, youtube, landline} = state.inputs;
            const v = (entity) => { if (!entity) return ''; else return entity.value}; 
            const FN = v(fname) || v(lname) ? makeFormat('FN', {fname : v(fname), lname: v(lname)}) : '';
            const N = v(lname) || v(fname) ? makeFormat('N', {lname : v(lname), fname : v(fname)}) : '';
            const ORG = v(company) ? makeFormat('ORG', v(company)) : '';
            const EMAIL = v(email) ? makeFormat('EMAIL', v(email)) : '';
            const TEL = v(cellphone) ? makeFormat('TEL', v(cellphone)) : '';
            const TITLE = v(designation) ? makeFormat('TITLE', v(designation)) : '';
            const LANDLINE = v(landline) ? makeFormat('TEL',  v(landline)) : '';
            const X_SOCIAL_LINKEDIN = v(linkedin) ? makeFormat('X-SOCIAL-PROFILE', {type:'linkedin', value: v(linkedin)} ) : ''
            const X_SOCIAL_INSTAGRAM = v(instagram) ? makeFormat('X-SOCIAL-PROFILE', {type:'instagram', value: v(instagram)} ) : ''
            const X_SOCIAL_FACEBOOK = v(facebook) ? makeFormat('X-SOCIAL-PROFILE', {type:'facebook', value: v(facebook)} ) : ''
            const X_SOCIAL_TWITTER = v(twitter) ? makeFormat('X-SOCIAL-PROFILE', {type:'twitter', value: v(twitter)} ) : ''
            const X_SOCIAL_YOUTUBE = v(youtube) ? makeFormat('X-SOCIAL-PROFILE', {type:'youtube', value: v(youtube)} ) : ''
            
            const vCardFormat = `BEGIN:VCARD\r\nVERSION:3.0\r\n${FN}${N}${ORG}${TITLE}${TEL}${LANDLINE}${EMAIL}${X_SOCIAL_LINKEDIN}${X_SOCIAL_INSTAGRAM}${X_SOCIAL_FACEBOOK}${X_SOCIAL_TWITTER}${X_SOCIAL_YOUTUBE}END:VCARD`;
            return {
                ...state,
                showDownload:true,
                toConvert: vCardFormat,
            };
        case 'SHOW_DL':
            return {
                ...state,
                showDownload: true
            }
        case 'RESET_STATE':
            Object.keys(initState.inputs).map(name => {initState.inputs[name].value = ''});
            return {...initState}
        default:
            throw new Error();
    }
}

function QRGenerator () {
    const [state, dispatch] = useReducer(reducer, initState);
    const canvasRef = useRef(null);
    const downloadQRCode = useCallback((fileType) => {
        const generatedQRCodeRef = canvasRef.current.canvas.current;
        state.toConvert && downloadFile(generatedQRCodeRef, uuidv4(), fileType ?? state.fileType);
    }, [state.fileType, state.toConvert]);

    const [optionalBtn, setOptionalBtn] = useState(optionalInputs);
    
    const handleResetState = useCallback(()=>{
        //Reset all to initial states.
        dispatch({type:'RESET_STATE'});
        setOptionalBtn(optionalInputs);
    }, []);

    const handleChangeInput = useCallback((e, actionType) => {
        const {id, name, value} = e.target;
        dispatch({type:actionType, payload: {id, name, value}});
    }, []);

    const handleHideBtn = useCallback((name, label)=>{
        dispatch({type:'ADD_INPUT', payload:{name, label}})
        setOptionalBtn(prev => prev.filter( opt => opt.name !== name))
    },[optionalBtn]);

    const createQR = useCallback(()=> {
        const {fname, lname, cellphone, email ,company, designation, linkedin, instagram, facebook, twitter, youtube, landline} = state.inputs;
        const v = (entity) => { if (!entity) return ''; else return entity.value}; 
        const FN = v(fname) || v(lname) ? makeFormat('FN', {fname : v(fname), lname: v(lname)}) : '';
        const N = v(lname) || v(fname) ? makeFormat('N', {lname : v(lname), fname : v(fname)}) : '';
        const ORG = v(company) ? makeFormat('ORG', v(company)) : '';
        const EMAIL = v(email) ? makeFormat('EMAIL', v(email)) : '';
        const TEL = v(cellphone) ? makeFormat('TEL', v(cellphone)) : '';
        const TITLE = v(designation) ? makeFormat('TITLE', v(designation)) : '';
        const LANDLINE = v(landline) ? makeFormat('TEL',  v(landline)) : '';
        const X_SOCIAL_LINKEDIN = v(linkedin) ? makeFormat('X-SOCIAL-PROFILE', {type:'linkedin', value: v(linkedin)} ) : ''
        const X_SOCIAL_INSTAGRAM = v(instagram) ? makeFormat('X-SOCIAL-PROFILE', {type:'instagram', value: v(instagram)} ) : ''
        const X_SOCIAL_FACEBOOK = v(facebook) ? makeFormat('X-SOCIAL-PROFILE', {type:'facebook', value: v(facebook)} ) : ''
        const X_SOCIAL_TWITTER = v(twitter) ? makeFormat('X-SOCIAL-PROFILE', {type:'twitter', value: v(twitter)} ) : ''
        const X_SOCIAL_YOUTUBE = v(youtube) ? makeFormat('X-SOCIAL-PROFILE', {type:'youtube', value: v(youtube)} ) : ''
        const vCardFormat = `BEGIN:VCARD\r\nVERSION:3.0\r\n${FN}${N}${ORG}${TITLE}${TEL}${LANDLINE}${EMAIL}${X_SOCIAL_LINKEDIN}${X_SOCIAL_INSTAGRAM}${X_SOCIAL_FACEBOOK}${X_SOCIAL_TWITTER}${X_SOCIAL_YOUTUBE}END:VCARD`;

        const options = {
            text: vCardFormat,
            quietZone: 15
        }
        new QRCode(canvasRef.current, options)

        dispatch({type:'SHOW_DL'});
        
    }, [state]);

    
    return (
        <Container style={{flexGrow:1}} className="body">
            <h1 style={{fontSize:27, fontWeight:'bold',textAlign: 'center'}}>
                VCARD<br/>
                GENERATOR
            </h1>
            <div className={`container ${state.showDownload ? 'hide' : ''}`}>
                {
                    Object.keys(state.inputs).map((name) => {
                        const {label, value} = state.inputs[name];
                        return (
                            <FormGroup
                                key={name}
                                id={name}
                                name={name}
                                label={label}
                                value={value}
                                onChange={(e)=>handleChangeInput(e, 'INPUT_ONCHANGE')}
                            />
                        )
                    })
                }
                {
                    optionalBtn.map(({name, label})=>{
                        return (
                            <button
                                key={name}
                                className='box add-container-btn flex flex-center'
                                onClick={()=>handleHideBtn(name, label)}
                            >
                                + Add {label}
                            </button>
                        )
                    })
                }
            </div>
            <div className='flex flex-center' id="canvas-ref" ref={canvasRef}></div>
            <div className="flex-col flex flex-center btn-wrapper">
            {
                !state.showDownload ? (
                    <button
                        style={{margin: '5em 0 2em'}}
                        className='btn-cbi' 
                        onClick={createQR} 
                        type="button">
                            Generate
                    </button>
                ) : (
                    <>
                        <ButtonSelect 
                            title="Download"
                            opts={FILETYPES_OPTS}
                            optClick={
                                    (value)=>{
                                        dispatch({type: 'CHANGE_FILE_TYPE', value});
                                        downloadQRCode(value)
                                }
                            }
                            btnClick={()=>downloadQRCode(state.fileType)}
                        />
                        {/* <button className='label' onClick={handleResetState}>Generate another QR code</button> */}
                        <a className='label' href={window.location.href}>
                            Generate another QR code
                        </a>
                    </>
                )
            }
            </div>
        </Container>
    )
}

export default QRGenerator