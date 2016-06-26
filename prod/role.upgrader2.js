// This role is similar to roleUpgrader, except that it returns to the Spawn for energy
var roleUpgrader2 = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.suspend) {
            creep.moveTo(Game.flags.rally);
            return;
        }

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }        
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            if (creep.carry.energy < creep.carryCapacity) {
                var spawns = creep.room.find(FIND_MY_SPAWNS);
                // go to the first Spawn
                if (spawns[0].transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0]);
                }
            }
        }
    }
};

module.exports = roleUpgrader2;
