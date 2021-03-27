/*!
 * \file mapping.h
 * \author Quentin Ra
 * \version 0.5
 * \date 10/03/2021
 *
 * List of actions mappings
 *
 */
#ifndef PRIM_MAPPING_H
#define PRIM_MAPPING_H

    #include "actions_utils.h" // actions.h : enum of all actions

    /*!
     * \typedef UserActionMapping
     * \struct UserActionMapping_S mapping.h "headers/data/mapping.h"
     *
     * Struct of an action mapping. Each action is mapped with a string.
     *
     */
    typedef struct UserActionMapping_S {
        Action actionID; //!< actionID: int, see actions.h
        char* key; //!< a sentence to input to select this action
    } UserActionMapping; //!< one mapping so (action, input_sequence)

    /**
     * @see interface_chooseAction, count of available actions
     */
    #define USER_MAPPING_SIZE 14 //!< to iterates user_mapping

    // @see UserActionMapping, all mappings
    extern const UserActionMapping user_mapping[]; //!< will contains all mappings, used in interface.h

#endif //PRIM_MAPPING_H
