function isMobilePhone(phone: string): boolean {
    var reg: RegExp = /^[09]{2}[0-9]{8}$/;
    var res: boolean = reg.test(phone);

    if (res) return true;
    else return false;
}

function randomHexString(amount: number): string {
    var text = '';
    var charSet = "0123456789ABCDEF";

    for (var i = 0; i < amount; i++) {
        text += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }

    return text;
}


export {isMobilePhone, randomHexString};