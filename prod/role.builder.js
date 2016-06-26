var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.suspend) {
            creep.moveTo(Game.flags.rally);
            return;
        }

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                // wait near Spawn1
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[0]);
            // }
            // go to the Spawn1 for energy
            if (Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
    }
};

module.exports = roleBuilder;
