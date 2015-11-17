var game = {
  allTracks:[],
  track:null,
  selectedTracks:[],
  countCorrect:0,

  init:function (){

    $(".playlist-item").click(function(){
      sessionStorage.playlistID = $(this).data('id');
      game.getListsTracks();
      
    });

    $('.record-play').click(game.playTrack);

    $('.record-pause').click(game.pauseTrack);


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

          var allTracks = response.items;
          // REMOVE TRACKS WITH NO PREVIEW
          // for (var i = 0; i < allTracks.length; i++) {
          //   if(allTracks[i].track.preview_url === null){

          //   }
          // };

          // console.log(allTracks.length);
          allTracks = jQuery.grep(allTracks, function(value) {
            return value.track.preview_url !== null;
          });
          // console.log(allTracks.length);
          var randTrack;

          

          for (var i = 0; i < 10; i++) {
            randTrack = allTracks[Math.floor(Math.random() * allTracks.length)];
            allTracks = jQuery.grep(allTracks, function(value) {
              return value != randTrack;
            });

            game.selectedTracks.push(randTrack);
          };
          game.allTracks = allTracks;
          

          game.loadNewRound();
  
        },
        complete: function(response){
          // console.log(response);
        }
    });
  },
  loadNewRound:function(){
    if(game.selectedTracks <= 0){
      var data = {
        count: game.countCorrect
      };
      var gameoverSource = document.getElementById('gameover-template').innerHTML,
          gameoverTemplate = Handlebars.compile(gameoverSource),
          gameoverPlaceholder = document.getElementById('answer');
      gameoverPlaceholder.innerHTML = gameoverTemplate(data);
      $('.answer').show();
      $('.gameover-btn').click(game.initNewGame);
    }else{
      $(".record-loading").removeClass('is-hidden');
      $(".record_button").addClass('is-hidden');

      var randTrack = game.selectedTracks[Math.floor(Math.random() * game.selectedTracks.length)];
      var artists= randTrack.track.artists;
      //REMOVE TRACK FROM ARRAY
      var randTrack2 = game.randTrack();
      var artists2 = randTrack2.track.artists;

      var randTrack3 = game.randTrack();
      var artists3 = randTrack3.track.artists;


      var artistArray = [];
      for (var i = 0; i < artists.length; i++) {
        artistArray.push(artists[i].id);
      };
      var artistArray2 = [];
      for (var i = 0; i < artists2.length; i++) {
        artistArray2.push(artists2[i].id);
      };
      var artistArray3 = [];
      for (var i = 0; i < artists3.length; i++) {
        artistArray3.push(artists3[i].id);
      };


      if($(artistArray).not(artistArray2).length === 0 || $(artistArray2).not(artistArray).length === 0){
        var check = false;
        // debugger;
        while(check === false){
          randTrack2 = game.randTrack();
          artists2 = randTrack2.track.artists;
          artistArray2 = [];
          for (var i = 0; i < artists2.length; i++) {
            artistArray2.push(artists2[i].id);
          };
          check = game.checkUniqueArtists(artistArray, artistArray2);
        }
      }

      if( $(artistArray).not(artistArray3).length === 0 || $(artistArray3).not(artistArray).length === 0 || $(artistArray2).not(artistArray3).length === 0 || $(artistArray3).not(artistArray2).length === 0 ){
        var check = false;
        // debugger;
        while(check === false){
          randTrack3 = game.randTrack();
          artists3 = randTrack3.track.artists;
          artistArray3 = [];
          for (var i = 0; i < artists3.length; i++) {
            artistArray3.push(artists3[i].id);
          };
          check = game.checkUniqueArtists2(artistArray, artistArray2, artistArray3);
        }
      }
      
      console.log();
      //CHECK SO NOT THE SAME ARTIST

      if(game.track == null){
        game.track = new Audio(randTrack.track.preview_url);
      }else{
        game.track.setAttribute('src',randTrack.track.preview_url);
      }
      

      game.track.addEventListener("canplay", function(){
        console.log("can play");
        $(".record-play").removeClass('is-hidden');
        $(".record-loading").addClass('is-hidden');
        
      });
      game.track.addEventListener("ended", function(){
        $('.record-play').addClass('is-hidden');
        $('.record-pause').addClass('is-hidden');
        $('.record_canvas').removeClass('is-playing');
      });

      var options ={
        items: []
      }

      var items = [
          {
            answer: true,
            artists: game.writeOutArtists(randTrack.track),
            track: randTrack.track.id,
          },
          {
            answer: false,
            artists: game.writeOutArtists(randTrack2.track),
            track: randTrack2.track.id
          },
          {
            answer: false,
            artists: game.writeOutArtists(randTrack3.track),
            track: randTrack3.track.id
          }
        ];

      // Writes them out randomly
      for (var i = 0; i < 3; i++) {
        var index = Math.floor(Math.random() * items.length);

        options.items.push(items[index]);

        if (index > -1) {
          items.splice(index, 1);
        }
      };
        
        
      var choiceSource = document.getElementById('choice-template').innerHTML,
          choiceTemplate = Handlebars.compile(choiceSource),
          choicePlaceholder = document.querySelector('.choice');
      choicePlaceholder.innerHTML = choiceTemplate(options);

      $('.choice-item').click(function(){
        game.checkAnwser($(this));
      });

    }
    
  },
  initNewGame:function(){
    game.allTracks=[];
    game.track=null;
    game.selectedTracks=[];
    game.countCorrect=0;

    $('.answer').hide();

    $('.page-view').removeClass('is-active');
    $('.page-list').addClass('is-active');


  },
  randTrack:function(){
    return game.allTracks[Math.floor(Math.random() * game.allTracks.length)];
  },
  checkUniqueArtists:function(artist, artist2){
    if($(artist).not(artist2).length === 0 && $(artist2).not(artist).length === 0){
      return false;
    }else{
      return true;
    }

  },
  checkUniqueArtists2:function(artists, artists2, artists3){
    if( ($(artists).not(artists3).length === 0 && $(artists3).not(artists).length === 0) && ($(artists2).not(artists3).length === 0 && $(artists3).not(artists2).length === 0) ){
      return false;
    }else{
      return true;
    }

  },
  writeOutArtists:function(track){
    var artists = track.artists[0].name;

    if(track.artists.length > 1){
      for (var i = 1; i < track.artists.length; i++) {
        artists += ", " + track.artists[i].name;
      };
    }
    
    return artists;
  },
  playTrack:function(){ 
    $('.record_canvas').addClass('is-playing');
    $('.record-play').addClass('is-hidden');
    $('.record-pause').removeClass('is-hidden');
    game.track.play();
  },
  pauseTrack:function(){
    $('.record_canvas').removeClass('is-playing');
    $('.record-play').removeClass('is-hidden');
    $('.record-pause').addClass('is-hidden');
    game.track.pause();
  },
  checkAnwser:function(that){
    var answer = $(that).data('answer');

    var newList = [];
    var currentID = $('.choice-item[data-answer=true]').data('trackid');
    for (var i = 0; i < game.selectedTracks.length; i++) {
      if(game.selectedTracks[i].track.id != currentID){
        newList.push(game.selectedTracks[i]);
      }
    };
    game.selectedTracks = newList;

    if(answer === true){
      game.correctAnswer();
    }else{
      game.wrongAnswer();
    }

    // Removes track from selected tracks
    // game.selectedTracks = jQuery.grep(game.selectedTracks, function(value) {
    //   if(value.track.id != $(that).data('trackID')){
    //     return value;
    //   }
      
    // });
    

    console.log(game.selectedTracks.length);

    $('.answer').show();
    $('.answer-btn').click(function(){
      $('.answer').hide();
      game.loadNewRound();
    });

    game.pauseTrack();
  },
  correctAnswer:function(){
    game.countCorrect++;
    var data = {
      message: "Congratz, you were right!",
      answer: $('.choice-item[data-answer=true]').html(),
      class: 'correct',
      count: Math.abs(game.selectedTracks.length-10)
    }

    var answerSource = $('#answer-template').html(),
        answerTemplate = Handlebars.compile(answerSource),
        answerPlaceholder = document.getElementById('answer');
    answerPlaceholder.innerHTML = answerTemplate(data);

    
  },
  wrongAnswer:function(){
    var data = {
      message: "Sorry, not the correct answer",
      answer: $('.choice-item[data-answer=true]').html(),
      class: 'wrong',
      count: Math.abs(game.selectedTracks.length-10)
    }

    var answerSource = $('#answer-template').html(),
        answerTemplate = Handlebars.compile(answerSource),
        answerPlaceholder = document.getElementById('answer');
    answerPlaceholder.innerHTML = answerTemplate(data);

  },

};
