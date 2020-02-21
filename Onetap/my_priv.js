var UI_IND_SCREENY = '[SKI] Indicators Screen Y'
var UI_IND_OUTLINEB = '[SKI] Indicators Outline (Black)'
var SCREEN_SIZE = Global.GetScreenSize()
var screenX = SCREEN_SIZE[0]
var screenY = SCREEN_SIZE[1]

var baseX = 15,
  baseY = screenY - 200 // bottom left corner

var COLOR_WHITE = [255, 255, 255, 255],
  COLOR_GREEN = [124, 195, 13, 255],
  COLOR_RED = [195, 13, 35, 255]

var ANTIAIM_DIR = ''
var DENULL = false
function checkAntiAim() {
  // shit code, please help me improve
  var leftActive = UI.IsHotkeyActive('Anti-Aim', 'Rage Anti-Aim', 'Left dir'),
    rightActive = UI.IsHotkeyActive('Anti-Aim', 'Rage Anti-Aim', 'Right dir'),
    backActive = UI.IsHotkeyActive('Anti-Aim', 'Rage Anti-Aim', 'Back dir'),
    nulled =
      (leftActive && (rightActive || backActive)) ||
      (rightActive && (leftActive || backActive)) ||
      (backActive && (rightActive || leftActive))
  if (DENULL) {
    DENULL = false
    if (leftActive) {
      ANTIAIM_DIR = 'left'
      return
    }
    if (rightActive) {
      ANTIAIM_DIR = 'right'
      return
    }
    if (backActive) {
      ANTIAIM_DIR = 'back'
      return
    }
  }
  if (leftActive) {
    ANTIAIM_DIR = 'left'
    if (nulled) return (DENULL = true)
  }
  if (rightActive) {
    ANTIAIM_DIR = 'right'
    if (nulled) return (DENULL = true)
  }
  if (backActive) {
    ANTIAIM_DIR = 'back'
    if (nulled) return (DENULL = true)
  }
}

function MANUAL_AA(val) {
  return val === ANTIAIM_DIR
}

var functionLookup = { hotkey: UI.IsHotkeyActive, manual: MANUAL_AA },
  indicators = [
    ['hotkey', 'MINWALK', COLOR_WHITE, ['Anti-Aim', 'Extra', 'Slow walk']],
    ['hotkey', 'FD', COLOR_WHITE, ['Anti-Aim', 'Extra', 'Fake duck']],
    ['manual', 'LEFT', COLOR_WHITE, ['left']],
    ['manual', 'RIGHT', COLOR_WHITE, ['right']],
    ['manual', 'BACK', COLOR_WHITE, ['back']],
    ['hotkey', 'DT', COLOR_WHITE, ['Rage', 'Exploits', 'Doubletap']],
    ['hotkey', 'HS', COLOR_WHITE, ['Rage', 'Exploits', 'Hide shots']],
    [
      'hotkey',
      'SP',
      COLOR_WHITE,
      ['Rage', 'General', 'General', 'Safe point override']
    ],
    [
      'hotkey',
      'DMG',
      COLOR_GREEN,
      ['Rage', 'Pistol', 'Damage', 'Minimum damage (on key)']
    ],
    [
      'hotkey',
      'BAIM',
      COLOR_GREEN,
      ['Rage', 'Pistol', 'Pistol config', 'Hitbox override']
    ],
    [
      'hotkey',
      'AUTOPEEK',
      COLOR_GREEN,
      ['Misc', 'General', 'Movement', 'Auto peek']
    ]
  ]

// Draw Callback
function r_skeetindicators() {
  baseY = screenY - UI.GetValue(UI_IND_SCREENY)

  checkAntiAim()
  var activeIndicators = []
  indicators.forEach(function(ind) {
    var type = ind[0],
      text = ind[1],
      color = ind[2],
      map = ind[3]
    var fn = functionLookup[type]
    // call function with argument array "map "
    if (fn.apply(this, map)) {
      activeIndicators.push(ind)
    }
  })

  var index = 0
  activeIndicators.forEach(function(ind) {
    var type = ind[0],
      text = ind[1],
      color = ind[2],
      map = ind[3]
    index = index + 1
    var x = baseX,
      y = baseY + index * 25
    if (UI.GetValue(UI_IND_OUTLINEB)) {
      Render.String(x + 2, y + 2, 0, text, [0, 0, 0, 255], 4)
    }
    Render.String(x, y, 0, text, color, 4)
  })
}

// Add baseY slider
UI.AddSliderInt(UI_IND_SCREENY, 0, 1000)
UI.AddCheckbox(UI_IND_OUTLINEB)
// Register callbacks
Global.RegisterCallback('Draw', 'r_skeetindicators')