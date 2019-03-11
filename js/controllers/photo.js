//*****************************************************************************************************************
// Copyright 2014-2019 Lahuna. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Lahuna.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('PhotoController', ['Resources']);

ctl.controller('PhotoCtrl', function ($scope, $routeParams, $location, PicasaAlbumFeedResource, LogResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  $scope.photos = PicasaAlbumFeedResource.Get({
    'kind': 'photo',
    'start-index': 1,
    'max-results': 50
  });
});
