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
          // REMOVE TRACKS WITH NO PREVIEW

          var randTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
          //REMOVE TRACK FROM ARRAY
          var randTrack2 = allTracks[Math.floor(Math.random() * allTracks.length)];
          var randTrack3 = allTracks[Math.floor(Math.random() * allTracks.length)];
          
          //CHECK SO NOT THE SAME ARTIST

          track = new Audio(randTrack.track.preview_url);

          track.addEventListener("canplay", function(){
            console.log("can play");
            $(".record-play").removeClass('is-hidden');
            $(".record-loading").addClass('is-hidden');
          });

          var options ={
            items: []
          }

          var items = [
              {
                answer: true,
                artists: game.randTrack(randTrack.track)
              },
              {
                answer: false,
                artists: game.randTrack(randTrack2.track)
              },
              {
                answer: false,
                artists: game.randTrack(randTrack3.track)
              }
            ];
          for (var i = 0; i < 3; i++) {
            var index = Math.floor(Math.random() * items.length);

            options.items.push(items[index]);

            if (index > -1) {
              items.splice(index, 1);
            }
          };
            
          console.log(options);
          game.insertRand(items);
            
          var choiceSource = document.getElementById('choice-template').innerHTML,
              choiceTemplate = Handlebars.compile(choiceSource),
              choicePlaceholder = document.querySelector('.choice');
          choicePlaceholder.innerHTML = choiceTemplate(options);
  
        },
        complete: function(response){
          // console.log(response);
        }
    });
  },
  randTrack:function(track){
    var artists = "";
    for (var i = 0; i < track.artists.length; i++) {
      artists += track.artists[i].name + " ";
    };
    return artists;
  },
  insertRand:function(items){
    // var index = Math.floor(Math.random() * items.length);

    // var item = items[randNo];

    // if (index > -1) {
    //   array.splice(index, 1);
    // } 

    // console.log(items.indexof(item));

    // // var options.items.push(  );
  },
  playTrack:function(){ 
    track.play();
  },
  pauseTrack:function(){
    track.pause();
  }

};
