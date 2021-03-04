function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  var decoded = {};
  var hexStr = '';
  for (var i = 0; i < bytes.length; i++) {
    var hex = (bytes[i] & 0xff).toString(16);
    hex = (hex.length === 1) ? '0' + hex : hex;
    hexStr += hex;
  }
  
  // if (port === 1) decoded.led = bytes[0];
  if (port===10) {
    if(bytes[0]===0x00) {
      if(bytes[1]===0x88) {
        decoded.latitude=parseInt(hexStr.substr(4,6),16)*0.0000125;
        if(bytes[5]!==0xff) { 
          decoded.longitude=parseInt(hexStr.substr(10,8),16)*0.0000001;
        } else {
          var neglong=parseInt(hexStr.substr(10,8),16);
          decoded.longitude=(~neglong)*-0.0000001;
        }
        decoded.altitude=parseInt(hexStr.substr(18,4),16)*0.5;      
        decoded.hexStr=hexStr;
      } else if(bytes[1]==0x85) {
        decoded.year=parseInt(hexStr.substr(4,4),16);
        decoded.month=parseInt(hexStr.substr(8,2),16);
        decoded.day=parseInt(hexStr.substr(10,2),16);
        decoded.hour=parseInt(hexStr.substr(12,2),16);
        decoded.mins=parseInt(hexStr.substr(14,2),16);
        decoded.secs=parseInt(hexStr.substr(16,2),16);
        decoded.hexStr=hexStr;
        
      } else if(bytes[1]==0x04) {
        decoded.ffsmState=parseInt(hexStr.substr(4,2),16);
        decoded.hexStr=hexStr;
        
      } else if(bytes[1]==0x06) {
        decoded.utcValid=parseInt(hexStr.substr(4,2),16) & 0x01;
        decoded.posValid=parseInt(hexStr.substr(4,2),16) & 0x02;
        decoded.hexStr=hexStr;
        
      } else if(bytes[1]==0x00) {
        if(bytes[2]==0x00) {
          decoded.alarmActive=false;
        } else {
          decoded.alarmActive=true;
        }
        decoded.hexStr=hexStr;
        
      } else if(bytes[1]==0x71) {
        decoded.accelX=parseInt(hexStr.substr(4,4),16);
        decoded.accelY=parseInt(hexStr.substr(8,4),16);
        decoded.accelZ=parseInt(hexStr.substr(12,4),16);
        decoded.hexStr=hexStr;
        
      } else if(bytes[1]==0x67) {
        decoded.temperature=parseInt(hexStr.substr(4,2),16);
        decoded.hexStr=hexStr;
      }
    } else if(bytes[0]==0x01 && bytes[1]==0xba) {
      decoded.battery1=bytes[2];
      decoded.hexStr=hexStr;
    } else if(bytes[0]==0x02 && bytes[1]==0xba) {
      decoded.battery2=bytes[2];
      decoded.hexStr=hexStr;
    }
  }

  return decoded;
}
