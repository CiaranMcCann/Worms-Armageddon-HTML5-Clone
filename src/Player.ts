///<reference path="Team.ts"/>
///<reference path="system/Utilies.ts"/>

class Player
{
    team: Team;

    constructor ()
    {
        this.team = new Team();
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
      
    }

    draw(ctx)
    {
        this.team.draw(ctx);
    }


}