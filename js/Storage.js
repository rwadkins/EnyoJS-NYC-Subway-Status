enyo.kind({
    name: "Storage",
    kind: "Component",
    
    statics: {
        set: function(name, obj){
            if(typeof name === "string") {
                if(typeof obj === "object") {
                    localStorage.setItem(name, JSON.stringify(obj));
                }
                else if(typeof obj === "string") {
                    localStorage.setItem(name, obj);
                }
            }
        },
        
        /* Get the item with the key 'name'. */
        get: function(name){
            var result;
            if(typeof name === "string") {
                result = localStorage.getItem(name);
            }
            
            if(typeof result === "string"){
                return JSON.parse(result);
            } else if(typeof result === "object" && result !== null) {
                enyo.log("OBJECT: " + result);
                throw "ERROR [Storage.get]: getItem returned an object. Should be a string.";
            } else if(typeof result === "undefined" || result === null){
                //TODO: what to do? log?
            }
            
        },
        
        /* Remove the item with the key 'name'. */
        remove: function(name){
            if(typeof name === "string") {
                localStorage.remove(name);
            } else {
                throw "ERROR [Storage.remove]: 'name' was not a String.";
            }
        },
        
        /* Returns length of all localStorage objects. */
        __getSize: function(){
            var i, count = 0;
            for(i = 0; i < localStorage.length; i++){
                count += localStorage.getItem(localStorage.key()).length;
            }
            return count;
        }
    }

});