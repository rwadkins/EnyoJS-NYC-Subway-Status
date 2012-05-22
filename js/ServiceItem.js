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
    },
    titleTap: function(inSender, inEvent) {
        this.$.EntryListDrawer.setOpen(!this.$.EntryListDrawer.open);
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
        
        itemControl.setTitle(k);
        itemControl.setData(d);
        
        return true;
    },
    getLines: function() {
        var k = Object.keys(this.getData());
        return k.sort();
    }
})
