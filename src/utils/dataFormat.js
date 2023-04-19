/* 
*/

const escapeChars = (str, searchValue = /,|;/g, newValue = (ch) => `\\${ch}`) => {

    return str.replace(searchValue, newValue).trim();
}


export const FN_Format = (fname, lname, mname="" ) => {
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


export const ORG_Format = (value) => `ORG:${escapeChars(value)}\r\n`;

export const TITLE_Format = (value) => `TITLE:${escapeChars(value)}\r\n`;

export const ROLE_Format = (value) => `ROLE:${escapeChars(value)}\r\n`;


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
    return `TEL${params}:${escapeChars(value)}`;
}

export const URL_Format = (value) => {
    return `URL:${escapeChars(value)}`;
}

export const EMAIL_Format = (value ) => {
/*  
    TYPE parameter values can include:
        -internet : indicate an Internet addressing type
        - pref : indicate a preferred-use email address when more than one is specified

    The default email type is "internet". A non-standard value
    can also be specified.
*/
    // const params = `${type ? 'TYPE=' + type: ''}`;
    return `EMAIL:${escapeChars(value)}`;
}

export const X_SOCIAL_PROFILE_Format = (type, value) => {
    return `X-SOCIAL-PROFILE:${escapeChars(value)}`;
}
export const makeFormat = (format, data) => {
    /* 
    Parameter values MAY be case-sensitive or case-insensitive, 
    depending on their definition. (e.g., the property name "fn" is 
    the same as "FN" and "Fn"). It is RECOMMENDED that property and
    parameter names be upper-case on output.
    */

    console.log(format);
    switch (format) {
        case 'FN':
            return FN_Format(data.fname, data.lname);
        case 'N':
            return N_Format(data.lname,data.fname);
        case 'ORG':
            return ORG_Format(data);
        case 'TITLE':
            return TITLE_Format(data);
        case 'ROLE':
            return ROLE_Format(data);
        case 'ADR':
            return data.map(({street, city, state, zip, country, type, pref}) => 
                ADR_Format(street, city, state, zip, country, type, pref)).join('\r\n');
        case 'TELS':
            return data.map( ({type, value}) => TEL_Format(type, value)).join('\r\n');
        case 'TEL':
            return TEL_Format('',data) + '\r\n';
        case 'URL':
            return data.map(({value}) => URL_Format(value)).join('\r\n');
        case 'EMAILS':
            return data.map(({type, value}) => EMAIL_Format(type, value)).join('\r\n');
        case 'EMAIL':
            return EMAIL_Format(data) + '\r\n';
        case 'X-SOCIAL-PROFILES':
            return data.map(({type, value}) => X_SOCIAL_PROFILE_Format(type, value)).join('\r\n');
        case 'X-SOCIAL-PROFILE':
            return X_SOCIAL_PROFILE_Format('',data)
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