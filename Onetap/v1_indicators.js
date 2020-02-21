function Draggable(x, y, w, h) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.cursorPosition = [];
    this.pressInWindow = false;
    this.pressOutside = false;
    this.differenceX = 0;
    this.differenceY = 0;
}

Draggable.prototype.drag = function() {
    if (!Input.IsKeyPressed(1)) {
        this.pressInWindow = false;
        this.pressOutside = false;
        return [this.x, this.y];
    }
    
    this.cursorPosition = Input.GetCursorPosition();
    
    var inBoundary = (
        (this.cursorPosition[0] >= this.x) &&
        (this.cursorPosition[1] >= this.y) &&
        (this.cursorPosition[0] <= this.x + this.w) &&
        (this.cursorPosition[1] <= this.y + this.h)
    );
    
    if (!inBoundary) {
        this.pressOutside = true;

    } else if (!this.pressInWindow && !this.pressOutside) {
        this.pressInWindow = true;
        
        this.differenceX = this.cursorPosition[0] - this.x;
        this.differenceY = this.cursorPosition[1] - this.y;
    }
    
    if (this.pressInWindow) {
        this.x = this.cursorPosition[0] - this.differenceX;
        this.y = this.cursorPosition[1] - this.differenceY;
    }
    
    return [this.x, this.y];
};

// Indicator Menu Elements //
UI.AddCheckbox( "Indicator Enabled" );
UI.AddSliderInt( "Indicator X", 0, 100 );
UI.AddSliderInt( "Indicator Y", 0, 100 );
UI.AddCheckbox( "Reset Colors" );

// Hide Sliders from User //
UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Indicator X", false)
UI.SetEnabled("Misc", "JAVASCRIPT", "Script items", "Indicator Y", false)

// Color Pickers //
UI.AddColorPicker("Background");
UI.AddColorPicker("FPS Text");
UI.AddColorPicker("Indicator Text");
UI.AddColorPicker("Indicator Bar1");
UI.AddColorPicker("Indicator Bar2");

// Default values //
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Background", [0, 0, 0, 64]);
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "FPS Text", [121, 218, 35, 255]);
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Text", [230, 172, 124, 255]);
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar1", [255, 165, 56, 255]);
UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar2", [136, 85, 28, 255]);

// Window dimensions //
var w = 127;
var h = 96;

// Indicator window position //
var x = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Indicator X");
var y = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Indicator Y");
var indicatorDrag = new Draggable(x, y, w, h);

// Shared varibles //
var indicatorX = x + 5;
var indicatorW = 8;
var indicatorH = 16;
var indicatorGap = indicatorW + 4;
var indicatorBars = 10;

// FPS indicator //
var fpsY = y + 2;
var fpsFrameRate = 0;
 
// Choke indicator //
var chokeY = y + 23;
var chokeBarY = chokeY + 15;
var chokeMax = 14;

// Desync indicator //
var desyncY = y + 60;
var desyncBarY = desyncY + 15;
var desyncDiffMax = 119.11886787414551;

// Colors //
var backgroundColor = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Background");
var fpsTextColor = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "FPS Text");
var indicatorTextColor = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Text");
var indicatorBar1 = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar1");
var indicatorBar2 = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar2");

function updateVariables()
{
    backgroundColor = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Background");
    fpsTextColor = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "FPS Text");
    indicatorTextColor = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Text");
    indicatorBar1 = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar1");
    indicatorBar2 = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar2");
    
    if(UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Reset Colors"))
    {
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Background", [0, 0, 0, 64]);
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "FPS Text", [121, 218, 35, 255]);
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Text", [230, 172, 124, 255]);
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar1", [255, 165, 56, 255]);
        UI.SetColor("Misc", "JAVASCRIPT", "Script items", "Indicator Bar2", [136, 85, 28, 255]);
        UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Reset Colors", false)
    }
    
    x = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Indicator X");
    y = UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Indicator Y");
    
    var newPosition = indicatorDrag.drag();
    UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Indicator X", newPosition[0]);
    UI.SetValue("Misc", "JAVASCRIPT", "Script items", "Indicator Y", newPosition[1]);
    
    indicatorX = x + 5;
    
    fpsY = y + 2;
    chokeY = y + 23;
    desyncY = y + 60;
    
    chokeBarY = chokeY + 15;
    desyncBarY = desyncY + 15;
    
}

function sortHigherLower(a, b)
{
    return [((a > b) ? a : b), ((a < b) ? a : b)];
}

function sameSign(a, b)
{
    return (a >= 0 && b >= 0) || (a < 0 && b < 0);
}

function getChokeAmount(playerIndex)
{
    var simTime = Entity.GetProp( playerIndex, "CBasePlayer", "m_flSimulationTime" );
    var simDiff = Globals.Curtime() - simTime;
    var chokedTicks = simDiff / Globals.TickInterval();
    
    return Math.floor(chokedTicks * (indicatorBars / chokeMax) + 0.5)
}

function getDesyncAmount(realYaw, fakeYaw)
{
    var sorted = sortHigherLower(realYaw, fakeYaw);
    
    realYaw = (0 > realYaw) ? (realYaw * (-1)) : realYaw;
    fakeYaw = (0 > fakeYaw) ? (fakeYaw * (-1)) : fakeYaw;
    var sortedSameSign = sortHigherLower(realYaw, fakeYaw);
    
    
    var realFakeAmount = 0;
    
    if(!sameSign(sorted[0], sorted[1]))
        realFakeAmount = sorted[0] - sorted[1];   
    else if((realYaw + fakeYaw) > 180 && !sameSign(sorted[0], sorted[1]))
        realFakeAmount = (360 - realYaw) - fakeYaw;
    else
        realFakeAmount = sortedSameSign[0] - sortedSameSign[1];
    
    return Math.floor((realFakeAmount * (indicatorBars / desyncDiffMax)) + 0.5);
}

function main()
{
    var localPlayer = Entity.GetLocalPlayer();
    
    if(!UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Indicator Enabled"))
        return;
    
    if( !Entity.IsAlive(localPlayer) && !UI.IsMenuOpen(1))
        return;
    
    font = Render.AddFont( "Verdana", 8, 1000);
    fpsFrameRate = 0.9 * fpsFrameRate + (1.0 - 0.9) * Globals.Frametime();
    var fps = Math.floor((1.0 / fpsFrameRate) + 0.5);   
    
    Render.FilledRect(x, y, w, h, backgroundColor);
    Render.StringCustom( indicatorX, fpsY, 0, "FPS: " + fps, fpsTextColor, font );
    Render.StringCustom( indicatorX, chokeY, 0, "CHOKE", indicatorTextColor, font );
    Render.StringCustom( indicatorX, desyncY, 0, "DESYNC", indicatorTextColor, font );
    
    var chokeAmount = getChokeAmount(Entity.GetLocalPlayer());
    var desyncAmount = getDesyncAmount(Local.GetRealYaw(), Local.GetFakeYaw());
    
    for(var i = 0; i < indicatorBars; ++i)
    {
        var barX = indicatorX + (i * indicatorGap);
        
        if(chokeAmount > i) {
            Render.FilledRect(barX, chokeBarY, indicatorW, indicatorH, indicatorBar1);
        } else {
            Render.FilledRect(barX, chokeBarY, indicatorW, indicatorH, indicatorBar2);
        }
        if(desyncAmount > i) {
            Render.FilledRect(barX, desyncBarY, indicatorW, indicatorH, indicatorBar1);
        } else {
            Render.FilledRect(barX, desyncBarY, indicatorW, indicatorH, indicatorBar2);
        }
    }
    
    updateVariables();
}

Cheat.RegisterCallback("Draw", "main");