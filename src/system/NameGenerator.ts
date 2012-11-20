///<reference path="Utilies.ts" />

// The name generator gets a list of famous programmers from wikipeda and randomly assigns them to worms
module NameGenerator
{

    var randomNamesList = [];
    //List_of_programming_language_researchers
    var nameDataSrc = "http://en.wikipedia.org/w/api.php?format=json&action=query&titles=List_of_programmers&prop=revisions&rvprop=content";

    export function init(callback)
    {

        $.ajax({
            url: nameDataSrc,
            dataType: 'jsonp',
            success: function (data) =>
            {
                randomNamesList = JSON.stringify(data).match(new RegExp("\\*\\[\\[[A-Z,a-z, ]+]]","g") )
                
                for (var name in randomNamesList)
                {
                    randomNamesList[name] = randomNamesList[name].replace("*", "");
                    randomNamesList[name] = randomNamesList[name].replace(/\[/g,"")
                    randomNamesList[name] = randomNamesList[name].replace(/]/g, "");                   
                }
                callback();
            }
        });

    }

    export function randomName()
    {
        if (randomNamesList.length == 0)
            return "Error with genertor";
        return randomNamesList[Utilies.random(0, randomNamesList.length - 1)];
    }

}