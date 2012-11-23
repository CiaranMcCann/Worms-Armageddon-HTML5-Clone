///<reference path="../Settings.ts" />
///<reference path="../system/Timer.ts" />
declare var test, ok, equal, notEqual, asyncTest, start,QUnit

QUnit.module( "Timer.js" );
asyncTest( "Asynchronous", function() {
     
    var timePeroid = 1000;
    var t = new Timer(timePeroid);
     
    
    setTimeout(function() => {
        t.update();
        notEqual(t.getTimeLeft(), timePeroid , "getTimeLeft()");
        equal(t.hasTimePeriodPassed(), true,"hasTimePeriodPassed()");
        equal(t.getTimeLeft(), timePeroid , "getTimeLeft()");

        start();
    }, timePeroid+200);
});



asyncTest( "Reset", function() {
     
    var timePeroid = 1000;
    var t = new Timer(timePeroid);
     
    
    setTimeout(function() => {
        t.update();
        notEqual(t.getTimeLeft(), timePeroid , "getTimeLeft()");
        t.reset();
        equal(t.getTimeLeft(), timePeroid , "getTimeLeft()");

        start();
    }, timePeroid);
});
