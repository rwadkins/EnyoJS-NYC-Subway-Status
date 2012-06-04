enyo.kind({
    name: "EntryItem",
    kind: "Control",
    classes: "entry-item",
    style: "position: relative;",
    events: {
        onItemSelected: "",
        onItemFavorite: "",
    },
    handlers: {
        ontap: "handleTap"
    },
    components: [
        {
            name: "itemFavorite",
            caption: "",
            classes: "itemFavorite",
            // style: "position: absolute; top: 10px; right: 10px; height: 24px; width: 24px;"
            style: "height: 24px; width: 24px;"
        },
        {
            name: "itemTitle",
            caption: "",
            style: "position: absolute; top: 10px; left: 39px;"
            //fit: true
        },
        {
            name: "itemStatus",
            classes: "itemStatus",
            caption: "",
            style: "position: absolute; top: 10px; right: 39px;"
        },
        {
            name: "itemStatusColor",
            style: "position: absolute; top: 10px; right: 10px; height: 24px; width: 24px;"            
        }
    ],
    // ontap: "handleTap",
    published: {
        title: "",
        data: null,
        favorite: false
    },
    titleChanged: function(inSender, inEvent) {
        this.$.itemTitle.setContent(this.getTitle());
    },
    dataChanged: function(inSender, inEvent) {
        this.$.itemStatus.setContent(this.statusTranslation(this.getData().status).text);
        this.$.itemStatusColor.setClassAttribute(this.statusTranslation(this.getData().status).colorStyle);
    },
    statusTranslation: function(inString) {
        var statuses = {
            "PLANNED WORK": {
                text: "Planned Work",
                colorStyle: "orange-status"
            },
            "GOOD SERVICE": {
                text: "Good Service",
                colorStyle: "green-status"
            },
            "SERVICE CHANGE": {
                text: "Service Change",
                colorStyle: "red-status"
            },
            "DELAYS": {
                text: "Delays",
                colorStyle: "yellow-status"
            }
        };
        
        return statuses[inString];
    },
    favoriteChanged: function(inSender, inEvent) {
        this.$.itemFavorite.addRemoveClass('itemFavoriteSelected', this.getFavorite());
    },
    handleTap: function(inSender, inEvent) {
        var favorite, d;
        d = this.getData();
        d.originator = this;
        if (inSender.name === "itemFavorite") {
            favorite = !d.favorite;
            d.favorite = favorite; 
            this.setFavorite(favorite);
            this.doItemFavorite(d);
        }
        else {
            this.doItemSelected(d);
        }
        delete d.originator;
    }
});
