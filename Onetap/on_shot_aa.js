currShot = 0;
currentYaw = 0;
function weaponFire() {
    ogYawOffset = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Base yaw:");
    
    UID = Event.GetInt("userid");
    entityID = Entity.GetEntityFromUserID(UID);
    
    localEntityID = Entity.GetLocalPlayer();
    
    
    
    if (entityID == localEntityID) {
        desiredYaw = 0;
        
        if (currShot == 1) {
            //User is on second shot
            desiredYaw = ogYawOffset;
            currShot = 0;
            if (UI.GetValue("Misc", "JAVSCRIPT", "Script items", "Chat info:")) {
                Cheat.PrintChat("[RESET] - Changed yaw to " + desiredYaw.toString());
            }            
        }
        else {    
            //User is on first shot
            desiredYaw = UI.GetValue("Misc", "JAVSCRIPT", "Script items", "Yaw flip:");
            if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Random yaw:")) {
                desiredYaw = getRandomInt(-180, 180);
                Cheat.PrintChat("[RANDOM] - New yaw: " + desiredYaw.toString());
            }                
            Cheat.PrintChat("[SWITCH] - Changed yaw to " + desiredYaw.toString());
            currShot++;
        }
        UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", desiredYaw);
        
    }
}

function playerDeathFunc() {
    
    attackerUID = Event.GetInt("attacker");
    victimUID = Event.GetInt("userid");
    
    attackerEntity = Entity.GetEntityFromUserID(attackerUID);
    victimEntity = Entity.GetEntityFromUserID(victimUID);
    localEntity = Entity.GetLocalPlayer();
    
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Reset after you get a kill:") && attackerEntity == localEntity) {
        Cheat.PrintChat("[RESET] - You got a kill.");
        resetYaw();
    }
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Reset after you are killed:") && victimEntity == localEntity) {
        Cheat.PrintChat("[RESET] - You got killed.");
        resetYaw();
    }
}

function resetYaw() {
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Chat info:")) {
        Cheat.PrintChat("Finished resetting yaw!");
    }
    currShot = 0;
    UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", ogYawOffset);
}

ogYawOffset = 0;

function drawUI() {
    UI.AddSliderInt("Yaw flip:", -180, 180);
    UI.AddSliderInt("Base yaw:", -180, 180);
    
    UI.AddCheckbox("Random yaw:");
    UI.AddCheckbox("Reset after you get a kill:");
    UI.AddCheckbox("Reset after you are killed:");
    UI.AddCheckbox("Reset after round ends:");
    
    UI.AddCheckbox("Chat info:");
}

function main() {
    ogYawOffset = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset");
    drawUI();
    Cheat.RegisterCallback("player_death", "playerDeathFunc");
    Cheat.RegisterCallback("weapon_fire", "weaponFire");
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * ( (max + 1) - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

main();
