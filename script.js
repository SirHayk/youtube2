/* YOUTUBE */
var videoduration;
var intervalrunning = false;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    width: '720',
    height: '480',
    wmode: 'opaque',
    videoId: '1rPxiXXxftE',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      showinfo: 0 ,
      modestbranding: 1,
      wmode: "opaque"
    },
  });
}

function onPlayerReady(event) {
  videoduration = getLength();
  window.setInterval(youtubetimeupdate, 60);
  function youtubetimeupdate() {
    if(intervalrunning) {
      var time_update = player.getCurrentTime();
      var playing = player.getPlayerState();
      if (playing==1) {
        var playedpercent = (time_update / videoduration) * 100;
        var percentofcircle = (360 / 100) * playedpercent;
        rotateWhilePlaying(percentofcircle);
      }
    }
  }
}

function onPlayerStateChange(event) {
  if(event.data === 0) {          
    //alert('done');
    intervalrunning = false;
  }
}

function playVideo() {
  player.playVideo();
}

function stopVideo() {
  player.stopVideo();
}

function pauseVideo() {
  player.pauseVideo();
}

function playerSeekTo(seconds) {
  player.seekTo(seconds);
}

function getLength() {
  return(player.getDuration());
}

function ontimeupdate() {
}

function calculateVideoFrame(lastangle) { 
  var percentage = (lastangle/360) * 100;;
  var seconds = (percentage / 100) * videoduration;
  playerSeekTo(seconds);
  playVideo();
  intervalrunning = true;
}

function rotateWhilePlaying(percentofcircle) {
  var deg = percentofcircle;
  var css = 'rotate(' + deg + 'deg)';
  document.getElementById('knob').style.transform = css; 
}

function threeSixtyRoation(wrapper, xcor, ycor, knob) {

  var x = xcor - wrapper.offset().left - wrapper.width()/2;
  var y = -1*(ycor - wrapper.offset().top - wrapper.height()/2);
  var theta = Math.atan2(y,x)*(180/Math.PI); 
  var deg = 180 - theta;

  var css = 'rotate(' + deg + 'deg)';
  knob.css({
    'transform' : css, 
    '-webkit-transform': css
  });
  $('body').on('mouseup', function(event) {
    calculateVideoFrame(deg);
    $('body').unbind('mousemove');
  });
}

$(document).ready(function() {        
  $('.knob').on('mousedown', function() {
    pauseVideo();
    intervalrunning = false;
    $('body').on('mousemove', function(event) {
      threeSixtyRoation($('.videocontainer'), event.pageX,event.pageY, $('.knob'));   
    });
  });    
});