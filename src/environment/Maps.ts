class Map
{
    private mapDef;
    currentSpawn;

    constructor (mapDef)
    {
        this.mapDef = mapDef;
        this.currentSpawn = 0;
    }

    getNextSpawnPoint()
    {
        return Utilies.pickUnqine(this.mapDef.spawnPionts, "spanwPionts");
    }

    getBackgroundCss()
    {
        return this.mapDef.backgroundGraidentCss;
    }

    getTerrainImg()
    {
        return AssetManager.images[this.mapDef.terrainImage];
    }
}

module Maps
{
    export var priates = {
        terrainImage: "level2",
        spawnPionts: [{"x":1699.956189657431,"y":2054.5162596293976},{"x":1693.956189657431,"y":2408.5162596293976},{"x":2218.956189657431,"y":2243.5162596293976},{"x":2570.956189657431,"y":2551.5162596293976},{"x":3896.956189657431,"y":2014.5162596293978},{"x":1156.956189657431,"y":2314.5162596293976},{"x":1652.956189657431,"y":1183.5162596293978},{"x":2273.956189657431,"y":1143.5162596293978},{"x":2568.956189657431,"y":1452.5162596293978},{"x":3129.956189657431,"y":1717.5162596293978}] ,
        backgroundGraidentCss: "background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"
    }
}