angular.module('remoteDev', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/netstat', {
                templateUrl: 'partials/netstat.html'
                //,controller: 'NetstatController'
            })
            .otherwise({
                templateUrl: 'partials/home.html'
            });
            
        $locationProvider.html5Mode(true);
    });