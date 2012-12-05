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
        spawnPionts: [
        { "x": 1498, "y": 1099 }, 
        { "x": 2176, "y": 1551 }, 
        { "x": 704, "y": 1679 }, 
        { "x": 1152, "y": 1479 }, 
        { "x": 577, "y": 1296 }, 
        { "x": 401, "y": 761 }, 
        { "x": 1442, "y": 724 }, 
        { "x": 2039, "y": 578 }, 
        { "x": 2226, "y": 905 }],
        backgroundGraidentCss: "background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"
    }
}