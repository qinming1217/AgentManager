/**
* Created by chengchao on 2014/9/29.
*/

'use strict';

define(['app'], function (app) {
    //datepicker
    var vDatepicker = function () {
        return {
            restrict: 'EA',
            scope: {
                model: "=ngModel"
            },
            link: function (scope, element, attrs, ctrl) {

                $(element).focus(function () {
                    var dateFormat = '%Y-%m-%d';
                    if (attrs.vDatepicker == "monthOnly") {
                        //dateFormat = '%Y-%m';
                    }
                    var input = element[0];
                    setday(input, dateFormat, function (cal) {
                        scope.model = cal.date.print(dateFormat);
                        scope.$apply();
                    })
                });
            }
        }
    };

    app.register.directive('vDatepicker', vDatepicker);
});