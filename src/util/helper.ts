export const parseQueryString = (str) => {
    let obj: any = {};
    let key;
    let value;
    (str || "").split("&").forEach((keyValue) => {
        if (keyValue) {
            value = keyValue.split("=");
            key = decodeURIComponent(value[0]);
            obj[key] = (!!value[1]) ? decodeURIComponent(value[1]) : true;
        }
    });

    return obj;
}