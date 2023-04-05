import React, {useReducer, useCallback} from 'react'
import { downloadFile, FILETYPES_OPTS,makeFormat } from '../utils';
import { v4 as uuidv4 } from 'uuid';

import AddRemoveInput from '../components/AddRemoveInput';
import QRCode from '../components/QRCode';
import Container from '../components/Container';
import ButtonSelect from '../components/ButtonSelect';
import FormGroup from '../components/FormGroup';
import InputRemoveSelect from '../components/InputRemoveSelect';
import AddressAddRemoveInput from '../components/AddressAddRemoveInput';
import ADRInputRemoveSelect from '../components/ADRInputRemoveSelect';

const initState = {
    inputs: {
        addresses: [
            {
                id: uuidv4(),
                street: '',
                city: '',
                state: '',
                zip: '4232',
                country: 'Philippines',
                type: '',
                pref: 1
            }
        ],
        telephones: [
            {id: 'work', value: '', type: 'work', _default: true},
        ],
        emails: [],
        urls: [],
        fname: '',
        lname: '',
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
            const newAddress = {id:payload.id, type: '', street: '', city: '', zip: '4232', state: '', country: 'Philippines'}
            return {...state, inputs: {...inputs,addresses: [...inputs.addresses, newAddress]}}
        case 'UPDATE_ADDRESS_INPUT':
            //Payload = {id,name, value}
            const inputAddresses = [...inputs.addresses];
            const addressInput = inputAddresses.find((input)=> input.id === payload.id);
            addressInput[payload.name] = payload.value;
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
            return {...state, inputs: {...inputs, urls: typeUrls}};
        
        case 'INPUT_ONCHANGE':
            const inputUpdatedState = {...inputs};
            inputUpdatedState[payload.id] = payload.value;
            return {...state, inputs: inputUpdatedState }
        case 'CHANGE_FILE_TYPE':
            return {
                ...state,
                fileType: action.value
            }
        case 'GENERATEQR':
            const {lname, fname, telephones, addresses, urls, emails} = state.inputs;
            const FN = makeFormat('FN', {fname, mname: 'Olfato', lname});
            const N = makeFormat('N', {lname, fname});
            const formattedTelNums = telephones.length ? makeFormat('TEL', telephones) + '\r\n' : '';
            const formattedAddresses = addresses.length ? makeFormat('ADR', addresses) + '\r\n' : '';
            const formattedUrls = urls.length ? makeFormat('URL', urls)+ '\r\n' : '';
            const formattedEmails = emails.length ? makeFormat('EMAIL', emails) + '\r\n' : '';
            const vCardFormat = `BEGIN:VCARD\r\nVERSION:3.0\r\n${FN}${N}${formattedTelNums}${formattedEmails}${formattedAddresses}${formattedUrls}END:VCARD`;
        
            console.log(vCardFormat);
            return {
                ...state,
                showDownload:true,
                toConvert: vCardFormat,
            };
        case 'RESET_STATE':
            return {
                ...state,
                ...initState
            }
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

    const handleChangeInput = useCallback((e, actionType) => {
        const {id, name, value} = e.target;
        dispatch({type:actionType, payload: {id, name, value}});
    }, []);
    const handleAddInput = useCallback((actionType) => {
        dispatch({type: actionType, payload: {id: uuidv4(), type:'', value:''}})
    }, []);
    const handleRemoveInput = useCallback((id, actionType) => {
        dispatch({type: actionType, payload:{id}})
    }, []);
    console.log(state);
    return (
        <Container style={{flexGrow:1}} className="body">
                <h1 style={{fontSize:27, fontWeight:'bold',textAlign: 'center'}}>
                    vCard QR CODE <br/>
                    GENERATOR
                </h1>
                <div className='container'>
                <div style={{gap:'1em'}} className='flex flex-row'>
                    <FormGroup
                        id="fname"
                        label="First Name"
                        name="fname"
                        value={state.inputs.fname}
                        onChange={(e)=>handleChangeInput(e,'INPUT_ONCHANGE')}

                    />
                    <FormGroup
                        id="lname"
                        label="Last Name"
                        name="lname"
                        value={state.inputs.lname}
                        onChange={(e)=>handleChangeInput(e,'INPUT_ONCHANGE')}
                    />
                </div>
                <div>
                    <h3>
                        Telephone
                    </h3>
                    <InputRemoveSelect
                        type="work"
                        id="work"
                        value={state.inputs.telephones[0].value}
                        onChangeType={(e)=>handleChangeInput(e, 'UPDATE_TELEPHONE_TYPE')}
                        onChange={(e)=>handleChangeInput(e, 'UPDATE_TELEPHONE_INPUT')}
                    />
                    <AddRemoveInput
                        labels={["mobile","phone","fax"]}
                        container={state.inputs.telephones}
                        onChangeType={(e)=>handleChangeInput(e, 'UPDATE_TELEPHONE_TYPE')}
                        onChange={(e)=>handleChangeInput(e, 'UPDATE_TELEPHONE_INPUT')}
                        addInput={()=>handleAddInput('ADD_TELEPHONE')} 
                        removeInput={(id)=>handleRemoveInput(id, 'REMOVE_TELEPHONE')}
                    />
                </div>
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
                <div className="flex-col flex">
                    <ADRInputRemoveSelect 
                        {...state.inputs.addresses[0]}
                        onChange={(e)=>handleChangeInput(e, 'UPDATE_ADDRESS_INPUT')}

                    />
                    <AddressAddRemoveInput 
                        container={state.inputs.addresses}
                        addInput={()=>handleAddInput('ADD_ADDRESS')}
                        removeInput={(id) => handleRemoveInput(id, 'REMOVE_ADDRESS')}
                        onChange={(e)=>handleChangeInput(e,'UPDATE_ADDRESS_INPUT')}
                    />
                </div>
                {/* <button onClick={handleGenerateFormat}>Generate TEL</button> */}
                
                <QRCode 
                    includeMargin 
                    level='L' 
value={`BEGIN:VCARD
VERSION:3.0
FN;CHARSET=UTF-8:Jhonas Olfato Palad
N;CHARSET=UTF-8:Palad;Jhonas;Olfato;Jr;Ma
NICKNAME;CHARSET=UTF-8:Nasty
GENDER:O
UID;CHARSET=UTF-8:67
BDAY:19220101
EMAIL;CHARSET=UTF-8;type=HOME,INTERNET:jhonasemmanuel@gmail.com
EMAIL;CHARSET=UTF-8;type=WORK,INTERNET:jhonasemmanuel@gmail.com
TEL;TYPE=CELL:vcxv
TEL;TYPE=PAGER:q
TEL;TYPE=HOME,VOICE:9394961849
TEL;TYPE=WORK,VOICE:123123
TEL;TYPE=HOME,FAX:qe
TEL;TYPE=WORK,FAX:rf
LABEL;CHARSET=UTF-8;TYPE=HOME:166
ADR;CHARSET=UTF-8;TYPE=HOME:;;122 Sala;Tanauan;Batangas;4232;Philippines
ROLE;CHARSET=UTF-8:CTO
ORG;CHARSET=UTF-8:Imis
TITLE;CHARSET=UTF-8:POQWOP
NOTE;CHARSET=UTF-8:4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj4ghjtyuj
X-SOCIALPROFILE;TYPE=facebook:facebook.com
X-SOCIALPROFILE;TYPE=linkedin:5342
REV:2023-04-04T12:40:45.828Z
END:VCARD`}
                    // hidden={!state.toConvert}
                />
                <div className="flex-col flex flex-center btn-wrapper">
                {
                    !state.showDownload ? (
                        <button 
                        className='btn-cbi' 
                            onClick={()=> dispatch({type:'GENERATEQR'})} 
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
                            <button className='label' onClick={()=>dispatch({type:'RESET_STATE'})}>Generate another QR code</button>
                        </>
                    )
                }
                </div>
            </div>
            </Container>
    )
}

export default QRGenerator