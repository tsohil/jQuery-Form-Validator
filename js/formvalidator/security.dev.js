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