
g_RainbowColor = [1.0, 1.0, 0.0, 1.0]
next = 1
decr = 0

function RandomStartColor() {
    if (g_RainbowColor[decr] === 0.0){
        decr = (decr + 1) % 3
        next = (next + 1) % 3
    } else if (g_RainbowColor[decr] === 1.0 && g_RainbowColor[next] !== 1.0) {
        g_RainbowColor[next] = Math.min(1.0, g_RainbowColor[next] + 0.1);
    } else if (g_RainbowColor[next] === 1.0) {
        g_RainbowColor[decr] = Math.max(0.0, g_RainbowColor[decr] - 0.1);
    }

    // Round the color components to avoid precision errors
    g_RainbowColor = g_RainbowColor.map(component => Math.round(component * 10) / 10);

    return g_RainbowColor;
}
