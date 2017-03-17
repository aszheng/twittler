$(document).ready(function(){
  var $body = $('body');

  //create new tweetStream <div> inside body
  var $tweetStream = $('<div></div>');
  $tweetStream.addClass('tweetStream');
  $tweetStream.appendTo($body);

  var tweetRefresh = function (){
  //var index - tells u how many objs are in home stream 
    var index = streams.home.length - 1;
    while(index >= 0){
      var tweet = streams.home[index];
      var $tweet = $('<div></div>');

      var tweetUser = tweet.user;
      //create anchor tags on users (for returning user's tweets)
      var $tweetUser = $('<a></a>');
      $tweetUser.text('@' + tweetUser);
      //create class with user's username (for returning user's tweets)
      $tweetUser.addClass(tweetUser);

      //populating indivdual tweet/ manipulating DOM
      $tweet.append($tweetUser);
      $tweet.append(': ' + tweet.message);
      $tweet.addClass('tweet');
            
      //create new <time> elem inside of <div> to store in new line                              
      var $timeStampDiv = $('<div></div>')
      var $timeStamp = $('<time></time>');
      //use tweet's property "tweet.created_at". convert to ISO time format for timeago          
      $timeStamp.text(tweet.created_at.toISOString());
      $timeStamp.addClass('timeago');
      //add attr for timeago. convert to ISO time format for timeago
      $timeStamp.attr('datetime', tweet.created_at.toISOString());            
      $timeStamp.appendTo($timeStampDiv);          
      $timeStampDiv.appendTo($tweet);   

      //tweet appended to tweetStream
      $tweet.appendTo($tweetStream);
      index -= 1;

      //call timeago jQuery plugin
      $(".timeago").timeago();
    }          
  };

  //call tweetRefresh to preload tweets
  tweetRefresh();

  //autofeed every 10 seconds 
  setInterval(function () {
    $tweetStream.html('');
    tweetRefresh();
  }, 10000);
        
  // use event delegation on.('click','.homeButton', func) to get new tweets
  $($body).on('click', '.homeButton', function () {
    //clear $tweetStream
    $tweetStream.html('');
    //return fresh copy of $tweetStream with new+old tweets
    tweetRefresh();     
  });     
        
  //FIXED ISSUE - where click doesn't work after Home is clicked/refreshed
  //must listen to the DOM itself, because jQuery selector returns element when DOM is first created
  $(document).on('click', 'a', function () {
    //save user's name. this refers to 'a' anchor tags
    var username = $(this).attr('class'); 

    //clears $tweetStream 
    $tweetStream.html('');

    //for reference to see if below while loop runs.
    var $tweetStreamCount = $('<p></p>')
    $tweetStreamCount.text('@' + username + ' Tweets : ' + streams.users[username].length);
    $tweetStreamCount.addClass('tweetStreamCount');
    $tweetStreamCount.prependTo($tweetStream);

    //shows only user's tweets by accessing stream.users array of tweet objects. Using While loop like above 
    var newindex = streams.users[username].length - 1;
    while(newindex >= 0){
      var tweet = streams.users[username][newindex];
      var $tweet = $('<div></div>');

      var tweetUser = tweet.user;
      var $tweetUser = $('<a></a>');
      $tweetUser.text('@' + tweetUser);
      $tweetUser.addClass(tweetUser);
      
      $tweet.append($tweetUser);
      $tweet.append(': ' + tweet.message);
      $tweet.addClass('tweet');
      
      var $timeStampDiv = $('<div></div>')      
      var $timeStamp = $('<time></time>');
      $timeStamp.text(tweet.created_at.toISOString());
      $timeStamp.addClass('timeago');
      $timeStamp.attr('datetime', tweet.created_at.toISOString());            
      $timeStamp.appendTo($timeStampDiv);          
      $timeStampDiv.appendTo($tweet);       

      $tweet.appendTo($tweetStream);
      newindex -= 1;

      $(".timeago").timeago();
    }
  }); 


  //on click handler for submit button - referencing <form>
  $('.newTweetForm').on('submit', function (e) {
    e.preventDefault(); 
    var newUser = $('.usernameInput').val();
    var newMesg = $('.tweetInput').val();
    // console.log('newUser:', newUser);
    // console.log('newMesg:', newMesg);

    var newTweet = {}
    //save user from usernameInput
    newTweet.user = newUser;
    //save tweet from tweetInput
    newTweet.message = newMesg;
    //save tweet.created_at by calling new Date()
    newTweet.created_at = new Date();

    //if user is new to the stream (not in streams.users)
    if (!(newTweet.user in streams.users)) {
      var newUser = newTweet.user;
      //create empty array for user
      streams.users[newUser] = [];
    }

    //push newTweet obj to streams using addTweet(newTweet obj) function
    addTweet(newTweet);

    //reset input boxes
    $('.usernameInput').val('');
    $('.tweetInput').val('');

    $tweetStream.html('');
    tweetRefresh(); 
  });
});