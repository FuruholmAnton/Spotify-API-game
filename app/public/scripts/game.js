var game = {
  allTracks:[],
  track:null,

  init:function (){

    $(".playlist-item").click(function(){
      sessionStorage.playlistID = $(this).data('id');
      game.getListsTracks();
      
    });

    $('.record-play').click(function(){
      $('.record_canvas').addClass('is-playing');
      $('.record_button').toggleClass('is-hidden');
      game.playTrack();
    });

    $('.record-pause').click(function(){
      $('.record_canvas').removeClass('is-playing');
      $('.record_button').toggleClass('is-hidden');
      game.pauseTrack();
    });



  },
  getListsTracks:function (){
    $.ajax({
        url: 'https://api.spotify.com/v1/users/'+sessionStorage.userID+'/playlists/'+ sessionStorage.playlistID +'/tracks',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.access_token
        },
        success: function(response) {
          console.log(response);
          $('.page-view.is-active').removeClass('is-active');
          $('.page-game').addClass('is-active');
          allTracks = response.items;

          game.getTrack();
  
        },
        complete: function(response){
          // console.log(response);
        }
    });
  },
  getTrack:function(){
    var randTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
    var trackID = randTrack.track.id;
    $.ajax({
        url: 'https://api.spotify.com/v1/tracks/'+trackID,
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.access_token
        },
        success: function(response) {
          console.log(response);
          track = new Audio(response.preview_url);
          
        },
        complete: function(response){
          // console.log(response);
        }
    });
  },
  playTrack:function(){ 
    track.play();
  },
  pauseTrack:function(){
    track.pause();
  }

};
