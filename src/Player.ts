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
///<reference path="system/Controls.ts"/>

class Player
{
    private team: Team;
    id: string;
    timer: Timer;

    constructor (playerId = Utilies.pickUnqine([1,2,3,4], "playerids"))
    {
        this.id = playerId;
        this.team = new Team(playerId);

        //TODO refactor all control code into central Controls.ts when adding gamepad
        //$('body').mousedown(function (event) =>
        //{
        //    if (Controls.checkControls( Controls.fire, event.which))
        //    {
        //          this.team.getCurrentWorm().fire();
        //    }
        //});

        this.timer = new Timer(10);
    }

    getPlayerNetData()
    {
        return this.team.getTeamNetData();
    }

    setPlayerNetData(data)
    {
        this.team.setTeamNetData(data);
    }

    getTeam()
    {
        return this.team;
    }

    update()
    {
        this.timer.update();



        if (GameInstance.state.getCurrentPlayerObject() == this && GameInstance.state.hasNextTurnBeenTiggered() == false)
        {


            //Player controls 
            if (keyboard.isKeyDown(Controls.walkLeft.keyboard))
            {
                this.team.getCurrentWorm().walkLeft();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayerObject.getTeam.getCurrentWorm.walkLeft"));
            }

            if (keyboard.isKeyDown(Controls.jump.keyboard, true))
            {
                this.team.getCurrentWorm().jump();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayerObject.getTeam.getCurrentWorm.jump"));
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard))
            {
                this.team.getCurrentWorm().walkRight();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayerObject.getTeam.getCurrentWorm.walkRight"));
            }

            if (keyboard.isKeyDown(Controls.aimUp.keyboard))
            {
                this.team.getCurrentWorm().target.aim(1);
               Client.sendImmediately(Events.client.ACTION,  new InstructionChain("state.getCurrentPlayerObject.getTeam.getCurrentWorm.target.aim",[1]));
            }

            if (keyboard.isKeyDown(Controls.aimDown.keyboard))
            {
                this.team.getCurrentWorm().target.aim(-1);
                 Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayerObject.getTeam.getCurrentWorm.target.aim",[-1]));
            }

            if (keyboard.isKeyDown(Controls.fire.keyboard, true))
            {
                this.team.getCurrentWorm().fire();
                GameInstance.weaponMenu.refresh();

                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayerObject.getTeam.getCurrentWorm.fire"));
            }


            if (keyboard.isKeyDown(38)) //up
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementY(-15)
            }

            if (keyboard.isKeyDown(40)) //down
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementY(15)
            }


            if (keyboard.isKeyDown(37)) //left
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementX(-15)
            }


            if (keyboard.isKeyDown(39)) //right
            {
                GameInstance.camera.cancelPan();
                GameInstance.camera.incrementX(15)
            }

            // end of player controls

            //The camera tracks the player while they move
            var currentWorm = this.team.getCurrentWorm();
            if (currentWorm.body.GetLinearVelocity().Length() >= 0.1)
            {
                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(currentWorm.body.GetPosition()));

            }
            //if the players weapon is active and is a throwable then track it with the camera
            else if(this.getTeam().getWeaponManager().getCurrentWeapon()  instanceof ThrowableWeapon &&
                this.getTeam().getWeaponManager().getCurrentWeapon().getIsActive())
            {
                var weapon : ThrowableWeapon = <ThrowableWeapon>this.getTeam().getWeaponManager().getCurrentWeapon();
                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(weapon.body.GetPosition()));
            }
        }

        this.team.update();

    }

    draw(ctx)
    {
        this.team.draw(ctx);
    }


}


class PlayerDataPacket
{
    teamDataPacket: TeamDataPacket;

    constructor(player: Player)
    {
        this.teamDataPacket = new TeamDataPacket(player.getTeam());
    }

    override(player : Player)
    {
        this.teamDataPacket.override(player.getTeam());
    }
}