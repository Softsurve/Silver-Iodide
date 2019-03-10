var umount = {};

umount.appName = "umount";
umount.version = "0.0.1";

umount.form = "mountPoint, ";
umount.currentLine = "";

umount.main = function(arg)
{
    var mountPoint = "/dev/clock";
    //console.printf("Not yet<br>");
    agi.umount(mountPoint);
};

umount.exec = umount.main;

export default umount;