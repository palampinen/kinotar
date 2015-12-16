  angular.module('starter.services', [])

  .value('corsURL', 'http://cors-anywhere.herokuapp.com/') 
  .value('APIURL',  'http://www.finnkino.fi/xml/')
  .value('IMDBURL', 'http://www.omdbapi.com/')



/*
* Finnkino API for movies
* http://www.finnkino.fi/xml/
*/


  .factory('Movies', function ($http, $q, APIURL) {
    
    return {
      get: function(areaid,date) {
        var deferred = $q.defer(),
            today = new Date();
        $http.get(APIURL+'Schedule',{
          params:{
            area:areaid,
            dt: date
          }
        }).success( function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      },
      event: function(eventid) {
        var deferred = $q.defer();
        $http.get(APIURL+'Events',{
          params:{
            eventID:eventid
          }
        }).success( function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      },
      areas: function() {
        var deferred = $q.defer();
        $http.get(APIURL+'TheatreAreas',{
          // no params
        }).success( function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      }
    }


  })

/*
* OMDb API for IMDB 
* http://www.omdbapi.com/'
*/

 .factory('Rating', function ($http, $q,corsURL,IMDBURL) {
    
    return {
      get: function(movie) {
        var deferred = $q.defer();
        $http.get(corsURL+IMDBURL,{
          params:{
            t:movie,
            y:'',
            plot:'short',
            r:'json'
          }
        }).success( function(data){
          deferred.resolve(data)
        })
        return deferred.promise;
      }
    }


  })


