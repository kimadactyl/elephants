$(document).ready(function() {

  // Element which contains the videos
  var videoPlayer = new MediaElementPlayer('#video-player', {
    type: ['video/mp4', 'video/webm', 'video/ogg'],
    pauseOtherPlayers: false,
    features: ['playpause', 'fullscreen', 'progress', 'volume']
  });
  var audioPlayer = new MediaElementPlayer('#audio-player', {
    type: ['audio/mp3'],
    pauseOtherPlayers: false,
    features: ['volume']
  });
  // Paths our video and audio is in
  var VPATH = '/video/';
  var APATH = '/audio/';
  // URL base of current video
  var nowplayingurl = '';
  // Current track
  var nowplaying = 0;

  // Randomise function
  $.fn.randomize = function(childElem) {
    return this.each(function() {
        var $this = $(this);
        var elems = $this.children(childElem);
        elems.sort(function() { return (Math.round(Math.random())-0.5); });  
        $this.remove(childElem);  
        for(var i=0; i < elems.length; i++)
          $this.append(elems[i]);      
    });    
  }

  // Randomise when we load
  $("#playlist ol").randomize("li");
  // Randomise on click
  $('button#reset').click(function() {
    $("#playlist ol").randomize("li");
  });

  // Event handlers to sync the video and audio

  var videoElement = $("#video-player")

  // Fades in the text at the end
  videoElement.on(
    "timeupdate", 
    function(event) {
      if(this.currentTime > 170) {
         $("h3#video-popover").fadeIn("slow")
      }
      else {
        $("h3#video-popover").hide()
      } 
  });
  // Volume changes
  videoElement.on(
    "volumechange", 
    function(event) {
      audioPlayer.setVolume(this.volume);
    }
  );
  // Play
  videoElement.on(
    "play", 
    function(event) {
      audioPlayer.play();
    }
  );
  // Pause
  videoElement.on(
    "pause", 
    function(event) {
      audioPlayer.pause();
    }
  );
  // Mute button -- bit hacky, relies on a click event that mejs draws
  $('.mejs-video .mejs-volume-button button').bind('click', function() {
    if($('.mejs-video .mejs-volume-button').hasClass('mejs-mute')) {
      audioPlayer.setMuted(true);
    }
    else {
      audioPlayer.setMuted(false);
    }
  });

  // Video load function
  function updateVideo() {
    nowplayingurl = $("#video-playlist li").eq(nowplaying).attr("movieurl");
    videoPlayer.setSrc([
      { src: VPATH + nowplayingurl + '.mp4', type: 'video/mp4' },
      { src: VPATH + nowplayingurl + '.mp4', type: 'video/ogg' },
      { src: VPATH + nowplayingurl + '.mp4', type: 'video/webm' }
    ]);
  };

  // Audio load function
  function updateAudio() {
    audioPlayer.setSrc(APATH + $("#audio-playlist li").eq(nowplaying).attr("audiourl"));
  }

  // Set caption text for audio function
  function updateCaption() {
    $("h3#video-popover").text(function() {
        return "Audio: " + $("#audio-playlist li").eq(nowplaying).text();
    });
  }

  // Start playing from track 0 (initially)
  updateVideo();
  updateAudio();
  updateCaption();

  // On end of video, load new one
  $("#video-player").bind("ended", function(){
    // Increment playlist
    nowplaying++

    // If playlist finished, reset and make another
    if(nowplaying > 4) {
      // $("#finished").css("display", "block");
      $("#playlist ol").randomize("li");
      nowplaying = 0;
    };

    // Load new content
    updateVideo();
    updateAudio();
  });

  // Click events
  $("#audio-playlist li, #video-playlist li").on("click", function() {
    nowplaying = $(this).index();
    updateVideo();
    updateAudio();
  })

});
