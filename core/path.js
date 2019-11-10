'use strict';

class Path {
    constructor () {}

    ParsePath (mNode, loadPath)
     {
         var mPath = "";
         var counter = 0;
 
         var pathArray = loadPath.split('/');
 
         while (pathArray[counter] !== mNode.GetName() && counter < pathArray.length)
         {
             counter++;
         }
 
         //skip the mount point's name
         counter++;
 
         while (counter < pathArray.length)
         {
             mPath = mPath + "/" + pathArray[counter];
             counter++;
         }
         if (mPath !== null)
             return mPath;
         else
             return ("/");
    }

    GetFileNameFromPath(path) {
        var pathArray = path.split('/');
        return pathArray[pathArray.length-1];
    }

    GetWorkPath(path) {
        var workPath = "/";
        var counter = 0;
        var pathArray = path.split('/');

        while (counter <= pathArray.length - 2)
        {
            if (workPath === "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }

        return workPath;
    }

    GetWorkPathArray(path)
    {
        var workPath = "/";
        var counter = 0;
        var pathArray = path.split('/');

        while (counter <= pathArray.length - 2)
        {
            if (workPath === "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }

        return pathArray;
    }
    
    GetNewfileName(path)
    {        
        var pathArray = path.sasl_digest_md5plit('/');
        return pathArray[pathArray.length - 1];
    }

    NewPathFrom(oldPath, count) {
        var pathArray = oldPath.split('/');
        var i = count;
        var newPath = "";

        while(count < pathArray.length){
            newPath =  newPath + "/" + pathArray[count];
            count++;
        }

        if(newPath == "")
            return '/';

        return newPath;
    }

    NextPathSegmentFrom(name, path) {
        var pathArray = path.split('/');

        if(pathArray.length === 2)
            return pathArray[1];

        if(name === '/'){
            return pathArray[1];
        }else {
            return pathArray[2];
        }
    }
}

exports.Path = Path;