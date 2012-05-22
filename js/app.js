enyo.kind({
    name: "App",
    kind: "FittableRows",
    classes: "onyx",
    components: [
        {
            kind: "onyx.Toolbar",
            layoutKind: "FittableColumnsLayout",
            style: "height: 55px;",
            components: [
                {
                    name: "BackButton",
                    kind: "onyx.Button",
                    content: "Back",
                    ontap: "backTap",
                    showing: false
                }, 
                { 
                    kind: "onyx.Button", 
                    content: "Get Data", 
                    ontap: "getMTAData"
                }
            ]
        },
        {
            name: "Main",
            kind: "Panels",
            layoutKind: "SlidingArranger",
            classes: "panels enyo-unselectable",
            fit: true,
            realtimeFit: true,
            draggable: false,
            components: [
                {
                    name: "MainList",
                    kind: "Repeater",
                    style: "overflow: auto;",
                    id: "mainList",
                    rows: 0,
                    onSetupItem: "setUpRow",
                    components: [
                        {
                            name: "ServiceItem",
                            kind: "ServiceItem"
                        }
                    ]
                },
                {
                    id: "detailPane",
                    name: "DetailPane",
                    classes: "onyx",
                    style: "overflow: auto;",
                    allowHtml: true,
                    content: ""
                }
            ]
        }
    ],
    published: {
        data: "",
    },
    handlers: {
        onItemSelected: "entryItemSelected"
    },
    getMTAData: function() {
        var ajax = new enyo.Ajax({ 
            url:  'http://mta.info/status/serviceStatus.txt',
            method: 'GET',
            handleAs: "text"
        });    
        ajax.response(this,"handleData").go();
        return true;
    },
    handleData: function(inSender, inResponse) {
        this.setData(parseData(inResponse));
    },
    dataChanged: function(inSender, inResponse) {
        this.$.MainList.setCount(this.getServices().length);
    },
    setUpRow: function(inSender, inEvent) {
        var i = inEvent.index;
        var s = this.getServices()[i];
        var rowControl = inEvent.item.controls[0];
        rowControl.setTitle(s.display);
        if ( s.key.length ) {
            rowControl.setData(this.getData()[s.key]);
        }
        
        //set the data too
        
        return true;
    },
    getServices: function() {
        var services = [ 
            { display: 'Favorites', key: '' }, 
            { display: 'Subway', key: 'subway' }, 
            { display: 'Bus', key: 'bus' }, 
            { display: 'LIRR', key: 'LIRR' }, 
            { display: 'MetroNorth', key: 'MetroNorth' }, 
            { display: 'Bridges & Tunnels', key: 'BT' } 
        ];
        return services;
    },
    entryItemSelected: function(inSender, inEvent) {
        if(this.isSmall()) {
            this.$.Main.setIndex(1);
            this.$.BackButton.setShowing(true);
        }
        this.$.DetailPane.setContent(inEvent.text);
    },
    backTap: function(inSender, inEvent) {
        this.$.BackButton.setShowing(false);
        this.$.Main.setIndex(0);
    },
    isSmall: function() {
        return window.matchMedia && window.matchMedia("all and (max-width:450px)").matches;
    }

});