class BandwidthMonitor
{
    totalBandWidth;
    active;
    mesauredIn;

    constructor(active)
    {
        this.active = active;
        this.totalBandWidth = 0;
        this.mesauredIn = 1048576 //megabytes
    }

    count(data)
    {
        if (this.active)
        {
            var str = JSON.stringify(data);
            this.totalBandWidth += str.length;
        }
    }

    getCurrentBandWidth()
    {
        return this.totalBandWidth / this.mesauredIn + " MB ";
    }


}

declare var exports: any;
if (typeof exports != 'undefined')
{
    (module ).exports = BandwidthMonitor;
}