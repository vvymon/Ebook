
var app = angular.module('angularApp', ['ui.router','ngResource','ui.bootstrap']);
app.run(function($rootScope, $location, $state, LoginService) {
    $rootScope.$on('$stateChangeSuccess', 
      function(event, to, toParams, from, fromParams){ 
    $rootScope.previousState = from;
    $rootScope.currentState = to;
      });
    
      if(!LoginService.isAuthenticated()) {
        $state.transitionTo('login');
        $rootScope.status="Đăng nhập";
      }
  });



app.factory('LoginService', function() {
    var admin = 'phamthanhhaivy@gmail.com';
    var pass = '123456';
    var isAuthenticated = false;
    
    return {
      login : function(username, password) {
        isAuthenticated = username == admin && password == pass;
        return isAuthenticated;
      },
      isAuthenticated : function() {
        return isAuthenticated;
      }
    };
    
  });
  
app.factory('SachsFactory', function($resource) { 
     return $resource('data/vanhoc1.json');
      });

app.controller('SachController', function($scope,$rootScope,orderBookService,SachsFactory,ModalEditor) {
  $scope.name = 'World'; 
  $scope.statuss=function()
  {
    return $rootScope.status;
  }
  $rootScope.obj=orderBookService;
  $scope.sachtks=SachsFactory.query();
  $rootScope.obj=orderBookService;
        $scope.addToCart = function(book){
          $rootScope.book=book;
          orderBookService.addBooks(book);   
          ModalEditor.openModal();
           console.log($rootScope.obj.totalAmount);
        };
        $scope.addToCart1 = function(book){
          $rootScope.book=book;
          orderBookService.addBooks(book);   
           console.log($rootScope.obj);
        };
  
});

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
// $urlRouterProvider.otherwise('/home');
$stateProvider
.state('home',{
        url: '',
        templateUrl:'MainIndex/ContentIndex.html',
        controller: 'productlistCtrl',
        param :{
          id: null
          
          
        }
    })

.state('vanhoc',{
        url: '/sach/:id',
        templateUrl:'MainIndex/vanhoc.html',
        controller: 'vanhocCtrl',
        param :{
          id: null
          
          
        }
    })
.state('cartpage', {
        url : '/cart',
        templateUrl : 'MainIndex/cart.html',
        controller : 'cartCtrl'
      })
.state('dathang', {
        url : '/dathang',
        templateUrl : 'MainIndex/formthongtin.html',
        controller : 'dathangCtrl'
      })

.state('vanhocchitiet',{
        url: '/sach/:loaisach/:id',
        templateUrl:'MainIndex/vanhocchitiet.html',
        controller: 'vanhocchitietCtrl',
        param :{
          id: null
        }
    })
.state('login', {
        url : '/login',
        templateUrl : 'MainIndex/login.html',
        controller : 'LoginController'
      })
.state('mainpage', {
        url : '/home',
        templateUrl : 'MainIndex/ContentIndex.html',
        controller : 'productlistCtrl'
      })
.state('gioithieueb', {
        url : '/gioithieu',
        templateUrl : 'MainIndex/gioithieueb.html'
              })
}])

app.controller("productlistCtrl",function($scope,$http,orderBookService,$modal, ModalEditor,$rootScope,SachsFactory)
      {
        $scope.sachmois1 = SachsFactory.query();
        
        $http({
          method:"GET",
          url:"data/sachmoi1.json",
        }).then(function mySuccess(response)
          {
            var range = [];
          for(var i=0;i<28;i++) { 
          range.push(response.data[i]);
          } 
          $scope.sachmois=range
          },function myError(response){
            $scope.dataError=response.statusText
          }
        )

        $http({
          method:"GET",
          url:"data/sachsapphathanh1.json"
        }).then(function mySuccess(response1)
          {
            var range = [];
          for(var i=0;i<12;i++) { 
          range.push(response1.data[i]);
          } 
          $scope.sachphathanhs=range
          },function myError(response1){
            $scope.dataError=response1.statusText
          }
        )
        $http({
          method:"GET",
          url:"data/sachbanchay1.json"
        }).then(function mySuccess(response2)
          {
            var range = [];
          for(var i=0;i<12;i++) { 
          range.push(response2.data[i]);
          } 
          $scope.sachbanchays=range
          },function myError(response2){
            $scope.dataError=response2.statusText
          }
        )
        // $rootScope.obj=orderBookService;
        // $scope.addToCart = function(book){
        //   $rootScope.book=book;
        //   orderBookService.addBooks(book);   
        //   ModalEditor.openModal();
        //    console.log($rootScope.obj.totalAmount);
        // };
        // $scope.addToCart1 = function(book){
        //   $rootScope.book=book;
        //   orderBookService.addBooks(book);   
        //    console.log($rootScope.obj);
        // };
       
      }

     
        )
app.controller("dathangCtrl",function($scope,orderBookService,$rootScope)
      {
        $scope.statuss=$rootScope.status;
});
app.controller("cartCtrl",function($scope,orderBookService,$rootScope)
      {
          $scope.sachsOrder=$rootScope.obj.orderBooks;
         $rootScope.obj=orderBookService;
          
          $scope.XoaSach=function(sach)
          {
            orderBookService.RemoveBooks(sach);
            console.log($rootScope.obj);
          }
          $scope.qty_incr = function(item){
              item.count = item.count + 1;
              orderBookService.AddaBook(item);
              console.log($rootScope.obj);
          }
          $scope.qty_decr = function(item){
              if(item.count > 1){
                 item.count = item.count - 1;
                 orderBookService.RemoveaBook(item);
              }
console.log($rootScope.obj);
          }

      })

      app.controller('vanhocCtrl', ['$scope', 'SachsFactory','$stateParams', '$filter',function ($scope, SachsFactory,$stateParams,$filter) {
        $scope.sachmois = SachsFactory.query();
        $scope.productID= $stateParams.id;
        $scope.itemsPerPage = 12
        $scope.currentPage = 1;

        $scope.pageCount = function () {
          return Math.ceil($scope.sachmois.length / $scope.itemsPerPage);
        };

        $scope.sachmois.$promise.then(function () {
          $scope.$watch('currentPage + itemsPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;
              $scope.countpage= $filter('filter')($scope.sachmois,{LoaiSach: $scope.productID});
            
            $scope.filteredSachs=$scope.countpage.slice(begin, end)
          });
        });
      }]);

angular.module('angularApp').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || '…');
        };
    });
 app.controller('vanhocchitietCtrl',['$stateParams', '$scope','SachsFactory', '$filter','$state','$rootScope','orderBookService','ModalEditor', function($stateParams,$scope,SachsFactory,$filter, $state,$rootScope,orderBookService,ModalEditor) {
  $scope.productID= $stateParams.id;
  $scope.prLoaiSach= $stateParams.loaisach;
   $scope.sachmois1=SachsFactory.query();
  $scope.sachmois1.$promise.then(function () {
    $scope.sachmois = $filter('filter')($scope.sachmois1,{LoaiSach: $scope.prLoaiSach});
  });
  console.log($scope.prLoaiSach);
             $scope.qty_incr = function(item){
              item.quantity = item.quantity + 1;
          }
          $scope.qty_decr = function(item){
              if(item.quantity > 1){
                 item.quantity = item.quantity - 1;
              }

          }

          $rootScope.obj=orderBookService;
          $scope.addToCart = function(book,quantity){
          $rootScope.book=book;
          orderBookService.adddetailBooks(book,quantity);   
          ModalEditor.openModal();
          console.log($rootScope.obj.totalAmount);
        };
        $scope.addToCart1 = function(book,quantity){
        $rootScope.book=book;
        orderBookService.adddetailBooks(book,quantity); 
        $state.transitionTo('dathang');
        console.log($rootScope.obj);
        };
}]);
  

  app.controller('LoginController', function($scope, $stateParams, $state,$rootScope, LoginService) {
    $scope.formSubmit = function() {
      if(LoginService.login($scope.username, $scope.password)) {
        $rootScope.status="Đăng xuất";
        $scope.error = '';
        $scope.username="";
        $scope.password="";
        console.log($rootScope.previousState);
        window.history.back();       
      } else {
        $scope.error = "Incorrect username/password !";
      }
    };
  });


app.service("orderBookService",['$rootScope',function($rootScope){
    var obj = {
      orderBooks: [],
      totalBooks: 0,
      totalAmount: 0,
      countabook:0
    };

    obj.addBooks = function(newBook) {
        $rootScope.test=obj.status;
      if(obj.orderBooks.length===0)
      {
        obj.orderBooks.push(newBook);
        obj.totalBooks += 1;
        newGia= newBook.Gia.replace(/,/g,"");
        newGia1=parseFloat(newGia.replace(/đ/g,""));
        obj.totalAmount += newGia1;
        newBook.count=1
        newBook.totalgiasach=newGia1;
      }
      else 
      {
        var repeat=false;
      for(var i=0; i < obj.orderBooks.length;i++){
        if(obj.orderBooks[i].id ===newBook.id){
          repeat=true;      
          obj.totalBooks += 1;
          newGia= obj.orderBooks[i].Gia.replace(/,/g,"");
          newGia1=parseFloat(newGia.replace(/đ/g,""));
          obj.totalAmount += newGia1;
          obj.orderBooks[i].count+=1;
          obj.orderBooks[i].totalgiasach+=newGia1;
        }
      }
      if(!repeat)
      {
        obj.orderBooks.push(newBook);
        obj.totalBooks += 1;
        newGia= newBook.Gia.replace(/,/g,"");
        newGia1=parseFloat(newGia.replace(/đ/g,""));
        obj.totalAmount += newGia1;
        newBook.count=1
        newBook.totalgiasach=newGia1;
      }
    }
    console.log(obj);
    return obj;
    };

 obj.adddetailBooks = function(newBook,quantity) {
        $rootScope.test=obj.status;
      // if(obj.orderBooks.length===0 && quantity==1)
      // {
      //   obj.orderBooks.push(newBook);
      //   obj.totalBooks += quantity;
      //   newGia= newBook.Gia.replace(/,/g,"");
      //   newGia1=parseFloat(newGia.replace(/đ/g,""));
      //   obj.totalAmount += newGia1*quantity;
      //   newBook.count=1
      //   newBook.totalgiasach=newGia1;
      // }
      // else 
      // {
        var repeat=false;
      for(var i=0; i < obj.orderBooks.length;i++){
        if(obj.orderBooks[i].id ===newBook.id){
          repeat=true;      
          obj.totalBooks += quantity;
          newGia= obj.orderBooks[i].Gia.replace(/,/g,"");
          newGia1=parseFloat(newGia.replace(/đ/g,""));
          obj.totalAmount += newGia1*quantity;
          obj.orderBooks[i].count+=quantity;
          obj.orderBooks[i].totalgiasach+=newGia1*quantity;
        }
      }
      if(!repeat)
      {
        obj.orderBooks.push(newBook);
        obj.totalBooks += quantity;
        newGia= newBook.Gia.replace(/,/g,"");
        newGia1=parseFloat(newGia.replace(/đ/g,""));
        obj.totalAmount += newGia1*quantity;
        newBook.count=quantity;
        newBook.totalgiasach=newGia1;
      }
    //}
    console.log(obj);
    return obj;
    };

    obj.RemoveBooks=function(sach)
    {
      var index=obj.orderBooks.indexOf(sach);
      obj.orderBooks.splice(index,1);
      obj.totalBooks-=sach.count;
      newGia= sach.Gia.replace(/,/g,"");
      newGia1=parseFloat(newGia.replace(/đ/g,""));
      sach.totalgiasach-=parseFloat(newGia1);
      obj.totalAmount-=parseFloat(newGia1)*sach.count;
      return obj;
    };
    obj.RemoveaBook=function(sach)
    {
      if(sach.count>=1)
      {
        obj.totalBooks-=1;
      }
      newGia= sach.Gia.replace(/,/g,"");
      newGia1=parseFloat(newGia.replace(/đ/g,""));
      sach.totalgiasach-=parseFloat(newGia1);
      obj.totalAmount-=parseFloat(newGia1);
      return obj;
    }
    obj.AddaBook=function(sach)
    {
        obj.totalBooks+=1;
      newGia= sach.Gia.replace(/,/g,"");
      newGia1=parseFloat(newGia.replace(/đ/g,""));
      sach.totalgiasach+=parseFloat(newGia1);
      obj.totalAmount+=parseFloat(newGia1);
      return obj;
    }
    return obj;
  }])

//modal controller and service definitions
app.controller('ModalCtrl', ModalCtrl); 
app.service('ModalEditor', ModalEditor); 

function ModalEditor($http,$modal,$rootScope){
  var service = {};
  service.openModal = openModal;
  
  function openModal(size){
    
     $modal.open({
      templateUrl : 'MainIndex/ModalContent.html',     //modal template
      controller  : [ '$modalInstance','$rootScope','$scope', ModalCtrl ],
      size:'lg',
      windowClass: 'my-modal-popup'
    });
  }
  
  return service;
}

function ModalCtrl($modalInstance ,$rootScope,$scope,orderBookService){
  //define functions used by the modal
  
   $scope.ok = function () {
    $modalInstance.close('ok');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $rootScope.sachsOrder=$rootScope.obj.orderBooks;
  $scope.sachmoiorder=$rootScope.book;
  $scope.xulygia=function()
  {
    return parseFloat($scope.sachmoiorder.Gia.replace(/,/g,"").replace(/đ/g,""));
  }
}