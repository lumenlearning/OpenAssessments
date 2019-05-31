import Communicator  from '../utils/communicator';
import SettingsStore from '../stores/settings.js';
import _             from "lodash";

export default {

  init: function(){
    Communicator.enableListener(this);
    this.sendSizeThrottled = _.throttle(this.sendSize, 1000);
    this.scrollParentToTopThrottled = _.throttle(this.scrollParentToTop, 2000);
  },

  sendSize: function(){
    var height = Math.max( 350, document.getElementById('assessment-container').scrollHeight + 20 );

    var ltiPayload = {
      subject: "lti.frameResize",
      height: height,
      iframe_resize_id: SettingsStore.current().iframe_resize_id
    };

    // Let the TC know about a resize
    Communicator.broadcastMsg(ltiPayload);
  },

  // get rid of LMS module navigation
  hideLMSNavigation: function () {
    Communicator.broadcastMsg({
      subject: "lti.showModuleNavigation",
      show: false
    });
  },

  // show LMS module navigation
  showLMSNavigation: function () {
    Communicator.broadcastMsg({
      subject: "lti.showModuleNavigation",
      show: true
    });
  },

  // tell the parent iFrame to scroll to top
  scrollParentToTop: function () {
    Communicator.broadcastMsg({
      subject: "lti.scrollToTop"
    });
  },

  navigateHome: function(){
    this.navigate("home");
  },

  navigateNext: function(){
    this.navigate("next");
  },

  navigatePrevious: function(){
    this.navigate("previous");
  },

  navigate: function(location){
    Communicator.broadcastMsg({
      subject: "lti.navigation",
      location: location
    });
  },

  handleComm: function(e){
    switch(e.data.open_assessments_msg){
      case 'open_assessments_size_request':
        this.sendSize();
        break;
    }
  }

};
