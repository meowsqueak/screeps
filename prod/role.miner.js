var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if (_.sum(creep.carry) < creep.carryCapacity) {
            var sources = creep.room.find(FIND_MINERALS);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            if (creep.transfer(Game.spawns.Spawn1, RESOURCES_ALL) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
	}
};

module.exports = roleMiner;

