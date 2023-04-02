import React, {useReducer, useCallback} from 'react'
import { downloadFile, FILETYPES_OPTS,makeFormat } from '../utils';
import { v4 as uuidv4 } from 'uuid';

import AddRemoveInput from '../components/AddRemoveInput';
import QRCode from '../components/QRCode';
import Container from '../components/Container';
import ButtonSelect from '../components/ButtonSelect';

const initState = {
    inputs: {
        addresses: [],
        telephones: [],
        emails: [],
        urls: []
    },
    toConvert: '',
    fileType: 'png',
    showDownload: false
}


const reducer = (state, action) => {
    const {type, payload} = action;
    const {inputs} = state;


    switch(type) {
        case 'REMOVE_ADDRESS':
            //Payload = id
            const removedAddresses = inputs.addresses.filter((input)=> input.id !== payload.id)
            return {...state,inputs: {...inputs,addresses: removedAddresses}}
        case 'ADD_ADDRESS':
            //Payload = {id, type, value}
            return {...state,inputs: {...inputs,addresses: [...inputs.addresses, payload]}}
        case 'UPDATE_ADDRESS_INPUT':
            //Payload = {id, value}
            const inputAddresses = [...inputs.addresses];
            const addressInput = inputAddresses.find((input)=> input.id === payload.id);
            addressInput.value = payload.value;
            return {...state, inputs: {...inputs,addresses: inputAddresses}};
        case 'UPDATE_ADDRESS_TYPE':
            const typeAddresses = [...inputs.addresses];
            const addressType = typeAddresses.find((input)=> input.id === payload.id);
            addressType.type = payload.value;
            return {...state, inputs: {...inputs, addresses: typeAddresses}};
        
        case 'REMOVE_TELEPHONE':
            //Payload = id
            const removedTelephones = inputs.telephones.filter((input)=> input.id !== payload.id)
            return {...state,inputs: {...inputs,telephones: removedTelephones}}
        case 'ADD_TELEPHONE':
            //Payload = {id, type, value}
            return {...state,inputs: { ...inputs,telephones: [...inputs.telephones, payload]}}
        case 'UPDATE_TELEPHONE_INPUT':
            //Payload = {id, value}
            const inputTelephones = [...inputs.telephones];
            const telephoneInput = inputTelephones.find((input)=> input.id === payload.id);
            telephoneInput.value = payload.value;
            return {...state, inputs: {...inputs,telephones: inputTelephones}};
        case 'UPDATE_TELEPHONE_TYPE':
            const typeTelephones = [...inputs.telephones];
            const telephoneType = typeTelephones.find((input)=> input.id === payload.id);
            telephoneType.type = payload.value;
            return {...state, inputs: {...inputs,telephones: typeTelephones}};
        
        case 'REMOVE_EMAIL':
            //Payload = id
            const removedEmails = inputs.emails.filter((input)=> input.id !== payload.id)
            return {...state,inputs: {...inputs,emails: removedEmails}}
        case 'ADD_EMAIL':
            //Payload = {id, type, value}
            return {...state, inputs: {...inputs, emails: [...inputs.emails, payload]}}
        case 'UPDATE_EMAIL_INPUT':
            //Payload = {id, value}
            const inputEmails = [...inputs.emails];
            const emailInput = inputEmails.find((input)=> input.id === payload.id);
            emailInput.value = payload.value;
            return {...state, inputs: {...inputs,emails: inputEmails}};
        case 'UPDATE_EMAIL_TYPE':
            const typeEmails = [...inputs.emails];
            const emailType = typeEmails.find((input)=> input.id === payload.id);
            emailType.type = payload.value;
            return {...state, inputs: {...inputs,emails: typeEmails}};
        
        case 'REMOVE_URL':
            //Payload = id
            const removedUrls = inputs.urls.filter((input)=> input.id !== payload.id)
            return {...state, inputs: {...inputs,urls: removedUrls}}
        case 'ADD_URL':
            //Payload = {id, type, value}
            return {...state, inputs: {...inputs, urls: [...inputs.urls, payload]}}
        case 'UPDATE_URL_INPUT':
            //Payload = {id, value}
            const inputUrls = [...inputs.urls];
            const urlInput = inputUrls.find((input)=> input.id === payload.id);
            urlInput.value = payload.value;
            return {...state, inputs: {...inputs,urls: inputUrls}};
        case 'UPDATE_URL_TYPE':
            const typeUrls = [...inputs.urls];
            const urlType = typeUrls.find((input)=> input.id === payload.id);
            urlType.type = payload.value;
            return {...state, inputs: {...inputs,urls: typeUrls}};

        case 'CHANGE_FILE_TYPE':
            return {
                ...state,
                fileType: action.value
            }
        case 'GENERATEQR':
            return {
                ...state, 
                toConvert: state.urlInput,
                showDownload: true
            };
        default:
            throw new Error();
    }
}


function QRGenerator () {
    const [state, dispatch] = useReducer(reducer, initState);
    const downloadQRCode = useCallback((fileType) => {
        const generatedQRCodeRef = document.getElementById("generated_qrcode");
        state.toConvert && downloadFile(generatedQRCodeRef, uuidv4(), fileType ?? state.fileType);
    }, [state.fileType, state.toConvert]);
    const handleChangeInput = (e, actionType) => {
        const {id, value} = e.target;
        dispatch({type:actionType, payload: {id, value}});
    }
    const handleAddInput = (actionType) => {
        dispatch({type: actionType, payload: {id: uuidv4(), type:'', value:''}})
    }
    const handleRemoveInput = (id, actionType) => {
        dispatch({type: actionType, payload:{id}})
    }

    const handleGenerateTel = () => {
        console.log(makeFormat('TEL', state.inputs.telephones));
    }

    return (
        <Container style={{flexGrow:1}} className="body">
                <h1 style={{fontSize:27, fontWeight:'bold',textAlign: 'center'}}>
                    vCard QR CODE <br/>
                    GENERATOR
                </h1>
                <div className='container'>
                <QRCode value={"ASDdsfsdfad"} hidden={!state.toConvert}/>
                <AddRemoveInput
                    title="Telephone" 
                    container={state.inputs.telephones}
                    onChangeType={(e)=>handleChangeInput(e, 'UPDATE_TELEPHONE_TYPE')}
                    onChange={(e)=>handleChangeInput(e, 'UPDATE_TELEPHONE_INPUT')}
                    addInput={()=>handleAddInput('ADD_TELEPHONE')} 
                    removeInput={(id)=>handleRemoveInput(id, 'REMOVE_TELEPHONE')}
                />
                <AddRemoveInput
                    title="Email" 
                    container={state.inputs.emails}
                    onChangeType={(e)=>handleChangeInput(e, 'UPDATE_EMAIL_TYPE')}
                    onChange={(e)=>handleChangeInput(e, 'UPDATE_EMAIL_INPUT')}
                    addInput={()=>handleAddInput('ADD_EMAIL')} 
                    removeInput={(id)=>handleRemoveInput(id, 'REMOVE_EMAIL')}
                />
                <AddRemoveInput
                    title="URLS" 
                    container={state.inputs.urls}
                    onChangeType={(e)=>handleChangeInput(e, 'UPDATE_URL_TYPE')}
                    onChange={(e)=>handleChangeInput(e, 'UPDATE_URL_INPUT')}
                    addInput={()=>handleAddInput('ADD_URL')} 
                    removeInput={(id)=>handleRemoveInput(id, 'REMOVE_URL')}
                />
                <button onClick={handleGenerateTel}>Generate TEL</button>
                <div className="flex-col flex flex-center btn-wrapper">
                {
                    !state.showDownload ? (
                        <button 
                        className='btn-cbi' 
                            onClick={()=> dispatch({type:'GENERATEQR'})} 
                            type="button"
                            disabled={!state.urlInput}>
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
                            <a className='label' href={window.location.href}>Generate another QR code</a>
                        </>
                    )
                }
                </div>
            </div>
            </Container>
    )
}

export default QRGenerator