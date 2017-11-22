const fs = require('fs');
const path = require('path');

class StorageController {
    /**
     * Class constructor.
     */
    constructor() {
        this.size = 0;
        this.dataStore = JSON.parse(fs.readFileSync(path.join(__dirname, '../database/storage.json')));
    }

    /**
     * Inserts a key and a value into the hash table.
     * 
     * @param  {String} key
     * @return {Object} this.dataStore
     */
    put(key, value) {
        if (this.dataStore.hasOwnProperty(key)) {
            throw new Error('Hash table cannot contain duplicates!');
        } else {
            this.dataStore[key] = value;
            this.size += 1;
            fs.writeFileSync(path.join(__dirname, '../database/storage.json'), JSON.stringify(this.dataStore, null, 2), (err) => {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
            });
            return this.dataStore;
        }
    }

    /**
     * Returns true if some value equal to the value exists within the hash table. 
     * Returns false if the value isn't found.
     *
     * @param {String} key
     * @return {Boolean}
     */
    contains(key) {
        if (this.dataStore.hasOwnProperty(key)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get value by key.
     * 
     * @param  {String} key [description]
     * @return {String}
     */
    getElement(key) {
        if (this.contains(key)) {
            return this.dataStore[key];
        }
    }

    /**
     * Returns an enumeration of the keys contained in the hash table.
     * 
     * @return {Object} this.dataStore
     */
    enumerate() {
        for (let element in this.dataStore) {
            console.log(`element ${this.dataStore[element]}`);
        }
        return this.dataStore;
    }

    /**
     * Removes the key and its value.
     * 
     * @param  {String} key
     * @return {Object} this.dataStore
     */
    remove(key) {
        if (this.dataStore.hasOwnProperty(key)) {
            delete this.dataStore[key];
            this.size -= 1;
            return this.dataStore;
        }
    }

    /**
     * Resets and empties the hash table.
     *
     * @return {Number} this.size;
     */
    clear() {
        this.dataStore = {};
        this.size = 0;
        return this.size;
    }

    /**
     * Returns the number of entries in the hash table.
     * 
     * @return {Number} this.size
     */
    getSize() {
        return this.size;
    }

    /**
     * Returns true if the hash table is empty; 
     * returns false if it contains at least one key.
     * 
     * @return {Boolean}
     */
    isEmpty() {
        if (this.size > 0) {
            return false
        } else {
            return true;
        }
    }
}

module.exports = new StorageController();