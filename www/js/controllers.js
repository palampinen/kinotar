angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('PlaylistsCtrl', function($scope,$timeout,Movies,Rating) {
    
    //$scope.today = ['su','ma','ti','ke','to','pe','la'][new Date().getDay()] +' '+ moment().format('D.M.');

    var today = new Date(),
        tmpdate,
        days = [
          {name:'tänään '},
          {name:'huomenna '},
          {name:''},
          {name:''},
          {name:''}
        ];

    $scope.days = _.map(days, function(day,i) {
      tmpdate = new Date().setDate(today.getDate()+i);
      day.date = moment(tmpdate).format('DD.MM.YYYY');
      day.name += ['su','ma','ti','ke','to','pe','la'][new Date(tmpdate).getDay()] + moment(tmpdate).format(' D.M.');
      return day;
    })


    $scope.movieDate = "0";
    $scope.selectedDate = $scope.days[0];
    $scope.setDate = function(date) {
      $scope.movieDate = ''+date;
      $scope.selectedDate = $scope.days[parseInt(date)];
      if($scope.selected)
        $timeout(function(){
          $scope.getMovies($scope.selected);
        });
    } 


    $scope.selected = localStorage.getItem('favoriteArea');

    if(!$scope.selected)
      $timeout(function() {
        $scope.ready=true;
      },2000)

    // Get Areas 
    Movies.areas()
    .then(function(data){
        //todo, limit fields, save to localstorage, use localstorage before ready
        $scope.areas = x2js.xml_str2json(data).TheatreAreas.TheatreArea_asArray;
        if($scope.selected)
          $scope.getMovies($scope.selected)
    });    

    $scope.loading = false;
    $scope.getMovies = function(selected) {
      
      var date = $scope.selectedDate.date;
      $scope.selected = selected;
      localStorage.setItem('favoriteArea', selected);

      $scope.loading = true;
      Movies.get(selected,date)
      .then(function(data){
        var jsonData = x2js.xml_str2json(data);
        var movies = _.groupBy(jsonData.Schedule.Shows_asArray[0].Show_asArray,function(movie){ return movie.Title });
        var newMovies = [],
            last,
            id = 0;
        _.map(movies, function(item,key) {

          last = item[item.length-1];
          newMovies.push({
            name:key,
            data: _.pick(last, 'EventID','ID','OriginalTitle','Title'),
            image: last.Images.EventSmallImageLandscape,
            shows: _.map(item, function(show){ return {time: format(show.dttmShowStart), past: moment(show.dttmShowStart) < moment() } }),
            imdb:0 
          })
        })



        $scope.loading = false;
        $scope.movies = newMovies;

        
        _.each($scope.movies, function(movie) {
          var title = movie.data.OriginalTitle;

          if(title.indexOf('3D')>0)
            title = title.split('3D')[0];
          else if(title.indexOf('(')>0)
            title = title.split('(')[0];
          else if(title.indexOf('-')>0)
            title = title.split('-')[0];
   
          Rating.get(title)
          .then(function(data) {
            movie.imdbID = data.imdbID;
            movie.imdb =  (!data.imdbRating || data.imdbRating == 'N/A') ? 0 : parseFloat(data.imdbRating);
          })
        })
      });
    }

    // movie times
    var format = function(time){
        return moment(time).format('HH:mm')
    }


})

.controller('PlaylistCtrl', function($scope, $timeout, $stateParams, Movies) {
  


      $scope.imdbID = $stateParams.imdbId;
      $scope.eventID = $stateParams.eventId;
      $scope.date = $stateParams.date;
      $scope.areaID = localStorage.getItem('favoriteArea');
      
      $timeout(function() {
        $scope.areaID = localStorage.getItem('favoriteArea')
      },500)

      //$scope.color = {};

      Movies.event($stateParams.eventId)
      .then(function(data){
        $scope.movie = x2js.xml_str2json(data).Events.Event;
        $scope.finnkinoID = $scope.movie.ID;
        $scope.ready=true;
      });



    $scope.play = false;
    $scope.vidplay = function() {
       var video = document.getElementById("video");

       if (!$scope.play) {
          $scope.play = true;
          video.play();
       } else {
          $scope.play = false;
          video.pause();
          
       }
       
    }
    $scope.restart = function() {
        var video = document.getElementById("video");
        video.currentTime = 0;
    }

    $scope.openLink = function(url){
      window.open(url, '_system', 'location=yes')
    }

    /*
    var fullScreen = function(elem){
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    };
    */

});