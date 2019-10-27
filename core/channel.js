
class Channel {
    constructor (url, user, pass) {
        this.status;
        this.username;
        this.url;
        this.sessionID;
    }

    Connect(url, user, pass) {
      this.username = user;
      this.url = url;       
      this.status = channelStatus.CONNECTING;    
        
      if( this.prototype.connect(user, pass) )
          this.status = channelStatus.CONNECTED
      else
          this.status = channelStatus.DISCONNECTED;
    }
    
    Disconnect() {
        this.prototype.disconnect();
        this.status = channelStatus.DISCONNECTED;
    }
}

export default Channel;