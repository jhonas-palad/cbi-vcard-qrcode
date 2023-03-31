export const FILETYPES_OPTS = [
    {title: 'PNG', value: 'png'},
    {title: 'JPG', value: 'jpg'},
    {title: 'SVG', value: 'svg'}
];

export const FILE_TYPES = {
    png : 'image/png',
    jpg : 'image/jpeg',
    svg : 'image/svg+xml'
}

export const getCanvas = (refElement, ext)=>{

    const qrCanvas = refElement ? refElement : document.getElementById('generated_qrcode');
    let url;
    if(ext === 'svg'){
        //convert canvas to svg
        const height = qrCanvas.height;
        const width = qrCanvas.width;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);

        const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        img.setAttribute('width', width);
        img.setAttribute('height', height);
        img.setAttribute('href', qrCanvas.toDataURL('image/png'));
        svg.appendChild(img);

        const svgSerializedStr = new XMLSerializer().serializeToString(svg);
        url = `data:${FILE_TYPES.svg};charset=utf-8,${encodeURIComponent(svgSerializedStr)}`;
    }else{
        url = qrCanvas.toDataURL(FILE_TYPES[ext]);
    }
    return new Promise(resolve => {
      resolve(url);
    });
}; 

export const downloadFile = async (refElement, filename, ext = 'png') => {
    const newFileName = `${filename}.${ext}`;
    
    return getCanvas(refElement, ext).then(
      url => {
        const anchorTag = document.createElement("a");
        anchorTag.href = url;
        anchorTag.download=newFileName;
        document.body.appendChild(anchorTag);
        anchorTag.click();
        document.body.removeChild(anchorTag);
      }
    )
  }


