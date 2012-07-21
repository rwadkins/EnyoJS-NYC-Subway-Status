enyo.kind({
    name: "App",
    kind: "FittableRows",
    classes: "onyx",
    components: [
        {
            kind: "onyx.Toolbar",
            layoutKind: "FittableColumnsLayout",
            style: "height: 55px;",
            classes: "enyo-unselectable",
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
					style: "height: 15px !important; text-align: center; vertical-align:middle;",
					content: "Smooth Ride NYC",
                },
                { 
                    kind: "onyx.Button", 
                    // content: "&#009881;", 
                    allowHtml: true,
                    ontap: "configTap",
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
            classes: "enyo-unselectable",
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
                },
                {
                    name: "LastUpdated",
                    classes: "lastUpdated",
					allowHtml: true,
                    content: "",
                    // fit: true
                } 
            ]
        },
        {
            id: "refreshPopup",
            name: "refreshPopup",
            kind: "onyx.Popup",
            classes: "onyx",
            modal: true, 
            floating: true,
            classes: "refreshPopup",
            showing: false,
            components: [
                { content: "Set Auto Update Preference", classes: "onyx" },
                { kind: "onyx.Button", classes: "onyx", value: "0", content: "Never", ontap: "handleRefreshTap" },
                { kind: "onyx.Button", classes: "onyx", value: "300000", content: "5 Minutes", ontap: "handleRefreshTap" },
                { kind: "onyx.Button", classes: "onyx", value: "600000", content: "10 Minutes", ontap: "handleRefreshTap" },
                { kind: "onyx.Button", classes: "onyx", value: "900000", content: "15 Minutes", ontap: "handleRefreshTap" },
                { kind: "onyx.Button", classes: "onyx", value: "1800000", content: "30 Minutes", ontap: "handleRefreshTap" },
                { kind: "onyx.Button", classes: "onyx", value: "3600000", content: "1 hour", ontap: "handleRefreshTap" },
            ],
            onHide: "refreshHideHandler"
        },
        {kind: "Signals", onkeyup: "handleKeyPress"},
        {name: "refreshPopupAnimator", kind: "Animator", onStep: "refreshPopupAnimatorStep", onEnd: "refreshPopupAnimatorEnd" }
    ],
    published: {
        data: "",
        favorites: "",
        autoRefresh: ""
    },
    handlers: {
        onItemSelected: "entryItemSelected",
        onItemFavorite: "entryItemFavorite",
        onServiceTap: "serviceTap"
    },
    create: function() {
        this.inherited(arguments);
        this.storage = Storage;
        this.preferences = {};
        // this.retrieveFromStorage()
        this.neverAutoRetrieved = 0;
        this.$.Main.setIndex(0);
    },
    retrieveFromStorage: function() {
        this.setFavorites(this.storage.get("favorites") || []);
        this.opened = this.storage.get("opened") || {};
        this.setAutoRefresh(this.storage.get("autoRefresh") || 0);
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
        var updateDate = new Date(this.getData().timeStamp);
        if (updateDate != 'Invalid Date') {
            var updateDateMediumDate = updateDate.format('mediumDate');
            var updateDateShortTime = updateDate.format('shortTime');
            this.$.LastUpdated.setContent("Updated: " + updateDateMediumDate + ' ' + updateDateShortTime);
        } else {
            this.$.LastUpdated.setContent("Updated: " + this.getData().timeStamp);
        }
        this.$.MainList.setCount(this.getServices().length);
        this.storage.set("feedData", this.getData());
        return true;
    },
    autoRefreshChanged: function(inSender, inEvent) {
        // console.log(this.getAutoRefresh());
        // this.preferences.autoRefresh = this.getAutoRefresh();
        this.doRefreshTimeout();
        this.storage.set("autoRefresh", this.getAutoRefresh());
    },
    doRefreshTimeout: function() {
        var v = this.getAutoRefresh();
        
        if (parseInt(v) === 0) {
            if (this.refreshTimeoutID) {
                window.clearInterval(this.refreshTimeoutID);
            }
        }
        else {
            if (this.neverAutoRetrieved === 0) {
                this.getMTAData();
                this.neverAutoRetrieved = 1;
            }
            this.refreshTimeoutID = window.setInterval(enyo.bind(this, "getMTAData"), v);
        }        
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
			this.$.LastUpdated.setShowing(false);
        }
        if (this.lastSelectedItem) {
            this.lastSelectedItem.addRemoveClass("entry-item-selected", false);
        }
        inEvent.originator.addRemoveClass("entry-item-selected", true);
        this.lastSelectedItem = inEvent.originator; 
        this.$.DetailPane.setContent(inEvent.status === "GOOD SERVICE" ? this.getGoodText() : inEvent.text);
    },
    backTap: function(inSender, inEvent) {
        this.$.BackButton.setShowing(false);
		this.$.LastUpdated.setShowing(true);
        if (this.lastSelectedItem) {
            this.lastSelectedItem.addRemoveClass("entry-item-selected", false);
        }
        this.$.Main.setIndex(0);
    },
    getGoodText: function() {
        var texts = [
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Enjoy Your Ride!</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Have a Safe Trip!</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Come Back Soon!</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Tell a Friend About Our App!</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />See Something, Say Something...</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Mind the Gap!</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Take a Nap if You Want!</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Take Me with You!</div>", 
            "<div id=\"smile\"><img src=\"images/smile.png\"><br />Don't Talk to Strangers!</div>"
        ];
        
        var i = parseInt((Math.random() * texts.length), 10);
        
        return texts[i];
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
    },
    configTap: function(inSender, inEvent) {
        var h, w;
        var p = this.$.refreshPopup;
        p.show();
        p.applyStyle("height", null);
        p.applyStyle("width", null);
        h = p.hasNode()["offsetHeight"];
        w = p.hasNode()["offsetWidth"];
        
        p.applyStyle("height", 0);
        p.applyStyle("width", 0);
        this.$.refreshPopupAnimator.play(
            {
                startValue: 0,
                endValue: 1,
                height: h,
                width: w
            }
        );
    }, 
    handleRefreshTap: function(inSender, inEvent) {
        // console.dir([inSender, inEvent]);
        this.setAutoRefresh(inEvent.dispatchTarget.value);
        this.$.refreshPopup.hide();
    },
    refreshPopupAnimatorStep: function(inEvent) {
        /* 
         * height and width come in with padding and border widths included,
         * but setting the height and width styles on the elements should
         * not include those things. dimensionExtra should be padding * 2 + 
         * border width * 2.  I don't know why the browsers don't give the 
         * ability to take real, consistent measurements of elements. 
         */
        var dimensionExtra = 30;
        
        this.$.refreshPopup.applyStyle("height", Math.max(parseInt(inEvent.height * inEvent.value - dimensionExtra), 0) + "px");
        this.$.refreshPopup.applyStyle("width", Math.max(parseInt(inEvent.width * inEvent.value - dimensionExtra), 0) + "px");
    },
    refreshPopupAnimatorEnd: function(inEvent) {
        var p = this.$.refreshPopup;
        if (p.closing) {
            p.hide();
            p.closing = 0;
        }
    },
    refreshHideHandler: function(inSender, inEvent) {
        var h, w;
        var p = this.$.refreshPopup;
        h = p.hasNode()["offsetHeight"];
        w = p.hasNode()["offsetWidth"];
        p.closing = 1;
        this.$.refreshPopupAnimator.play(
            {
                startValue: 1,
                endValue: 0,
                height: h,
                width: w
            }
        );        
    }
});