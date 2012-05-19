enyo.kind({
    name: "App",
    kind: "Control",
    components: [
        { 
            kind: "onyx.Button", 
            caption: "getData", 
            ontap: "getData"
        },
        { 
            name: "webservice", 
            kind: "enyo.Ajax",
            handleAs: "xml",
            url:  'http://mta.info/status/serviceStatus.txt',
            method: 'GET',
            response: function(data) { handleData(data) }
        }
    ],
    published: {
        data: {},
    },
    getData: function() {
        var ajax = new enyo.Ajax({ 
            url:  'http://mta.info/status/serviceStatus.txt',
            method: 'GET',
            handleAs: "text"
        });    
        ajax.response(this,"handleData").go();
    },
    handleData: function(inSender, inResponse) {
        this.data = parseData(inResponse);
    }
});