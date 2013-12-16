// Randomise function for later
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

document.addEventListener("DOMContentLoaded", function () {

 // Create a popcorn instance by calling the Youtube player plugin
 var video = Popcorn.youtube(
   '#video-player',
   'http://youtu.be/jRfvt2OUbBc' );

 // add a footnote at 2 seconds, and remove it at 6 seconds
 video.footnote({
   start: 2,
   end: 6,
   text: "Pop!",
   target: "video-popover"
 });

 // play the video right away
 video.play();

}, false);