var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.suspend) {
            creep.moveTo(Game.flags.rally);
            return;
        }

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            targets.sort((a,b) => a.hits - b.hits);

            if (targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);    
                }
            } else {
                // wait near Spawn1
                creep.moveTo(Game.spawns.Spawn1);
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            // go to the second source 
//            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
//                creep.moveTo(sources[1]);
//            }
            // go to the Spawn1 for energy
            if(Game.spawns.Spawn1.transferEnergy(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
    }
};

module.exports = roleRepairer;
