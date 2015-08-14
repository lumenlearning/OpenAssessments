export default {
  
  enableListener: function(handler){
    // Create IE + others compatible event handler
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    this.messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    // Listen to message from child window
    eventer(this.messageEvent, handler.handleComm, false);
  },

  commMsg: function(msg, payload){
    parent.postMessage(JSON.stringify({'open_assessments_msg': msg, 'payload': payload}), '*');
  },

  broadcastMsg: function(payload){
    parent.postMessage(JSON.stringify(payload), "*");
  }

};