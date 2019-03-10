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
    READ_ONLY : 1,
    WRITE_ONLY : 2
};

const ReadFlags = {
    CHECKDIR : 1,
    GETFILENODE : 2,
    GETFILEDATA : 3,
    GETFILEURL : 4
};

const WriteFlags = {
    DELETE : 0,
    CREATEDIR : 1,
    CREATEDATAFILE : 2,
    CREATELINK : 3,
    CREATEUNIONLINK : 4
};

const ChannelStatus = {
    DISCONNECTED : 0,
    CONNECTING : 1,
    CONNECTED : 2
};

export default {FileTypes, Errors, ReadFlags, WriteFlags, ChannelStatus}