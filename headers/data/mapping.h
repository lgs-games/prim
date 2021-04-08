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

    #include "actions.h" // actions.h : enum of all actions

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

    /*!
     * returns the number of mappings
     * @return a size, to iterates the array of mappings
     */
    int mapping_getSize();

    /**
     * Returns a mapping or null if not found by an index
     * @param index from 0 to {@link mapping_getSize}
     * @return a mapping or null
     */
    const UserActionMapping* mapping_get(int index);

    /*
     * Returns a mapping or null if not found
     * @param seq a character sequence that the user inputted
     * @return null or a UserActionMapping matching the sequence
     */
    const UserActionMapping* mapping_getMapping(const char* seq);

#endif //PRIM_MAPPING_H
