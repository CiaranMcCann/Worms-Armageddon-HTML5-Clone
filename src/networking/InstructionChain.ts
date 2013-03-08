/**
 * InstructionChain.js
 *
 * NOTICE: all varible names are extremely obsure and short for packet size reasons.
 *
 * This little beauty allows me functionality like eval, but with scope safety.
 * It allows the user to pass a string of method calls on objects. This is used mainly
 * for excuting commands on connected game clients in a safe way, its a little open to
 * cheating but I have other ways to lock that down, which I won't explain here
 * as this code is viewable on GitHub :) 
 *
 *  License: Apache 2.0
 *  author:  Ciarán McCann
 *  url: http://www.ciaranmccann.me/
 */

class InstructionChain
{
    //instructionChain shorted to iC so the packet is smaller
    iC: string[];

    // array of anything
    a; 

    constructor(instructionChain: string = "", args = [])
    {
        this.iC = instructionChain.split('.');
        this.a = args;

    }

    callFunc(objectToApplyInstruction)
    {
        var obj = objectToApplyInstruction;
        var objMethod;
        var objCalledMethod;

        if (this.iC.length > 1)
        {
            for (var i = 0; i < this.iC.length - 1; i++)
            {
                // If the next instruction is not a member varible but actually a function, call it.
                if (typeof obj[this.iC[i]] == "function")
                {
                        obj = obj[this.iC[i]].call(obj);

                } else
                {

                    obj = obj[this.iC[i]]
                }
            }
            objMethod = this.iC[this.iC.length - 1]


        } else
        {
            obj = objectToApplyInstruction;
            objMethod = this.iC[0];
        }

            obj[objMethod].call(obj, this.a);

    }

}