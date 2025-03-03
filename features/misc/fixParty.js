// FixParty commands registration
const kicklist = {
    uuids: [],
    igns: [],
    readFromFile() {
        try {
            const data = JSON.parse(FileLib.read('SkyPad', 'fixparty.json'));
            this.uuids = data.uuids || [];
            this.igns = data.igns || [];
            ChatLib.chat("&aSuccessfully read from fixparty.json.");
        } catch (e) {
            ChatLib.chat("&cError reading fixparty.json. Creating a new one.");
            this.saveToFile();  // Create a new file if reading fails
        }
    },
    saveToFile() {
        try {
            const dataToSave = JSON.stringify(this, null, 2);
            FileLib.write('SkyPad', 'fixparty.json', dataToSave);
            ChatLib.chat("&aSuccessfully saved to fixparty.json.");
        } catch (e) {
            ChatLib.chat("&cError saving fixparty.json.");
            console.error("Error saving fixparty.json:", e);
        }
    },
    addOrRemovePlayer(playerName, action) {
        this.readFromFile();

        if (action === 'add') {
            if (!this.igns.includes(playerName)) {
                this.igns.push(playerName);
                ChatLib.chat(`&aAdded ${playerName} to the kicklist.`);
            } else {
                ChatLib.chat(`&c${playerName} is already in the kicklist.`);
            }
        } else if (action === 'remove') {
            if (this.igns.includes(playerName)) {
                this.igns = this.igns.filter(player => player !== playerName);
                ChatLib.chat(`&cRemoved ${playerName} from the kicklist.`);
            } else {
                ChatLib.chat(`&c${playerName} is not in the kicklist.`);
            }
        }

        this.saveToFile(); // Save after modifying the list
    },
    listKicklist() {
        this.readFromFile();
        if (this.igns.length === 0) {
            ChatLib.chat("&cNo players in the kicklist.");
        } else {
            ChatLib.chat("&7Current Kicklist: " + this.igns.join(', '));
        }
    }
};

const DELAY = 500;  // Delay between commands to avoid flooding

register('command', (arg) => {
    if (!arg) {
        ChatLib.chat('Invalid argument! Use "/fixparty <player>" to toggle, "/fixparty list", or "/fixparty cleanse".');
        return;
    }

    const playerName = arg.trim(); // Trim to ensure no accidental spaces

    // Check if it's a valid toggle request (not 'list' or 'cleanse')
    if (playerName.toLowerCase() === 'list') {
        // List the players in the kicklist
        kicklist.readFromFile();

        if (kicklist.igns.length === 0) {
            ChatLib.chat("&cNo players in the kicklist.");
        } else {
            ChatLib.chat("&7Current Kicklist: " + kicklist.igns.join(', '));
        }
    } else if (playerName.toLowerCase() === 'cleanse') {
        let delay = 0; // Start with no delay

        kicklist.readFromFile(); // Read the kicklist from the file

        if (kicklist.igns.length === 0) {
            ChatLib.chat('&cNo players in the kicklist to cleanse.');
            return;
        }

        kicklist.igns.forEach((player) => {
            // Add a delay between each kick to avoid spamming
            setTimeout(() => {
                // Execute the kick command for each player
                ChatLib.command(`p kick ${player}`);
                ChatLib.chat(`&cKicked ${player} from the party.`);
            }, delay);

            // Increase the delay for the next player (e.g., 500ms between each kick)
            delay += DELAY;
        });
    } else {
        // This is a toggle request
        kicklist.readFromFile();

        if (kicklist.igns.includes(playerName)) {
            // If the player exists, remove them
            kicklist.igns = kicklist.igns.filter(player => player !== playerName);
            ChatLib.chat(`&cRemoved ${playerName} from the kicklist.`);
        } else {
            // If the player does not exist, add them
            kicklist.igns.push(playerName);
            ChatLib.chat(`&aAdded ${playerName} to the kicklist.`);
        }

        // Save the updated kicklist
        kicklist.saveToFile();
    }
}).setName('fixparty').setAliases('fp');