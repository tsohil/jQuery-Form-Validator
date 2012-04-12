/**
 * Module that makes it possible to let backend validate
 * the value of an input (eg. check that e-mail address not
 * already registered)
 */
$.formUtils.addValidator({
    oldKeyupEvent : false,
    oldSubmitEvent : false,
    name:'validate_backend',
    validate : function(val, $el, conf, lang, $form) {
        if($el.attr('data-backend-valid'))
            return true;
        else if($el.attr('data-backend-invalid'))
            return false;

        var self = this;

        if(this.oldSubmitEvent === false) {
            this.oldKeyupEvent = $el.get(0).keyup;
            this.oldSubmitEvent = $form.get(0).onsubmit;
            if(!this.oldSubmitEvent) {
                $.each($form.data('events').submit, function(k, func) {
                    self.oldSubmitEvent = func.handler;
                    return false;
                });
                $form.unbind('submit');
            }
        }

        $form
            .unbind('submit')
            .addClass('validating-backend')
            .get(0).onsubmit = function() {
                return false;
            };

        var backendUrl = document.location.href;

        if($el.attr('data-backend-url')) {
            backendUrl = $el.attr('data-backend-url');
        } else if('backendUrl' in conf) {
            backendUrl = conf.backendUrl;
        }

        $.ajax({
            url : backendUrl,
            type : 'POST',
            cache : false,
            data : 'validate='+val,
            dataType : 'json',
            success : function(json) {
                if(json.success) {
                    $el.attr('data-backend-valid', 'true');
                }
                else {
                    $el.attr('data-backend-invalid', 'true');
                    if(json.message)
                        $el.attr('data-error-message', json.message);
                    else
                        $el.removeAttr('data-error-message');
                }

                $form
                    .removeClass('validating-backend')
                    .get(0).onsubmit = function() {};

                $form.bind('submit', self.oldSubmitEvent);

                $el
                .bind('keyup', function() {
                    $(this)
                        .removeAttr('data-backend-valid')
                        .removeAttr('data-backend-invalid')
                        .removeAttr('data-error-message');

                    if(self.oldKeyupEvent == 'function')
                        self.oldKeyupEvent();
                });

                // fire submission again!
                $form.trigger('submit');
            }
        });

        $.formUtils.haltValidation = true;
        return false;
    },
    errorMessage : '',
    errorMessageKey: 'badBackend'
});