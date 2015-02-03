/**
 * Created by chengchao on 14/11/26.
 */
'use strict';

var param = function (obj) {

    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
            for (i = 0; i < value.length; i++) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        } else if (value instanceof Object) {
            for (subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        }
        else if (value !== undefined && value !== null) {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

    }
    return query.length ? query.substr(0, query.length - 1) : query;
};

var paramFile = function (data) {
    var fd = new FormData();
    angular.forEach(data, function (value, key) {
        if (value instanceof FileList) {
            if (value.length == 1) {
                fd.append(key, value[0]);
            } else {
                angular.forEach(value, function (file, index) {
                    fd.append(key + '_' + index, file);
                });
            }
        } else {
            fd.append(key, value);
        }
    });

    return fd;
}