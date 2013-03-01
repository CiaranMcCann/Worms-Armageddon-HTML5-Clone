/**
 * SpriteDefinitions.js
 *
 * They outline sprites and how many fames they have, what speed the move at etc. 
 * This class also removed the need to deal with nasty strings inside the main codebase
 *
 * SpriteDefinitions can be ascced and set from any where like the following
 * mySpriteObj.setSpriteDef(Sprites.worms.walking);
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */
interface SpriteDefinition
{
    imageName: string;
    frameY: number;
    frameCount: number;
    msPerFrame: number;
}


// -1 for msPerFrame means no animation
module Sprites
{

    export var weaponIcons = {

        holyGernade: { imageName: "iconhgrenade" },
        gernade: { imageName: "icongrenade" },
        drill: { imageName: "drill" },
        dynamite: { imageName: "icondynamite" },
        ninjaRope: { imageName: "iconrope" },
        jetPack: { imageName: "iconjetpack" },
        shotgun: { imageName: "iconshotgun" }



    };

    export var weapons = {

        jetPackFlamesDown: {

            imageName: "wjetflmd",
            frameY: 0,
            frameCount: 6,
            msPerFrame: 100,

        },

        jetPackFlamesSide: {

            imageName: "wjetflmb",
            frameY: 0,
            frameCount: 6,
            msPerFrame: 60,

        },


        holyGernade: {

            imageName: "hgrenade",
            frameY: 0,
            frameCount: 32,
            msPerFrame: 10,

        },

        gernade: {

            imageName: "grenade",
            frameY: 0,
            frameCount: 32,
            msPerFrame: 10,

        },

        dynamite: {

            imageName: "dynamite",
            frameY: 0,
            frameCount: 129,
            msPerFrame: 50,

        },
        //TODO Move aiming things to misulaous 
        redTarget: {
            imageName: "crshairr",
            frameY: 0,
            frameCount: 32,
            msPerFrame: 50,

        },


        arrow: {
            imageName: "arrowdnb",
            frameY: 0,
            frameCount: 30,
            msPerFrame: 10,

        },

        ninjaRopeTip: {
            imageName: "ropecuff",
            frameY: 0,
            frameCount: 112,
            msPerFrame: 10,

        }


    }

    // These are defined frames for said animations
    export var worms = {

        idle1: {

            imageName: "wselbak",
            frameY: 0,
            frameCount: 12,
            msPerFrame: 200,

        },

        hitground: {

            imageName: "wtwangd",
            frameY: 0,
            frameCount: 36,
            msPerFrame: 200,

        },


        drilling: {

            imageName: "wdrill",
            frameY: 0,
            frameCount: 4,
            msPerFrame: 100,

        },

        walking: {

            imageName: "wwalk",
            frameY: 0,
            frameCount: 15,
            msPerFrame: 50,

        },


        blink: {

            imageName: "wblink1u",
            frameY: 0,
            frameCount: 6,
            msPerFrame: 50,

        },

        falling: {

            imageName: "wfall",
            frameY: 0,
            frameCount: 2,
            msPerFrame: 100,

        },

        jumpBegin: {

            imageName: "wflyup",
            frameY: 0,
            frameCount: 2,
            msPerFrame: 100,

        },

        takeOutHolyGernade: {

            imageName: "whgrlnk",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 50,

        },

        takeOutDynamite: {

            imageName: "wdynlnkd",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 50,

        },

        aimHolyGernade: {

            imageName: "wthrhgr",
            frameY: 30 / 2,
            frameCount: 32,
            msPerFrame: 100,

        },

        takeOutDrill: {

            imageName: "wdrllnk",
            frameY: 0,
            frameCount: 13,
            msPerFrame: 60,

        },

        die: {

            imageName: "wdie",
            frameY: 0,
            frameCount: 60,
            msPerFrame: 5,
        },

        weWon: {

            imageName: "wwinner",
            frameY: 0,
            frameCount: 14,
            msPerFrame: 25,

        },

        hurt: {

            imageName: "wbrth2",
            frameY: 0,
            frameCount: 13,
            msPerFrame: 150,

        },

        takeOutGernade: {

            imageName: "wgrnlnk",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 50,

        },

        takeNinjaRope: {

            imageName: "wbatlnk",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 50,

        },

        aimNinjaRope: {

            imageName: "wbataim",
            frameY: 32 / 2,
            frameCount: 32,
            msPerFrame: 50,

        },

        aimGernade: {

            imageName: "wthrgrnu",
            frameY: 30 / 2,
            frameCount: 32,
            msPerFrame: 100,

        },

        takeOutJetPack: {

            imageName: "wjetlnk",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 50,

        },

        defualtJetPack: {

            imageName: "wjetbaku",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 50,

        },

        aimingShotgun: {

            imageName: "wshotp",
            frameY: 32/2,
            frameCount: 32,
            msPerFrame: 50,

        },

        shotgunTakeOut: {
            imageName: "wshglnk",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 60,

        },
        
        shotgunPutAway: {
            imageName: "wshgbak",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 60,

        },

        shotgunFireAnimation1: {
            imageName: "wshotf",
            frameY: 0,
            frameCount: 32,
            msPerFrame: 60,

        },

         shotgunFirePump: {
            imageName: "wshotg",
            frameY: 0,
            frameCount: 32,
            msPerFrame: 60,

        },
        



        minigunTakeOut: {
            imageName: "wmgnlnk",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 60,

        },

         minigunPutAway: {
            imageName: "wmgnbak",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 60,

        }







    }


    export var particleEffects = {

        eclipse: {

            imageName: "elipse75",
            frameY: 0,
            frameCount: 10,
            msPerFrame: 20,
        },


        cirlce1: {

            imageName: "circl100",
            frameY: 0,
            frameCount: 4,
            msPerFrame: 20,
        },

        wordBiff: {

            imageName: "exbiff",
            frameY: 0,
            frameCount: 12,
            msPerFrame: 20,
        },

        flame1: {

            imageName: "flame1",
            frameY: 0,
            frameCount: 32,
            msPerFrame: 50,
        },


        smoke75: {

            imageName: "smklt75",
            frameY: 0,
            frameCount: 28,
            msPerFrame: 50,
        },

        wave: {
            imageName: "water3",
            frameY: 0,
            frameCount: 12,
            msPerFrame: 50,

        },

        blob: {
            imageName: "blob",
            frameY: 0,
            frameCount: 16,
            msPerFrame: 50,

        },

        clouds: {
            imageName: "clouds",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 60,

        },

        cloudm: {
            imageName: "cloudm",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 60,

        },

        cloudl: {
            imageName: "cloudl",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 20,

        },

        grave1: {
            imageName: "grave1",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 20,

        },

        grave2: {
            imageName: "grave2",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 20,

        },

        grave3: {
            imageName: "grave3",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 20,

        },

        grave4: {
            imageName: "grave4",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 20,

        },

        grave5: {
            imageName: "grave5",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 20,

        },

        grave6: {
            imageName: "grave6",
            frameY: 0,
            frameCount: 20,
            msPerFrame: 20,

        },

    }

}
