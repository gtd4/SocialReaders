

(function () {

    var app = angular.module('socialReaders', []);
    //Helper Functions
    function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
            console.log('Successful login for: ' + response.name);
            document.getElementById('status').innerHTML =
              'Thanks for logging in, ' + response.name + '!';
        });
    };

    function statusChangeCallback(response) {
        console.log('statusChangeCallback');
        console.log(response);
        // The response object is returned with a status field that lets the
        // app know the current login status of the person.
        // Full docs on the response object can be found in the documentation
        // for FB.getLoginStatus().
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            testAPI();
            login.$apply(function () {
                login.isFBLoggedIn = true;
            });
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            login.$apply(function () {
                login.isFBLoggedIn = false;
            });

        }
    }

    //controllers

    app.controller('LoginController', ['$scope', function ($scope) {
        var login = $scope;
        login.accessToken = '';
        login.books = [];

        login.isFBLoggedIn = false

        login.checkLoginStatus = function () {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            });
        };

        login.fbLogin = function () {
            FB.login(function (response) {
                // handle the response
                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    testAPI();
                    login.$apply(function () {
                        login.isFBLoggedIn = true;
                        
                    });
                    FB.api('/me/books.reads', function (response) {
                        if (response && !response.error) {
                            console.log(response);
                            login.$apply(function () {
                                login.books = response.data;
                            });
                        }
                        
                    });
                } else {
                    // The person is not logged into Facebook, so we're not sure if
                    // they are logged into this app or not.
                    login.$apply(function () {
                        login.isFBLoggedIn = false;
                    });

                }
                
                

            }, { scope: 'public_profile,email,user_likes,user_actions.books' });
            
        };

        login.fbLogout = function () {
            FB.logout(function (response) {
                // Person is now logged out
                login.$apply(function () {
                    login.isFBLoggedIn = false;
                });
            });
        };

        //login.checkLoginStatus();
    }]);



})();