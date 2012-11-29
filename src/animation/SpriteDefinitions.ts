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
        drill: {imageName: "drill"},

    };

     export var weapons = {
         holyGernade: {

            imageName: "hgrenade",
            frameY: 0,
            frameCount: 32,
            msPerFrame: 10,

        }

     }

    // These are defined frames for said animations
    export var worms = {

        lookAround: {

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
            msPerFrame: 50,

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
            frameCount: 36,
            msPerFrame: 50,
        }

    }
   
}

//circl100 exbiff