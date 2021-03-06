"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const config_1 = require("./utils/config");
const mappings_1 = require("./utils/mappings");
const difficulty_1 = require("./model/difficulty");
const map_1 = require("./model/map");
const interface_1 = require("./utils/interface");
const staffs_1 = require("./model/staffs");
const machine_1 = require("./model/machine");
const translation_1 = require("./utils/translation");
const utilities_1 = require("./utils/utilities");
/**
 * Game controller
 */
class Game {
    /**
     * Clear any save
     */
    static clearGame() {
        // no more save
        localStorage.removeItem("save");
        localStorage.removeItem("tiles");
    }
    /**
     * @brief This function is used to initialize a game.
     * It therefore calls the necessary functions to start the interface and to create a map.
     *
     * set The starting map for a game
     *
     * @param level difficulty chosen
     */
    static initGame(level) {
        // create map
        this.map = new map_1.Map(difficulty_1.Difficulty.getDifficultyByID(level));
        // save
        Game.save();
    }
    /**
     * Load the save of the map
     */
    static loadSave() {
        let save = localStorage.getItem("save");
        if (save == null) {
            console.error("no save");
            this.initGame(1); // reset
            return;
        }
        // load from save
        this.map = map_1.Map.revive(JSON.parse(save, function reviver(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (value.dataType === 'StaffDictionary') {
                    return staffs_1.StaffDictionary.revive(value);
                }
                if (value.dataType === 'Machine') {
                    return machine_1.Machine.revive(value.value);
                }
                if (value.dataType === 'Box') {
                    return machine_1.Box.revive(value.value);
                }
                if (value.dataType === 'Facade') {
                    return machine_1.Facade.revive(value.value);
                }
            }
            return value;
        }));
    }
    /**
     * Save the map
     * @private
     */
    static save() {
        localStorage.setItem("save", JSON.stringify(this.map, function replacer(key, value) {
            if (value instanceof staffs_1.StaffDictionary) {
                return {
                    dataType: 'StaffDictionary',
                    value: Array.from(value.entries()),
                };
            }
            else if (value instanceof machine_1.Machine) {
                return {
                    dataType: 'Machine',
                    value: value.serialize(),
                };
            }
            else if (value instanceof machine_1.Box) {
                return {
                    dataType: 'Box',
                    value: value.serialize(),
                };
            }
            else if (value instanceof machine_1.Facade) {
                return {
                    dataType: 'Facade',
                    value: value.serialize(),
                };
            }
            else {
                return value;
            }
        }));
    }
    /**
     * Set the language value
     * @private
     */
    static getTranslationLanguage() {
        if (localStorage.getItem("lang") == null)
            localStorage.setItem("lang", translation_1.Language.EN);
        return localStorage.getItem("lang");
    }
    /**
     * Get the audio value
     * @private
     */
    static getAudio() {
        if (localStorage.getItem("audio") == null)
            localStorage.setItem("audio", "0.02");
        return Number(localStorage.getItem("audio"));
    }
    /**
     * Get the audio value
     * @private
     */
    static getMusic() {
        if (localStorage.getItem("music") == null)
            localStorage.setItem("music", "truth.mp3");
        return String(localStorage.getItem("music"));
    }
    /**
     * Set the audio value
     * @private
     */
    static setAudio(volume) {
        localStorage.setItem("audio", String(volume));
    }
    /**
     * Set the music value
     * @private
     */
    static setMusic(path) {
        localStorage.setItem("music", path);
    }
    /**
     * Returns the tiles of the map
     * @param max max value for a tile
     */
    static getTiles(max) {
        if (localStorage.getItem("tiles") == null) {
            // create
            let tiles = new Array();
            for (let i = 0; i < this.map.getWidth; i++) {
                tiles[i] = new Array();
                for (let j = 0; j < this.map.getHeight; j++) {
                    tiles[i][j] = Number(utilities_1.getRandomInt(max));
                }
            }
            // save
            localStorage.setItem("tiles", JSON.stringify(tiles));
        }
        // returns
        return JSON.parse(localStorage.getItem("tiles"));
    }
}
exports.Game = Game;
/** game configuration **/
Game.config = config_1.Config;
/** user mappings **/
Game.mappings = mappings_1.Mappings;
/** interface **/
Game.interface = interface_1.Interface;
