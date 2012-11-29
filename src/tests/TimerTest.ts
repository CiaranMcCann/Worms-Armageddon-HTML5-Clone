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


QUnit.module( "Utitlies" );
test( " remove item from array ", function() {
     
    var arr = [1,2,3,4,5];
     
    Utilies.deleteFromCollection(arr, 1);
    Utilies.deleteFromCollection(arr, 3);
    var t = arr[1] == 3 && arr[3] == null;


    ok(t);
});

