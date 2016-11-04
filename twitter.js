(function ($) {

$.FroalaEditor.RegisterShortcut(49, 'paragraphFormat', 'H1', false);
// Define twitter provider
$.FroalaEditor.TWEET_PROVIDERS = {
        test_regex: /^.*((twitter.com\/)([A-Za-z0-9\-]+))*/,
        test_tags: /(blockquote)/,
        html: '<twitter-widget>{data}</twitter-widget>'};
// Define popup template.
$.extend($.FroalaEditor.POPUP_TEMPLATES, {
  'yTwitter.popup': '[_BUTTONS_][_CUSTOM_LAYER_]'
});
$.extend($.FroalaEditor.htmlAllowedTags,{
  'htmlAllowedTags': ['blockquote','class', 'lang', 'dir', 'href', 'twitter-widget']
});
// Define popup buttons.
$.extend($.FroalaEditor.DEFAULTS, {
  popupButtons: ['popupClose', '|', 'submitTweet'],
});

// The custom popup is defined inside a plugin (new or existing).
$.FroalaEditor.PLUGINS.yTwitter = function (editor) {
  // Create custom popup.
  function initPopup () {

    // Popup buttons.
    var popup_buttons = '';

    // Create the list of buttons.
    if (editor.opts.popupButtons.length > 1) {
      popup_buttons += '<div class="fr-buttons">';
      popup_buttons += editor.button.buildList(editor.opts.popupButtons);
      popup_buttons += '</div>';
    }
    console.log(editor);
    // Load popup template.
    var template = {
      buttons: popup_buttons,
      custom_layer: '<div class="froala-popup froala-tweet-popup" style="width: 280px; padding: 5px;">\
      <h6 style="text-align: center;">\
      <span data-text="true">Insert Tweet</span>\
      </h6>\
      <div class="f-popup-line">\
      <textarea placeholder="Embedded code" class="twitter-textarea" id="f-tweet-textarea-' + editor.id + '"></textarea>\
      </div>\
      <div class="f-popup-line">\
      <span data-text="true">\
        <a target="_blank" href="https://support.twitter.com/articles/20169559">\
        <i class="fa fa-question-circle"></i> How to embed a Tweet</a>\
      </span>\
      </div></div>'
    };

    // Create popup.
    var $popup = editor.popups.create('yTwitter.popup', template);


    return $popup;
  }

  // Show the popup
  function showPopup () {

    // Get the popup object defined above.
    var $popup = editor.popups.get('yTwitter.popup');

    // If popup doesn't exist then create it.
    // To improve performance it is best to create the popup when it is first needed
    // and not when the editor is initialized.
    if (!$popup) $popup = initPopup();
    console.log($popup);
    // Set the editor toolbar as the popup's container.
    editor.popups.setContainer('yTwitter.popup', editor.$tb);

    // If the editor is not displayed when a toolbar button is pressed, then set BODY as the popup's container.
    // editor.popups.setContainer('customPlugin.popup', $('body'));

    // Trigger refresh for the popup.
    // editor.popups.refresh('customPlugin.popup');

    // This custom popup is opened by pressing a button from the editor's toolbar.
    // Get the button's object in order to place the popup relative to it.
    var $btn = editor.$tb.find('.fr-command[data-cmd="embedtweet"]');

    var $tweet_wrapper = editor.$tb.find('textarea#f-tweet-textarea-' + this.id);

    console.log($tweet_wrapper);

    // Compute the popup's position.
    var left = $btn.offset().left + $btn.outerWidth() / 2;
    var top = $btn.offset().top + (editor.opts.toolbarBottom ? 10 : $btn.outerHeight() - 10);

    // Show the custom popup.
    // The button's outerHeight is required in case the popup needs to be displayed above it.
    editor.popups.show('yTwitter.popup', left, top, $btn.outerHeight());
  }

  // Hide the custom popup.
  function hidePopup () {
    editor.popups.hide('yTwitter.popup');
  }

  function getTweet (val){
    // var twitterContainer = editor.popups.get('yTwitter.popup'),
    // c = twitterContainer.find("textarea#f-tweet-textarea-"+editor.id);
    var tweet = false;
    // var val = c.val();
    var vp = $.FroalaEditor.TWEET_PROVIDERS;
    if (vp.test_regex.test(val) && vp.test_tags.test(val)) {
      console.log('test');
      tweet = vp.html.replace(/\{data}/, val);
    }else{
      c.val('');
    }
    return tweet;
  }

  function checkTweet(val){
    var vp = $.FroalaEditor.TWEET_PROVIDERS;
    if (vp.test_regex.test(val) && vp.test_tags.test(val)) {
      setTimeout(function(){ 
        $.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
      }, 300);
    }
  }

  // Methods visible outside the plugin.
  return {
    showPopup: showPopup,
    hidePopup: hidePopup,
    getTweet: getTweet,
    checkTweet: checkTweet
  }
}

// Define an icon and command for the button that opens the custom popup.
$.FroalaEditor.DefineIcon('embedtweet', { NAME: 'twitter'});
$.FroalaEditor.RegisterCommand('embedtweet', {
  title: 'Show Popup',
  undo: false,
  focus: false,
  plugin: 'yTwitter',
  callback: function () {
    this.yTwitter.showPopup();
  }
});

// Define custom popup close button icon and command.
$.FroalaEditor.DefineIcon('popupClose', { NAME: 'times' });
$.FroalaEditor.RegisterCommand('popupClose', {
  title: 'Close',
  undo: false,
  focus: false,
  callback: function () {
    this.yTwitter.hidePopup();
  }
});

// Define custom popup 1.
$.FroalaEditor.DefineIcon('submitTweet', { NAME: 'check-circle' });
$.FroalaEditor.RegisterCommand('submitTweet', {
  title: 'Submit',
  undo: false,
  focus: false,
  callback: function () {
    // console.log(this.popups.get('yTwitter.popup'));
    var twitterContainer = this.popups.get('yTwitter.popup'),
    c = twitterContainer.find("textarea#f-tweet-textarea-"+this.id);
    var val = c.val();
    var t = this.yTwitter.getTweet(val);
    if(t){
      this.html.insert(t);
      // setTimeout(function(){ 
      //   $.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
      // }, 300);
      $('.twitter-textarea').val('');
;    }
    this.undo.saveStep();
    this.yTwitter.hidePopup();
    
  }
});



})(jQuery);
