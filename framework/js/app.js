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
                // {
                    // name: "BackButton",
                    // kind: "onyx.Button",
                    // content: "Back",
                    // ontap: "backTap",
                    // showing: false
                // }, 
                { 
                    name: "getData",
                    kind: "onyx.Button", 
                    // content: "Get Data", 
                    ontap: "getMTAData",
                    classes: "icon-buttons",
                    components: [
                        {
                            name: "getDataIcon",
                            kind: "onyx.Icon",
                            // classes: "spinner",
                            src: "images/refresh.png"
                            // src: "images/loader.gif"
                        }
                    ]
                },
                {
                    fit: true,
                },
                { 
                    kind: "onyx.Button", 
                    // content: "&#009881;", 
                    allowHtml: true,
                    // ontap: "getMTAData",
                    classes: "icon-buttons",
                    components: [
                        {
                            kind: "onyx.Icon",
                            src: "images/gear.png"
                        }
                    ]
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
                    kind: "Scroller",
                    id: "mainList",
                    components: [
                        {
                            name: "MainList",
                            kind: "Repeater",
                            style: "overflow: auto;",
                            rows: 0,
                            onSetupItem: "setUpRow",
                            components: [
                                {
                                    name: "ServiceItem",
                                    kind: "ServiceItem"
                                }
                            ]
                        }
                    ]
                },
                {
                    kind: "Scroller",
                    classes: "onyx",
                    components: [
                        {
                            id: "detailPane",
                            name: "DetailPane",
                            style: "overflow: auto;",
                            allowHtml: true,
                            content: "",
                        }
                    ]
                }
            ]
        },        
        {
            id: "bottomBar",
            kind: "onyx.Toolbar",
            layoutKind: "FittableColumnsLayout",
            style: "height: 40px;",
            components: [
                {
                    name: "BackButton",
                    kind: "onyx.Button",
                    // content: "Back",
                    ontap: "backTap",
                    showing: false,
                    classes: "icon-buttons",
                    components: [
                        {
                            kind: "onyx.Icon",
                            src: "images/back.png"
                        }
                    ]
                } 
            ]
        },
        {kind: "Signals", onkeyup: "handleKeyPress"}
    ],
    published: {
        data: "",
        favorites: "",
    },
    handlers: {
        onItemSelected: "entryItemSelected",
        onItemFavorite: "entryItemFavorite",
        onServiceTap: "serviceTap"
    },
    create: function() {
        this.inherited(arguments);
        this.storage = Storage;
        // this.retrieveFromStorage()
        this.$.Main.setIndex(0);
    },
    retrieveFromStorage: function() {
        this.setFavorites(this.storage.get("favorites") || []);
        this.opened = this.storage.get("opened") || {};
        this.setData(this.storage.get("feedData") || {});
    },
    getMTAData: function() {
        this.$.getDataIcon.addRemoveClass("spinner", true);
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
        this.$.getDataIcon.addRemoveClass("spinner", false);
    },
    dataChanged: function(inSender, inResponse) {
        this.markFavorites();
        this.$.MainList.setCount(this.getServices().length);
        this.storage.set("feedData", this.getData());
        return true;
    },
    setUpRow: function(inSender, inEvent) {
        var i = inEvent.index;
        var s = this.getServices()[i];
        var rowControl = inEvent.item.controls[0];
        rowControl.setTitle(s.display);
        if ( s.key !== '_favorites_') {
            rowControl.setData(this.getData()[s.key]);
        }
        else {
            rowControl.setData(this.parseFavorites());
        }
        rowControl.setKey(s.key);
        rowControl.setOpen(this.opened[s.key]);
        // enyo.log("setUpRow " + s.key);
        return true;
    },
    getServices: function() {
        var services = [ 
            { display: 'Favorites', key: '_favorites_' }, 
            { display: 'Subway', key: 'subway' }, 
            { display: 'Bus', key: 'bus' }, 
            { display: 'LIRR', key: 'LIRR' }, 
            { display: 'MetroNorth', key: 'MetroNorth' }, 
            { display: 'Bridges & Tunnels', key: 'BT' } 
        ];
        return services;
    },
    parseFavorites: function() {
        var f = this.getFavorites().sort();
        var i = 0; 
        var l = f.length;
        var keyParts = [];
        var d = {};
        var favorites = {}
        
        for (i = 0; i < l; i += 1) {
            keyParts = f[i].split(".");
            d[keyParts[1]] = this.getData()[keyParts[0]][keyParts[1]];
        }
        
        return d;
    },
    markFavorites: function() {
        var f = this.parseFavorites();
        var fKeys = Object.keys(f);
        var i = 0;
        var l = fKeys.length;
        
        for (i = 0; i < l; i += 1) {
            f[fKeys[i]].favorite = true;
        }
    },
    entryItemSelected: function(inSender, inEvent) {
        if(this.isSmall()) {
            this.$.Main.setIndex(1);
            this.$.BackButton.setShowing(true);
        }
        if (this.lastSelectedItem) {
            this.lastSelectedItem.addRemoveClass("entry-item-selected", false);
        }
        inEvent.originator.addRemoveClass("entry-item-selected", true);
        this.lastSelectedItem = inEvent.originator; 
        this.$.DetailPane.setContent(inEvent.text);
    },
    backTap: function(inSender, inEvent) {
        this.$.BackButton.setShowing(false);
        if (this.lastSelectedItem) {
            this.lastSelectedItem.addRemoveClass("entry-item-selected", false);
        }
        this.$.Main.setIndex(0);
    },
    isSmall: function() {
        // console.log("client width: " + document.documentElement.clientWidth);
        return document.documentElement.clientWidth <= 480;
        // return window.matchMedia && window.matchMedia("all and (max-width:481px)").matches;
    },
    entryItemFavorite: function(inSender, inEvent) {
        // enyo.log(inSender);
        // enyo.log(inEvent);
        var favorites = this.getFavorites() || [];
        var idx;
        
        if ( inEvent.favorite ) {
            favorites.push(inEvent.favoriteKey);
        }
        else {
            idx = favorites.indexOf(inEvent.favoriteKey);
            favorites.splice(idx, 1);   
        }
        // enyo.log(this.$.MainList.$);
        this.setFavorites(favorites);
        this.storage.set("favorites", favorites);
        delete inEvent.originator;
        this.dataChanged();
        return true;
    },
    serviceTap: function(inSender, inEvent) {
        var opened = this.opened || [];
        opened[inEvent.originator.getKey()] = inEvent.open;
        this.opened = opened;
        this.storage.set("opened", opened);
    },
    handleKeyPress: function(inSender, inEvent) {
        if (inEvent.keyCode == 27 && this.$.Main.getIndex() == 1) {
            // console.dir(arguments);
            this.backTap();
            inEvent.preventDefault();
            inEvent.stopPropagation();
            return true;
        }
    }
});