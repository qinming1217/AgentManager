var app = angular.module('ngIndexApp', ['ngResource']);
app.config =
            {
                'webapi': { 'url': appconfig.webapi },
                'login': { 'url': appconfig.login }
            };
app.controller('indexController', ['$scope', '$resource', '$q', '$element', '$http', function ($scope, $resource, $q, $element, $http) {
    //iframe src
    $scope.iframeSrc = "biz.html#/";
    //选项卡项
    $scope.tab = null;
    //选项卡列表
    $scope.tabs = [{ link: "biz.html#/", text: "首页" }];
    //当前登陆用户信息
    $scope.user = { name: "", position: "", department: "" };
    //菜单列表
    $scope.menuList = new Array();
    //查询条件
    $scope.search = "";
    //获取登陆用户uid用作加载用户信息及菜单列表
    $scope.initUserInfo = function () {
        $scope.search = window.location.search;
        if ($scope.search == '') {
            window.location.href = app.config.login.url;
            return;
        }
        var webapi = app.config.webapi.url;
        webapi += $scope.search;
        webapi += "&reqtype=InitUserInfo";
        $http.get(webapi)
            .success(function (data) {
                if (data.resCode == -1) {
                    window.location.href = app.config.login.url;
                    return;
                }
                $scope.user = data.content.user;
                $scope.menuList = data.content.menuList;
            })
            .error(function (error) {
                alert(error)
            });
    }
    //点击菜单改变iframe src进行页面展示
    $scope.redirectTo = function (src) {
        $scope.iframeSrc = src;
    }
    //添加选项卡
    $scope.addTab = function (link, text) {
        var isEqual = false;
        //循环当前选项卡列表如无则添加
        angular.forEach($scope.tabs, function (tab) {
            if (tab.link == link) {
                //如存在则跳出
                isEqual = true;
                return;
            }
        })
        //如添加项不存在选项卡列表则添加进去
        if (!isEqual) {
            $scope.tab = { link: link, text: text };
            $scope.tabs.push($scope.tab);
        }
        var timestamp = Math.round(new Date().getTime() / 1000);
        //显示该选项卡内容
        $scope.redirectTo(link + "?v=" + timestamp);
    }
    //移除选项卡
    $scope.removeTab = function (index) {
        //从选项卡列表中移除该选项卡
        $scope.tabs.splice(index, 1);
        //如移除后选项卡列表为空则添加默认选项卡并显示该选项卡内容
        if ($scope.tabs.length == 0) {
            $scope.tabs = [{ link: "biz.html#/", text: "首页" }];
            $scope.redirectTo("biz.html#/");
        }
            //显示最后一个选项卡内容
        else {
            $scope.redirectTo($scope.tabs[$scope.tabs.length - 1].link);
        }
    }

    $scope.submitOrder = function () {
        if ($("#txtVbsBid").val() == '' || $("#txtConfirmVbsBid").val() == '') {
            $("#lblMessage").text("提示：请输入VBS业务号");
            return;
        }
        if ($("#txtVbsBid").val() != $("#txtConfirmVbsBid").val()) {
            $("#lblMessage").text("提示：输入不一致");
            return;
        }

        var orderInfo = new Object();
        orderInfo.reqtype = "SubmitOrder";
        orderInfo.orderId = $element.find('#lblOrderId').html();
        orderInfo.vbsBid = $("#txtVbsBid").val();

        var api = $resource(app.config.webapi.url);

        var defer = $q.defer();

        api.get(orderInfo, function (data) {
            defer.resolve(data);
            if (data == "-1") {
                window.location.href = app.config.login.url;
                return;
            }
            if (data.resCode == 0 && data.content.operationResult == true) {
                var index = $element.find('#index').val();
                if (commitOrder != undefined) {
                    commitOrder(index, $("#txtVbsBid").val());
                }
                closeConfirm();
            } else {
                $("#lblMessage").text("提示：提交异常");
            }
        }, function (resp) {
            defer.reject(data);
        });

        return defer.promise;
    }
}]);