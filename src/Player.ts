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

class Player
{
    private team: Team;

    constructor ()
    {
        this.team = new Team();
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

        if (keyboard.isKeyDown(13))
        {
            this.team.getCurrentWorm().fire();
        }

        //this.team.update();
      
    }

    draw(ctx)
    {
        this.team.draw(ctx);
    }


}