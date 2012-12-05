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

        holyGernade: {imageName: "iconhgrenade"},
         gernade: {imageName: "icongrenade"},
        drill: {imageName: "drill"},
       dynamite: {imageName: "icondynamite"}

         

    };

     export var weapons = {
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
            frameY: 30/2,
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
            msPerFrame: 40,
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

         aimGernade: {

            imageName: "wthrgrnu",
            frameY: 30/2,
            frameCount: 32,
            msPerFrame: 100,

        },
         


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
            frameCount: 36,
            msPerFrame: 50,
        },

        
       smoke75: {

            imageName: "smklt75",
            frameY: 0,
            frameCount: 28,
            msPerFrame: 50,
        }



    }
   
}

//circl100 exbiff