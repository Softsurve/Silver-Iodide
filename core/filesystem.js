'use strict';

var path = require("./path.js");
var Types = require("./types.js");
var FileNode = require("./filenode.js");

var Path = new path.Path();

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
    }

    Read(path, flags, offset, length) {
        var loadPath;
        var readNode;

        readNode = this.walk(path, this.root);

        if(readNode === Types.ReadErrors.FILENOTFOUND || Types.ReadErrors.INVALIDPATH)
            return readNode;

        else if (readNode !== null && readNode.GetType() === Types.FileTypes.Mount)
        {
            loadPath = this.parsePath(readNode, path);

            return readNode.GetMount().read(loadPath, flags,0,0); 
        }
        else
            return readNode;
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
        aNode = this.walk(path, this.root);

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

    Mount(fileSystem, mountPoint, args) {
        var workPath = "/";
        var aNode;
        var pathArray = mountPoint.split('/');
        var counter = 0;
    
        while (counter <= pathArray.length - 2)
        {
            if (workPath === "/")
                workPath = workPath + pathArray[counter];
            else
                workPath = workPath + '/' + pathArray[counter];
            counter++;
        }
    
        aNode = this.walk(workPath, this.root);
    
        if (aNode !== null && aNode.GetType() === Types.FileTypes.Directory )
        {           
            aNode.AddChild(new fileSystem());
    
            this.touched(aNode);
    
            return;
        }
        else {
            this.Error("Mount failed");
            return null;
        }
    }

    Write(path, flags, buffer, offset, length)
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
            aNode = this.walk(workPath, this.root);

            if(aNode === Types.ReadErrors.FILENOTFOUND || aNode === Types.ReadErrors.INVALIDPATH )
                return -1;

            if ( aNode.GetType() === Types.FileTypes.Directory )
            {
                newDir=new FileNode.FileNode(pathArray[pathArray.length - 1], Types.FileTypes.Directory);
                newDir.AddParent(aNode);
                aNode.AddChild(newDir);

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
            aNode = this.walk(workPath, this.root);
            
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

                var newFile = new FileNode.FileNode(pathArray[pathArray.length - 1], Types.FileTypes.Text);

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
            aNode = this.walk(workPath, this.root);
            var bNode = this.walk(buffer, this.root);

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
            aNode = this.walk(workPath, this.root);

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
            aNode = this.walk(workPath, this.root);
            
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
            if (this.walk(path, this.root) !== null)
            {
                aNode = this.walk(path, this.root);

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

    walk(path, node) {
        if (path === null || path === "" || path.length < 1 || node === null || node === undefined || path[0] !== '/')
            return Types.ReadErrors.INVALIDPATH;

        if (path.length === 1 && path[0] === '/')
            return node;

        var pathArray = path.split('/');
        var pathOffset = 1;
        var fileName = Path.GetFileNameFromPath(path);
        var n = node.GetChildren();
        var i = 0;

        while(pathOffset < pathArray.length && n.length > 0 && i < n.length){
            if(n[i].GetName() === fileName && pathOffset === pathArray.length - 1){
                    return n[i];                    
            }
            else if(n[i].GetName() === pathArray[pathOffset]  && n[i].GetType() === Types.FileTypes.Directory) {
                n = n[i].GetChildren();
                pathOffset++;
            }            
            else {
                i++;
            }
        }

        return Types.ReadErrors.FILENOTFOUND;
    }

    watch(path, caller, callback)
    {
        var aNode = this.walk(path, this.root);
        return aNode.AddWatcher(callback);
    }

    unwatch(callback, path, watcher)
    {
        var aNode = this.walk(path, this.root);
        return aNode.removeWatcher(callback, watcher);
    }

    log(text) 
    {
        this.stdLog = this.stdLog + "\n" + text;
    }
    
}
exports.FileSystem = FileSystem;
