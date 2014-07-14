var messages = [
	"Ring-ding-ding-ding-dingeringeding!",
	"Wa-pa-pa-pa-pa-pa-pow!",
	"Hatee-hatee-hatee-ho!",
	"Joff-tchoff-tchoffo-tchoffo-tchoff!",
	"Jacha-chacha-chacha-chow!",
	"Fraka-kaka-kaka-kaka-kow!",
	"A-hee-ahee ha-hee!",
	"A-oo-oo-oo-ooo!"
]; 

var handler = {
	"commands": {
		whatdoesthefoxsay: function() {
        		return "The fox says: " + messages[Math.random() * messages.length | 0];
	    	}
	}
};

module.exports = handler;
