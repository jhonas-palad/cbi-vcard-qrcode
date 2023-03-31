
// export const vCardData = `
// BEGIN:VCARD
// VERSION:3.0
// EMAIL;type=WORK:Paul@pocketables.com
// EMAIL;type=HOME:paul@pocketables.com
// EMAIL:smith.j@smithdesigns.com
// TEL;type=WORK:+1 (615) 669-9734
// NOTE:here's some random text to throw into the contact information
// ADR;TYPE=WORK,PREF:;;151 Moore Avenue;Grand
// CATEGORIES: blogger, internet troll
// GENDER:M
// PHOTO;JPEG:https://secure.gravatar.com/avatar/4fdde8e771f209d9a50ceb0f02ba60b8?s=100&d=retro&r=pg
// LOGO;JPEG:https://pocketables.com/wp-content/uploads/2010/05/Pocketables_logo_400x400.jpg
// TZ:America/Chicago
// URL:https://www.pocketables.com
// FN:Paul E. King
// N:Paul King
// END:VCARD
// `

export const VCARD = `
BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName}
${telnums}
${emails}
ORG:${org}
TITLE:${title}
${addresses}
${urls}
NOTE:${notes ?? ''}
`;