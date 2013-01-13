/**
 * InstructionChain.js
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

    instructionChain: string[];
    args; // array of anything

    constructor(instructionChain: string = "", args = [])
    {
        this.instructionChain = instructionChain.split('.');
        this.args = args;

    }

    call(objectToApplyInstruction)
    {
        var obj = objectToApplyInstruction;
        var objMethod;
        var objCalledMethod;

        if (this.instructionChain.length > 1)
        {
            for (var i = 0; i < this.instructionChain.length - 1; i++)
            {
                // If the next instruction is not a member varible but actually a function, call it.
                if (typeof obj[this.instructionChain[i]] == "function")
                {
                    obj = obj[this.instructionChain[i]].call(obj);

                } else
                {

                    obj = obj[this.instructionChain[i]]
                }
            }
            objMethod = this.instructionChain[this.instructionChain.length - 1]


        } else
        {
            obj = objectToApplyInstruction;
            objMethod = this.instructionChain[0];
        }

        obj[objMethod].call(obj, this.args);
    }

}