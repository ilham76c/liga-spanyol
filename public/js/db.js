var db_promised = idb.open("liga-spanyol", 1, function(upgradeDb) {
    let match_object_store = upgradeDb.createObjectStore("match");
    match_object_store.createIndex("id", "id", { unique: true });
    // let matches_object_store = upgradeDb.createObjectStore("matches");
    // matches_object_store.createIndex("id", "id", { unique: true });
});

function saveForLater(match) {
    return new Promise(function(resolve, reject) {
        db_promised.then(function(db) {
            let tx = db.transaction("match", "readwrite");
            let store = tx.objectStore("match");            
            store.add(match, match.match.id)            
            return tx.complete;
        })
        .then(function() {
            //alert("Match berhasil di simpan.");
            //Materialize.toast("Match berhasil di simpan.", 4000)             
            resolve(true);
            console.log("Match berhasil di simpan.");
        })
        .catch(function(error) {
            reject(false);
            console.error("Error : " + error);            
        });    
    })
}

function getAll() {
    return new Promise(function(resolve, reject) {
        db_promised.then(function(db) {
            let tx = db.transaction("match", "readonly");
            let store = tx.objectStore("match");
            return store.getAll();
        })
        .then(function(mathes) {
            resolve(mathes);
        })        
    });
}

function getById(id) {
    return new Promise(function(resolve, reject) {
        db_promised
            .then(function(db) {
                let tx = db.transaction("match", "readonly");
                let store = tx.objectStore("match");
                //console.log(typeof(id));
                return store.get(parseInt(id));
            })
            .then(function(match) {                
                resolve(match);
            });
    });
}

function delById(id) {
    return new Promise(function(resolve, reject) {    
        db_promised.then(function(db) {
            let tx = db.transaction("match", "readwrite");
            let store = tx.objectStore("match");         
            console.log('id ' + id);
            store.delete(parseInt(id));
            return tx.complete;
        })
        .then(function() {
            //alert("Match telah dihapus");
            console.log("Match telah dihapus");
            resolve(true);
        })
    })
}

function isSaved(id) {
    return new Promise(function(resolve, reject) {
        db_promised
            .then(function(db) {
                let tx = db.transaction("match", "readonly");
                let store = tx.objectStore("match");
                //console.log(typeof(id));
                //console.log(store.get(parseInt(id)))
                return store.get(parseInt(id));
            })
            .then(function(res) {                
                if (res !== undefined) {                    
                    resolve(true)
                } else {
                    resolve(false)                    
                }
                // console.log('match telah tersimpan');
                // resolve(true);
            })
            .catch(function(error) {
                console.log(error)
            });
    });
}
