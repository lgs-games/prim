// This file is required by the game.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { MachineStuff } = require("../../model/machine");
const { EventType } = require("../../utils/events");
game.interface.init()

// apply reductions
let hireStudentEventFise = game.map.getStudentCost(EventType.HIRE_FISE,
    game.config.constants.COST_FISE_E, game.config.constants.COST_FISE_DD);
let hireStudentEventFisa = game.map.getStudentCost(EventType.HIRE_FISA,
    game.config.constants.COST_FISA_E, game.config.constants.COST_FISA_DD);

// replace son constants
win.replaceText('max-score', game.config.constants.NUMBER_RESOURCE_WIN)
win.replaceText('fise-cost-e', hireStudentEventFise.costE)
win.replaceText('fise-cost-dd', hireStudentEventFise.costDD)
win.replaceText('fisa-cost-e', hireStudentEventFisa.costE)
win.replaceText('fisa-cost-dd', hireStudentEventFisa.costDD)
win.replaceText('source-gen', game.config.constants.NB_RESOURCE_PRODUCT_BY_SOURCE)
win.replaceText('source-gen-turn', game.config.constants.NB_TURN_PRODUCTION_SOURCE)

console.log(game.config.constants.NB_RESOURCE_PRODUCT_BY_SOURCE)

// call exit
document.getElementById('exit-button-event').onclick = () => game.mappings.getMapping(game.actions.EXIT).code()
// call end turn
let endTurn = document.getElementById('tr-game-end-turn');
endTurn.onclick = (e, n= 1) => game.mappings.getMapping(game.actions.END_TURN).code(n)

// change production mode
changeMode(undefined, true) // set default
document.getElementById('e-dd-change-e').onclick = changeMode;
document.getElementById('e-dd-change-dd').onclick = changeMode;
// buy machine
document.getElementById('buy-button').onclick = callBuyMachine;
document.querySelectorAll('.machine-list').forEach((e) => e.onclick = select_machine)
document.querySelectorAll('.orientations').forEach((e) => initOrientationEvents(e))
// destroy/upgrade
document.getElementById('destroy-selected').onclick = callDestroy;
document.getElementById('update-selected').onclick = callUpgrade;
// hire fise/fisa
let buyFise = document.getElementById('buy-fise-event');
let buyFisa = document.getElementById('buy-fisa-event');
buyFise.onclick = (e, n= 1) => game.mappings.getMapping(game.actions.HIRE_FISE).code(n);
buyFisa.onclick = (e, n= 1) => game.mappings.getMapping(game.actions.HIRE_FISA).code(n);
// staffs
document.getElementById('manage-staff').onclick = () => game.mappings.getMapping(game.actions.LIST_STAFF).code()
// machines
document.getElementById('list-machines').onclick = () => game.mappings.getMapping(game.actions.LIST_MACHINES).code()

//////////////
/// helpers //
//////////////

function changeMode(event=undefined, loadOnly = false) {
    if (!loadOnly) // call end turn
        game.mappings.getMapping(game.actions.CHANGE_FISA_MODE).code();

    let mode = document.getElementById('mode').innerText;
    if (loadOnly && mode === 'E'){
        // already set to E
        return;
    }
    let imageSelected; // other image since it was selected
    let imageNotSelected; // image of new selected one

    let labelSelected; // same but for label
    let labelNotSelected;

    if (mode === 'E'){
        imageSelected = document.getElementById('e-dd-change-dd-img');
        imageNotSelected = document.getElementById('e-dd-change-e-img');

        labelSelected = document.getElementById('e-dd-change-dd-label');
        labelNotSelected = document.getElementById('e-dd-change-e-label');
    } else {
        imageSelected = document.getElementById('e-dd-change-e-img');
        imageNotSelected = document.getElementById('e-dd-change-dd-img');

        labelSelected = document.getElementById('e-dd-change-e-label');
        labelNotSelected = document.getElementById('e-dd-change-dd-label');
    }

    // switch images
    let tmp = imageSelected.src;
    imageSelected.src = imageNotSelected.src;
    imageNotSelected.src = tmp;

    if(labelNotSelected){
        labelNotSelected.classList.add('text-muted')
        labelNotSelected.classList.remove('text-dark')
    }

    if(labelSelected){
        labelSelected.classList.add('text-dark')
        labelSelected.classList.remove('text-muted')
    }
}

function callUpgrade() {
    let button = document.getElementById('update-selected');
    let x = button.getAttribute('data-x');
    let y = button.getAttribute('data-y');
    game.mappings.getMapping(game.actions.UPGRADE_MACHINE).code(x, y)
}

function callDestroy() {
    let button = document.getElementById('destroy-selected');
    let x = button.getAttribute('data-x');
    let y = button.getAttribute('data-y');
    game.mappings.getMapping(game.actions.DESTROY_MACHINE).code(x, y)
}

function callBuyMachine() {
    let button = document.getElementById('buy-button');
    let x = button.getAttribute('data-x');
    let y = button.getAttribute('data-y');
    let selectedType = document.getElementsByClassName('selected-machine-type')[0];
    let selectedOrientation = document.getElementsByClassName('orientation-selected')[0];
    let machineStuff = Number(selectedType.getAttribute('data-id'))
    let orientation = Number(selectedOrientation.getAttribute('data-rotation'))
    game.mappings.getMapping(game.actions.BUY_MACHINE).code(machineStuff, x, y, orientation)
}

function select_machine(e) {
    let selected = document.getElementsByClassName('selected-machine-type')[0];
    let id = selected.getAttribute('data-id');
    // unselect machine
    selected.classList.remove('bg-info','selected-machine-type')
    // hides orientation
    document.getElementById('orientations'+id).classList.add('d-none');
    // select machine
    e.target.classList.add('bg-info','selected-machine-type')
    // show orientation
    id = e.target.getAttribute('data-id');
    document.getElementById('orientations'+id).classList.remove('d-none');

    // unselect orientation
    document.getElementsByClassName('orientation-selected')[0].classList
        .remove('border-my-yellow', 'orientation-selected')
    // select first
    let orientations = document.getElementById('orientations'+id);
    orientations.children[0].classList.add('orientation-selected')
    if (orientations.children[0].tagName === "IMG"){
        orientations.children[0].classList.add('border-my-yellow')
    }

    let machineInfo = config.getMachineStuff(Number(id));
    let me = game.map.getCostUpgrade(machineInfo, EventType.BUY_MACHINE);
    document.getElementById('machine-cost')
        .innerText = `${me.costE} E ${me.costDD} DD`
}

// set default price
let machineInfo = config.getMachineStuff(MachineStuff.MS_COLLECTOR);
let me = game.map.getCostUpgrade(machineInfo, EventType.BUY_MACHINE);
document.getElementById('machine-cost')
    .innerText = `${me.costE} E ${me.costDD} DD`;

function select_orientation(e) {
    let selected = document.getElementsByClassName('orientation-selected')[0];
    selected.classList.remove('border-my-yellow', 'orientation-selected')
    e.target.classList.add('border-my-yellow', 'orientation-selected')
}

function initOrientationEvents(orientationDIV) {
    for(let e of orientationDIV.children){
        e.onclick = select_orientation;
    }
}

////////////////////////////
// handling context menus //
////////////////////////////
const contextMenu = document.getElementById('popup-skip');
const do10 = document.getElementById('do10');
const do20 = document.getElementById('do20');
const do50 = document.getElementById('do50');
let caller = null;

// open
buyFise.oncontextmenu = (e) => show(e, buyFise)
buyFisa.oncontextmenu = (e) => show(e, buyFisa)
endTurn.oncontextmenu = (e) => show(e, endTurn)

// hides if right click
document.onclick = () => { contextMenu.classList.add('d-none') }

// show
function show(e, newCaller) {
    contextMenu.classList.remove('d-none')
    contextMenu.style.left = e.pageX+"px";
    contextMenu.style.top = e.pageY+"px";
    caller = newCaller; // save
}

// handles do event
function doAction(e, n) {
    if (caller == null) return;
    caller.onclick(e, n);
}

do10.onclick = (e) => doAction(e, 10);
do20.onclick = (e) => doAction(e, 20);
do50.onclick = (e) => doAction(e, 50);