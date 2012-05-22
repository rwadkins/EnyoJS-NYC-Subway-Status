enyo.kind({
    name: "EntryItem",
    kind: "Control",
    classes: "entry-item",
    style: "position: relative;",
    events: {
        onItemSelected: "",
    },
    handlers: {
        ontap: "handleTap"
    },
    components: [
        {
            name: "itemTitle",
            caption: "",
            //fit: true
        },
        {
            name: "itemStatus",
            caption: "",
            style: "position: absolute; top: 10px; right: 10px;"
        }
    ],
    // ontap: "handleTap",
    published: {
        title: "",
        data: null, 
    },
    titleChanged: function(inSender, inEvent) {
        this.$.itemTitle.setContent(this.getTitle());
    },
    dataChanged: function(inSender, inEvent) {
        this.$.itemStatus.setContent(this.statusTranslation(this.getData().status).text);
    },
    statusTranslation: function(inString) {
        var statuses = {
            "PLANNED WORK": {
                text: "Planned Work"
            },
            "GOOD SERVICE": {
                text: "Good Service"
            },
            "SERVICE CHANGE": {
                text: "Service Change"
            },
            "DELAYS": {
                text: "Delays"
            }
        };
        
        return statuses[inString];
    },
    handleTap: function(inSender, inEvent) {
        this.doItemSelected(this.getData());
    }
});
