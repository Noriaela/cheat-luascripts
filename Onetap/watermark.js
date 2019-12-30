// watermark by raidhvh 02.12.2019
// 02.12.2019 updated
/*
  1) fixed issues with other resolution
  2) fixed issues with time
  3) ping now more accurate
  4) added x and y sliders(paste)
*/

/* 03.12.2019 updated
    1) changed fps design
    2) watermark save position with cfg( must work )
*/

/*
    08.12.2019 updated
    1) fixed time
    2) updated rainbow line(pasted of "Animated rainbow line (cringe)" by ksenon)
*/

function HSVtoRGB(h, s, v)
{
    var r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (i % 6)
    {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function getCustomValue(xy) {
  var value = UI.GetValue("MISC", "JAVASCRIPT", "Script items", xy);
return value;}
var position = {
  x1: 0,
  y1: 0
}

function watermark()
{
   
    var colors = HSVtoRGB(Global.Realtime() * UI.GetValue("MISC", "JAVASCRIPT", "Script Items", "Watermark Gradient Speed"), 1, 1);
   
    const ping = Math.floor(Global.Latency() * 1000 / 1.5 );
    const fps = Math.floor( 1 / Global.Frametime() );
       
   
    x1 = getCustomValue("Watermark x");
    y1 = getCustomValue("Watermark y");  
    var today = new Date();
    var hours1 = today.getHours();
    var minutes1 = today.getMinutes();
    var seconds1 = today.getSeconds();
    var hours = hours1 <= 9 ? "0" + today.getHours() + ":" : today.getHours() + ":";
    var minutes = minutes1 <= 9 ? "0" + today.getMinutes() + ":" : today.getMinutes() + ":";
    var seconds = seconds1 <= 9 ? "0" + today.getSeconds() : today.getSeconds()    ;

   

    var tickrate = Global.Tickrate()
    Render.FilledRect( x1 + 45, y1 + 2, 260, 55 , [ 30, 30, 30, 150 ] ); // background
    Render.Rect( x1 + 45, y1 + 2, 260, 55, [ 30, 30, 30, 255 ] );
    Render.FilledRect( x1 + 50, y1 + 7, 250, 45, [ 30, 30, 30, 255 ] ); // background1
    Render.String( x1 + 122, y1 + 37, 0, "TCK   ", [ 120, 120, 120, 255 ], 3 ); //TCK
    Render.String( x1 + 127, y1 + 37, 0, "          " + tickrate, [ 255, 255, 255, 220 ], 3 ); // TCK1
    Render.Rect( x1 + 120, y1 + 35, 23, 13, [ 120, 120, 120, 255] ); // TCK2
    Render.Rect( x1 + 170, y1 + 35, 6, 13, [ 120, 120, 120, 255] ) ;// ping
    Render.Rect( x1 + 177, y1 + 38, 6, 10, [ 120, 120, 120, 255] ); // ping1
    Render.Rect( x1 + 184, y1 + 41, 6, 7, [ 120, 120, 120, 255] ); // ping2
    Render.Circle( x1 + 237, y1 + 41, 6, [ 120, 120, 120, 255 ] ) ;// clock
    Render.Line( x1 + 237, y1 + 42, x1 + 237, y1 + 36, [ 120, 120, 120, 255 ] ); // clock1
    Render.Line( x1 + 237, y1 + 42, x1 + 243, y1 + 42, [ 120, 120, 120, 255 ] ); // clock2
    Render.String( x1 + 192, y1 + 37, 0, " " + ping + "ms", [ 255, 255, 255, 200 ], 3 );
    Render.Rect( x1 + 67, y1 + 33, 21, 13, [ 120, 120, 120, 255] ); // fps2
    Render.Rect( x1 + 69, y1 + 31, 21, 13, [ 120, 120, 120, 255] ); // fps3    
    Render.FilledRect( x1 + 65, y1 + 35, 21, 13, [30, 30, 30, 255] ); // background fps
    Render.Rect( x1 + 65, y1 + 35, 21, 13, [ 120, 120, 120, 255] ); // fps1
    Render.String( x1 + 67, y1 + 37, 0, "FPS   " , [ 120, 120, 120, 255 ], 3 );
    Render.String( x1 + 72, y1 + 37, 0, "           " + fps , [ 255, 255, 255, 220 ], 3 );
    Render.String( x1 + 247, y1 + 37, 0, " " + hours + minutes + seconds, [ 255, 255, 255, 220 ], 3 );
    Render.GradientRect( x1 + 55,  y1 + 25, 120, 3, 1, [colors.g, colors.b, colors.r, 255], [colors.r, colors.g, colors.b, 255]); // rainbow line
    Render.GradientRect( x1 + 175, y1 + 25, 120, 3, 1, [colors.r, colors.g, colors.b, 255], [colors.b, colors.r, colors.g, 255]); // rainbow line
    Render.String( x1 + 157, y1 + 12, 0, "onetap.su", [ 255, 255, 255, 200], 3 );
   
}

function main()
{
        var screensize = Global.GetScreenSize();
        UI.AddSliderInt("Watermark x", 0, screensize[0]);
        UI.AddSliderInt("Watermark y", 0, screensize[1]);
}
main()

Global.RegisterCallback("Draw", "watermark");
UI.AddSliderFloat("Watermark Gradient Speed", 0.01, 1.0);
UI.SetValue("MISC", "JAVASCRIPT", "Script Items", "Watermark Gradient Speed", 0.1);