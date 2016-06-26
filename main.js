// Notes:
//  - need to prioritise harvester respawning - DONE
//  - need to suspend spending energy (e.g. building) when needing spawn - DONE
//  - need to direct additional upgraders to other sources, if source is blocked
//  - display some metrics periodically (e.g. upgrade rate, harvest rate, CPU time per creep)

var errors = require('errors');

var roles = {
    'harvester' : require('role.harvester'),
    'upgrader'  : require('role.upgrader'),
    'upgrader2' : require('role.upgrader2'),
    'builder'   : require('role.builder'),
    'repairer'  : require('role.repairer'),
    'miner'     : require('role.miner'),
};

var roster = {
    'harvester' : { 'max': 3, 'body': [ WORK, WORK,  CARRY, CARRY, CARRY, CARRY, MOVE,  MOVE,  MOVE,  MOVE ] },
    'upgrader'  : { 'max': 2, 'body': [ WORK, WORK,  WORK,  WORK,  CARRY, CARRY, MOVE,  MOVE ] },
    'upgrader2' : { 'max': 2, 'body': [ WORK, WORK,  WORK,  WORK,  CARRY, CARRY, CARRY, MOVE,  MOVE,  MOVE ] },
    'builder'   : { 'max': 1, 'body': [ WORK, WORK,  CARRY, CARRY, MOVE,  MOVE ] },
    'repairer'  : { 'max': 2, 'body': [ WORK, WORK,  CARRY, CARRY, MOVE,  MOVE,  MOVE,  MOVE ] },
    'miner'     : { 'max': 0, 'body': [ WORK, CARRY, MOVE ] },
};

global.roster = roster;

global.creep_info = function(creep) {
    return creep.name + ': ticks ' + creep.ticksToLive + ', hits ' + creep.hits + ', fatigue ' + creep.fatigue;
}

global.role_info = function(role) {
    var members = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    result = role.substr(0,1).toUpperCase() + role.substr(1) + 's :\n';
    for (var i in members) {
        result += '  ' + creep_info(members[i]) + '\n';
    }
    return result;
}

global.who = function() {
    for (var role in roles) {
        console.log(role_info(role));
    }
}

global.spawn_creep = function(role, body) {
    var newName = Game.spawns.Spawn1.createCreep(body, undefined, {role: role});
    if (newName === parseInt(newName, 10)) {
        console.log('Deferring spawn of new ' + role + ' (' + errors.error2string(newName) + ')');
        newName = undefined;
    } else {
        console.log('Spawning new ' + role + ': ' + newName);
    }
    return newName;
}

global.spawn_roster = function(roster) {
    for (var role in roster) {
        var members = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (members.length < roster[role].max) {
            var name = spawn_creep(role, roster[role].body);
            // only ever attempt to spawn one at a time, or earlier spawns get obliterated!
            break;
        }
    }
}

global.is_roster_met = function(roster, report=true) {
    var met = true;
    for (var role in roster) {
        var members = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (members.length < roster[role].max) {
            if (report) { console.log(role + ': have ' + members.length + ', need ' + roster[role].max); }
            met = false;
        }
    }
    return met;
}    

global.suspend_role = function(role, suspend) {
    var members = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    for (var i in members) {
        members[i].memory.suspend = suspend;            
    }
}

global.manage_energy = function(roster) {
    // if roster is unmet (and energy is low?), pause energy spending (i.e. builders)
    var suspend_spending = !is_roster_met(roster, false);
    if (suspend_spending) {
        console.log("Unmet roster - suspending energy spending");
    }
    suspend_role('builder', suspend_spending);
    suspend_role('repairer', suspend_spending);
    suspend_role('upgrader2', suspend_spending);
}

module.exports.loop = function () {

    var mainStartCpu = Game.cpu.getUsed();

    // Memory cleanup, must be first:
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    // pause creeps if energy is low
    manage_energy(roster);

    // maintain creep roster:
    spawn_roster(roster);

    // Tower control
    var tower = Game.getObjectById('57695bf17f3ecf055422ddad');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            // don't repair walls and roads at the moment:
            filter: (structure) => structure.hits < structure.hitsMax &&
                structure.structureType != STRUCTURE_WALL &&
                structure.structureType != STRUCTURE_ROAD
        });
        console.log('ClosestDamagedStructure: ' + closestDamagedStructure);
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    var mainElapsed = Game.cpu.getUsed() - mainStartCpu;
    console.log('Main has used ' + mainElapsed.toFixed(2) + ' CPU time');

    // Role execution
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        for (var role in roles) {
            if (creep.memory.role == role) {
                var creepStartCpu = Game.cpu.getUsed();
                roles[role].run(creep);
                var creepElapsed = Game.cpu.getUsed() - creepStartCpu;
                console.log('  ' + name + ' has used ' + creepElapsed.toFixed(2) + ' CPU time');
            }
        }
    }
    
    var totalElapsed = Game.cpu.getUsed() - mainStartCpu;
    console.log('Total CPU time: ' + totalElapsed.toFixed(2));
}
