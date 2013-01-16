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
        spawnPionts: [{"x":2123.724440058533,"y":1615.5021837536601},{"x":2217.724440058533,"y":1681.5021837536601},{"x":2149.724440058533,"y":1524.5021837536601},{"x":2123.724440058533,"y":1413.5021837536601},{"x":2157.724440058533,"y":1335.5021837536601},{"x":2076.724440058533,"y":1576.5021837536601}] ,
        backgroundGraidentCss: "background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"
    }
}