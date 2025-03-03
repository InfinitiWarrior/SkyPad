/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import './features/data'
import config from './config'
import './features/misc/fixParty'
import { shownChangelog } from './features/data'
import { sendPBMessage } from './features/utils/utils'

// Welcome message display
function displayWelcomeMessage() {
    const metadata = JSON.parse(FileLib.read('SkyPad', 'metadata.json'));
    if (metadata.version == shownChangelog.lastUpdatedVersion) return;

    shownChangelog.lastUpdatedVersion = metadata.version;
    shownChangelog.save();

    const fileContent = FileLib.read("SkyPad", "changelogLines.txt");
    const lines = fileContent.replace(/\r\n/g, "\n").split("\n");
    if (fileContent.length == 0) return;

    setTimeout(() => {
        ChatLib.chat('&a&l&m--------------------------------------------');
        ChatLib.chat(ChatLib.getCenteredText(`&b&lSkyPad ${metadata.version}`));
        lines.forEach(c => ChatLib.chat(ChatLib.getCenteredText('&7' + c)));
        ChatLib.chat(ChatLib.getCenteredText('&bThank you for installing SkyPad!'));
        ChatLib.chat(ChatLib.getCenteredText('&cFor any bugs, dm me on discord (InfinitiWarrior)'));
        ChatLib.chat('&a&l&m--------------------------------------------');
    }, 300);
}

// Register the `/skypad` and `/sp` commands to open the SkyPad GUI
register('command', (arg) => {
    if (arg && arg.toLowerCase() == 'pb') {
        sendPBMessage()
    } else {
        config.openGUI()  // This should open the SkyPad GUI
    }
}).setName('skypad').setAliases('sp');

displayWelcomeMessage();
