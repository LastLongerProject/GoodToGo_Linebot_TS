function successPromise(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
        resolve(param);
    });
}

function failPromise(param: any): Promise<any> {
    return new Promise((resolve, reject) => {
        reject(param);
    });
}

export {successPromise, failPromise};