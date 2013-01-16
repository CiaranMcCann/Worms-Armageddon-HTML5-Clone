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
        spawnPionts: [{"x":1690.5955306911665,"y":1161.958040030463},{"x":2272.5955306911665,"y":1135.958040030463},{"x":2594.5955306911665,"y":1431.958040030463},{"x":2671.5955306911665,"y":1744.958040030463},{"x":3072.5955306911665,"y":1538.958040030463},{"x":3464.5955306911665,"y":2209.958040030463},{"x":2416.5955306911665,"y":2434.958040030463},{"x":1667.5955306911665,"y":2393.958040030463},{"x":1558.5955306911665,"y":2029.958040030463},{"x":2279.5955306911665,"y":1810.958040030463},{"x":2537.5955306911665,"y":1964.958040030463},{"x":2251.5955306911665,"y":2234.958040030463},{"x":3838.5955306911665,"y":1797.958040030463}],
        backgroundGraidentCss: "background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"
    }
}