/*!
 * \file machine_info.h
 * \author Ramzy ZEBRIR and Antoine man
 * \version 0.1
 * \date 01/03/2021
 * \see machine.h
 *
 * Contains all information about machine
 */

#ifndef PRIM_MACHINE_INFO_H
#define PRIM_MACHINE_INFO_H

#include <stdbool.h> //! return value
#include <stdlib.h> //! to use uint
#include "machine.h"
#include "effect.h"

/*!
 * \typedef MachineInfo
 * \struct MachineInfo_S machine_info.h "headers/data/MachineInfo.h"
 * \brief Represent all information about a machine
 * Struct which contains all information about a machine
 *
 * Only machines that have canUpgrade=true can upgrade.
 * This value must be checked before applying effect or increase level.
 */
typedef struct MachineInfo_S {
    MachineStuff type; //!< int which represent the type of the machine
    int costE; //!< price in E of the machine
    int costDD; //!< price in DD of the machine
    int costUpgradeE; //!< price for upgrade the machine in E
    int costUpgradeDD; //!< price for upgrade the machine in DD
    int costDestroyE; //!< price for destroy the machine in E
    int costDestroyDD; //!< price for destroy the machine in DD;
    char *description; //!< description of the machine
    int capacity; //!< -1 it don't have capacity
    char *defaultOrientation; //!< get the default orientation of the machine
    bool canUpgrade; //!< 1 if it's upgradable, else 0
    Effect effects; //!< An effect for the machine if it's upgrade
} MachineInfo; //!< Information of the machine.

#define NUMBER_OF_MACHINES 5 //!< name of machines

/**
 * A function to return all the information about a specific type of machine
 * @param type
 * @return MachineInfo
 */
const MachineInfo *machineInfo_getMachineInfoByType(MachineStuff type);

/**
 * A function to get the machine type attribute from a MachineInfo
 * @param machine
 * @return machine type
 */
MachineStuff machineInfo_getType(const MachineInfo *machine);

/**
 * A function to get the CostE attribute from a MachineInfo
 * @param machine
 * @return CostE
 */
int machineInfo_getCostE(const MachineInfo *machine);

/**
 * A function to get the CostDD attribute from a MachineInfo
 * @param machine
 * @return CostDD
 */
int machineInfo_getCostDD(const MachineInfo *machine);

/**
 * A function to get the CostUpgradeE attribute from a MachineInfo
 * @param machine
 * @return CostUpgradeE
 */
int machineInfo_getCostUpgradeE(const MachineInfo *machine);

/**
 * A function to get the CostUpgradeDD attribute from a MachineInfo
 * @param machine
 * @return CostUpgradeDD
 */
int machineInfo_getCostUpgradeDD(const MachineInfo *machine);

/**
 * A function to get the CostDestroyE attribute from a MachineInfo
 * @param machine
 * @return CostDestroyE
 */
int machineInfo_getCostDestroyE(const MachineInfo *machine);

/**
 * A function to get the CostDestroyDD attribute from a MachineInfo
 * @param machine
 * @return CostDestroyDD
 */
int machineInfo_getCostDestroyDD(const MachineInfo *machine);

/**
 * A function to get the Description attribute from a MachineInfo
 * @param machine
 * @return Description
 */
char *machineInfo_getDescription(const MachineInfo *machine);

/**
 * A function to get the Capacity attribute from a MachineInfo
 * @param machine
 * @return Capacity
 */
int machineInfo_getCapacity(const MachineInfo *machine);

/**
 * A function to get the CanUpgrade attribute from a MachineInfo
 * in order to know if a specific machine can be upgraded
 * @param machine
 * @return true if it can be upgrade, if not false
 */
bool machineInfo_getCanUpgrade(const MachineInfo *machine);

/**
 * A function to get the Effects type attribute from a MachineInfo
 * @param machine
 * @return Effects
 */
const Effect *machineInfo_getEffects(const MachineInfo *machine);

/**
 * A function to get the DefaultOrientationMessage attribute from a machineInfo.
 * It explain to the user on the interface, the default orientation of the machine
 * in order to help him during the machine purchase
 * @param m
 * @return
 */
char *machineInfo_getDefaultOrientationMessage(const MachineInfo *m);

/**
 * A function to verify if the id given in argument correspond to a machineInfo
 * @param id
 * @return If id exist, return the tab index, If not -1
 */
int machineInfo_isMachineStuffValid(int id);

/**
 * A function to return all the information about a machineInfo according to the id
 * @param id
 * @return machineInfo
 */
const MachineInfo *machineInfo_getMachineStuff(int id);

#endif //PRIM_MACHINE_INFO_H
