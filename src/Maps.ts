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
        var tmp = this.mapDef.spawnPionts[this.currentSpawn]
        this.currentSpawn++;

        // If not enough spawn pionts in map just loop back over.
        if (this.currentSpawn > this.mapDef.spawnPionts.length + 1) 
        {
            this.currentSpawn = 0;
        }

        return tmp;
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
        spawnPionts: [{"x":1544.9062323019293,"y":1566.0332014302426},{"x":1156.9062323019293,"y":1250.0332014302426},{"x":655.9062323019293,"y":1425.0332014302426},{"x":519.9062323019293,"y":1074.0332014302426},{"x":1023.9062323019293,"y":582.0332014302427},{"x":1238.9062323019293,"y":162.03320143024268},{"x":2024.9062323019293,"y":220.03320143024268},{"x":1822.9062323019293,"y":854.0332014302427}] ,
        backgroundGraidentCss: "background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"
    }
}