angular.module('scg.controller', [
]);

angular.module('scg.controller').controller('GameCtrl', function($scope, $stateParams, $http) {
    'use strict';

    $http.get('//api.searchchessgames.dev/game', {params: {
        slug: $stateParams.slug,
    }}).success(function(response) {
        $scope.game = response.game;
    })
});
