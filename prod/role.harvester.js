var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if (!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            console.log(creep.name + ' now harvesting');
        }
        if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            console.log(creep.name + ' now delivering');
        }
        
        if (creep.memory.harvesting) {
            //console.log(creep.name + ' harvesting');
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                //console.log(creep.name + ' going to ' + sources[0]);
                creep.moveTo(sources[0]);
            }
        } else {
            //console.log(creep.name + ' delivering');
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                //TODO: search for tower, put at front of list
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    //console.log(creep.name + ' going to ' + targets[0]);
                    creep.moveTo(targets[0]);
                }
            } else {
                // nowhere to deliver, so move away from Source to avoid blocking it
                //console.log(creep.name + ' going to rally');
                creep.moveTo(Game.flags.rally);
            }
        }
	}
};

module.exports = roleHarvester;


    	   // if(creep.carry.energy < creep.carryCapacity) {
        //         var sources = creep.room.find(FIND_SOURCES);
        //         if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(sources[0]);
        //         }
        //     }
        //     else {
        //         var targets = creep.room.find(FIND_STRUCTURES, {
        //                 filter: (structure) => {
        //                     return (structure.structureType == STRUCTURE_EXTENSION ||
        //                             structure.structureType == STRUCTURE_SPAWN ||
        //                             structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        //                 }
        //         });
        //         if(targets.length > 0) {
        //             if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //                 creep.moveTo(targets[0]);
        //             }
        //         } else {
        //             // move away from Source
        //             creep.moveTo(Game.spawns.Spawn1);
        //         }
        //     }

