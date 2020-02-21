var should_draw = false;
var started_drawing = 0;
var screen_size = Render.GetScreenSize( );
var alpha = 0;

function event_player_hurt( ) {
    target = Event.GetInt( "userid" );
    target_id = Entity.GetEntityFromUserID( target );
    attacker = Event.GetInt( "attacker" );
    attacker_id = Entity.GetEntityFromUserID( attacker );

    if ( ( Entity.GetLocalPlayer( ) === target_id ) || ( Entity.GetLocalPlayer( ) !== attacker_id ) )
        return;

    should_draw = true;
    started_drawing = Globals.Tickcount( );
}

function draw( ) {
    if (World.GetServerString() == "") //unconnected
        return;
    if ( !should_draw )
        return;
    if ( started_drawing + 180 < Globals.Tickcount( ) )
        return;

    alpha = ( started_drawing + 180 ) - Globals.Tickcount( );
    
    if ( alpha > 255 )
        alpha = 255;
    if ( alpha < 0 )
        alpha = 0;

    Render.Line( //top left
        screen_size[0] / 2 - 9, //x
        screen_size[1] / 2 - 9,  //y
        screen_size[0] / 2 - 4,   //x2
        screen_size[1] / 2 - 4,   //y2
        [ 255, 255, 255, alpha ] );

    Render.Line( //bottom right
        screen_size[0] / 2 + 9, //x
        screen_size[1] / 2 + 9,  //y
        screen_size[0] / 2 + 4,   //x2
        screen_size[1] / 2 + 4,   //y2
        [ 255, 255, 255, alpha ] );

    Render.Line( //top right
        screen_size[0] / 2 + 9, //x
        screen_size[1] / 2 - 9,  //y
        screen_size[0] / 2 + 4,   //x2
        screen_size[1] / 2 - 4,   //y2
        [ 255, 255, 255, alpha ] );

    Render.Line( //bottom left
        screen_size[0] / 2 - 9, //x
        screen_size[1] / 2 + 9,  //y
        screen_size[0] / 2 - 4,   //x2
        screen_size[1] / 2 + 4,   //y2
        [ 255, 255, 255, alpha ] );
}
Cheat.RegisterCallback( "Draw", "draw" );
Cheat.RegisterCallback( "player_hurt", "event_player_hurt" );