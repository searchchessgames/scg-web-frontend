angular.module('scg.controller', [
]);

angular.module('scg.controller').controller('GameCtrl',
        function($scope, $stateParams, $http, BASE_HOST) {
    'use strict';

    $http.get(BASE_HOST + '/game', {params: {
        slug: $stateParams.slug,
    }}).success(function(response) {
        $scope.game = response.game;
    })
});
