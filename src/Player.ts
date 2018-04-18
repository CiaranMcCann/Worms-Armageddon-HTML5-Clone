/**
 * Player
 * The player class contains a team objects, which is the team of worms. 
 * It also defines the controls for the worms movements.
 *
 *  License: Apache 2.0
 *  author:  Ciar�n McCann
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
        $(window).keyup(function (e)
        {
            // Dectects keyup on fire button
            if (e.which == Controls.fire.keyboard)
            {
                var wormWeapon = this.team.getCurrentWorm().getWeapon()

                // If the weapon in use is a force charge sytle weapon we will fire otherwise do nothing
                if (wormWeapon.getForceIndicator().isRequired() && wormWeapon.getForceIndicator().getForce() > 1 && wormWeapon.getIsActive() == false)
                {
                    this.team.getCurrentWorm().fire();
                    Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("fire"));
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
            if (wormWeapon.ammo > 0 && this.team.getCurrentWorm().getWeapon().getForceIndicator().charge(3))
            {
                this.team.getCurrentWorm().fire();
                GameInstance.weaponMenu.refresh();

            } else if(wormWeapon.ammo <= 0)
            {
                Notify.display("Out of Ammo", "No more ammo left in your " + wormWeapon.name + " Select a new weapon ",5000);
                AssetManager.getSound("cantclickhere").play();
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
           
            if (keyboard.isKeyDown(Controls.jump.keyboard, true) || 
                this.gamePad.isButtonPressed(0) ||
                TouchUI.isJumpDown(true))
            {
                this.team.getCurrentWorm().jump();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("jump"));
            }

            if (keyboard.isKeyDown(Controls.backFlip.keyboard, true) || this.gamePad.isButtonPressed(0))
            {
                this.team.getCurrentWorm().backFlip();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("backFlip"));
            }

            if (keyboard.isKeyDown(Controls.walkLeft.keyboard) ||
                 this.gamePad.isButtonPressed(14) || 
                this.gamePad.getAxis(0) > 0.5 ||
                GameInstance.sticks.getNormal(0).x < -0.5)
            {
                this.team.getCurrentWorm().walkLeft();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("walkLeft"));
            }

            if (keyboard.isKeyDown(Controls.walkRight.keyboard) || 
                this.gamePad.isButtonPressed(15) || 
                this.gamePad.getAxis(0) > 0.5 ||
                GameInstance.sticks.getNormal(0).x  > 0.5)
            {
                this.team.getCurrentWorm().walkRight();
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("walkRight"));
            }

            if (keyboard.isKeyDown(Controls.aimUp.keyboard) ||
             this.gamePad.getAxis(2) >= 0.2 || 
             this.gamePad.getAxis(3) >= 0.2 ||
              GameInstance.sticks.getNormal(0).y < -0.6)
            {
                var currentWrom = this.team.getCurrentWorm();
                currentWrom.target.aim(-0.8);
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("target.aim", [-0.8]));
            }

            if (keyboard.isKeyDown(Controls.aimDown.keyboard) || 
                this.gamePad.getAxis(2) <= -0.2 || 
                this.gamePad.getAxis(3) <= -0.2 || 
                 GameInstance.sticks.getNormal(0).y > 0.6)
            {
                var currentWrom = this.team.getCurrentWorm();
                currentWrom.target.aim(0.8);           
                Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("target.aim", [0.8]));
            }

            // While holding the
            if (
                keyboard.isKeyDown(Controls.fire.keyboard, true) ||
                this.gamePad.isButtonPressed(7) ||
                TouchUI.isFireButtonDown())
            {
                this.weaponFireOrCharge();
                Client.sendImmediately(Events.client.ACTION, new InstructionChain("state.getCurrentPlayer.weaponFireOrCharge"));
            } else
            {
                if (TouchUI.isTouchDevice())
                {
                    var wormWeapon = this.team.getCurrentWorm().getWeapon()
                    // If the weapon in use is a force charge sytle weapon we will fire otherwise do nothing
                    if (!TouchUI.isFireButtonDown() && wormWeapon.getForceIndicator().isRequired() && wormWeapon.getForceIndicator().getForce() > 5 && wormWeapon.getIsActive() == false)
                    {
                        this.team.getCurrentWorm().fire();
                        Client.sendImmediately(Events.client.CURRENT_WORM_ACTION, new InstructionChain("fire"));
                        GameInstance.weaponMenu.refresh();
                    }
                }
            }

            // end of player controls
        }
        
         //Finds the worm traveling at the highest velocity and if its over a therosold
         // the camera will then pan to the position of that worm. 
         // So when their is an explosion it gives the player somthing interesting and fun to look at
         var fastestWorm : Worm = GameInstance.wormManager.findFastestMovingWorm();
         if (GameInstance.state.physicsWorldSettled && fastestWorm != null && fastestWorm.body.GetLinearVelocity().Length() > 3)
         {
                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(fastestWorm.body.GetPosition()));
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
           
            if (GameInstance.state.physicsWorldSettled && currentWorm.body.GetLinearVelocity().Length() >= 0.1)
            {

                GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(currentWorm.body.GetPosition()));
            }          
                //if the players weapon is active and is a throwable then track it with the camera
            else if ( GameInstance.state.physicsWorldSettled && (this.getTeam().getWeaponManager().getCurrentWeapon() instanceof ThrowableWeapon
                || this.getTeam().getWeaponManager().getCurrentWeapon() instanceof ProjectileWeapon) &&
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
    position;

    constructor(player: Player)
    {
        this.teamDataPacket = new TeamDataPacket(player.getTeam());
    }

    override(player: Player)
    {
        this.teamDataPacket.override(player.getTeam());
    }
}