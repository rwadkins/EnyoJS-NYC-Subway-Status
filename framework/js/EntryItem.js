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
            name: "itemTitle",
            caption: "",
            //fit: true
        },
        {
            name: "itemStatus",
            caption: "",
            style: "position: absolute; top: 10px; right: 39px;"
        },
        {
            name: "itemFavorite",
            caption: "",
            classes: "itemFavorite",
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
    favoriteChanged: function(inSender, inEvent) {
        this.$.itemFavorite.addRemoveClass('itemFavoriteSelected', this.getFavorite());
    },
    handleTap: function(inSender, inEvent) {
        var favorite, d;
        if (inSender.name === "itemFavorite") {
            d = this.getData();
            favorite = !d.favorite;
            d.favorite = favorite; 
            this.setFavorite(favorite);
            this.doItemFavorite(d);
        }
        else {
            this.doItemSelected(this.getData());
        }
    }
});
