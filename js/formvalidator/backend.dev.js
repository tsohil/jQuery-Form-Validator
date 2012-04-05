$.formUtils.addValidator({
    oldKeyupEvent : false,
    name:'validate_backend',
    validate : function(val, $el, conf, lang, $form) {
        if($el.attr('data-backend-valid'))
            return true;
        else if($el.attr('data-backend-invalid'))
            return false;

        var oldSubmitEvent = $form.get(0).onsubmit;
        if(this.oldKeyupEvent === false)
            var oldElementKeyupEvent = $el.get(0).keyup;

        var disableElement = function(e) {
            if('preventDefault' in e)
                e.preventDefault();

            return false;
        };

        $el
        .bind('keyup', disableElement)
        .bind('keydown', disableElement)
        .bind('keypress', disableElement);

        alert(oldSubmitEvent);

        $form
            .unbind('submit')
            .bind('submit', disableElement)
            .addClass('validating-backend');

        var backendUrl = document.location.href;

        if($el.attr('data-backend-url')) {
            backendUrl = $el.attr('data-backend-url');
        } else if('backendUrl' in conf) {
            backendUrl = conf.backendUrl;
        }

        var self = this;
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
                }

                $form.bind('submit', oldSubmitEvent);
                $el
                .unbind('keyup')
                .unbind('keydown')
                .unbind('keypress');

                $el.bind('keyup', function() {
                    $(this)
                        .removeAttr('data-backend-valid')
                        .removeAttr('data-backend-invalid');

                    if(self.oldKeyupEvent == 'function')
                        self.oldKeyupEvent();
                });

                // fire submission again!
                $form.get(0).submit();
            }
        });

        return false;
    },
    errorMessage : '',
    errorMessageKey: 'badBackend'
});