'use strict';

var Types = require("./types.js")
var FileNode = require("./filenode.js")

class FileSystem {
    constructor () {
        this.stdLog = "";
        this.stdOut = "";
        this.debugLevel = 10;
        this.fsArray = [];
        this.currentDir = "~";
        this.vfsList = [];
        this.channelList = [];

        this.root= new FileNode.FileNode("/", Types.FileTypes.Directory);
        this.init = function()
        {
            this.root = new FileNode.FileNode("/", Types.FileTypes.Directory);
            return this.root;
        }
    }

    read(path, flags, offset, length) {
        var loadPath;
        var readNode;
        readNode = this.walk(path);

        if (readNode !== null && readNode.GetType() === Types.FileTypes.Mount)
        {
            loadPath = this.parsePath(readNode, path);

            return readNode.GetMount().read(loadPath, flags,0,0); 
        }
        else
            return readNode;
    }

    parsePath (mNode, loadPath)
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

    touched(node) {
        var x = 0;
        while(x < node.watchers.length) {
            if(typeof node.watchers[x] === "function") {
                var callback = node.watchers[x];
                callback();
                } else
                this.log("failed to run callback "+x);
                x++;
            }
        return x;
    }

    onmount(mountPoint)
    {
        return this;
    }

    getWorkPath(path) {
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

    getWorkPathArray(path)
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
    
    getNewfileName(path)
    {        
        var pathArray = path.sasl_digest_md5plit('/');
        return pathArray[pathArray.length - 1];
    }

    Delete(path){
        var aNode;
        var buffer;
        var counter;
        var fileStruct;
        var flags;
        var loadPath = "";
        var offset;
        var prevNode;
        var nextNode;
    
        counter = 0;
        aNode = this.walk(path);

        if(aNode === null)
            return -1;
        
        if (aNode.GetType() === Types.FileTypes.Mount)
        {
            loadPath = this.parsePath(aNode, path);
            return (aNode.GetMount().write(loadPath, flags, buffer, offset, 0));
        }
        if (aNode.GetType() === Types.FileTypes.Symlink)
        {
            fileStruct = path.split('/');
            Types.remPath = aNode.GetName() + "/" + fileStruct[fileStruct.length - 1];
            return (this.write(Types.remPath, flags, buffer, offset, 0));
        }
        if (aNode.GetType() === Types.FileTypes.Union)
        {
            fileStruct = path.split('/');
            counter = 0;

            while (counter < aNode.GetDirList().Count)
            {
                Types.remPath = aNode.GetDirList()[counter] + "/" + fileStruct[fileStruct.length - 1];
                this.write(Types.remPath, flags, buffer, offset, 0);
                counter++;
            }
            return 0;
        }
        prevNode = aNode.GetPrev();
        nextNode = aNode.GetNext();

        while (aNode.GetParent().GetDirList()[counter].GetName() !== aNode.GetName() && counter < aNode.GetParent().GetDirList().Count)
        {
            counter++;
        }

        prevNode.SetNext(nextNode);
        nextNode.SetPrev(prevNode);
        return 0;
    }

    write(path, flags, buffer, offset, length)
    {
        var workPath = "/";
        var aNode;
        var pathArray = path.split('/');
        var counter = 0;
        var loadPath = "";
        var newDir;
        var newfile;
        var count;

        while (counter <= pathArray.length - 2)
        {
            if (workPath === "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }

        if (flags === Types.WriteFlags.CREATEDIR)
        {
            aNode = this.walk(workPath);

            if(aNode === null) {
                return -1;
            }
            
            if ( aNode.GetType() === 1 && buffer === "1")
            {
                newDir =  new FileNode(pathArray[pathArray.length - 1], Types.FileTypes.Directory);
                newDir.AddParent(aNode);
                aNode.AddChild(newDir);

                if (aNode.CountChildren() > 0)
                {
                    newDir.SetPrev(aNode.GetDirList().ElementAt(aNode.CountChildren()-1));
                }

                if (aNode.CountChildren() >= 2)
                {
                    aNode.GetDirList()[aNode.CountChildren() - 2].SetNext(newDir);
                }

                this.touched(aNode);
                return 0;
            }
            else if (aNode.GetType() === Types.FileTypes.Symlink)
            {
                return (this.write(aNode.GetSym() + "/" + pathArray[pathArray.length - 1], flags, buffer, offset, length));
            }

            else if (aNode.GetType() === Types.FileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                return (aNode.GetMount().write(loadPath, flags, buffer, offset, length));
            }
            else if (aNode.GetType() === Types.FileTypes.Union)
            {
                loadPath = this.parsePath(aNode, path);
                count = 0;
                while (count < aNode.GetDirList().Count)
                {
                    this.touched(aNode);
                    this.write(aNode.GetDirList()[count] + loadPath, flags, buffer, offset, length);
                    count++;
                }
                return (0);
            }
            else
                return -1;

        }
        else if (flags === Types.WriteFlags.CREATEDATAFILE)
        {
            aNode = this.walk(workPath);
            
            if (aNode.GetType() === 1)
            {
                count = 0;
                if (aNode.GetDirList().Count > 0)
                {
                    while (count < aNode.GetData().length - 1 && aNode.GetDirList()[count].GetName() !== pathArray[pathArray.length - 1])
                    {
                        count++;
                    }
                    aNode.GetDirList();
                    if (aNode.GetDirList()[count].GetName() === pathArray[pathArray.length - 1] && aNode.GetDirList()[count].GetName() !== "")
                    {
                        aNode.GetDirList()[count].putData(buffer);
                        this.touched(aNode);
                        return 0;
                    }
                }

                var newFile = new FileNode(pathArray[pathArray.length - 1], Types.FileTypes.Text);

                newFile.AddParent(aNode);
                aNode.AddChild(newFile);

                if (aNode.CountChildren() > 0)
                {
                    newFile.SetPrev(aNode.GetDirList().ElementAt(aNode.CountChildren() - 1));
                }

                if (aNode.CountChildren() >= 2)
                {
                    aNode.GetDirList()[aNode.CountChildren() - 2].SetNext(newFile);
                }

                newFile.PutData(buffer);
                this.touched(aNode);
                return 0;
            }

            else if (aNode.GetType() === Types.FileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                return aNode.GetMount().write(loadPath, flags, buffer, offset, length);
            }
            else if (aNode.GetType() === Types.FileTypes.Union)
            {
                loadPath = this.parsePath(aNode, path);
                counter = 0;

                while (counter < aNode.GetData().length)
                {
                    this.touched(aNode);
                    this.write(aNode.GetDirList()[counter] + loadPath, flags, buffer, offset, length);
                    counter++;
                }
                return 0;
            }
            else
                return -2;
        }

        else if (flags === 3)
        {
            aNode = this.walk(workPath);
            var bNode = this.walk(buffer);

            if (bNode.GetType() === Types.FileTypes.Directory || bNode.GetType() === Types.FileTypes.Mount)
            {
                if (aNode.GetType() === Types.FileTypes.Directory)
                {
                    newDir = aNode.GetDirList()[aNode.GetDirList().Count] = new FileNode(pathArray[pathArray.length - 1], Types.FileTypes.Symlink);
                    newDir.SetSym(bNode);

                    newDir.AddParent(aNode);
                    aNode.AddChild(newDir);

                    if (aNode.CountChildren() > 0)
                    {
                        newDir.SetPrev(aNode.GetDirList().ElementAt(aNode.CountChildren() - 1));
                    }

                    if (aNode.CountChildren() >= 2)
                    {
                        aNode.GetDirList()[aNode.CountChildren() - 2].SetNext(newDir);
                    }

                    this.touched(aNode);
                    return 0;
                }

                else if (aNode.GetType() === Types.FileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.touched(aNode);
                    return (aNode.GetMount().write(loadPath, flags, buffer, offset, length));
                }

                else
                    return -3;
            }
            if (bNode.GetType() === Types.FileTypes.Mount)
            {
                if (aNode.GetType() === Types.FileTypes.Directory)
                {

                    newfile = aNode.GetDirList()[aNode.GetDirList().Count] = new FileNode(pathArray[pathArray.length - 1], Types.FileTypes.Symlink);
                    newfile.SetSym(bNode);
                    newfile.AddParent(aNode);
                    aNode.AddChild(newfile);
                 
                    if (aNode.CountChildren() > 0)
                    {
                        newfile.SetPrev(aNode.GetDirList().ElementAt(aNode.CountChildren() - 1));
                    }

                    if (aNode.CountChildren() >= 2)
                    {
                        aNode.GetDirList()[aNode.CountChildren() - 2].SetNext(newfile);
                    }

                    this.touched(aNode);
                    return 0;
                 }

                if (aNode.GetType() === Types.FileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.touched(aNode);
                    return (aNode.GetMount().write(loadPath, flags, buffer, offset, length));
                }
                else
                    return -3;
            }
            if (bNode.GetType() === Types.FileTypes.Union)
            {
                if (aNode.GetType() === 1)
                {
                    newfile = new FileNode(pathArray[pathArray.length - 1], 4);
                    aNode.GetDirList()[aNode.GetDirList().Count] = newfile;
                    /*
                    newfile.Name = pathArray[pathArray.length - 1];
                    newfile.Type = 4;
                    newfile.next = 0;
                    newfile.Data = buffer;
                    newfile.prev = aNode.Data[aNode.Data.length - 1];
                    newfile.Parent = aNode;

                    if (aNode.Data.length >= 2)
                    {
                        aNode.Data[aNode.Data.length - 2].next = newfile;
                    }*/
                    this.touched(aNode);
                    return 0;
                }

                if (aNode.GetType() === Types.FileTypes.Mount)
                {
                    loadPath = this.parsePath(aNode, path);
                    this.touched(aNode);
                    return aNode.GetMount().write(loadPath, flags, buffer, offset, length);
                }
                else
                    return -4;
            }

            else
                return bNode.GetType();
        }
        else if (flags === Types.FileTypes.Symlink)
        {
            aNode = this.walk(workPath);

            if (aNode.GetType() === Types.FileTypes.Directory)
            {
                this.touched(aNode);
                 return 0;
            }

            else if (aNode.GetType() === Types.FileTypes.Mount)
            {
                loadPath = this.parsePath(aNode, path);
                this.touched(aNode);
                return (aNode.GetMount().write(loadPath, flags, buffer, offset, length));
            }

            else if (aNode.GetType() === Types.FileTypes.Union)
            {
                loadPath = this.parsePath(aNode, path);
                counter = 0;

                return 0;
            }

            else
                return -2;
        }
        else if (flags === 5)
        {
            aNode = this.walk(workPath);
            
            if(aNode === null)
                return -1;
            
            if (aNode.GetType() === Types.FileTypes.Directory)
            {
                this.touched(aNode);
                return 0;
            }

            if (aNode.GetType() === Types.FileTypes.Directory)
            {
                loadPath = this.parsePath(aNode, path);
                this.touched(aNode);

                return (aNode.GetMount().write(loadPath, flags, buffer, offset, length));
            }

            else
                return -4;
        }
        else if (flags === Types.FileTypes.Mount)
        {
            if (this.walk(path) !== null)
            {
                aNode = this.walk(path);

                if (aNode.GetType() === 5)
                {
                    return -1;
                }
                if (aNode.GetType() === Types.FileTypes.Union)
                {
                    //aNode.Data[aNode.Data.length] = buffer;
                    this.touched(aNode);
                    return 0;
                }
                else
                    aNode.putData(  buffer);
                return 0;
            }
            else
                return -5;
        }
        else
            return -10;
    }

    walk(path) {
        var startNode = this.root;
        var aNode = null;
        if (path === null || path === "" || path.length < 1)
            return null;
        
        if (path.length === 1 && path[0] === '/')
        {         
            return startNode;
        }

        if (path[0] !== '/')
        {
            path = '/' + path;
        }
        
        var nodeArray = path.split('/');

        if (startNode.GetDirList().length !== 0)
            aNode = startNode.GetDirList()[0];

        var depth = 1;
 
        while (aNode !== null && aNode.GetName() !== nodeArray[nodeArray.length - 1] && depth <= nodeArray.length)
        {
            while (aNode.GetName() !== nodeArray[depth] && depth <= nodeArray.length)
            {
                if (aNode.GetNext() !== null)
                {
                    aNode = aNode.GetNext();
                }
                else
                {
                    return null;
                }
            }

            if (aNode.GetName() !== nodeArray[nodeArray.length - 1] && aNode.GetType() !== 5 && aNode.GetType() !== 6)
            {
                aNode = aNode.GetDirList()[0];
                depth++;
            }

            if (aNode !== null && aNode.GetName() === nodeArray[nodeArray.length - 1] && depth < nodeArray.length - 1)
            {
                var znode = 0;
                while (aNode.GetDirEntry(znode).GetName() !== nodeArray[depth + 1] && depth <= nodeArray.length)
                {
                    if (aNode.GetDirEntry(znode).GetNext() !== null)
                        znode++;
                    else
                        return null;
                }
                if (aNode.GetDirEntry(znode).GetName() === nodeArray[depth + 1])
                {
                    depth++;
                    aNode = aNode.GetDirEntry(znode);
                }
                else
                    return null;
            }

	    switch(aNode !== null) {
            case aNode.GetType() === 5:
               	if (aNode.GetName() === nodeArray[depth])
                    return (aNode);
                else
                    break;
			case aNode.GetType() === 4:
                if (aNode.GetName() === nodeArray[depth])
                	return (aNode);
                else
                    return null;
           	case aNode.GetType() === 6:
                if (aNode.GetName() === nodeArray[depth])
                   	return (aNode);
                else
                    return null;
            default:
			    break;
	    }
        }
        return aNode;
    }

    watch(path, caller, callback)
    {
        var aNode = this.walk(path);
        return aNode.AddWatcher(callback);
    }

    unwatch(callback, path, watcher)
    {
        var aNode = this.walk(path);
        return aNode.removeWatcher(callback, watcher);
    }

    log(text) 
    {
        this.stdLog = this.stdLog + "\n" + text;
    }
    
}
exports.FileSystem = FileSystem;
