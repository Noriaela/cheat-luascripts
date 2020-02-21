UI.AddCheckbox("R8 Fake lag fix");

function check() {
    if (UI.GetValue( "Misc", "JAVASCRIPT", "Script items", "R8 Fake lag fix")) {
        LagFix();
    }
}

function LagFix() {
    player = Entity.GetLocalPlayer();
    weapon = Entity.GetWeapon(player);
        weaponName = Entity.GetName(weapon);
    if (weaponName.includes("r8 revolver")) {
            UI.SetValue( "Anti-Aim", "Fake-Lag", "Enabled", false )
        }else {
            UI.SetValue( "Anti-Aim", "Fake-Lag", "Enabled", true )
    }
}

Global.RegisterCallback("Draw", "check");
