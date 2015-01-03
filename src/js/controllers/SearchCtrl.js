angular.module('scg.controller').controller('SearchCtrl',
        function($scope, $stateParams, $http, BASE_HOST) {
    'use strict';

    $scope.page = 1;

    function search() {
        $http.get(BASE_HOST + '/search', {params: {
                q: $stateParams.query,
                p: $scope.page,
            }}).
            success(function(response) {
                $scope.games = response.games;
                $scope.page = response.page;
                $scope.count = response.count;
            });
    }

    $scope.nextPage = function() {
        $scope.page = $scope.page + 1;
        search();
    }

    search();
});
