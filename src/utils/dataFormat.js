/* 
    https://www.rfc-editor.org/rfc/rfc6350

    6.2. Identification Properties
        FN, N, NICKNAME, PHOTO, BDAY, ANNIVERSARY, GENDER
    6.3. Delivery Addressing Properties
        ADR
    6.4. Communication Properties
        TEL, EMAIL, IMPP, LANG
    6.5. Geographical Properties
        TZ, GEO
    6.6. Organizational Properties
        TITLE, ROLE, LOGO, ORG, MEMBER, RELATED
    6.7. Explanatory Properties
        CATEGORIES, NOTE, PROID, REV, SOUND, UID, CLIENTPIDMAP, URL, VERSION
    6.8. Security Properties
        KEY
    6.9. Calendar Properties
        FBURL, CALADRURI, CALURI
    6.10. Extended Properties and Parameters
        The properties and parameters defined by this document can be
        extended.  Non-standard, private properties and parameters with a
        name starting with "X-" may be defined bilaterally between two
        cooperating agents without outside registration or standardization.
*/


const escapeChars = (str, searchValue = '/,|;/g', newValue = (ch) => `\\${ch}`) => {
    return str.replace(searchValue, newValue).trim();
}


export const FN_Format = (fname, mname, lname ) => {
    const cleanFname = escapeChars(fname);
    const cleanMname = escapeChars(mname);
    const cleanLname = escapeChars(lname);

    return `FN:${cleanFname} ${cleanMname} ${cleanLname}\r\n`;
}
export const N_Format = (fname, lname , honorificPrefixes = [], honorificSuffixes = []) => {
/*
    6.2.2.  N

   Purpose:  To specify the components of the name of the object the
      vCard represents.

   Value type:  A single structured text value.  Each component can have
      multiple values.

   Cardinality:  *1

   Special note:  The structured property value corresponds, in
      sequence, to the Family Names (also known as surnames), Given
      Names, Additional Names, Honorific Prefixes, and Honorific
      Suffixes.  The text components are separated by the SEMICOLON
      character (U+003B).  Individual text components can include
      multiple text values separated by the COMMA character (U+002C).
      This property is based on the semantics of the X.520 individual
      name attributes [CCITT.X520.1988].  The property SHOULD be present
      in the vCard object when the name of the object the vCard
      represents follows the X.520 model.

      The SORT-AS parameter MAY be applied to this property.

   ABNF:

     N-param = "VALUE=text" / sort-as-param / language-param
             / altid-param / any-param
     N-value = list-component 4(";" list-component)

   Examples:

             N:Public;John;Quinlan;Mr.;Esq.

             N:Stevenson;John;Philip,Paul;Dr.;Jr.,M.D.,A.C.P.
*/
    const cleanFname = escapeChars(fname);
    const cleanLname = escapeChars(lname);
    const strHonorificPrefixes = honorificPrefixes.join(',');
    const strHonorificSuffixes = honorificSuffixes.join(',');
    return `N:${cleanLname};${cleanFname};${strHonorificPrefixes};${strHonorificSuffixes}\r\n`;
}

export const ADR_Format = (street, city, state, zip, country,type, pref = false) => {
/* 
    Purpose:  To specify the components of the delivery address for the
        vCard object.

    Value type:  A single structured text value, separated by the
        SEMICOLON character (U+003B).
*/
    const params = `${pref ? ';PREF=1' : ''}${type ? `;${type}` : ''}`;
    const value = `${street};${city};${state};${zip};${country}`;
    return `ADR${params}:${value}`;
}

export const TEL_Format = (type, value) => {
    const params = `${type ? ';TYPE=' + type: ''}`;
    return `TEL${params}:${value}`;
}

export const URL_Format = (value) => {
    return `URL:${value}`;
}

export const EMAIL_Format = (type, value) => {
    const params = `${type ? ';TYPE=' + type: ''}`;
    return `EMAIL${params}:${value}`;
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