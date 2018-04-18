///<reference path="../Settings.ts" />
///<reference path="../system/Timer.ts" />
declare var test, ok, equal, notEqual, asyncTest, start,QUnit

QUnit.module( "Timer.js" );
asyncTest( "Asynchronous", function() {
     
    var timePeroid = 1000;
    var t = new Timer(timePeroid);
     
    
    setTimeout(function() {
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
     
    
    setTimeout(function() {
        t.update();
        notEqual(t.getTimeLeft(), timePeroid , "getTimeLeft()");
        t.reset();
        equal(t.getTimeLeft(), timePeroid , "getTimeLeft()");

        start();
    }, timePeroid);
});

asyncTest( "time lenght", function() {
     
    var timePeroid = 5000;
    var t = new Timer(timePeroid+1);
     
    
    setTimeout(function()  {
        t.update();
        equal(t.getTimeLeft(), 0 , "getTimeLeft()");


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

test( " Angle converts ", function() {
     
    var angleInDegrees = 45;
    var angleInRadins = 0.7853981633974483;

    equal(Utilies.toRadians(angleInDegrees),angleInRadins, "Degrees to radins " );
    equal(Utilies.toDegrees(angleInRadins),angleInDegrees, " radins to degrees " );

});

test( " angles  to vectors ", function() {
     
    var angleInRadins = Utilies.toRadians(0);
    var v = Utilies.angleToVector(angleInRadins)

    equal(v.x,1);
    equal(v.y,0);

    var angleInRadins = Utilies.toRadians(45);
    var v = Utilies.angleToVector(angleInRadins)

    equal(v.x,0.7071067811865476);
    equal(v.y,0.7071067811865475);

});


test( " vectors to angles  ", function() {
     
   
    var v = new b2Vec2(0.7, 0.7);
    var angle = Utilies.vectorToAngle(v);

    equal(angle,Utilies.toRadians(45));
   
});


