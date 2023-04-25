import React from 'react';
// import { QRCode } from 'react-qrcode-logo';
import * as QRCode from 'easyqrcodejs'
function Playground() {
    const canvasRef = React.useRef(null);
    const [value, setValue] = React.useState('');
    const createQR = React.useCallback(()=>{
        const options = {
            text: 'Jhonas Plad',
            title: 'TITLE',
            titleHeight: 70,
            subTitle: 'SUBTITLE',
            quietZone: 15
        }
        new QRCode(canvasRef.current, options)
        
    }, []);
   
    return (
        <div style={{
            height: '100vh',
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div ref={canvasRef}></div>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={createQR}>Click me</button>
        </div>
    )
}

export default Playground