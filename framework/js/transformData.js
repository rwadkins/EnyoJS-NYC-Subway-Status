function insertImages(text) {
    var replaced = text
    
    // subway
    var matches = text.match(/\[[A-Z0-9]\]/g);
    for (match in matches) {
        var m = matches[match].replace('[', '\\[(').replace(']', ')\\]');
        var re = new RegExp(m, "g");
        replaced = replaced.replace(re, "\<img height=\"25px\" src=\"images\/mta\/NYCS-bull-trans-\$1.png\"\/\>");
    }

    // shuttle bus
    var matches = text.match(/\[SB\]/g);
    for (match in matches) {
        var m = matches[match].replace('[', '\\[(').replace(']', ')\\]');
        var re = new RegExp(m, "g");
        replaced = replaced.replace(re, "\<img height=\"25px\" src=\"images\/other\/shuttlebus-50x50.png\"\/\>");
    }

    // disabled
    var matches = text.match(/\[ad\]/g);
    for (match in matches) {
        var m = matches[match].replace('[', '\\[(').replace(']', ')\\]');
        var re = new RegExp(m, "g");
        replaced = replaced.replace(re, "\<img height=\"25px\" src=\"images\/other\/wheelchair-50x50.png\"\/\>");
    }
    
    return replaced;
}

function transformData(data) {
    for (var serviceKey in data) {
        var serviceData = data[serviceKey];
        for (var dataItemKey in serviceData) {
            dataItem = serviceData[dataItemKey];
            if (dataItem.text) {
                dataItem.text = insertImages(dataItem.text);
            }
        }
    }
    return data;
}
