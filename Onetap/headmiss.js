// rahim is the better script maker : )
UI.AddSliderInt("LBY offset", -180, 180)
UI.AddSliderInt("Real offset", -180, 180)
UI.AddSliderInt("Fake offset", -180, 180)
UI.AddSliderInt("Inverted LBY offset", -180, 180)
UI.AddSliderInt("Inverted Real offset", -180, 180)
UI.AddSliderInt("Inverted Fake offset", -180, 180)
function main() {
    var LBYOffset = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "LBY offset")
    var RealOffset = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "Real offset")
    var FakeOffset = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "Fake offset")
    var LBYInvert = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "Inverted LBY offset")
    var RealInvert = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "Inverted Real offset")
    var FakeInvert = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "Inverted Fake offset")
    var Inverted = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter") 
    if(Inverted) {
        AntiAim.SetOverride(1);
        AntiAim.SetFakeOffset(FakeInvert);
        AntiAim.SetRealOffset(RealInvert);
        AntiAim.SetLBYOffset(LBYInvert);
    } else {
        AntiAim.SetOverride(1);
        AntiAim.SetFakeOffset(FakeOffset);
        AntiAim.SetRealOffset(RealOffset);
        AntiAim.SetLBYOffset(LBYOffset);
    }
}
// ignore my dog shit indicators it was like 2am
function test() {
    var local = Entity.GetLocalPlayer()
    if (Entity.IsAlive(local)) {
    var test = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")    
        Render.String( 900, 525 -5, 0, "<", [137, 142, 208, 1505], 4)
        Render.String( 1000, 525 -5, 0, ">", [255, 0, 0, 255], 4)
    if (test) {
        Render.String( 900, 525 -5, 0, "<", [255, 0, 0, 255], 4)
        Render.String( 1000, 525 -5, 0, ">", [137, 142, 208, 1505], 4)
        }
    }
}
Cheat.RegisterCallback("Draw", "test");
Cheat.RegisterCallback("CreateMove", "main");