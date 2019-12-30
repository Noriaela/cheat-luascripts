const alpha = {
  header: 200,
  background: 200
}

const position = {
  x: 100,
  y: 100
}

const hitboxes = [
  'generic',
  'head',
  'chest',
  'stomach',
  'left arm',
  'right arm',
  'left leg',
  'right leg',
  'body'
];

const damageColors = {
  lethal: [255, 0, 0, 255],
  semi:   [255, 140, 0, 255],
  half:   [255, 215, 0, 255],
  low:    [0, 255, 0, 255],
  miss:   [100, 149, 237, 255]
}

var logs = [];

function getHitboxName(index) {
  return hitboxes[index] || 'generic';
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function getValue(field) {
  var value = UI.GetValue('Script Items', field);

  return value;
}

function getColor(name) {
  var value = UI.GetColor('MISC', 'JAVASCRIPT', 'Script items', name);

  return value;
}

function cursorConstruct(array) {
  if (typeof array !== 'object') {
    return null;
  }

  return {
    x: array[0],
    y: array[1]
  };
}

function onObject(cursor, position, width, heigth) {
  if (!cursor || !position || !width || !heigth) {
    return;
  }

  return cursor.x <= position.x + width && cursor.x >= position.x 
    && cursor.y <= position.y + heigth && cursor.y >= position.y;
}

function colorByDamage(damage) {
  if (damage > 90) {
    return damageColors.lethal
  } else if (damage < 90 && damage > 70) {
    return damageColors.semi
  } else if (damage < 70 && damage > 40) {
    return damageColors.half
  } else if (damage > 0) {
    return damageColors.low;
  } else {
    return damageColors.miss;
  }
}

function getRandomInt() {
  return Math.floor(Math.random() * 2e9);
}

function findIndex(array, field, value) {
  var index = -1;
  
  for (var i = 0; i < array.length; i++) {
    if (array[i][field] === value) {
      index = i;

      break;
    }
  }

  return index;
}

var isDrag = false;

function onRender() {
  const isVisible = getValue('enable hitlist');

  UI.SetEnabled('Script Items', 'hitlist size', isVisible);
  UI.SetEnabled('Script Items', 'update every round', isVisible);
  UI.SetEnabled('Script Items', 'misc hitlist options', isVisible);
  UI.SetEnabled('Script Items', 'custom damage colors', isVisible);
  UI.SetEnabled('Script Items', 'custom alpha', isVisible);
  UI.SetEnabled('Script Items', 'position by pixels', isVisible);

  if (!isVisible) {
    return;
  }

  const visibleDamageColors = getValue('custom damage colors');
  UI.SetEnabled('Script Items', 'damage > 90', visibleDamageColors);
  UI.SetEnabled('Script Items', 'damage > 70', visibleDamageColors);
  UI.SetEnabled('Script Items', 'damage > 40', visibleDamageColors);
  UI.SetEnabled('Script Items', 'damage > 0', visibleDamageColors);

  const visibleCustomAlpha = getValue('custom alpha');
  UI.SetEnabled('Script Items', 'alpha header', visibleCustomAlpha);
  UI.SetEnabled('Script Items', 'alpha background', visibleCustomAlpha);

  const visibleCustomPosition = getValue('position by pixels');
  UI.SetEnabled('Script Items', 'position x', visibleCustomPosition);
  UI.SetEnabled('Script Items', 'position y', visibleCustomPosition);

  const listSize = getValue('hitlist size');

  const tickcount = Globals.Tickcount();
  
  const color = HSVtoRGB(tickcount % 350 / 350, 1, 1, 1, 255);

  if (UI.IsMenuOpen()) {
    const cursor = cursorConstruct(Input.GetCursorPosition());
    const keyPressed = Input.IsKeyPressed(0x01);
    
    if (
      cursor 
      && keyPressed
      && onObject(cursor, position, 270, 20 + 20 * logs.slice(-listSize).length)
    ) {
      isDrag = true;
    } else if (!keyPressed) {
      isDrag = false;
    }

    if (isDrag) {
      UI.SetValue('Script Items', 'position x', cursor.x - 260 / 2);
      UI.SetValue('Script Items', 'position y', cursor.y - 15);
    }
  }

  const addExploits = ~[4, 5, 6, 7].indexOf(getValue('misc hitlist options'));
  const addType = ~[2, 3, 6, 7].indexOf(getValue('misc hitlist options'))

  position.x = getValue('position x');
  position.y = getValue('position y');

  alpha.header = getValue('alpha header');
  alpha.background = getValue('alpha background');

  damageColors.lethal = getColor('damage > 90');
  damageColors.semi =   getColor('damage > 70');
  damageColors.half =   getColor('damage > 40');
  damageColors.low =    getColor('damage > 0');

  var addPosition = (addExploits && addType ? 63 : addExploits && !addType ? 13 : 0);

  Render.FilledRect(position.x, position.y, 260 + addPosition, 20, [0, 0, 0, alpha.header]);
  Render.FilledRect(position.x, position.y + 20, 260 + addPosition, 20 * logs.slice(-listSize).length, [0, 0, 0, alpha.background]);

  Render.String(position.x + 5, position.y + 5, 0, "NAME", [255, 255, 255, 255], 8);
  Render.String(position.x + 110, position.y + 5, 0, "DMG", [255, 255, 255, 255], 8);
  Render.String(position.x + 150, position.y + 5, 0, "HITBOX", [255, 255, 255, 255], 8);

  if (addType) {
    Render.String(position.x + 210, position.y + 5, 0, "TYPE", [255, 255, 255, 255], 8);
  }

  if (addExploits) {
    Render.String(position.x + 260 + (addType ? 0 : -50), position.y + 5, 0, "EXPLOITS", [255, 255, 255, 255], 8);
  }

  Render.Line(position.x, position.y + 20, position.x + 259 + addPosition, position.y + 20, [color.r, color.g, color.b, 255]);

  for (var i = logs.slice(-listSize).length, j = 0; i > 0; i--, j++) {
    // better than before :thinking:
    j = j > listSize ? 0 : j;
    
    var log = logs.slice(-listSize)[i - 1];

    if (!log.type) {
      Render.FilledRect(position.x + 3, position.y + 20 * (j + 1.25), 2.3, 10.5, colorByDamage(log.damage));
    }

    var name = log.name.slice(0, 14).replace(/[А-Яа-я]/ig, '*');

    Render.String(position.x + 7, position.y + 20 * (j + 1.25), 0, name, [255, 255, 255, 255], 8);
    Render.String(position.x + 110, position.y + 20 * (j + 1.25), 0, String(log.damage), [255, 255, 255, 255], 8);
    Render.String(position.x + 150, position.y + 20 * (j + 1.25), 0, log.hitbox, [255, 255, 255, 255], 8);

    if (addType) {
      Render.String(position.x + 210, position.y + 20 * (j + 1.25), 0, (log.manual ? 'manual' : 'auto'), [255, 255, 255, 255], 8);
    }

    if (addExploits) {
      Render.String(position.x + 260 + (addType ? 0 : -50), position.y + 20 * (j + 1.25), 0, log.exploits, [255, 255, 255, 255], 8);
    }
  }

  if (logs.length > listSize) {
    logs.shift();
  }
}

function getExploitName(i) {
  return ['-', 'HS', 'DT'][i] || '-';
}

function onRagebot() {
  exploitIndex = Event.GetInt('exploit');
}

function onHit() {
  const me = Entity.GetLocalPlayer();

  const victim = Event.GetInt('userid');
  const attacker = Event.GetInt('attacker');

  const damage = Event.GetInt('dmg_health');
  const hitbox = Event.GetInt('hitgroup');

  const victimIndex = Entity.GetEntityFromUserID(victim);
  const attackerIndex = Entity.GetEntityFromUserID(attacker);

  if (me === attackerIndex && me !== victimIndex) {
    logs.push({
      name: Entity.GetName(victimIndex),
      hitbox: getHitboxName(hitbox),
      damage: damage,
      manual: Input.IsKeyPressed(0x01),
      exploits: getExploitName(exploitIndex)
    });
  }
}

function onRoundStart() {
  if (!getValue('update every round')) {
    return;
  }

  logs = [];
}

function onRoundEnd() {
  if (!~[1, 3, 5, 7].indexOf(getValue('misc hitlist options'))) {
    return;
  }

  logs.push({
    name: 'Round ended',
    hitbox: '',
    damage: '',
    type: 'roundEnd',
    manual: '',
    exploits: ''
  });
}

function init() {
  var sizes = Render.GetScreenSize();

  // Main
  UI.AddCheckbox('enable hitlist');
  UI.AddSliderInt('hitlist size', 1, 15);
  UI.AddCheckbox('update every round');
  
  // Misc logs
  UI.AddMultiDropdown('misc hitlist options', [
    'round end',
    'type of shot',
    'exploits'
  ]);

  // Color settings
  UI.AddCheckbox('custom damage colors');
  UI.AddColorPicker('damage > 90');
  UI.AddColorPicker('damage > 70');
  UI.AddColorPicker('damage > 40');
  UI.AddColorPicker('damage > 0');

  // Alpha settings
  UI.AddCheckbox('custom alpha');
  UI.AddSliderInt('alpha header', 0, 255);
  UI.AddSliderInt('alpha background', 0, 255);

  // Position
  UI.AddCheckbox('position by pixels');
  UI.AddSliderInt('position x', 0, sizes[0]);
  UI.AddSliderInt('position y', 0, sizes[1]);

  // Default settings
  UI.SetValue('MISC', 'JAVASCRIPT', 'Script items', 'hitlist size', 7);
  UI.SetValue('MISC', 'JAVASCRIPT', 'Script items', 'alpha header', 200);
  UI.SetValue('MISC', 'JAVASCRIPT', 'Script items', 'alpha background', 90);
  UI.SetColor('MISC', 'JAVASCRIPT', 'Script items', 'damage > 90', damageColors.lethal);
  UI.SetColor('MISC', 'JAVASCRIPT', 'Script items', 'damage > 70', damageColors.semi);
  UI.SetColor('MISC', 'JAVASCRIPT', 'Script items', 'damage > 40', damageColors.half);
  UI.SetColor('MISC', 'JAVASCRIPT', 'Script items', 'damage > 0',  damageColors.low);

  // Set defaults
  UI.SetEnabled('Script Items', 'hitlist size', false);
  UI.SetEnabled('Script Items', 'update every round', false);
  UI.SetEnabled('Script Items', 'misc hitlist options', false);
  UI.SetEnabled('Script Items', 'custom damage colors', false);
  UI.SetEnabled('Script Items', 'damage > 90', false);
  UI.SetEnabled('Script Items', 'damage > 70', false);
  UI.SetEnabled('Script Items', 'damage > 40', false);
  UI.SetEnabled('Script Items', 'damage > 0', false);
  UI.SetEnabled('Script Items', 'custom alpha', false);
  UI.SetEnabled('Script Items', 'alpha header', false);
  UI.SetEnabled('Script Items', 'alpha background', false);
  UI.SetEnabled('Script Items', 'position by pixels', false);
  UI.SetEnabled('Script Items', 'position x', false);
  UI.SetEnabled('Script Items', 'position y', false);

  Cheat.RegisterCallback('Draw', 'onRender');
  Cheat.RegisterCallback('player_hurt', 'onHit');
  Cheat.RegisterCallback('ragebot_fire', 'onRagebot');
  Cheat.RegisterCallback('round_start', 'onRoundStart');
  Cheat.RegisterCallback('round_end', 'onRoundEnd');
}

init();