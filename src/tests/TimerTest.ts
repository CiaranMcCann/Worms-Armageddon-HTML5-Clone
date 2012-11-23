///<reference path="../Settings.ts" />
///<reference path="../system/Timer.ts" />
declare var test, ok, equal

test("TimerTest", function ()
{
    var t = new Timer(2000);
     t.update();

    equal(t.getTimeLeft(), 2000, "getTimeLeft()");
    equal(t.hasTimePeriodPassed(), false,"hasTimePeriodPassed()");
    equal(t.getTimeLeft(), 2000, "getTimeLeft() after hasTimePeriodPassed()");


});
