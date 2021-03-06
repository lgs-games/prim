"use strict";
/**
 * \file machine_info.h
 * \author Ramzy ZEBRIR and Antoine man
 * \version 0.1
 * \date 01/03/2021
 * \see machine.h
 *
 * Contains all information about machine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = exports.Direction = exports.Cardinal = exports.Facade = exports.Machine = exports.MachineStuff = exports.MachineInfo = void 0;
const code_1 = require("../utils/code");
const utilities_1 = require("../utils/utilities");
const translation_1 = require("../utils/translation");
const logger_1 = require("./logger");
/**
 * Struct which contains all information about a machine
 *
 * Only machines that have canUpgrade=true can upgrade.
 * This value must be checked before applying effect or increase level.
 */
class MachineInfo {
    constructor(name_en, name_fr, type, tag, costE, costDD, costUpgradeE, costUpgradeDD, costDestroyE, costDestroyDD, description_en, description_fr, upgrade_en, upgrade_fr, capacity, defaultOrientation_en, defaultOrientation_fr, canUpgrade, levelUpFunction, imageFile) {
        this.name_en = name_en;
        this.name_fr = name_fr;
        this.type = type;
        this.tag = tag;
        this.costE = costE;
        this.costDD = costDD;
        this.costUpgradeE = costUpgradeE;
        this.costUpgradeDD = costUpgradeDD;
        this.costDestroyE = costDestroyE;
        this.costDestroyDD = costDestroyDD;
        this.description_en = description_en;
        this.description_fr = description_fr;
        this.capacity = capacity;
        this.defaultOrientation_en = defaultOrientation_en;
        this.defaultOrientation_fr = defaultOrientation_fr;
        this.canUpgrade = canUpgrade;
        this.upgrade_en = upgrade_en;
        this.upgrade_fr = upgrade_fr;
        this.levelUpFunction = levelUpFunction ?? null;
        this.imageFile = imageFile;
    }
    /**
     * Returns the machine capacity (if upgradable)
     * according to the machine level
     * @param level the machine level
     * @return number the new capacity or -1 if not upgradable
     */
    capacityByLevel(level) { return this.levelUpFunction === null ? -1 : this.levelUpFunction(level); }
    /**
     * return the name with the correct language
     * @return name the name of a machine
     */
    name(lang) {
        let logger = logger_1.Logger.Instance;
        if (lang == translation_1.Language.EN) {
            logger.info("English name set");
            return this.name_en;
        }
        else if (lang == translation_1.Language.FR) {
            logger.info("French name set");
            return this.name_fr;
        }
        else
            return "ERROR TRANSLATION";
    }
    /**
     * return the description with the correct language
     * @return description the description of a machine
     */
    description(lang) {
        let logger = logger_1.Logger.Instance;
        if (lang == translation_1.Language.EN) {
            logger.info("English description set");
            return this.description_en;
        }
        else if (lang == translation_1.Language.FR) {
            logger.info("French description set");
            return this.description_fr;
        }
        else
            return "ERROR TRANSLATION";
    }
    /**
     * return the upgrade description with the correct language
     * @return upgrade the description of the upgrade
     */
    upgrade(lang) {
        let logger = logger_1.Logger.Instance;
        if (lang == translation_1.Language.EN) {
            logger.info("English upgrade description setted");
            return this.upgrade_en;
        }
        else if (lang == translation_1.Language.FR) {
            logger.info("French upgrade description setted");
            return this.upgrade_fr;
        }
        else
            return "ERROR TRANSLATION";
    }
    defaultOrientation(langue) {
        let logger = logger_1.Logger.Instance;
        if (langue == translation_1.Language.EN) {
            logger.info("English default Orientation description setted");
            return this.defaultOrientation_en;
        }
        else if (langue == translation_1.Language.FR) {
            logger.info("French default Orientation description setted");
            return this.defaultOrientation_fr;
        }
        else
            return "ERROR TRANSLATION";
    }
}
exports.MachineInfo = MachineInfo;
/**
 * Contains id associate to the machine.
 */
var MachineStuff;
(function (MachineStuff) {
    MachineStuff[MachineStuff["MS_COLLECTOR"] = 1] = "MS_COLLECTOR";
    MachineStuff[MachineStuff["MS_CONVEYOR_BELT"] = 2] = "MS_CONVEYOR_BELT";
    MachineStuff[MachineStuff["MS_CROSS_BELT"] = 3] = "MS_CROSS_BELT";
    MachineStuff[MachineStuff["MS_RECYCLING_CENTER"] = 4] = "MS_RECYCLING_CENTER";
    MachineStuff[MachineStuff["MS_JUNKYARD"] = 5] = "MS_JUNKYARD";
})(MachineStuff = exports.MachineStuff || (exports.MachineStuff = {}));
/**
 * \author Ramzy ZEBRIR and Antoine MAN
 * \version 0.1
 * \date 01/03/2021
 * \see machine_info
 *
 * Struct which contains the main information about a machine
 */
class Machine {
    /**
     * Machine which contains the main information about a machine.
     * Function to create a new machine according to the type machine given
     * @param type MachineStuff
     */
    constructor(type) {
        this.rotation = 0;
        let logger = logger_1.Logger.Instance;
        logger.debug("New Machine stuff type = " + type);
        this._type = type;
        this._level = 1;
        this._interface = Machine.defaultFacade(type);
    }
    /**
     * function to get the type of the machine
     * @return the type of the machine
     */
    get type() { return this._type; }
    /**
     * function to get the level of the machine
     * @return the level of the machine
     */
    get level() { return this._level; }
    /**
     * This function upgrade a machine by incrementing his level
     */
    increaseLevel() { this._level++; }
    /**
     * A function to know if the direction given in argument is equals to
     * the north direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationTop(d) { return this.getDirection(Cardinal.NORTH) == d; }
    /**
     * A function to know if the direction given in argument is equals to
     * the north direction and the east direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationTopRight(d) {
        return this.getDirection(Cardinal.NORTH) == d && this.getDirection(Cardinal.EAST) == d;
    }
    /**
     * A function to know if the direction given in argument is equals to
     * the east direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationRight(d) {
        return this.getDirection(Cardinal.EAST) == d;
    }
    /**
     * A function to know if the direction given in argument is equals to
     * the east direction and the south direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationBottomRight(d) {
        return this.getDirection(Cardinal.SOUTH) == d && this.getDirection(Cardinal.EAST) == d;
    }
    /**
     * A function to know if the direction given in argument is equals to
     * the south direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationBottom(d) {
        return this.getDirection(Cardinal.SOUTH) == d;
    }
    /**
     * A function to know if the direction given in argument is equals to
     * the south direction and the left direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationBottomLeft(d) {
        return this.getDirection(Cardinal.SOUTH) == d && this.getDirection(Cardinal.WEST) == d;
    }
    /**
     * A function to know if the direction given in argument is equals to
     * the left direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationLeft(d) {
        return this.getDirection(Cardinal.WEST) == d;
    }
    /**
     * A function to know if the direction given in argument is equals to
     * the north direction and the left direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationTopLeft(d) {
        return this.getDirection(Cardinal.NORTH) == d && this.getDirection(Cardinal.WEST) == d;
    }
    ;
    /**
     * A function to know if the number of rotation is correct
     * Between 0 and NUMBER_CARDINAL(4)
     * @param rotation a rotation
     * @return true if yes, if not false
     */
    static isRotationCorrect(rotation) {
        return rotation >= 0 && rotation < Machine.NUMBER_CARDINAL;
    }
    /**
     * A function to set the direction of a facade machine according to the cardinal
     * @param card a cardinal
     * @param d a direction
     */
    setDirection(card, d) {
        this._interface[card].direction = d;
    }
    /**
     * A function to get the direction of a facade machine according to the cardinal
     * @param card a cardinal
     * @return Direction of the facade machine (IN, OUT, NONE)
     */
    getDirection(card) {
        return this._interface[card].direction;
    }
    ;
    /**
     * A function to set a box of a facade machine according to the cardinal
     * @param card a cardinal
     * @param box a box
     */
    setBox(card, box) {
        this._interface[card].box = box;
    }
    /**
     * A function to get a box of a facade machine according to the cardinal
     * @param card a cardinal
     * @return box of the facade machine
     */
    getBox(card) {
        return this._interface[card].box;
    }
    /**
     * A function to add a box to the facade machine according to the cardinal
     * @param card a cardinal
     * @param box a box
     */
    addBox(card, box) {
        this._interface[card].box?.addBox(box);
    }
    ;
    /**
     * A function to destroy a box of the facade machine according to the cardinal
     * @param card a cardinal
     */
    destroyBox(card) {
        let tmp = this.getBox(card);
        // Verify if there is a box in the facade machine
        if (tmp != null) {
            this._interface[card].box = null;
        }
    }
    ;
    /**
     * This function rotate the orientation of a machine in clockwise
     * The int rotation can be a negative value.
     * @param rotation a valid rotation
     */
    rotate(rotation) {
        let logger = logger_1.Logger.Instance;
        logger.debug(rotation + " Rotations for this machine = " + this._type);
        let tmpBox;
        let tmpDirection;
        rotation = (rotation % Machine.NUMBER_CARDINAL) + Machine.NUMBER_CARDINAL;
        this.rotation = rotation;
        //      North -----> East
        //       / \          |
        //        |           V
        //      West <----- South
        //
        for (let rot = 0; rot < (rotation % Machine.NUMBER_CARDINAL); rot++) {
            tmpDirection = this.getDirection(Cardinal.NORTH);
            tmpBox = this.getBox(Cardinal.NORTH);
            // North facade become West facade
            this.setDirection(Cardinal.NORTH, this.getDirection(Cardinal.WEST));
            this.setBox(Cardinal.NORTH, this.getBox(Cardinal.WEST));
            // West facade become South facade
            this.setDirection(Cardinal.WEST, this.getDirection(Cardinal.SOUTH));
            this.setBox(Cardinal.WEST, this.getBox(Cardinal.SOUTH));
            // South facade become East facade
            this.setDirection(Cardinal.SOUTH, this.getDirection(Cardinal.EAST));
            this.setBox(Cardinal.SOUTH, this.getBox(Cardinal.EAST));
            // East facade become North facade
            this.setDirection(Cardinal.EAST, tmpDirection);
            this.setBox(Cardinal.EAST, tmpBox);
        }
    }
    /**
     * @brief a function to get a default orientation for a machine
     * @param s a type machine
     *
     * This fonction get D:
     * MS_COLLECTOR = 1, collector machine
     * <pre>
     *      None
     *  None x None
     *      Out
     * </pre>
     *
     * MS_CONVEYOR_BELT = 2, conveyor belt
     * <pre>
     *      In
     *   In x In
     *     Out
     * </pre>
     *
     *
     * MS_CROSS = 3, cross
     * <pre>
     *      In
     *  Out x In
     *     Out
     * </pre>
     *
     * MS_RECYCLING_CENTER = 4, recycling center
     * <pre>
     *      In
     *   In x In
     *     Out
     * </pre>
     *
     * MS_JUNKYARD = 5, junkyard
     * <pre>
     *      In
     *   In x In
     *     In
     * </pre>
     * @return a default orientation for a machine
     */
    static defaultFacade(s) {
        let logger = logger_1.Logger.Instance;
        logger.debug("Default facade creation for this machine stuff = " + s);
        let interfaces = new Array();
        for (let i = 0; i < Machine.NUMBER_CARDINAL; i++) {
            interfaces.push(new Facade(i));
        }
        // Give a default orientation for each machine (IN, OUT, NONE)
        switch (s) {
            // Resources move out by the south
            case MachineStuff.MS_COLLECTOR:
                interfaces[Cardinal.SOUTH].direction = Direction.OUT;
                break;
            // Resources move in by all direction except South which is the exit
            case MachineStuff.MS_CONVEYOR_BELT:
                interfaces[Cardinal.NORTH].direction = Direction.IN;
                interfaces[Cardinal.EAST].direction = Direction.IN;
                interfaces[Cardinal.SOUTH].direction = Direction.OUT;
                interfaces[Cardinal.WEST].direction = Direction.IN;
                break;
            // Resources move in by the north and the east and they move out by the south and the west
            case MachineStuff.MS_CROSS_BELT:
                interfaces[Cardinal.NORTH].direction = Direction.IN;
                interfaces[Cardinal.EAST].direction = Direction.IN;
                interfaces[Cardinal.SOUTH].direction = Direction.OUT;
                interfaces[Cardinal.WEST].direction = Direction.OUT;
                break;
            // Resources move in by all direction except South which is the exit
            case MachineStuff.MS_RECYCLING_CENTER:
                interfaces[Cardinal.NORTH].direction = Direction.IN;
                interfaces[Cardinal.EAST].direction = Direction.IN;
                interfaces[Cardinal.SOUTH].direction = Direction.OUT;
                interfaces[Cardinal.WEST].direction = Direction.IN;
                break;
            // Resources move in by all direction
            case MachineStuff.MS_JUNKYARD:
                interfaces[Cardinal.NORTH].direction = Direction.IN;
                interfaces[Cardinal.EAST].direction = Direction.IN;
                interfaces[Cardinal.SOUTH].direction = Direction.IN;
                interfaces[Cardinal.WEST].direction = Direction.IN;
                break;
            default:
                return interfaces;
        }
        return interfaces;
    }
    /**
     * Returns the serialization of a machine
     */
    serialize() {
        return {
            interface: this._interface,
            level: this._level,
            type: this._type,
            rotation: this.rotation,
        };
    }
    /**
     * Revive of machine from a machine serialization
     * @param obj a machine serialized with @serialize
     */
    static revive(obj) {
        // @ts-ignore
        let m = new Machine(obj.type);
        // @ts-ignore
        m._level = obj.level;
        // @ts-ignore
        for (const facade of obj.interface) {
            m.setBox(facade.cardinal, facade.box);
        }
        // @ts-ignore
        m.rotate(obj.rotation);
        return m;
    }
}
exports.Machine = Machine;
Machine.NUMBER_CARDINAL = 4;
/**
 * \author Antoine MAN
 * \version 0.1
 * \date 09/04/2021
 * \see Box
 *
 * This header contains functions related to the interactions with a machine facade.
 * A facade correspond to a machine wall.
 *
 * Contains all the map information concerning a wall machine
 * Cardinal : to identify the wall of the machine (NORTH, EAST, SOUTH, WEST)
 * Direction : to know if the wall correspond to an entry, to an exit or to nothing
 * Box : it allow to stock resources and garbage
 */
class Facade {
    /**
     * Facade that contains all the map information concerning a wall machine
     * @param cardinal a cardinal (north, south, easy, west, ...)
     */
    constructor(cardinal) {
        let logger = logger_1.Logger.Instance;
        logger.debug("New Cardinal");
        this.cardinal = cardinal;
        this.direction = Direction.NONE;
        this.content = null;
    }
    get box() { return this.content; }
    set box(box) { this.content = box; }
    /**
     * Allows in relation to a cardinal to return the modifications to be made on the coordinates
     * @param cardinal a cardinal
     * @return Vector2D modifications to be made on the coordinates
     */
    static modifyXYWithCardinal(cardinal) {
        switch (cardinal) {
            case Cardinal.NORTH:
                return new utilities_1.Vector2D(0, -1);
            case Cardinal.EAST:
                return new utilities_1.Vector2D(1, 0);
            case Cardinal.SOUTH:
                return new utilities_1.Vector2D(0, 1);
            case Cardinal.WEST:
                return new utilities_1.Vector2D(-1, 0);
            default:
                return new utilities_1.Vector2D(0, 0);
        }
    }
    /**
     * Serialize a facade, returns as an object
     * @return object serialized facade
     */
    serialize() {
        return {
            cardinal: this.cardinal,
            direction: this.cardinal,
            content: this.content,
        };
    }
    /**
     * Revive a serialized facade
     * @param obj a serialized facade
     * @return Facade a facade
     */
    static revive(obj) {
        let f = new Facade(obj.cardinal);
        f.direction = obj.direction;
        f.content = obj.content;
        return f;
    }
}
exports.Facade = Facade;
/**
* a direction to select each wall of the machine
*/
var Cardinal;
(function (Cardinal) {
    Cardinal[Cardinal["NORTH"] = 0] = "NORTH";
    Cardinal[Cardinal["EAST"] = 1] = "EAST";
    Cardinal[Cardinal["SOUTH"] = 2] = "SOUTH";
    Cardinal[Cardinal["WEST"] = 3] = "WEST"; //!< left direction
})(Cardinal = exports.Cardinal || (exports.Cardinal = {}));
/**
 * \brief the direction of the transit
 *
 * IN it correspond to an entry
 * OUT it correspond to an exit
 * NONE it's not a enter and not a exit
 */
var Direction;
(function (Direction) {
    Direction[Direction["IN"] = 0] = "IN";
    Direction[Direction["OUT"] = 1] = "OUT";
    Direction[Direction["NONE"] = 2] = "NONE";
})(Direction = exports.Direction || (exports.Direction = {}));
/**
 * Resources and garbage are stocked in a box in order
 * to facilitate resources moves
 *
 * \author Antoine Man
 * \version 0.6
 * \date 07/04/2021
 */
class Box {
    /**
     * Struct that contains all the information concerning a box
     * It contain resources and garbage on a case
     *
     * This function create a new box in a case or in a facade machine
     * The number of resources and garbage are given in argument
     * @param nbResource resources number
     * @param nbGarbage garbage number
     */
    constructor(nbResource, nbGarbage) {
        let logger = logger_1.Logger.Instance;
        logger.debug("New Box");
        this.resources = nbResource;
        this.garbage = nbGarbage;
    }
    /**
     * This function get the number of resources of the box.
     * @return the number of resources available in the box
     */
    get numberResources() { return this.resources; }
    /**
     * This function get the number of garbage of the box.
     * @return the number of garbage available in the box
     */
    get numberGarbage() { return this.garbage; }
    /**
     * This function add to the number of resources of the box
     * The value can be a negative value
     * @param val int value to add/subtract
     * @return ErrorCode error/no error code
     */
    addResources(val) {
        // Verify if the result of the addition/substract is not negative
        if (this.resources + val >= 0) {
            // Set number resources of the box
            this.resources += val;
            return code_1.ErrorCode.NO_ERROR;
        }
        else {
            return code_1.ErrorCode.ERROR_NEGATIVE_RESULT;
        }
    }
    /**
     * This function set the number of garbage of the box.
     * The value can be a negative value
     * @param val int value to add/subtract
     * @return ErrorCode error/no error code
     */
    addGarbage(val) {
        // Verify if the result of the addition/substract is not negative
        if (this.garbage + val >= 0) {
            // Set number garbage of the box
            this.garbage += val;
            return code_1.ErrorCode.NO_ERROR;
        }
        else {
            return code_1.ErrorCode.ERROR_NEGATIVE_RESULT;
        }
    }
    /**
     * This function add resources and garbage
     * of the another box to this one
     * @param box another box
     */
    addBox(box) {
        if (box != null) {
            this.addResources(box.resources);
            this.addGarbage(box.garbage);
        }
    }
    /**
     * Serialize a box
     */
    serialize() {
        return {
            resources: this.resources,
            garbage: this.garbage,
        };
    }
    /**
     * Revive of box from a serialization
     * @param obj a serialization
     */
    static revive(obj) {
        return new Box(obj.resources, obj.garbage);
    }
}
exports.Box = Box;
