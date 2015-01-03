angular.module('scg.filter', [
]);

angular.module('scg.filter').filter('nl2br', function ($sce) {
    'use strict';

    return function(input) {
        return $sce.trustAsHtml((input + "").replace(/\n/g, '<br />'));
    };
});
