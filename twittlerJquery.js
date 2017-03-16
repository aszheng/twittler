//original code - annotated
$(document).ready(function(){
  var $body = $('body');
  // this make sure body is cleared every time DOM is loaded
  // $body.html(''); 

  //tweetStream is a new <div> inside body
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
      //create anchor tags on users (for returning user's tweets later)
      var $tweetUser = $('<a></a>');
      $tweetUser.text('@' + tweetUser);
      //create class with user's username (for returning user's tweets later)
      $tweetUser.addClass(tweetUser);

      //text for each tweet being manipulated in DOM using jQuery
      $tweet.append($tweetUser);
      $tweet.append(': ' + tweet.message);
      $tweet.addClass('tweet');

// ** 2) Display the timestamps of when the tweets were created. This timestamp should reflect the actual time the tweets were created, and should not just be hardcoded.
            
      //create new <div> elem inside of $tweet to store in new line                              
      var $timeStamp = $('<div></div>');
      //use tweet's property "tweet.created_at"          
      $timeStamp.text(tweet.created_at);
      $timeStamp.addClass('timeStamp');
      $timeStamp.appendTo($tweet);          

      //tweet being appended to tweetStream
      $tweet.appendTo($tweetStream);
      index -= 1;
    }          
  };

  //call tweetRefresh to preload tweets
  tweetRefresh();

  //autofeed every 10 seconds 
  setInterval(function () {
    $tweetStream.html('');
    tweetRefresh();
  }, 10000);

// ** 1) Show the user new tweets somehow. (You can show them automatically as they're created, or create a button that displays new tweets.)
        
  // create "Home" button (will use to return to feed after clicking on username later on)
  var $homeButton = $('<button></button>');
  $homeButton.text('Home Button');
  $homeButton.addClass('homeButton');
  $homeButton.insertAfter($('h1'));

  // use event delegation on.('click','button', func) to get one new tweets
  // tweets being added automatically. index is increasing
  $($body).on('click', '.homeButton', function () {
    //clear tweetStream
    $tweetStream.html('');

    //return fresh copy of tweetStream with new tweets
    tweetRefresh();     
  });     

// ** 3) Design your interface so that you want to look at and use the product you're making.
  //created link in HTML head for external css stylesheet

// ** 4) Allow the user to click on a username to see that user's timeline.
        
  //FIXED ISSUE - where click doesn't work after Home is clicked/refreshed
  //must listen to the DOM itself, because jQuery selector returns element when DOM is first created
  
  $(document).on('click', 'a', function () {
    //save user's name. this refers to 'a'
    var username = $(this).attr('class'); 

    //clears tweetStream 
    $tweetStream.html('');

    //For reference to see if while loop runs.
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
      
      var $timeStamp = $('<div></div>');
      $timeStamp.text(tweet.created_at);
      $timeStamp.addClass('timeStamp');
      $timeStamp.appendTo($tweet);          

      $tweet.appendTo($tweetStream);
      newindex -= 1;
    }
  }); 
}); // end of $(document).ready(); function 


//**code create own tweet** for extra credit later
// var newTweet = {};
// newTweet.message = 'HIIIIIII';
// newTweet.user = 'mracus';
// var $newTweet = $('<div></div>');
// $newTweet.text('@' + newTweet.user + ': ' + newTweet.message);
// $newTweet.appendTo($body);