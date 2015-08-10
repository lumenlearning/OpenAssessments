var IframeHelper = {
  setHeight: function () {
// get rid of double iframe scrollbars
    var default_height = Math.max(
            document.body.scrollHeight, document.body.offsetHeight,
            document.documentElement.clientHeight, document.documentElement.scrollHeight,
            document.documentElement.offsetHeight);

    parent.postMessage(JSON.stringify({
      subject: "lti.frameResize",
      height: default_height
    }), "*");
  }
};

module.exports = IframeHelper;