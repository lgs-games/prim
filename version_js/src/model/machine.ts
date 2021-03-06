/**
 * \file machine_info.h
 * \author Ramzy ZEBRIR and Antoine man
 * \version 0.1
 * \date 01/03/2021
 * \see machine.h
 *
 * Contains all information about machine
 */

import {ErrorCode} from "../utils/code";
import {Vector2D} from "../utils/utilities";
import {Language} from "../utils/translation";
import {Logger} from "./logger";

/**
 * Struct which contains all information about a machine
 *
 * Only machines that have canUpgrade=true can upgrade.
 * This value must be checked before applying effect or increase level.
 */
export class MachineInfo {
    public readonly name_en : string; //!< int which represent the type of the machine in english
    public readonly name_fr : string; //!< int which represent the type of the machine in french
    public readonly type : MachineStuff; //!< int which represent the type of the machine
    public readonly tag : string; //!< letter representing the machine
    public readonly costE : number; //!< price in E of the machine
    public readonly costDD : number; //!< price in DD of the machine
    public readonly costUpgradeE : number; //!< price for upgrade the machine in E
    public readonly costUpgradeDD : number; //!< price for upgrade the machine in DD
    public readonly costDestroyE : number; //!< price for destroy the machine in E
    public readonly costDestroyDD : number; //!< price for destroy the machine in DD;
    public readonly description_en : string; //!< description of the machine in english
    public readonly description_fr : string; //!< description of the machine in french
    public readonly upgrade_en : string; //!< short description of the upgrade in english
    public readonly upgrade_fr : string; //!< short description of the upgrade in french
    public readonly capacity : number; //!< -1 it don't have capacity
    /**
     * Get the DefaultOrientationMessage attribute from a machineInfo.
     * It explain to the user on the interface, the default orientation of the machine
     * in order to help him during the machine purchase
     */
    public readonly defaultOrientation_en : string; //!< get the default orientation of the machine in english
    public readonly defaultOrientation_fr : string; //!< get the default orientation of the machine in french
    public readonly canUpgrade : boolean; //!< 1 if it's upgradable, else 0
    private readonly levelUpFunction: ((v: number) => number) | null; //!< An effect for the machine if it's upgrade
    public readonly imageFile: Map<Cardinal, string>; //!< Path to the image file

    constructor(name_en: string,name_fr: string, type: MachineStuff, tag: string, costE: number, costDD: number, costUpgradeE: number,
                costUpgradeDD: number, costDestroyE: number, costDestroyDD: number,
                description_en: string,description_fr: string, upgrade_en : string, upgrade_fr : string,
                capacity: number, defaultOrientation_en: string, defaultOrientation_fr: string,
                canUpgrade: boolean, levelUpFunction: ((v: number) => number) | null,
                imageFile: Map<Cardinal, string>){
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
    capacityByLevel(level: number) : number { return this.levelUpFunction === null ? -1 : this.levelUpFunction(level); }

    /**
     * return the name with the correct language
     * @return name the name of a machine
     */
    name(lang: Language) : string {
        let logger = Logger.Instance;
        if(lang == Language.EN) {
            logger.info("English name set");
            return this.name_en;
        } else if(lang == Language.FR) {
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
    description(lang: Language) : string {
        let logger = Logger.Instance;
        if(lang == Language.EN) {
            logger.info("English description set");
            return this.description_en;
        } else if(lang == Language.FR) {
            logger.info("French description set");
            return this.description_fr;
        } else
            return "ERROR TRANSLATION";
    }

    /**
     * return the upgrade description with the correct language
     * @return upgrade the description of the upgrade
     */
    upgrade(lang: Language) : string {
        let logger = Logger.Instance;
        if(lang == Language.EN) {
            logger.info("English upgrade description setted");
            return this.upgrade_en;
        } else if(lang == Language.FR) {
            logger.info("French upgrade description setted");
            return this.upgrade_fr;
        }
        else
            return "ERROR TRANSLATION";
    }

    defaultOrientation(langue: Language) : string {
        let logger = Logger.Instance;
        if(langue==Language.EN) {
            logger.info("English default Orientation description setted");
            return this.defaultOrientation_en;
        } else if(langue==Language.FR) {
            logger.info("French default Orientation description setted");
            return this.defaultOrientation_fr;
        }
        else
            return "ERROR TRANSLATION";
    }
}

/**
 * Contains id associate to the machine.
 */
export enum MachineStuff {
    MS_COLLECTOR = 1, //!< collector machine
    MS_CONVEYOR_BELT = 2, //!< conveyor belt
    MS_CROSS_BELT = 3, //!< cross
    MS_RECYCLING_CENTER = 4, //!< recycling center
    MS_JUNKYARD = 5, //!< junkyard
}

/**
 * \author Ramzy ZEBRIR and Antoine MAN
 * \version 0.1
 * \date 01/03/2021
 * \see machine_info
 *
 * Struct which contains the main information about a machine
 */
export class Machine {
    public static NUMBER_CARDINAL : number = 4;

    private readonly _type : MachineStuff; //!< number associate to the type of the machine
    private _level : number; //!< Represent the level of improvement of the machineFacade
    private _interface : Array<Facade>; //!< Represent the orientation of the machine
    private rotation: number = 0;

    /**
     * Machine which contains the main information about a machine.
     * Function to create a new machine according to the type machine given
     * @param type MachineStuff
     */
    constructor(type: MachineStuff) {
        let logger = Logger.Instance;
        logger.debug("New Machine stuff type = "+ type);
        this._type = type;
        this._level = 1;
        this._interface = Machine.defaultFacade(type);
    }

    /**
     * function to get the type of the machine
     * @return the type of the machine
     */
    get type() : MachineStuff { return this._type; }

    /**
     * function to get the level of the machine
     * @return the level of the machine
     */
    get level() : number { return this._level; }

    /**
     * This function upgrade a machine by incrementing his level
     */
    increaseLevel(){ this._level++; }

    /**
     * A function to know if the direction given in argument is equals to
     * the north direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationTop(d: Direction){ return this.getDirection(Cardinal.NORTH) == d; }
    /**
     * A function to know if the direction given in argument is equals to
     * the north direction and the east direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationTopRight(d: Direction){
        return this.getDirection(Cardinal.NORTH) == d && this.getDirection(Cardinal.EAST) == d;
    }

    /**
     * A function to know if the direction given in argument is equals to
     * the east direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationRight(d: Direction){
        return this.getDirection(Cardinal.EAST) == d;
    }

    /**
     * A function to know if the direction given in argument is equals to
     * the east direction and the south direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationBottomRight(d: Direction){
        return this.getDirection(Cardinal.SOUTH) == d && this.getDirection(Cardinal.EAST) == d;
    }

    /**
     * A function to know if the direction given in argument is equals to
     * the south direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationBottom(d: Direction){
        return this.getDirection(Cardinal.SOUTH) == d;
    }

    /**
     * A function to know if the direction given in argument is equals to
     * the south direction and the left direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationBottomLeft(d: Direction){
        return this.getDirection(Cardinal.SOUTH) == d && this.getDirection(Cardinal.WEST) == d;
    }

    /**
     * A function to know if the direction given in argument is equals to
     * the left direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationLeft(d: Direction){
        return this.getDirection(Cardinal.WEST) == d;
    }

    /**
     * A function to know if the direction given in argument is equals to
     * the north direction and the left direction of the machine
     * @param d direction
     * @return true if equals, if not false
     */
    isOrientationTopLeft(d: Direction) {
        return this.getDirection(Cardinal.NORTH) == d && this.getDirection(Cardinal.WEST) == d;
    };

    /**
     * A function to know if the number of rotation is correct
     * Between 0 and NUMBER_CARDINAL(4)
     * @param rotation a rotation
     * @return true if yes, if not false
     */
    static isRotationCorrect(rotation: number) : boolean {
        return rotation >= 0 && rotation < Machine.NUMBER_CARDINAL;
    }

    /**
     * A function to set the direction of a facade machine according to the cardinal
     * @param card a cardinal
     * @param d a direction
     */
    private setDirection(card: Cardinal, d: Direction) {
        this._interface[card].direction = d;
    }

    /**
     * A function to get the direction of a facade machine according to the cardinal
     * @param card a cardinal
     * @return Direction of the facade machine (IN, OUT, NONE)
     */
    getDirection(card: Cardinal) : Direction {
        return this._interface[card].direction;
    };

    /**
     * A function to set a box of a facade machine according to the cardinal
     * @param card a cardinal
     * @param box a box
     */
    setBox(card: Cardinal, box: Box | null) {
        this._interface[card].box = box;
    }

    /**
     * A function to get a box of a facade machine according to the cardinal
     * @param card a cardinal
     * @return box of the facade machine
     */
    getBox(card: Cardinal) : Box | null {
        return this._interface[card].box;
    }

    /**
     * A function to add a box to the facade machine according to the cardinal
     * @param card a cardinal
     * @param box a box
     */
    addBox(card : Cardinal, box : Box) : void {
        this._interface[card].box?.addBox(box);
    };

    /**
     * A function to destroy a box of the facade machine according to the cardinal
     * @param card a cardinal
     */
    destroyBox(card : Cardinal) : void {
        let tmp : Box | null = this.getBox(card);

        // Verify if there is a box in the facade machine
        if (tmp != null) {
            this._interface[card].box = null;
        }
    };

    /**
     * This function rotate the orientation of a machine in clockwise
     * The int rotation can be a negative value.
     * @param rotation a valid rotation
     */
    rotate(rotation : number) : void {

        let logger = Logger.Instance;
        logger.debug(rotation+" Rotations for this machine = "+ this._type);
        let tmpBox: Box | null;
        let tmpDirection: Direction;
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
    static defaultFacade(s: MachineStuff) : Array<Facade> {

        let logger = Logger.Instance;
        logger.debug("Default facade creation for this machine stuff = " +s);
        let interfaces = new Array<Facade>();
        for (let i = 0; i < Machine.NUMBER_CARDINAL; i++) {
            interfaces.push(new Facade(i))
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
        }
    }

    /**
     * Revive of machine from a machine serialization
     * @param obj a machine serialized with @serialize
     */
    static revive(obj: Object) : Machine {
        // @ts-ignore
        let m = new Machine(obj.type);
        // @ts-ignore
        m._level = obj.level;
        // @ts-ignore
        for (const facade : Facade of obj.interface) {
            m.setBox(facade.cardinal, facade.box);
        }
        // @ts-ignore
        m.rotate(obj.rotation);
        return m;
    }
}

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
export class Facade {

    public cardinal : Cardinal; //!< Cardinal that indicates the wall position in the machine
    public direction : Direction; //!< Direction that indicates the resources flow direction
    private content : Box | null; //!< Bow that contains number of resources and number of garbage

    /**
     * Facade that contains all the map information concerning a wall machine
     * @param cardinal a cardinal (north, south, easy, west, ...)
     */
    constructor(cardinal: Cardinal) {
        let logger = Logger.Instance;
        logger.debug("New Cardinal");
        this.cardinal = cardinal;
        this.direction = Direction.NONE;
        this.content = null;
    }

    get box() : Box | null { return this.content; }
    set box(box: Box | null) { this.content = box; }

    /**
     * Allows in relation to a cardinal to return the modifications to be made on the coordinates
     * @param cardinal a cardinal
     * @return Vector2D modifications to be made on the coordinates
     */
    static modifyXYWithCardinal(cardinal: Cardinal) : Vector2D {
        switch (cardinal) {
            case Cardinal.NORTH:
                return new Vector2D(0,-1);
            case Cardinal.EAST:
                return new Vector2D(1,0);
            case Cardinal.SOUTH:
                return new Vector2D(0,1);
            case Cardinal.WEST:
                return new Vector2D(-1,0);
            default:
                return new Vector2D(0,0);
        }
    }

    /**
     * Serialize a facade, returns as an object
     * @return object serialized facade
     */
    public serialize() : object {
        return {
            cardinal: this.cardinal,
            direction: this.cardinal,
            content: this.content,
        }
    }

    /**
     * Revive a serialized facade
     * @param obj a serialized facade
     * @return Facade a facade
     */
    public static revive(obj: any) : Facade {
        let f = new Facade(obj.cardinal);
        f.direction = obj.direction;
        f.content = obj.content;
        return f;
    }

}

/**
* a direction to select each wall of the machine
*/
export enum Cardinal {
    NORTH = 0, //!< up direction
    EAST = 1, //!< right direction
    SOUTH = 2, //!< down direction
    WEST = 3 //!< left direction
}

/**
 * \brief the direction of the transit
 *
 * IN it correspond to an entry
 * OUT it correspond to an exit
 * NONE it's not a enter and not a exit
 */
export enum Direction {
    IN = 0,
    OUT = 1,
    NONE = 2,
}

/**
 * Resources and garbage are stocked in a box in order
 * to facilitate resources moves
 *
 * \author Antoine Man
 * \version 0.6
 * \date 07/04/2021
 */
export class Box {
    private resources : number; //!< nbResource : number of resource on the machine
    private garbage : number; //!< nbGarbage : number of garbage on the machine

    /**
     * Struct that contains all the information concerning a box
     * It contain resources and garbage on a case
     *
     * This function create a new box in a case or in a facade machine
     * The number of resources and garbage are given in argument
     * @param nbResource resources number
     * @param nbGarbage garbage number
     */
    constructor(nbResource: number, nbGarbage: number) {
        let logger = Logger.Instance;
        logger.debug("New Box");
        this.resources = nbResource;
        this.garbage = nbGarbage;
    }

    /**
     * This function get the number of resources of the box.
     * @return the number of resources available in the box
     */
    get numberResources() : number { return this.resources; }

    /**
     * This function get the number of garbage of the box.
     * @return the number of garbage available in the box
     */
    get numberGarbage() : number { return this.garbage; }

    /**
     * This function add to the number of resources of the box
     * The value can be a negative value
     * @param val int value to add/subtract
     * @return ErrorCode error/no error code
     */
    addResources(val: number) : ErrorCode {
        // Verify if the result of the addition/substract is not negative
        if (this.resources + val >= 0) {

            // Set number resources of the box
            this.resources += val;
            return ErrorCode.NO_ERROR;
        } else {
            return ErrorCode.ERROR_NEGATIVE_RESULT;
        }
    }

    /**
     * This function set the number of garbage of the box.
     * The value can be a negative value
     * @param val int value to add/subtract
     * @return ErrorCode error/no error code
     */
    addGarbage(val: number) {
        // Verify if the result of the addition/substract is not negative
        if (this.garbage + val >= 0) {
            // Set number garbage of the box
            this.garbage += val;
            return ErrorCode.NO_ERROR;
        } else {
            return ErrorCode.ERROR_NEGATIVE_RESULT;
        }
    }

    /**
     * This function add resources and garbage
     * of the another box to this one
     * @param box another box
     */
    addBox(box: Box | null) : void {
        if (box != null){
            this.addResources(box.resources);
            this.addGarbage(box.garbage);
        }
    }

    /**
     * Serialize a box
     */
    serialize(){
        return {
            resources: this.resources,
            garbage: this.garbage,
        }
    }

    /**
     * Revive of box from a serialization
     * @param obj a serialization
     */
    static revive(obj: any) : Box {
        return new Box(
            obj.resources,
            obj.garbage
        )
    }
}