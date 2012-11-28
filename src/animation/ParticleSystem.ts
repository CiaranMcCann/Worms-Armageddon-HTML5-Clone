/**
 * Game.js
 * This is the main game object which controls gameloop and basically everything in the game
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
///<reference path="Sprite.ts"/>
///<reference path="SpriteDefinitions.ts"/>
///<reference path="../system/AssetManager.ts"/>
///<reference path="../system/Utilies.ts"/>
///<reference path="../system/Timer.ts" />
///<reference path="../Settings.ts" />


class ParticleSystem
{
    private x: number;
    private y: number;

    eclipse: Sprite;
    cirlce: Sprite;
    word: Sprite;

    constructor (x, y)
    {
        this.x = x;
        this.y = y;
        this.eclipse = new Sprite(Sprites.particleEffects.eclipse,true);
        this.cirlce = new Sprite(Sprites.particleEffects.cirlce1,true);
        this.word = new Sprite(Sprites.particleEffects.wordBiff,true);
    }



    draw(ctx)
    {
        this.cirlce.drawOnCenter(ctx,
           this.x,
           this.y,
           this.eclipse
        );

        this.eclipse.draw(ctx,
           this.x,
           this.y
        );


        this.word.drawOnCenter(ctx,
           this.x,
           this.y,
           this.eclipse
        );

        // this.eclipse.draw(ctx,this.x, this.y);
    }


    update()
    {
        this.eclipse.update();
        this.cirlce.update();
        this.word.update();
    }


}