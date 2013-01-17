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
///<reference path="system/GamePad.ts"/>
///<reference path="system/Controls.ts"/>

class Player
{
    private team: Team;
    id: string;
    timer: Timer;
    gamePad: GamePad;

    constructor(playerId = Utilies.pickUnqine([1, 2, 3, 4], "playerids"))
    {
        this.id = playerId;
        this.team = new Team(playerId);

        // Global window keyup event
        $(window).keyup(function (e) =>
        {
            // Dectects keyup on fire button
            if (e.which == Controls.fire.keyboard)
            {
                var wormWeapon = this.team.getCurrentWorm().getWeapon()

                // If the weapon in use is a force charge sytle weapon we will fire otherwise do nothing
                if (wormWeapon.getForceIndicator().isRequired() && wormWeapon.getForceIndicator().getForce() > 1 && wormWeapon.getIsActive() == false)
                {
                    this.team.getCurrentWorm().fire();
                    Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getCurrentWorm.fire"));
                    GameInstance.weaponMenu.refresh();
                }
            }
        });

        this.timer = new Timer(10);
        this.gamePad = new GamePad();
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

    weaponFireOrCharge()
    {
        var wormWeapon = this.team.getCurrentWorm().getWeapon()
        //If this weapons use a force, then we charge the force.
        if (wormWeapon.getForceIndicator().isRequired() && wormWeapon.getIsActive() == false)
        {
            // The charge returns true if the charge has reached maxium
            if (this.team.getCurrentWorm().getWeapon().getForceIndicator().charge(3))
            {
                this.team.getCurrentWorm().fire();
                GameInstance.weaponMenu.refresh();
            }
        }
        else
        {
            this.team.getCurrentWorm().fire();
            GameInstance.weaponMenu.refresh();
        }

    }

    update()
    {
        this.timer.update();

        this.gamePad.connect();
        this.gamePad.update();

        var onlineSpefic = Client.isClientsTurn();

        if (onlineSpefic && GameInstance.state.getCurrentPlayer() == this && GameInstance.state.hasNextTurnBeenTiggered() == false)
        {

            //Player controls 
            if (keyboard.isKeyDown(Controls.walkLeft.keyboard) || this.gamePad.isButtonPressed(14) || this.gamePad.getAxis(0) > 0.5)
            {
                this.team.getCurrentWorm().walkLeft();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getCurrentWorm.walkLeft"));
            }

            if (keyboard.isKeyDown(Controls.jump.keyboard, true) || this.gamePad.isButtonPressed(0))
            {
                this.team.getCurrentWorm().jump();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getCurrentWorm.jump"));
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard) || this.gamePad.isButtonPressed(15) || this.gamePad.getAxis(0) > 0.5)
            {
                this.team.getCurrentWorm().walkRight();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getCurrentWorm.walkRight"));
            }

            if (keyboard.isKeyDown(Controls.aimUp.keyboard) ||
             this.gamePad.getAxis(2) >= 0.2 || this.gamePad.getAxis(3) >= 0.2)
            {

                this.team.getCurrentWorm().target.aim(0.8);
                this.team.getCurrentWorm().setCurrentFrame(this.team.getCurrentWorm().getCurrentFrame() - 0.8)
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getCurrentWorm.target.aim", [1]));

            }

            if (keyboard.isKeyDown(Controls.aimDown.keyboard) || this.gamePad.getAxis(2) <= -0.2 || this.gamePad.getAxis(3) <= -0.2)
            {
                this.team.getCurrentWorm().target.aim(-0.8);
                this.team.getCurrentWorm().setCurrentFrame(this.team.getCurrentWorm().getCurrentFrame() + 0.8)
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.getTeam.getCurrentWorm.target.aim", [-1]));
            }

            // While holding the
            if (keyboard.isKeyDown(Controls.fire.keyboard, true) || this.gamePad.isButtonPressed(7))
            {
               this.weaponFireOrCharge();
               Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.weaponFireOrCharge"));
            }


            // end of player controls
        }

        if (GameInstance.state.hasNextTurnBeenTiggered() == false)
        {

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

            //The camera tracks the player while they move
            var currentWorm = this.team.getCurrentWorm();
            if (currentWorm.body.GetLinearVelocity().Length() >= 0.1)
            {
                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(currentWorm.body.GetPosition()));
            }
                //if the players weapon is active and is a throwable then track it with the camera
            else if (this.getTeam().getWeaponManager().getCurrentWeapon() instanceof ThrowableWeapon &&
                this.getTeam().getWeaponManager().getCurrentWeapon().getIsActive())
                {
                var weapon: ThrowableWeapon = <ThrowableWeapon>this.getTeam().getWeaponManager().getCurrentWeapon();
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

    override(player: Player)
    {
        this.teamDataPacket.override(player.getTeam());
    }
}