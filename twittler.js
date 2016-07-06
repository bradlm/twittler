$(document).ready(function(){
  var username = null;
  while(username === null) {
    username = prompt('Please provide a username.');
    if(username === null || !/[^\s]+/g.test(username)) {
      alert('Please enter a username containing at least one non-space character.')
    }
  }
  var $body = $('body'),
  show = true,
  targetUser = '';

  //top display function:
  (function displayTweet () {
    let tempStream = streams.home.reverse();
    streams.home = [];
    
    (function recursiveDisplay () {
      function appendShow (tweet) {
        $tweet.appendTo('#tweets').show('fast', () => {
          recursiveDisplay();
        })
      }
      function appendHide (tweet) {
        $tweet.appendTo('#tweets').hide(() => {
          recursiveDisplay();
        })
      }
      if(tempStream.length > 0) {
        let tweet = tempStream.pop();
        $tweet = $('<div class=\'tweet standard-border\' id=\'' + tweet.user + '\' data=\'#' + tweet.user +'\'>' + '<span class=\'user\'>' + '@' + tweet.user + '</span> <span class=\'time\' data=\'' + tweet.created_at.unformatted + '\'>(just now)</span>: ' + tweet.message + ' <span class=\'date\'>[' + tweet.created_at.formatted + ']</span>' + '</div>').hide();
        if(show) {
          appendShow(tweet)
        } else if(targetUser) {
          if(tweet.user === targetUser.slice(1, targetUser.length)) {
            appendShow(tweet)
          } else {
            appendHide(tweet)
          }
        } else {
          appendHide(tweet)
        }
      } else {
        setTimeout(displayTweet, 400)}
    }).call(this);
  }).call(this);

  $('body').on('click', '.user', function () {
    if(show) {
      show = false,
      targetUser = $(this).closest('.tweet').attr('data');
      $('.tweet').filter('.tweet:not(' + targetUser + ')').hide()
      $('#help-div').addClass('user');
      $('#help-div').text('Return to all tweets.');
    } else {
      show = true;
      $('.tweet').filter('.tweet:not(' + targetUser + ')').show()
      targetUser = '';
      $('#help-div').removeClass('user');
      $('#help-div').text('Click a username to see only their tweets.')
    }
  })

  document.getElementById('latest-button').onclick = function() {
    $('html,body').animate({scrollTop: $(document).height() }, 'normal')
  }

  setInterval(function() {
    var timeIndex = $('.time').each(function() {
      let date = new Date($(this).attr('data'));
      $(this).text('(' + moment(date).fromNow() + ')')
    });
  },10000);

  document.getElementById('send-button').onclick = function() {
    var userTweet = {
      user: username,
      message: document.getElementById('textinput').value,
      created_at: {unformatted: new Date(), formatted: getDate(new Date())}
    }
    addTweet(userTweet)
  }
});