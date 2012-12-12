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
        spawnPionts: [{"x":1140.1105493952311,"y":1006.0155735471201},{"x":2164.110549395231,"y":626.0155735471201},{"x":1272.1105493952311,"y":1676.01557354712},{"x":658.1105493952311,"y":1476.01557354712},{"x":1591.1105493952311,"y":1426.01557354712},{"x":2515.110549395231,"y":1422.01557354712},{"x":2576.110549395231,"y":810.0155735471201},{"x":1190.1105493952311,"y":692.0155735471201},{"x":759.1105493952311,"y":592.0155735471201}],
        backgroundGraidentCss: "background: -webkit-linear-gradient(top,  #242a4a 0%,#201610 100%);"
    }
}