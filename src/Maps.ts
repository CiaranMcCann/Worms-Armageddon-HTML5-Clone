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
        spawnPionts: [{"x":1190.1049129056307,"y":685.3893677086331},{"x":737.1049129056307,"y":1852.389367708633},{"x":1761.1049129056307,"y":1944.389367708633},{"x":1948.1049129056307,"y":1256.389367708633},{"x":2245.104912905631,"y":616.389367708633},{"x":1525.1049129056307,"y":765.389367708633},{"x":1117.1049129056307,"y":1007.389367708633},{"x":2516.104912905631,"y":1407.389367708633}],
        backgroundGraidentCss: "background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"
    }
}