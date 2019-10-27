'use strict';

var Types = require("./types.js")

class FileNode {
    constructor(name, nodeType) {
        this.Name = name;
        this.meta = '{ "owner:local", "perm:755", "mime:text/plain" }';
        this.next = null;
        this.prev = null;
        this.Type = nodeType;
        this.watchers = [];
        this.Data = null;
        this.dirList = [];
        this.mounted = null;
        this.symNode = null;
        this.fsReserved = null;
    }

    AddChild(newDir)
    {
        if (this.Type === Types.FileTypes.Directory)
        {
            if(this.dirList.length === 0)
                this.dirList = [newDir]
            else {
                var prev = this.dirList[this.dirList.length-1];
                this.dirList = this.dirList.concat(newDir);
                var newItem = this.dirList[this.dirList.length-1]; 
                prev.next = newItem;
                newItem.prev = prev;
            }
            return 0;
        }
        else
            return -1;
    }

    AddParent(parent)
    {
        this.Parent = parent;
        return 0;
    }
 
    AddWatcher(newWatcher)
    {
        this.watchers[this.watchers.length] = newWatcher;
        return this.watchers.length - 1;
    }

    CountChildren()
    {
        if (this.dirList != null)
            return this.dirList.Count;
        else
            return -1;
    }

    GetData()
    {
        if (this.Type === Types.FileTypes.Binary || this.Type === Types.FileTypes.Text)
            return this.Data;
        else
            return "-1";
    }

    GetDirEntry(dirCount)
    {
        if (this.Type === Types.FileTypes.Binary)
            return this.dirList.ElementAt(dirCount);
        else
            return null;
    }

    GetDirList()
    {
        return this.dirList;
    }    

    GetMeta()
    {
        return this.meta;
    }    

    GetMount()
    {
        if (this.Type === Types.FileTypes.Mount)
        {
            if (this.mounted != null)
                return this.mounted;
            else
                return null;
        }
        else
            return null;
    }

    GetName()
    {
        return this.Name;
    }

    GetNext()
    {
        return this.next;
    }

    GetParent()
    {
        return this.Parent;
    }

    GetPrev()
    {
       return this.prev;
    }

    GetSym ()
    {
        if (this.Type === Types.FileTypes.Symlink && this.symNode != null)
            return this.symNode;
        else
            return null;
    }

    GetType()
    {
        return this.Type;
    }

    PutData(buffer)
    {
        if (this.Type === Types.FileTypes.Binary || this.Type === Types.FileTypes.Text)
        {
            this.Data = buffer;
            return 0;
        }
        else
            return -1;
    }

    RemoveWatcher(callback, watcher)
    { 
        if (this.watchers[watcher] === callback)
        {
            return 1;
        }
        else
            return -1;
    }

    SetMount(mount)
    {
        if (this.Type === Types.FileTypes.Mount)
        {
            if (this.mounted === null)
            {
                this.mounted = mount;
                return 0;
            }
            else
                return -1;
        }
        else
            return -1;
    }

    SetName(name)
    {
        this.Name = name;
        return 0;
    }

    SetNext(nextNode)
    {
        if(nextNode != null)
        {
            this.next = nextNode;
            return 0;
        }
        else
            return -1;
    }

    SetPrev(prevNode)
    {
        if (prevNode != null)
        {
            this.prev = prevNode;
            return 0;
        }
        else
            return -1;
    }

    SetSym(link)
    {
        if (this.Type === Types.FileTypes.Symlink && link != null)
        { 
            this.symNode = link;
            return 0;
        }
        else
            return -1;
    }

    SetType(type)
    {
        this.Type = type;
        return 0;
    }
}
exports.FileNode = FileNode;