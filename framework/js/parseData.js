function parseData(parseText) {
    var xmlParser = new DOMParser();
    var xmlDoc = xmlParser.parseFromString(parseText, "text/xml");
    var data = {}, s = 0, l = 0, f = 0, dataItem = {}, dataItemName = "", dataNode = {};
    var service = {}, lines = [], linesLength = 0;
    var services = ["subway", "bus", "BT", "LIRR", "MetroNorth"];
    var fields = ["status", "text", "Date", "Time"];

    data.responseCode = nodeByName(xmlDoc, "responsecode").childNodes[0].nodeValue;
    data.timeStamp = nodeByName(xmlDoc, "timestamp").childNodes[0].nodeValue;
	var ampm = data.timeStamp.substring(data.timeStamp.length -2);
	data.timeStamp = data.timeStamp.substring(0,data.timeStamp.lastIndexOf(":")) + " " + ampm;
    for( s = 0; s < services.length; s += 1) {
        data[services[s]] = {};
        service = nodeByName(xmlDoc, services[s]);
        lines = nodeByName(service, "line");

        linesLength = lines.length;
        for( l = 0; l < linesLength; l += 1) {
            dataItemName = nodeByName(lines[l],"name").childNodes[0].nodeValue;
            dataItem = {};
            for( f = 0; f < fields.length; f += 1) {
                dataNode = nodeByName(lines[l], fields[f]);
                dataItem[fields[f]] = "";
                if(dataNode.childNodes.length) {
                    dataItem[fields[f]] = dataNode.childNodes[0].nodeValue;
                }
            }
            dataItem.favoriteKey = services[s] + '.' + dataItemName;
            data[services[s]][dataItemName] = dataItem;
        }
    }

    return data;
    /*
     * getElementsByTagName tediously returns an array every time, even if you know there's only one element that'll match.
     */
    function nodeByName(e, name) {
        var returnVal = e.getElementsByTagName(name);

        if(returnVal.length == 1) {
            returnVal = returnVal[0];
        }
        return returnVal;
    }

}
