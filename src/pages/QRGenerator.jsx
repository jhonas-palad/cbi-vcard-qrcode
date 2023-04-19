import React, {useReducer, useRef, useCallback} from 'react'
import { downloadFile, FILETYPES_OPTS,makeFormat } from '../utils';
import { v4 as uuidv4 } from 'uuid';

import AddRemoveInput from '../components/AddRemoveInput';
// import QRCode from '../components/QRCode';
import QRCodeLogo from '../components/QRCodeLogo';
import Container from '../components/Container';
import ButtonSelect from '../components/ButtonSelect';
import FormGroup from '../components/FormGroup';
import InputRemoveSelect from '../components/InputRemoveSelect';
import AddressAddRemoveInput from '../components/AddressAddRemoveInput';
import ADRInputRemoveSelect from '../components/ADRInputRemoveSelect';
import { QRCode } from 'react-qrcode-logo';

const initState = {
    inputs: {
        fname: '',
        lname: '',
        cellphone: '',
        email: '',
        company: '',
        designation: '',
        websites: [],
        landlines: [],
        // addresses: [
        //     {
        //         id: uuidv4(),
        //         street: '',
        //         city: '',
        //         state: '',
        //         zip: '4232',
        //         country: 'Philippines',
        //         type: '',
        //         pref: 1
        //     }
        // ],
        // telephones: [
        //     {id: uuidv4(), value: '', type: 'work', _default: true},
        // ],
        // org: '',
        // title: '',
        // role: '',
    },
    toConvert: '',
    fileType: 'png',
    showDownload: false
}


const reducer = (state, action) => {
    const {type, payload} = action;
    const {inputs} = state;
    switch(type) {
        case 'ADD_WEBSITES':
            const newWebsites = [...inputs.websites, {id: uuidv4(), value: ''}]
            return {...state, inputs: {...inputs, websites: newWebsites}}
        case 'ADD_LANDLINES' : 
            const newLandlines = [...inputs.landlines, { id: uuidv4(), value: ''}]
            return {...state, inputs: {...inputs, landlines: newLandlines}}
        case 'UPDATE_WEBSITES_INPUT':
            const inputWebsites = [...inputs.websites];
            const websiteInput = inputWebsites.find((input) => input.id === payload.id);
            websiteInput.value = payload.value;
            return {...state, inputs: {...inputs, websites: inputWebsites}} 
        case 'UPDATE_LANDLINES_INPUT':
            const inputLandlines = [...inputs.landlines];
            const landlineInput = inputLandlines.find((input) => input.id === payload.id);
            landlineInput.value = payload.value;
            return {...state, inputs: {...inputs, landlines: inputLandlines}} 
        case 'REMOVE_EMAIL':
            //Payload = id
            const removedEmails = inputs.emails.filter((input)=> input.id !== payload.id)
            return {...state,inputs: {...inputs,emails: removedEmails}}

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
            const {fname, lname, cellphone, email ,company, designation, websites, landlines} = state.inputs;
            
            const FN = makeFormat('FN', {fname, lname});
            const N = makeFormat('N', {lname, fname});
            const ORG = makeFormat('ORG', company);
            const EMAIL = makeFormat('EMAIL', email);
            const TEL = makeFormat('TEL', cellphone);
            const TITLE = makeFormat('TITLE', designation);
            const X_SOCIAL_PROFILES = websites.length ? makeFormat('X-SOCIAL-PROFILES', websites) + '\r\n' : '';
            // const TITLE = makeFormat('TITLE', title);
            // const ROLE = makeFormat('ROLE', role);
            // const formattedTelNums = telephones.length ? makeFormat('TEL', telephones) + '\r\n' : '';
            // const formattedAddresses = addresses.length ? makeFormat('ADR', addresses) + '\r\n' : '';
            // const formattedUrls = urls.length ? makeFormat('URL', websites)+ '\r\n' : '';
            // const formattedEmails = emails.length ? makeFormat('EMAIL', emails) + '\r\n' : '';
            const vCardFormat = `BEGIN:VCARD\r\nVERSION:3.0\r\n${FN}${N}${ORG}${TITLE}${TEL}${EMAIL}${X_SOCIAL_PROFILES}END:VCARD`;
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
    const qrRef = useRef(null);
    const downloadQRCode = useCallback((fileType) => {
        const generatedQRCodeRef = qrRef.current.canvas.current;
        console.log(generatedQRCodeRef)
        state.toConvert && downloadFile(generatedQRCodeRef, uuidv4(), fileType ?? state.fileType);
    }, [state.fileType, state.toConvert]);

    const handleChangeInput = useCallback((e, actionType) => {
        const {id, name, value} = e.target;
        dispatch({type:actionType, payload: {id, name, value}});
    }, []);
    const handleAddInput = useCallback((actionType) => {
        dispatch({type: actionType, payload: {id: uuidv4(), type:'', value:''}})
    }, []);
    // const handleRemoveInput = useCallback((id, actionType) => {
    //     dispatch({type: actionType, payload:{id}})
    // }, []);
    console.log(state);
    return (
        <Container style={{flexGrow:1}} className="body">
                <h1 style={{fontSize:27, fontWeight:'bold',textAlign: 'center'}}>
                    VCard<br/>
                    GENERATOR
                </h1>
                <div className='container'>
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
                    
                    <FormGroup
                        id="cellphone"
                        label="Cellphone Number"
                        name="cellphone"
                        value={state.inputs.title}
                        onChange={(e)=>handleChangeInput(e,'INPUT_ONCHANGE')}
                    />
                    <FormGroup
                        id="email"
                        label="E-mail address"
                        value={state.inputs.email}
                        onChange={(e)=>handleChangeInput(e, 'INPUT_ONCHANGE')}
                    />
                    <FormGroup
                        id="company"
                        label="Company"
                        value={state.inputs.company}
                        onChange={(e)=>handleChangeInput(e, 'INPUT_ONCHANGE')}
                    />
                    <FormGroup
                        id="designation"
                        label="Designation"
                        value={state.inputs.designation}
                        onChange={(e)=>handleChangeInput(e, 'INPUT_ONCHANGE')}
                    />
                <AddRemoveInput
                    title="Landline Number" 
                    container={state.inputs.landlines}
                    limit={1}
                    // onChangeType={(e)=>handleChangeInput(e, 'UPDATE_EMAIL_TYPE')}
                    onChange={(e)=>handleChangeInput(e, 'UPDATE_LANDLINES_INPUT')}
                    addInput={()=>handleAddInput('ADD_LANDLINES')} 
                    // removeInput={(id)=>handleRemoveInput(id, 'REMOVE_EMAIL')}
                />
                <AddRemoveInput
                    title="Websites" 
                    container={state.inputs.websites}
                    // onChangeType={(e)=>handleChangeInput(e, 'UPDATE_URL_TYPE')}
                    onChange={(e)=>handleChangeInput(e, 'UPDATE_WEBSITES_INPUT')}
                    addInput={()=>handleAddInput('ADD_WEBSITES')} 
                    // removeInput={(id)=>handleRemoveInput(id, 'REMOVE_URL')}
                />
                {/* <button onClick={handleGenerateFormat}>Generate TEL</button> */}
                {state.showDownload && state.toConvert  && <QRCode ecLevel='L' value={state.toConvert} />}
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