/* 
*/

const escapeChars = (str, searchValue = /,|;/g, newValue = (ch) => `\\${ch}`) => {

    return str.replace(searchValue, newValue).trim();
}


export const FN_Format = (fname, mname, lname ) => {
    const cleanFname = escapeChars(fname);
    const cleanMname = escapeChars(mname);
    const cleanLname = escapeChars(lname);

    return `FN:${cleanFname} ${cleanMname} ${cleanLname}\r\n`;
}
export const N_Format = (fname, lname , honorificPrefixes = [], honorificSuffixes = []) => {
    const cleanFname = escapeChars(fname);
    const cleanLname = escapeChars(lname);

    const strHonorificPrefixes = honorificPrefixes.map((str) => escapeChars(str)).join(',');
    const strHonorificSuffixes = honorificSuffixes.map((str) => escapeChars(str)).join(',');
    return `N:${cleanLname};${cleanFname};${strHonorificPrefixes};${strHonorificSuffixes}\r\n`;
}

export const ADR_Format = (street, city, state, zip, country,type, pref = false) => {
    const params = `${pref ? ';PREF=1' : ''}${type ? `;${type}` : ''}`;
    const value = `${street};${city};${state};${zip};${country}`;
    return `ADR${params}:${value}`;
}

export const TEL_Format = (type, value) => {
/* 
    TYPE parameter values can include:
        - home : indicate a telephone number associated with a residence
        - msg : indicate the telephone number has voice messaging support
        - work : indicate a telephone number associated with a place of work
        - pref : indicate a preferred-use telephone number
        - voice : indicate a voice telephone number
        - fax : indicate a facsimile telephone number
        - cell : indicate a cellular telephone number
        - video : indicate a video conferencing telephone number
        - pager : indicate a paging device telephone number
        - bbs : indicate a bulletin board system telephone number
        - modem : indicate a MODE connected telephone number
        - car : indicate a car-phone telephone number
        - isdn : indicate an ISDN service telephone number
        - pcs : indicate a personal communication services telephone number

*/
    const params = `${type ? ';TYPE=' + type: ''}`;
    return `TEL${params}:${value}`;
}

export const URL_Format = (value) => {
    return `URL:${value}`;
}

export const EMAIL_Format = (type, value) => {
/*  
    TYPE parameter values can include:
        -internet : indicate an Internet addressing type
        - pref : indicate a preferred-use email address when more than one is specified

    The default email type is "internet". A non-standard value
    can also be specified.
*/
    // const params = `${type ? 'TYPE=' + type: ''}`;
    return `EMAIL:${value}`;
}

export const makeFormat = (format, data) => {
    /* 
    Parameter values MAY be case-sensitive or case-insensitive, 
    depending on their definition. (e.g., the property name "fn" is 
    the same as "FN" and "Fn"). It is RECOMMENDED that property and
    parameter names be upper-case on output.
    */
    switch (format) {
        case 'FN':
            return FN_Format(data.fname, data.mname, data.lname);
        case 'N':
            return N_Format(data.lname,data.fname, data.honorificPrefixes, data.honorificSuffixes);
        case 'ADR':
            return data.map(({street, city, state, zip, country, type, pref}) => 
                ADR_Format(street, city, state, zip, country, type, pref)).join('\r\n');
        case 'TEL':
            return data.map( ({type, value}) => TEL_Format(type, value)).join('\r\n');
        case 'URL':
            return data.map( ({value}) => URL_Format(value)).join('\r\n');
            
        case 'EMAIL':
            return data.map( ({type, value}) => EMAIL_Format(type, value)).join('\r\n');
            
        default:
            break;
    }
    // const formattedData = data.map(({type, value}) => {
    //     return `${format}${type ? `;type=${type.toUpperCase()}:`: ':'}${value}`;
    // });
    // return formattedData.join('\n');
}
// export const makeAddressFormat = (addresses) => {
//     const formattedData = addresses.map(({}) => `ADR;`);
// }

export const vCardFormats = {
    N_Format,
    ADR_Format,
    TEL_Format,
    EMAIL_Format,
    URL_Format,
}