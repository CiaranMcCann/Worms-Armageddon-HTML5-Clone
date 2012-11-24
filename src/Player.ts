/**
 * Player
 * The player class contains a team objects, which is the team of worms. 
 * It also defines the controls for the worms movements.
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Team.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="system/Timer.ts"/>

class Player
{
    private team: Team;
    private timer: Timer;
    private hasPlayerFiredWeapon;

    constructor ()
    {
        this.team = new Team();
        this.timer = new Timer(2000);
        this.hasPlayerFiredWeapon = false;
    }

    getTeam()
    {
        return this.team;
    }

    update()
    {       
        

        if (keyboard.isKeyDown(65))
        {
            this.team.getCurrentWorm().walkLeft();
        }

        if (keyboard.isKeyDown(87))
        {
            this.team.getCurrentWorm().jump();
        }

        if (keyboard.isKeyDown(68))
        {
            this.team.getCurrentWorm().walkRight();
        }

        if (keyboard.isKeyDown(13) && !this.hasPlayerFiredWeapon)
        {
            this.hasPlayerFiredWeapon = true;
            this.team.getCurrentWorm().fire();

        }


        //if (this.hasPlayerFiredWeapon)
        //{
        //    this.timer.update();
        //}

        //if (this.timer.hasTimePeriodPassed())
        //{
        //        GameInstance.nextPlayer();
        //}

        //this.team.update();
      
    }

    draw(ctx)
    {
        this.team.draw(ctx);
    }


}