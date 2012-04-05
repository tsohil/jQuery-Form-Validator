/*
* This file contains commonly used functions
* on swedish websites
*/


/*
* Validate swedish social security number yyyymmddXXXX
*/
$.formUtils.addValidator({
    name : 'validate_swesc',
    validate : function(securityNumber) {
        if (!securityNumber.match(/^(\d{4})(\d{2})(\d{2})(\d{4})$/)) {
            return false;
        }

        var year = RegExp.$1;
        var month = $.formUtils.parseDateInt(RegExp.$2);
        var day = $.formUtils.parseDateInt(RegExp.$3);

        // var gender = parseInt( (RegExp.$4) .substring(2,3)) % 2; ==> 1 === male && 0 === female

        var months = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
            months[1] = 29;
        }
        if (month < 1 || month > 12 || day < 1 || day > months[month - 1]) {
            return false;
        }

        securityNumber = securityNumber.substring(2, securityNumber.length);
        var check = '';
        for (var i = 0; i < securityNumber.length; i++) {
            check += ((((i + 1) % 2) + 1)* securityNumber.substring(i, i + 1));
        }
        var checksum = 0;
        for (i = 0; i < check.length; i++) {
            checksum += parseInt(check.substring(i, i + 1),10);
        }

        return checksum % 10 === 0;
    },
    errorMessage : '',
    errorMessageKey: 'badSecurityNumber'
});


/*
* Validate that string is a swedish telephone number
*/
$.formUtils.addValidator({
    name : 'validate_swemobile',
    validate : function(number) {
        if (!$.formUtils.validators.validate_phone.validate(number)) {
            return false;
        }

        number = number.replace(/[^0-9]/g, '');
        var begin = number.substring(0, 3);

        if (number.length != 10 && begin !== '467') {
            return false;
        } else if (number.length != 11 && begin === '467') {
            return false;
        }
        return (/07[0-9{1}]/).test(begin) || (begin === '467' && number.substr(3, 1) === '0');
    },
    errorMessage : '',
    errorMessageKey: 'badTelephone'
});