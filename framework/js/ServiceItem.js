enyo.kind({
    name: "ServiceItem",
    kind: "Control",
    classes: "serviceItem",
    components: [
        {
            name: "TitleBar",
            kind: "FittableColumns",
            classes: "item enyo-border-box service_title",
            components: [
                { 
                    name: "Title",
                    content: "title",
                }
            ],
            ontap: "titleTap"
        },
        {
            name: "EntryListDrawer",
            kind: "onyx.Drawer",
            open: false,
            components: [
                {
                    name: "EntryList",
                    kind: "Repeater",
                    rows: 0,
                    onSetupItem: "setUpRow",
                    components: [
                        {
                            kind: "EntryItem"
                        }
                    ]
                }
            ]
        }
    ],
    published: {
        title: "",
        data: null,
        key: "",
        open: false
    },
    events: {
        onServiceTap: "",
    },
    titleTap: function(inSender, inEvent) {
        this.setOpen(!this.$.EntryListDrawer.open)
        this.doServiceTap({"open": this.getOpen()})
    },
    openChanged: function(inSender, inEvent) {
        // enyo.log("openChanged" + this.getKey());
        this.$.EntryListDrawer.setOpen(this.getOpen());
    },
    titleChanged: function(inSender, inEvent) {
        this.$.Title.setContent(this.getTitle());
    },
    dataChanged: function(inSender, inEvent) {
        if (this.getData()) {
            this.$.EntryList.setCount(Object.keys(this.getData()).length);
        }
    },
    setUpRow: function(inSender, inEvent) {
        var i = inEvent.index;
        var k = this.getLines()[i];
        var d = this.getData()[k];
        var itemControl = inEvent.item.controls[0];
		
		if( this.title === 'Subway' && k !== 'SIR' )
		k = k.replace(/(\B)/g, '$1 | ');
        
        itemControl.setTitle(k);
        itemControl.setData(d);
        itemControl.setFavorite(d.favorite);
        this.$.EntryListDrawer.setOpen(this.getOpen());
        return true;
    },
    getLines: function() {
        var k = Object.keys(this.getData());
        return k.sort();
    }
})
