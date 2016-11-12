//*****************************************************************************************************************
// Copyright 2016 Chanthu Oeur. All rights reserved.
// You may not copy, reproduce, republish, disassemble, decompile, reverse engineer, post, broadcast, transmit, or
// make available to the public any content or code on this website without prior written permission from Chanthu Oeur.
//*****************************************************************************************************************

'use strict';

var ctl = angular.module('WikiController', ['Resources']);

ctl.controller('WikiSearchCtrl', function ($sce, $scope, $routeParams, $location,
  LogResource, WikiResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  $scope.search = 'Cambodia';
  search();

  function search() {
    WikiResource.Get({
      srsearch: $scope.search,
      action: 'query',
      list: 'search',
      srlimit: 100,
      format: 'json'
    }).$promise.then(function (data) {
      $scope.info = data.query.search;
    });
  }

  function getPageId(pages) {
    for (var pageId in pages) {
      return pageId;
    }
  }

  $scope.goSearch = function ($event) {
    var keypressed = $event.keyCode || $event.which;
    if (keypressed == 13) {
      search();
    }
  }

  $scope.clickSearch = function () {
    search();
  }
});

ctl.controller('WikiExtractCtrl', function ($sce, $scope, $routeParams, $location,
  LogResource, WikiResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  $scope.title = $routeParams.title;

  WikiResource.Get({
    titles: $routeParams.title,
    action: 'query',
    prop: 'extracts',
    format: 'json'
  }).$promise.then(function (data) {
    var pageId = getPageId(data.query.pages);
    var extract = data.query.pages[pageId].extract;
    if (!extract) {
      $scope.msg = 'No extract found for: ' + $routeParams.title;
      return;
    }
    $scope.msg = 'Extract for: ' + $routeParams.title;
    $scope.info = $sce.trustAsHtml(extract);
  });

  function getPageId(pages) {
    for (var pageId in pages) {
      return pageId;
    }
  }
});

ctl.controller('WikiCommonsCtrl', function ($sce, $scope, $routeParams, $location,
  LogResource, WikiCommonsResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  $scope.title = $routeParams.title;

  WikiCommonsResource.Get({
    titles: $routeParams.title,
    action: 'query',
    prop: 'extracts',
    format: 'json'
  }).$promise.then(function (data) {
    var pageId = getPageId(data.query.pages);
    var extract = data.query.pages[pageId].extract;
    if (!extract) {
      $scope.msg = 'No extract found for: ' + $routeParams.title;
      return;
    }
    $scope.msg = 'Extract for: ' + $routeParams.title;
    $scope.info = $sce.trustAsHtml(extract);
  });

  function getPageId(pages) {
    for (var pageId in pages) {
      return pageId;
    }
  }
});

ctl.controller('WikiLinkCtrl', function ($sce, $scope, $routeParams, $location,
  LogResource, WikiResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  WikiResource.Get({
    titles: $routeParams.title,
    action: 'query',
    prop: 'links',
    format: 'json'
  }).$promise.then(function (data) {
    var pageId = getPageId(data.query.pages);
    //$scope.info = data.query.pages[pageId].links;
  });

  function getPageId(pages) {
    for (var pageId in pages) {
      return pageId;
    }
  }
});

ctl.controller('WikiComImageCtrl', function ($sce, $scope, $routeParams, $location,
  LogResource, WikiCommonsResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  getImage($routeParams.title, function(title, imginfo) {
    $scope.item = {
      title: title
    }

    if (imginfo) {
      $scope.item.url = imginfo.url;
      $scope.item.thumburl = imginfo.thumburl;

      if (imginfo.extmetadata) {
        var desc = imginfo.extmetadata.ImageDescription;
        var artist = imginfo.extmetadata.Artist;
        var lic = imginfo.extmetadata.LicenseShortName;
        var use = imginfo.extmetadata.UsageTerms;
        var licurl = imginfo.extmetadata.LicenseUrl;

        if (desc) {
          $scope.item.desc = trust(desc.value);
        }
        if (artist) {
          $scope.item.artist = trust(artist.value);
        }
        if (lic) {
          $scope.item.lic = trust(lic.value);
        }
        if (use) {
          $scope.item.use = trust(use.value);
        }
        if (licurl) {
          $scope.item.licurl = trust(licurl.value);
        }
      }
    }
  });

  function trust(html) {
    if (!html) {
      return;
    }https://localhost:4000/wiki/commons?title=User:Rdghalayini&action=edit&redlink=1

    html = html.replace('https://en.wikipedia.org', '')
    .replace('https://commons.wikimedia.org/wiki/', '/wiki/commons/')
    .replace('//commons.wikimedia.org/wiki/', '/wiki/commons/')
    .replace('//commons.wikimedia.org/w/index.php', '/wiki/commons')
    .replace('&amp;action=edit&amp;redlink=1', '')
    .replace('?title=', '/')
    return $sce.trustAsHtml(html);
  }

  function getImage(title, callback) {
    WikiCommonsResource.Get({
      titles: title,
      action: 'query',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: 900,
      format: 'json'
    }).$promise.then(function (data) {
      var pages = data.query.pages;
      var pageId = getPageId(pages, 0);
      var imginfo = pages[pageId].imageinfo;
      if (imginfo) {
        return callback(title, imginfo[0]);
      } else {
        return callback();
      }
    });
  }

  function getPageId(pages, index) {
    var i = 0;
    for (var pageId in pages) {
      if (i == index) {
        return pageId;
      } else {
        i++;
      }
    }
  }
});

ctl.controller('WikiImageCtrl', function ($sce, $scope, $routeParams, $location,
  LogResource, WikiResource, WikiCommonsResource, WikiExcludeResource) {
  LogResource.Post({
    'path': $location.$$path
  });

  /*WikiResource.Get({
    pageids: 334751,
    action: 'query',
    prop: 'images',
    format: 'json',
    imlimit: 500
  }).$promise.then(function (data) {
    //$scope.info = data.query.pages[334751].images;
  });*/

  $scope.title = $routeParams.title;

  WikiExcludeResource.Get().$promise.then(function (data) {
    loadData(data.list);
  });

  function loadData(exclude) {
    WikiResource.Get({
      titles: $routeParams.title,
      action: 'query',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: 250,
      generator: 'images',
      format: 'json',
      gimlimit: 100
    }).$promise.then(function (data) {
      if (!data.query) {
        $scope.msg = 'No images found for: ' + $routeParams.title;
        return;
      }
      $scope.msg = 'Images for: ' + $routeParams.title;
      $scope.info = [];
      var pages = data.query.pages;
      var i = 0;
      for (var x in pages) {
        var pageId = getPageId(pages, i);
        var page = pages[pageId];
        if (exclude.indexOf(page.title) > -1) {
          i++;
          continue;
        }
        if (page.imageinfo) {
          var item = {
            title: page.title,
            url: page.imageinfo[0].url,
            thumburl: page.imageinfo[0].thumburl
          };
          $scope.info.push(item);
        } else {
          getImage(page.title, function(title, imginfo) {
            if (imginfo) {
              var item = {
                title: title,
                url: imginfo.url,
                thumburl: imginfo.thumburl
              };
              $scope.info.push(item);
            }
          });
        }
        i++;
      }
    });
  }

  $scope.hide = function(index) {
    var key = 'wiki_image_exclude';
    var title = $scope.info[index].title;
    var o = {list: []};
    var a = localStorage.getItem(key);
    if (a) {
      o = JSON.parse(a);
    }
    if (o.list.indexOf(title) == -1) {
      o.list.push(title);
      localStorage.setItem(key, JSON.stringify(o));
    }
    $scope.info.splice(index, 1);
  }

  function getImage(title, callback) {
    WikiCommonsResource.Get({
      titles: title,
      action: 'query',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: 250,
      format: 'json'
    }).$promise.then(function (data) {
      var pages = data.query.pages;
      var pageId = getPageId(pages, 0);
      var imginfo = pages[pageId].imageinfo;
      if (imginfo) {
        return callback(title, imginfo[0]);
      } else {
        return callback(null);
      }
    });
  }

  function getPageId(pages, index) {
    var i = 0;
    for (var pageId in pages) {
      if (i == index) {
        return pageId;
      } else {
        i++;
      }
    }
  }
});
