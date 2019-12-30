// UI
var UIOnKey = "[BB] Blockbot Targetting Key";
var UIDoBlock = "[BB] Blockbot On Key";
var UIMode = "[BB] Blockbot Mode";
var UIBHop = "[BB] Blockbot BHop Retreat";

var MODE_MATCH_SPEED = "Match Speed";
var MODE_MAX_SPEED = "Maximum Speed";

var blockbotModes = [
    MODE_MATCH_SPEED,
    MODE_MAX_SPEED
];

UI.AddHotkey(UIDoBlock);
UI.AddHotkey(UIOnKey);
UI.AddDropdown(UIMode, blockbotModes);
UI.AddCheckbox(UIBHop);

// Shared
var Target = null;
var CrouchBlock = false;
var LocalPlayer = null;

// Less hard-baked stuff.
var types = {
    DEFAULT: "default",
    HOTKEY: "hotkey"
};

var entities = {
    CCSPlayer: 40
};

// Vector stuff
function print3(desc, vec) {
    Global.Print(desc + ": " + vec[0] + " | " + vec[1] + " | " + vec[2] + "\n");
}

function yaw3(v) {
    var x = v[0];
    var y = v[1];
    return Math.atan2(y, x) * 180 / Math.PI;
}

function dist3(a, b) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var bx = b[0];
    var by = b[1];
    var bz = b[2];

    var dx = ax - bx;
    var dy = ay - by;
    var dz = az - bz;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function sub3(a, b) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var bx = b[0];
    var by = b[1];
    var bz = b[2];

    return [ax - bx, ay - by, az - bz];
}

function add3(a, b) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var bx = b[0];
    var by = b[1];
    var bz = b[2];

    return [ax + bx, ay + by, az + bz];
}

function len3(v) {
    return dist3(v, [0, 0, 0]);
}

// UI helpers
function getUIVal(name, type) {
    type = type || "default";
    var value = null;

    if (type == types.HOTKEY) {
        value = UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script Items", name);
    } else {
        value = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", name);
    }

    return value;
}

function setUIVal(name, value, type) {
    if (type == types.HOTKEY) {
        return UI.ToggleHotkey("Misc", "JAVASCRIPT", "Script Items", name);
    }

    return UI.SetValue("Misc", "JAVASCRIPT", "Script Items", name, value);
}

// Helpers
// I would expect to get a single float out of m_vecVelocity[0] but it actually gives me the array.
function getEntityVelocity(entity) {
    return Entity.GetProp(entity, "CBasePlayer", "m_vecVelocity[0]"); // This actually resolves to a vec3 instead of the first float of the vec3
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

// blockbot.
function OnFrameMain() {
    LocalPlayer = Entity.GetLocalPlayer();

    if (!LocalPlayer) {
        return;
    }

    if (Target && Entity.IsAlive(LocalPlayer) && Entity.IsAlive(Target)) {
        var NearPlayer_toScreen = Render.WorldToScreen(Entity.GetHitboxPosition(Target, 5));
        var targetHitboxPosition = Entity.GetHitboxPosition(Target, 0);
        var playerOrigin = Entity.GetRenderOrigin(LocalPlayer);
        var targetOrigin = Entity.GetRenderOrigin(Target);
        var color = null;

        if ((targetHitboxPosition[2] < playerOrigin[2]) && dist3(playerOrigin, targetOrigin) < 100) {
            CrouchBlock = true;
            color = [255, 255, 0, 255];
        } else {
            CrouchBlock = false;
            color = [255, 0, 0, 255];
        }

        if (NearPlayer_toScreen[0] != null && NearPlayer_toScreen[1] != null) {
            Render.String(NearPlayer_toScreen[0] - (Render.TextSize("x")[0] / 2), NearPlayer_toScreen[1], 0, "x", color);
        }
    }

    if (!getUIVal(UIOnKey, types.HOTKEY) || !Entity.IsAlive(LocalPlayer)) {
        //Global.Print( "Key not pressed or not alive; Bail...\n" );
        return;
    }

    if (getUIVal(UIOnKey, types.HOTKEY)) {
        //Global.Print( "No target selected, looking for victims...\n" );
        var cEntities = Entity.GetEntitiesByClassID(entities.CCSPlayer);

        for (var i = 0; i < cEntities.length; i++) {
            var cEntity = cEntities[i];

            if (cEntity != LocalPlayer && Entity.IsAlive(cEntity) && Entity.IsTeammate(cEntity)) {
                if (!Target) {
                    Target = cEntity;
                    Global.PrintChat("Selected #" + Target + " - " + Entity.GetName(Target) + " as Target.\n");
                } else {
                    var playerOrigin = Entity.GetRenderOrigin(LocalPlayer);
                    var entityOrigin = Entity.GetRenderOrigin(cEntity);
                    var targetOrigin = Entity.GetRenderOrigin(Target);

                    if (dist3(playerOrigin, targetOrigin) > dist3(playerOrigin, entityOrigin)) {
                        // If entity is closer than target, use entity as target
                        Target = cEntity;
                        Global.PrintChat("Selected #" + Target + " - " + Entity.GetName(Target) + " as Target (closer than previous target).\n");
                    }
                }
            }
        }
    } else if (!getUIVal(UIOnKey, types.HOTKEY) || !Entity.IsAlive(Target)) {
        //Global.Print( "Key not pressed or target not alive; De-selecting...\n" );
        Target = null;
    }
}

function OnCreateMoveMain() {
    if (Target && getUIVal(UIDoBlock, types.HOTKEY)) {
        var LocalAngles = Global.GetViewAngles();
        var VecForward = sub3(Entity.GetRenderOrigin(Target), Entity.GetRenderOrigin(LocalPlayer));
        var otherYaw = yaw3(VecForward);
        var TargetSpeed = len3(getEntityVelocity(Target));

        if (CrouchBlock) {
            var cmdMove = [0, 0, 0];

            if (blockbotModes[getUIVal(UIMode)] == MODE_MATCH_SPEED) {
                cmdMove[0] = ((Math.sin(degToRad(LocalAngles[1])) * VecForward[1]) + (Math.cos(degToRad(LocalAngles[1])) * VecForward[0])) * 10;
                cmdMove[1] = ((Math.cos(degToRad(LocalAngles[1])) * -VecForward[1]) + (Math.sin(degToRad(LocalAngles[1])) * VecForward[0])) * 10;
            } else if (blockbotModes[getUIVal(UIMode)] == MODE_MAX_SPEED) {
                cmdMove[0] = ((Math.sin(degToRad(LocalAngles[1])) * VecForward[1]) + (Math.cos(degToRad(LocalAngles[1])) * VecForward[0])) * 200;
                cmdMove[1] = ((Math.cos(degToRad(LocalAngles[1])) * -VecForward[1]) + (Math.sin(degToRad(LocalAngles[1])) * VecForward[0])) * 200;
            }

            UserCMD.SetMovement(cmdMove);
        } else {
            var cmdMove = [0, 0, 0];
            var DiffYaw = otherYaw - LocalAngles[1];

            if (DiffYaw > 180) {
                DiffYaw = DiffYaw - 360;
            } else if (DiffYaw < -180) {
                DiffYaw = DiffYaw + 360;
            }

            if (TargetSpeed > 285 && getUIVal(UIBHop)) {
                cmdMove[0] = -Math.abs(TargetSpeed);
            }

            if (blockbotModes[getUIVal(UIMode)] == MODE_MATCH_SPEED) {
                if (Math.abs(DiffYaw) > 0.75) {
                    cmdMove[1] = 450 * -DiffYaw;
                }
            } else if (blockbotModes[getUIVal(UIMode)] == MODE_MAX_SPEED) {
                if (DiffYaw > 0.25) {
                    cmdMove[1] = -450;
                } else if (DiffYaw < -0.25) {
                    cmdMove[1] = 450;
                }
            }

            UserCMD.SetMovement(cmdMove);
        }
    }
}
Global.RegisterCallback("Draw", "OnFrameMain");
Global.RegisterCallback("CreateMove", "OnCreateMoveMain");