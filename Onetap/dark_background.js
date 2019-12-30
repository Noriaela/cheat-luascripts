function Draw()
{
    screenSize = Global.GetScreenSize();

    if (UI.IsMenuOpen())
        Render.FilledRect( 0, 0, screenSize[0], screenSize[1], [ 0, 0, 0,  UI.GetValue("Misc", "JAVASCRIPT", "Menu background alpha")] );
}

function Main() {
    UI.AddSliderInt( "Menu background alpha", 80, 225 );

    Global.RegisterCallback("Draw", "Draw")
}

Main();