/*
* Simple spam check
*/
$.formUtils.addValidator({
    name : 'validate_spamcheck',
    validate : function(val, $el, config) {
        var attr = $el.attr(config.validationRuleAttribute);
        return attr.match(/captcha([0-9a-z]+)/i)[1].replace('captcha', '') === val;
    },
    errorMessage : '',
    errorMessageKey: 'badSecurityAnswer'
});

/*
* Validate confirmation
*/
$.formUtils.addValidator({
    name : 'validate_confirmation',
    validate : function(value, $el, config, language, $form) {
        var conf = '';
        var confInput = $form.find('input[name=' + $el.attr('name') + '_confirmation]').eq(0);
        if (confInput) {
            conf = confInput.val();
        }
        return value === conf;
    },
    errorMessage : '',
    errorMessageKey: 'notConfirmed'
});

/*
* Validate password strength
*/
$.formUtils.addValidator({
    name : 'validate_strength',
    validate : function(val, $el, conf) {
        var validationRules = $el.attr(conf.validationRuleAttribute);
        var requiredStrength = $.formUtils.getAttributeInteger(validationRules, 'strength');
        if(requiredStrength > 2)
            requiredStrength = 2;

        return parseInt(val) >= requiredStrength;
    },
    errorMessage : '',
    errorMessageKey: 'badStrength',

    /**
     * Code more or less borrowed from jQuery plugin "Password Strength Meter"
     * written by Darren Mason (djmason9@gmail.com), myPocket technologies (www.mypocket-technologies.com)
     * @param {String} password
     * @return {Number}
     */
    calculatePasswordStrength : function(password) {

        if (password.length < 4) {
            return 0;
        }

        var score = 0;

        var checkRepetition = function (pLen, str) {
            var res = "";
            for (var i = 0; i < str.length; i++) {
                var repeated = true;

                for (var j = 0; j < pLen && (j + i + pLen) < str.length; j++) {
                    repeated = repeated && (str.charAt(j + i) == str.charAt(j + i + pLen));
                }
                if (j < pLen) {
                    repeated = false;
                }
                if (repeated) {
                    i += pLen - 1;
                    repeated = false;
                }
                else {
                    res += str.charAt(i);
                }
            }
            return res;
        };

        //password length
        score += password.length * 4;
        score += ( checkRepetition(1, password).length - password.length ) * 1;
        score += ( checkRepetition(2, password).length - password.length ) * 1;
        score += ( checkRepetition(3, password).length - password.length ) * 1;
        score += ( checkRepetition(4, password).length - password.length ) * 1;

        //password has 3 numbers
        if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
            score += 5;
        }

        //password has 2 symbols
        if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
            score += 5;
        }

        //password has Upper and Lower chars
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
            score += 10;
        }

        //password has number and chars
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
            score += 15;
        }
        //
        //password has number and symbol
        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([0-9])/)) {
            score += 15;
        }

        //password has char and symbol
        if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/) && password.match(/([a-zA-Z])/)) {
            score += 15;
        }

        //password is just a numbers or chars
        if (password.match(/^\w+$/) || password.match(/^\d+$/)) {
            score -= 10;
        }

        //verifying 0 < score < 100
        if (score < 0) {
            score = 0;
        }
        if (score > 100) {
            score = 100;
        }

        // score < 34 == bad
        // score 34 >< 68 == okey
        // score > 68 == great

        if (score < 34) {
            return 0;
        }
        else if (score < 68) {
            return 1;
        }
        else
            return 2;
    },

    strengthDisplay : function($el, options) {
        var self = this;
        var config = {
            fontSize: '12pt',
            padding: '10px',
            weak : 'To weak',
            good : 'Good',
            strong : 'Strong'
        };
        
        if (options) {
            $.extend(config, options);
        }

        $el.bind('keyup', function() {
            var $parent = $(this).parent();
            var $displayContainer = $parent.find('.strength-meter');
            if($displayContainer.length == 0) {
                $displayContainer = $('<div></div>');
                $displayContainer
                    .addClass('strength-meter')
                    .appendTo($parent);
            }

            var strength = self.calculatePasswordStrength($(this).val());
            var css = {
                background: 'pink',
                color : '#FF0000',
                fontWeight : 'bold',
                border : 'red solid 0px 0px 2px',
                display : 'inline-block',
                fontSize : conf.fontSize,
                padding : conf.padding
            };

            var text = conf.weak;

            if(strength == 2) {
                css.background = 'lightyellow';
                css.borderColor = 'yellow';
                css.color = 'goldenrod';
                text = conf.good;
            }
            else if(strength == 1) {
                css.background = 'lightgreen';
                css.borderColor = 'darkgreen';
                css.color = 'darkgreen';
                text = conf.strong;
            }

            $displayContainer
                .css(css)
                .text(text);
        });
    }
});

/*
* Add jQuery plugin for displaying password strength
*/
(function($) {
    $.extend($.fn, {
        displayPasswordStrength : function(conf) {
            new $.formUtils.validators.validate_strength.strengthDisplay($(this), conf);
            return this;
        }
    })
})(jQuery);
