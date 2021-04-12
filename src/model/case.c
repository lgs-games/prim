#include "../../headers/data/case.h"

#include "stdlib.h"
#include "stdio.h"

struct Case_S {
    int x; //!< int, abscissa
    int y; //!< int, ordinate
    void* in; //!< union, it correspond to the object contained in the case
    CaseType type; //!< type of object contained in the case
}; //!< it correspond to a case of the board game

int case_getX(const Case* c) { return c->x; }

int case_getY(const Case* c) { return c->y; }

//TODO DOC
CaseType case_getType(const Case* c) {
    return c->type & 0xFFFFFFFE;
}

//todo: you may use a inline condition?ok:ko
Machine* case_getMachine(const Case* c) {
    if (case_getType(c) == CASE_MACHINE) {
        return (Machine*) c->in;
    } else {
        return NULL;
    }
}

//todo: you may use a inline condition?ok:ko
Box* case_getBox(const Case* c) {
    if (case_hasBox(c)) {
        return (Box*) c->in;
    } else {
        return NULL;
    }
}

//todo: too much code without a comment.
// Please comment variables (with //!<) or something like if branch
int case_getNumberResourcesByCase(const Case* c) {
    int nbResources = 0;
    Box *box;
    CaseType type = case_getType(c);

    if (case_hasBox(c)) {
        box = case_getBox(c);
        nbResources = box_getNumberResource(box);
    } else if (type == CASE_MACHINE) {
        Machine *machine = case_getMachine(c);
        for (Cardinal card = 0; card < NUMBER_CARDINAL; ++card) {
            box = machine_getBox(machine, card);
            if (box != NULL) {
                nbResources += box_getNumberResource(box);
            }
        }
    }
    return nbResources;
}

//todo: too much code without a comment.
// Please comment variables (with //!<) or something like if branch
int case_getNumberGarbageByCase(const Case* c) {
    int nbGarbage = 0;
    Box *box;
    CaseType type = case_getType(c);

    if (case_hasBox(c)) {
        box = case_getBox(c);
        nbGarbage = box_getNumberGarbage(box);

    } else if (type == CASE_MACHINE) {
        Machine *machine = case_getMachine(c);
        for (Cardinal card = 0; card < NUMBER_CARDINAL; ++card) {
            box = machine_getBox(machine, card);
            if (box != NULL) {
                nbGarbage += box_getNumberGarbage(box);
            }
        }
    }
    return nbGarbage;
}


void case_addMachine(Case* c, Machine* mach) {
    if(case_isEmpty(c) && c->in == NULL) {
        c->type = CASE_MACHINE;
        c->in = mach;
    }
}

void case_addGate(Case* c) {
    if(case_isEmpty(c)) {
        c->type = CASE_GATE;
    }
}

void case_addSource(Case* c) {
    if(case_isEmpty(c)) {
        c->type = CASE_SOURCE;
    }
}

//TODO DOC
void case_addBox(Case* c, Box* box) {
    if (c->type != CASE_MACHINE && !(case_hasBox(c))) {
        c->type = c->type | 0x01;
        c->in = box;
    }
}

//TODO DOC
ErrorCode case_deleteBox(Case* c) {
    if (case_hasBox(c)) {
        free(c->in);
        c->type = c->type & 0xFFFFFFFE;
        c->in = NULL;
    }
    return NO_ERROR;
}

void case_setEmpty(Case* c) {
    if (case_hasBox(c)) {
        free(c->in);
    } else if (case_getType(c) == CASE_MACHINE) {
        machine_destroyMachine((Machine*) c->in);
    }
    c->type = CASE_VIDE;
    c->in = NULL;
}

Case* case_create(int x, int y) {
    Case* c = (Case*) malloc(sizeof(Case));
    c->type = CASE_VIDE;
    c->in = NULL;
    c->x = x;
    c->y = y;
    return c;
}

bool case_isEmpty(const Case* c) {
    return c->type == CASE_VIDE;
}

// TODO DOC
bool case_hasBox(const Case* c){
    return (c->type & 0x01) == 0x01;
}

ErrorCode case_destroy(Case* c) {
    case_setEmpty(c);
    free(c);
    return NO_ERROR;
}