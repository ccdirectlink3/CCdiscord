const CLIENT_ID = '376560840012201984';

export default class DiscordMod {
  prestart() {
    const DiscordRPC = require('discord-rpc');
    this.rpc = new DiscordRPC.Client({ transport: 'ipc' });
  }

  main() {
    this.rpc.on('ready', () => {
      this.setActivity();
      // activity can only be set every 15 seconds
      setInterval(() => this.setActivity(), 15e3);
    });

    this.rpc.login({ clientId: CLIENT_ID }).catch(console.error);
  }

  setActivity() {
    if (this.rpc == null) return;

    if (sc.model.isTitle() || !ig.ready) {
      this.rpc.setActivity({
        state: 'Menu',
        details: 'In the menu',
        largeImageKey: 'ducklea',
        largeImageText: 'Menu',
        instance: false,
      });
      return;
    }

    let area = getArea();
    let areaName = sc.map.getCurrentAreaName().value;
    let element = getCurrentElementName();

    let timeStamp =
      new Date().getTime() / 1000 - sc.stats.getMap('player', 'playtime');

    let partySize = sc.party.getPartySize() + 1;
    let partyMax = sc.PARTY_MAX_MEMBERS + 1;

    this.rpc.setActivity({
      details: getChapterText(),
      state: getState(areaName),
      startTimestamp: timeStamp,
      partySize: partySize,
      partyMax: partyMax,
      smallImageKey: 'e-' + element.toLowerCase(),
      smallImageText: element,
      largeImageKey: getArtKey(area),
      largeImageText: areaName,
      instance: false,
    });
  }
}

function getState(areaName) {
  let state;
  if (sc.model.isPaused()) {
    state = '(Paused)';
  } else {
    if (sc.pvp.isActive()) state = 'In a PvP';
    else if (sc.combat.isInCombat(ig.game.playerEntity)) state = 'In combat';
    else state = 'Exploring';
  }
  state += ' ' + areaName;
  return state;
}

function getArea() {
  // can be replaced with `sc.map.currentPlayerArea.path`, but that will require
  // changing names of rich presence assets, and alas I don't have access to the
  // application registered in Discord
  return (ig.game.mapName || '???').split('.')[0];
}

function getChapterText() {
  let chapter = sc.model.player.chapter;
  let loreKey = `chapter-${chapter.toString().padStart(2, '0')}`;
  return ig.LangLabel.bakeVars(sc.lore.getLoreTitle(loreKey));
}

const ART_LIST = [
  'autumn',
  'jungle-city',
  'bergen',
  'heat-dng',
  'jungle',
  'heat',
  'rhombus-sqr',
  'heat-village',
  'rookie-harbor',
];

function getArtKey(area) {
  return ART_LIST.includes(area) ? area : 'ducklea';
}

const ELEMENT_NAMES = ['Neutral', 'Heat', 'Cold', 'Shock', 'Wave'];

function getCurrentElementName() {
  return ELEMENT_NAMES[sc.model.player.currentElementMode];
}
