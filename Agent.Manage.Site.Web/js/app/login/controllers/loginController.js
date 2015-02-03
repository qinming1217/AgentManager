var app = angular.module("ngLoginApp", []);
app.config =
            {
                'webapi': { 'url': appconfig.webapi },
                'index': { 'url': appconfig.index }
            };
app.controller("loginController", ['$scope', '$http', function ($scope, $http) {
    $scope.user = new Object();
    $scope.error = new Object();
    $scope.enterLogin = function (user) {
        if (event.keyCode == 13) {
            $scope.login(user);
        }
    }
    //登陆
    $scope.login = function (user) {
        $scope.error = new Object();
        if (user.loginname == undefined || user.loginname.trim().length == 0) {
            $scope.error.loginnameerror = "登陆名不能为空！";
        }
        else if (user.password == undefined || user.password.trim().length == 0) {
            $scope.error.passworderror = "密码不能为空！";
        }
        else {
            var webapi = app.config.webapi.url;
            webapi += "?loginname=" + user.loginname + "&password=" + user.password + "&reqtype=AgentLogin";
            $http.get(webapi, { cache: false })
                .success(function (data) {
                    var value = eval('(' + data.value + ')');
                    if (value.content.loginResult != "登陆成功") {
                        $scope.error.passworderror = value.content.loginResult;
                        return;
                    }
                    window.location.href = app.config.index.url + "?sessionKey=" + data.key + "&uid=" + value.content.user.uid;
                });
        }
    }
    //重置
    $scope.reset = function () {
        $scope.user = new Object();
        $scope.error = new Object();
    }
}]);