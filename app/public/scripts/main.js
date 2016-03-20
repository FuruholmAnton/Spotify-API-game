Handlebars.registerHelper('each', function(context, options) {
  var ret = "";

  for(var i=0, j=context.length; i<j; i++) {
    ret = ret + options.fn(context[i]);
  }

  return ret;
});
Handlebars.registerHelper('list', function(context, options) {
  
  if(context.length>1){
    var ret = "<ul>";
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + "<li>" + options.fn(context[i]) + "</li>";
    }

    return ret + "</ul>";
  }else{
    return 'Make a playlist public to see it here';
  }
  
});

$( document ).ready(function() {


        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }


        var playlistSource = document.getElementById('playlist-template').innerHTML,
            playlistTemplate = Handlebars.compile(playlistSource),
            playlistPlaceholder = document.getElementById('playlist');

        

        var params = getHashParams();

        if(params == null || 'undefiend'){
          $('.page-view').removeClass('is-active');
          $('.page-home').addClass('is-active');
        }
        

        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;

        sessionStorage.access_token = access_token;

        if (error) {
          alert('There was an error during the authentication');
          
        } else {
          if (access_token) {
            // render oauth info

            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  // console.log(response);
                  getPlayLists(response.id, access_token);
                  sessionStorage.userID = response.id;
                },
                error: function(response) {
                  
                },
                complete: function(){
                  // $('.is-loading').addClass("is-hidden");
                }
            });
          } else {
              // render initial screen
             
          }
        }

        function getPlayLists(userId, access_token){
          $.ajax({
              url: 'https://api.spotify.com/v1/users/'+userId+'/playlists',
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
              success: function(response) {
                // console.log(response);
                $('.page-view.is-active').removeClass('is-active');
                $('.page-list').addClass('is-active');

                playlistPlaceholder.innerHTML = playlistTemplate(response);

                game.init();
                if($('.playlist-item').length === 0){
                  $('.playlist-empty').show();
                }
              }
          });
        }

        
        

});