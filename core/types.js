'use strict';

const FileTypes = {
    Directory : 1,
    Text : 2,
    Binary : 3,
    Symlink : 4,
    Mount : 5,
    Union : 6,
    Excutable : 7,
    SPECIALDATA : 8
};

const Errors = {
    READ_ONLY : 10,
    WRITE_ONLY : 20
};

const ReadFlags = {
    CHECKDIR : 100,
    GETFILENODE : 200,
    GETFILEDATA : 300,
    GETFILEURL : 400
};

const ReadErrors = {
    INVALIDPATH : 1000,
    FILENOTFOUND : 2000
};

const WriteFlags = {
    DELETE : 0,
    CREATEDIR : 10000,
    CREATEDATAFILE : 20000,
    CREATELINK : 30000,
    CREATEUNIONLINK : 40000
};

const ChannelStatus = {
    DISCONNECTED : 900000,
    CONNECTING : 10000,
    CONNECTED : 20000
};

module.exports.FileTypes = FileTypes;
module.exports.Errors = Errors;
module.exports.ReadFlags = ReadFlags;
module.exports.ReadErrors = ReadErrors;
module.exports.WriteFlags = WriteFlags;
module.exports.ChannelStatus = ChannelStatus;