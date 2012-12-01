/**
* jQuery Form Validator
* ------------------------------------------
* Created by Victor Jonsson <http://www.victorjonsson.se>
* Documentation and issue tracking on Github <https://github.com/victorjonsson/jQuery-Form-Validator/>
*
* @license Dual licensed under the MIT or GPL Version 2 licenses
* @version 1.9.13
*/
(function($) {

    'use strict';

    /**
    * Should be called on the element containing the input elements
    *
    * @param {Object} language Optional, will override $.formUtils.LANG
    * @param {Object} settings Optional, will override the default settings
    * @return {jQuery}
    */
    $.fn.validateOnBlur = function(language, settings) {
        this.find('textarea,input').blur(function() {
               $(this).doValidate(language, settings);
            });

        return this;
    };

    /**
    * Should be called on the element containing the input elements.
    * <input data-help="The info that I want to display for the user when input is focused" ... />
    *
    * @param {String} attrName - Optional, default is data-help
    * @return {jQuery}
    */
    $.fn.showHelpOnFocus = function(attrName) {
        if(!attrName) {
            attrName = 'data-validation-help';
        }

        this.find('textarea,input').each(function() {
            var $element = $(this);
            var help = $element.attr(attrName);
            if(help) {
                $element
                    .focus(function() {
                        var $element = $(this);
                        if($element.parent().find('.jquery_form_help').length == 0) {
                            var $span = $('<span />')
                                            .addClass('jquery_form_help')
                                            .text(help)
                                            .hide()
                                            .fadeIn();
                            $element.after($span);
                        }
                    })
                    .blur(function() {
                        $(this)
                            .parent()
                            .find('.jquery_form_help')
                                .fadeOut('slow', function() {
                                    $(this).remove();
                                });
                    });
            }
        });

        return this;
    };

    /**
    * Function that validates the value of given input and shows
    * error message in a span element that is appended to the parent
    * element
    *
    * @param {Object} language Optional, will override $.formUtils.LANG
    * @param {Object} settings Optional, will override the default settings
    * @param {Boolean} attachKeyupEvent Optional
    * @return {jQuery}
    */
    $.fn.doValidate = function(language, settings, attachKeyupEvent) {
        if(typeof attachKeyupEvent == 'undefined') {
            attachKeyupEvent = true;
        }

        var $element = this;
        // test if there is custom obj to hold element error msg (id = element name + err_msg)
        var elementErrMsgObj = document.getElementById($element.attr('name')+'_err_msg');

        var config = {
            ignore : [], // Names of inputs not to be validated, overwriting attribute notaed validation
            validationRuleAttribute : 'data-validation',
            validationErrorMsgAttribute : 'data-validation-error-msg', // define custom err msg inline with element
            errorElementClass : 'error', // Class that will be put on elements which value is invalid
            borderColorOnError : 'red',
            dateFormat : 'yyyy-mm-dd'
        };

        if (settings) {
            $.extend(config, settings);
        }
        if (language) {
            $.extend($.formUtils.LANG, language);
        }
        // get updated dialog strings
        language = $.formUtils.LANG;

        var $form = $element.closest("form");

        var elementType = $element.attr('type');
        if ($.formUtils.defaultBorderColor === null && elementType !== 'submit' && elementType !== 'checkbox' && elementType !== 'radio') {
            $.formUtils.defaultBorderColor = $element.css('border-color');
        }

        var validationRule = $element.attr(config.validationRuleAttribute);

        if( validationRule == 'validate_backend' || validationRule == 'backend' ) {
            // not possible to validate on the fly
            return this;
        }

        // Remove possible error style applied by previous validation
        $element
            .removeClass(config.errorElementClass)
            .parent()
            .find('.jquery_form_error_message').remove();

        // if element has custom err msg container, clear it
        if( elementErrMsgObj != null) {
            elementErrMsgObj.innerHTML = '';
        }

        if(config.borderColorOnError !== '') {
            $element.css('border-color', $.formUtils.defaultBorderColor);
        }

        if(validationRule && validationRule.indexOf('confirmation') > -1) {
            var validateWhenBlurred = function($element) {
                var $confirm = $form.find('input[name=' + $element.attr('name') + '_confirmation]').eq(0);
                $confirm.one('blur', function() {
                    $element.doValidate(language, settings, false);
                });
            };
            validateWhenBlurred($element);
         }

        var validation = $.formUtils.validateInput($element, language, config, $form);

        if(validation === true) {
            $element.addClass('valid');
        } else {
            $element
                .addClass(config.errorElementClass)
                .removeClass('valid');

            // if element has custom err msg container, use it
            if( elementErrMsgObj != null) {
                elementErrMsgObj.innerHTML = validation;
            } else { // use regular span append
                $element.parent().append('<span class="jquery_form_error_message">'+validation+'</span>');
            }

            if(config.borderColorOnError !== '') {
                $element.css('border-color', config.borderColorOnError);
            }

            if(attachKeyupEvent) {
                $element.bind('keyup', function() {
                    $(this).doValidate(language, settings, false);
                });
            }
        }

        return this;
    };

    /**
     * Short hand for fetching/adding/removing element attributes
     * prefixed with 'data-validation-'
     *
     * @param {String} name
     * @param {String|Boolean} [val]
     * @return string|undefined
     * @protected
     */
    $.fn.valAttr = function(name, val) {
        if( val === undefined ) {
            return this.attr('data-validation-'+name);
        } else if( val === false || val === null ) {
            return this.removeAttr('data-validation-'+name);
        } else {
            return this.attr('data-validation-'+name, val);
        }
    };

    /**
     * Function that validate all inputs in a form
     *
     * @param language
     * @param settings
     */
    $.fn.validate = function(language, settings) {

        /*
         * Config
         */
        var config = {
            ignore : [], // Names of inputs not to be validated even though node attribute containing the validation rules tells us to
            errorElementClass : 'error', // Class that will be put on elements which value is invalid
            borderColorOnError : 'red', // Border color of elements which value is invalid, empty string to not change border color
            errorMessageClass : 'jquery_form_error_message', // class name of div containing error messages when validation fails
            validationRuleAttribute : 'data-validation', // name of the attribute holding the validation rules
            validationErrorMsgAttribute : 'data-validation-error-msg', // define custom err msg inline with element
            errorMessagePosition : 'top', // Can be either "top" or "element"
            scrollToTopOnError : true,
            dateFormat : 'yyyy-mm-dd'
        };

        /*
         * Extends initial settings
         */
        if (settings) {
            $.extend(config, settings);
        }
        if (language) {
            $.extend($.formUtils.LANG, language);
        }
        // get updated dialog strings
        language = $.formUtils.LANG;

        /**
         * Adds message to error message stack if not already in the message stack
         *
         * @param {String} mess
         */
        var addErrorMessage = function(mess) {
            if ($.inArray(mess, errorMessages) < 0) {
                errorMessages.push(mess);
            }
        };

        /** Error messages for this validation */
        var errorMessages = [];

        /** Input elements which value was not valid */
        var errorInputs = [];

        /** Form instance */
        var $form = this;

        /**
         * Tells whether or not to validate element with this name and of this type
         *
         * @param {String} name
         * @param {String} type
         * @return {Boolean}
         */
        var ignoreInput = function(name, type) {
            if (type === 'submit' || type === 'button') {
                return true;
            }

            for (var i = 0; i < config.ignore.length; i++) {
                if (config.ignore[i] === name) {
                    return true;
                }
            }
            return false;
        };

        //
        // Validate element values
        //
        $.formUtils.haltValidation = false;
        $form.find('input,textarea,select').each(function() {
            var $element = $(this);
            var elementType = $element.attr('type');
            if (!ignoreInput($element.attr('name'), elementType)) {

                // input of type radio
                if(elementType === 'radio') {
                    var validationRule = $element.attr(config.validationRuleAttribute);
                    if (typeof validationRule != 'undefined' && validationRule === 'required') {
                        var radioButtonName = $element.attr('name');
                        var isChecked = false;
                        $form.find('input[name=' + radioButtonName + ']').each(function() {
                            if ($(this).is(':checked')) {
                                isChecked = true;
                                return false;
                            }
                            return true;
                        });

                        if (!isChecked) {
                            var validationErrorMsg = $element.attr(config.validationErrorMsgAttribute);
                            $element.valAttr('current-error', validationErrorMsg || language.requiredFields);
                            errorMessages.push(validationErrorMsg || language.requiredFields);
                            errorInputs.push($element);
                        }
                    }
                }
                // inputs, textareas and select lists
                else {

                    // memorize border color
                    if ($.formUtils.defaultBorderColor === null && $element.attr('type')) {
                        $.formUtils.defaultBorderColor = $element.css('border-color');
                    }

                    var valid = $.formUtils.validateInput(
                                    $element,
                                    language,
                                    config,
                                    $form
                                );

                    if(valid !== true) {
                        errorInputs.push($element);
                        addErrorMessage(valid);
                        $element
                            .valAttr('current-error', valid)
                            .removeClass('valid');
                    }
                    else {
                        $element
                            .valAttr('current-error', false)
                            .addClass('valid');
                    }
                }
            }

        });

        //
        // Reset style and remove error class
        //
        var borderStyleProp = $.formUtils.defaultBorderColor===null ||
            ($.formUtils.defaultBorderColor.indexOf(' ') > -1 && $.formUtils.defaultBorderColor.indexOf('rgb') == -1)
            ? 'border':'border-color';

        $form.find('input,textarea,select')
            .css(borderStyleProp, $.formUtils.defaultBorderColor)
            .removeClass(config.errorElementClass);

        //
        // Remove possible error messages from last validation
        //
        $('.' + config.errorMessageClass.split(' ').join('.')).remove();
        $('.jquery_form_error_message').remove();


        //
        // Validation failed
        //
        if (!$.formUtils.haltValidation && errorInputs.length > 0) {

            // Apply error style to invalid inputs
            for (var i = 0; i < errorInputs.length; i++) {
                if (config.borderColorOnError !== '') {
                    errorInputs[i].css('border-color', config.borderColorOnError);
                }
                errorInputs[i].addClass(config.errorElementClass);
            }

            // display all error messages in top of form
            if (config.errorMessagePosition === 'top') {
                var messages = '<strong>' + language.errorTitle + '</strong>';
                for (var i = 0; i < errorMessages.length; i++) {
                    messages += '<br />* ' + errorMessages[i];
                }
                // using div instead of P gives better control of css display properties
                $form.children().eq(0).before('<div class="' + config.errorMessageClass + '">' + messages + '</div>');
                if(config.scrollToTopOnError) {
                    $(window).scrollTop($form.offset().top - 20);
                }
            }

            // Display error message below input field
            else {
                for (var i = 0; i < errorInputs.length; i++) {
                    var $parent = errorInputs[i].parent();
                    var $errorSpan = $parent.find('span[class=jquery_form_error_message]');
                    if ($errorSpan.length > 0) {
                        $errorSpan.eq(0).text(errorInputs[i].valAttr('current-error'));
                    } else {
                        $parent.append('<span class="jquery_form_error_message">' + errorInputs[i].valAttr('current-error') + '</span>');
                    }
                }
            }
            return false;
        }

        return !$.formUtils.haltValidation;
    };

    /**
    * Plugin for displaying input length restriction
    */
    $.fn.restrictLength = function(maxLengthElement) {
        new $.formUtils.lengthRestriction(this, maxLengthElement);
        return this;
    };


    $.formUtils = {

        /**
        * Default border color, will be picked up first
        * time form is validated
        */
        defaultBorderColor : null,

        /**
        * Available validators
        */
        validators : {},

        /**
         * Events triggered by form validator
         */
        _events : {load : [], valid: [], invalid:[]},

        /**
         * Setting this property to true during validation will
         * stop further validation from taking place and form will
         * not be sent
         */
        haltValidation : false,

        /**
        * Function for adding a validator
        * @param {Object} validator
        */
        addValidator : function(validator) {
            this.validators[validator.name] = validator;
        },

        /**
         * @param {String} evt
         * @param {Function} callback
         */
        on : function(evt, callback) {
            this._events[evt].push(callback);
        },

        /**
         * @param {String} evt
         * @param [argA]
         * @param [argB]
         */
        trigger : function(evt, argA, argB) {
            $.each(this._events[evt], function(i, func) {
                func(argA, argB);
            });
        },

        /**
        * @example
        *  $.formUtils.loadModules('date, security.dev');
        *
        * Will load the scripts date.js and security.dev.js from the
        * directory where this script resides. If you want to load
        * the modules from another directory you can use the
        * path argument.
        *
        * The script will be cached by the browser unless the module
        * name ends with .dev
        *
        * @param {String} modules - Comma separated string
        * @param {String} path - Optional
        */
        loadModules : function(modules, path) {

            var loadModuleScripts = function(modules, path) {
                var moduleList = modules.split(',');
                var numModules = moduleList.length;
                var moduleLoadedCallback = function() {
                    numModules--;
                    if( numModules == 0 ) {
                        $.formUtils.trigger('load', path);
                    }
                };
                $.each(moduleList, function(i, module) {
                    var moduleName = $.trim(module);
                    if( moduleName.length == 0 ) {
                        moduleLoadedCallback();
                    }
                    else {
                        var scriptUrl = path + $.trim(module) + '.js';
                        $.ajax({
                            url : scriptUrl,
                            cache : scriptUrl.substr(-7) != '.dev.js',
                            dataType : 'script',
                            async : false,
                            success : function() {
                                moduleLoadedCallback();
                            },
                            error : function() {
                                moduleLoadedCallback();
                                throw new Error('Unable to load form validation module '+module);
                            }
                        });
                    }
                });
            };

            if(typeof path != 'undefined')
                loadModuleScripts(modules, path);
            else {
                $(function() {
                    var scripts = $('script');
                    for(var i=0; i < scripts.length; i++) {
                        var src = scripts.eq(i).attr('src');
                        var scriptName = src.substr(src.lastIndexOf('/')+1, src.length);
                        if(scriptName == 'jquery.formvalidator.js' || scriptName == 'jquery.formvalidator.min.js') {
                            path = src.substr(0, src.lastIndexOf('/')) + '/';
                            if(path == '/')
                                path = '';

                            break;
                        }
                    }
                    loadModuleScripts(modules, path);
                });
            }
        },

        /**
        * Validate the value of given element according to the validation rules
        * found in the attribute data-validation. Will return true if valid,
        * error message otherwise
        *
        * @param {jQuery} $element
        * @param {Object} language ($.formUtils.LANG)
        * @param {Object} config
        * @param {jQuery} $form
        * @return {String}|{Boolean}
        */
        validateInput : function($element, language, config, $form) {

            // Multiple select
            if( $element.get(0).nodeName == 'SELECT' && $element.attr('multiple') ) {
                return this.validateMultipleSelect($element.val(), $element, config, language);
            }

            // Form not given as argument
            if(!$form)
                $form = $element.closest('form');

            var value = $.trim($element.val());
            value = value || '';
            var optional = $element.valAttr('optional');

            // test if a checkbox forces this element to be validated
            var validationDependsOnCheckedInput = false;
            var validationDependentInputIsChecked = false;
            // get value of this element's attribute "... if-checked"
            var validateIfCheckedElementName = $element.valAttr("if-checked");
            // make sure we can proceed
            if (validateIfCheckedElementName != null) {

                // Set the boolean telling us that the validation depends
                // on another input being checked
                validationDependsOnCheckedInput = true;

                // select the checkbox type element in this form
                var validateIfCheckedElement = $form.find('input[name="' + validateIfCheckedElementName + '"]');

                // test if it's property "checked" is checked
                if ( validateIfCheckedElement.prop('checked') ) {
                    // set value for validation checkpoint
                    validationDependentInputIsChecked = true;
                }
            }

            // validation checkpoint
            // if empty AND optional attribute is present
            // OR depending on a checkbox being checked AND checkbox is checked, return true
            if ((!value && optional === 'true') || (validationDependsOnCheckedInput && !validationDependentInputIsChecked)) {
                $.formUtils.trigger('valid', $element);
                return true;
            }

            var validationRules = $element.attr(config.validationRuleAttribute);

            // see if form element has inline err msg attribute
            var validationErrorMsg = $element.attr(config.validationErrorMsgAttribute);

            if ( validationRules ) {
                var posRules = validationRules.split(' ');
                for(var i=0; i < posRules.length; i++) {
                    if( posRules[i].substr(0, 9) != 'validate_' ) {
                        posRules[i] = 'validate_' + posRules[i];
                    }

                    var validator = $.formUtils.validators[posRules[i]];
                    if( validator ) {

                        var isValid = validator.validate(value, $element, config, language, $form);
                        if(!isValid) {
                            $.formUtils.trigger('invalid', $element);
                            if( !validationErrorMsg ) {
                                validationErrorMsg = language[validator.errorMessageKey];
                                if(typeof validationErrorMsg == 'undefined')
                                    validationErrorMsg = validator.errorMessage;
                            }
                            return validationErrorMsg;
                        }
                    } else if (posRules[i].substr(9) == 'validate_' && typeof console != 'undefined' && 'warn' in console) {
                        console.warn('Using undefined validator "'+posRules[i]+'"');
                    }
                }
            }
            $.formUtils.trigger('valid', $element);
            return true;
        },

        /**
         * @param {Array} values
         * @param {jQuery} $el
         * @param {Object} config
         * @param {Object} language - $.formUtils.LANG
         * @return {Boolean|String}
         */
        validateMultipleSelect : function(values, $el, config, language) {
            values = values || [];
            var validationRules = $el.attr(config.validationRuleAttribute);
            var validationErrorMsg = $el.attr(config.validationErrorMsgAttribute);
            if(validationRules.indexOf('validate_num_answers') > -1) {
                var num = this.getAttributeInteger(validationRules, 'num');
                if(num > values.length) {
                    return validationErrorMsg || (language.badNumberOfSelectedOptionsStart +num+ language.badNumberOfSelectedOptionsEnd);
                }
            }
            return true;
        },

       /**
        * <input data-validation="validate_min_length length12" /> => getAttribute($(element).attr('data-validation'), 'length') = 12
        * @param {String} attrValue
        * @param {String} attrName
        * @returns {Number}
        */
        getAttributeInteger : function(attrValue, attrName) {
            var regex = new RegExp('(' + attrName + '[0-9\-]+)', "g");
            return attrValue.match(regex)[0].replace(/[^0-9\-]/g, '');
        },

       /**
        * Is it a correct date according to given dateFormat. Will return false if not, otherwise
        * an array 0=>year 1=>month 2=>day
        *
        * @param {String} val
        * @param {String} dateFormat
        * @return {Array}|{Boolean}
        */
        parseDate : function(val, dateFormat) {
            var divider = dateFormat.replace(/[a-zA-Z]/gi, '').substring(0,1);
            var regexp = '^';
            var formatParts = dateFormat.split(divider);
            for(var i=0; i < formatParts.length; i++) {
                regexp += (i > 0 ? '\\'+divider:'') + '(\\d{'+formatParts[i].length+'})';
            }
            regexp += '$';
            
            var matches = val.match(new RegExp(regexp));
            if (matches === null) {
                return false;
            }
        
            var findDateUnit = function(unit, formatParts, matches) {
                for(var i=0; i < formatParts.length; i++) {
                    if(formatParts[i].substring(0,1) === unit) {
                        return $.formUtils.parseDateInt(matches[i+1]);
                    }
                }
                return -1;
            };
        
            var month = findDateUnit('m', formatParts, matches);
            var day = findDateUnit('d', formatParts, matches);
            var year = findDateUnit('y', formatParts, matches);
        
            if ((month === 2 && day > 28 && (year % 4 !== 0  || year % 100 === 0 && year % 400 !== 0)) 
            	|| (month === 2 && day > 29 && (year % 4 === 0 || year % 100 !== 0 && year % 400 === 0))
            	|| month > 12 || month === 0) {
                return false;
            }
            if ((this.isShortMonth(month) && day > 30) || (!this.isShortMonth(month) && day > 31) || day === 0) {
                return false;
            }
        
            return [year, month, day];
        },

       /**
        * skum fix. är talet 05 eller lägre ger parseInt rätt int annars får man 0 när man kör parseInt?
        *
        * @param {String} val
        * @param {Number}
        */
        parseDateInt : function(val) {
            if (val.indexOf('0') === 0) {
                val = val.replace('0', '');
            }
            return parseInt(val,10);
        },

        /**
        * Has month only 30 days?
        *
        * @param {Number} m
        * @return {Boolean}
        */
        isShortMonth : function(m) {
            return (m % 2 === 0 && m < 7) || (m % 2 !== 0 && m > 7);
        },

       /**
        * Restrict input length
        *
        * @param {jQuery} $inputElement Jquery Html object
        * @param {jQuery} $maxLengthElement jQuery Html Object
        * @return void
        */
        lengthRestriction : function($inputElement, $maxLengthElement) {
           // read maxChars from counter display initial text value
           var maxChars = parseInt($maxLengthElement.text(),10);

           // bind events to this element
           // setTimeout is needed, cut or paste fires before val is available
           $($inputElement).bind('keydown keyup keypress focus blur',  countCharacters )
               .bind('cut paste', function(){ setTimeout(countCharacters, 100); } ) ;

           // internal function does the counting and sets display value
           function countCharacters() {
               var numChars = $inputElement.val().length;
               if(numChars > maxChars) {
                   // get current scroll bar position
                   var currScrollTopPos = $inputElement.scrollTop();
                   // trim value to max length
                   $inputElement.val($inputElement.val().substring(0, maxChars));
                   $inputElement.scrollTop(currScrollTopPos);
               }
               // set counter text
               $maxLengthElement.text(maxChars - numChars);
           }
        },

        _numSuggestionElements : 0,
        _selectedSuggestion : null,
        _previousTypedVal : null,

        /**
         * Utility function that can be used to create plugins that gives
         * suggestions when inputs is typed into
         * @param {jQuery} $element
         * @param {Array} suggestions
         * @param {Object} settings - Optional
         * @return {jQuery}
         */
        suggest : function($element, suggestions, settings) {
            var config =  {
                css : {
                    maxHeight: '150px',
                    background: '#FFF',
                    lineHeight:'150%',
                    textDecoration : 'underline',
                    overflowX : 'hidden',
                    overflowY : 'auto',
                    border : '#CCC solid 1px',
                    borderTop : 'none',
                    cursor: 'pointer'
                },
                activeSuggestionCSS : {
                    background : '#F2F2F2'
                }
            };

            if(settings)
                $.extend(config, settings);

            config.css['position'] = 'absolute';
            config.css['z-index'] = 9999;
            $element.attr('autocomplete', 'off');

            this._numSuggestionElements++;

            var onSelectSuggestion = function($el) {
                var suggestionId = $el.valAttr('suggestion-nr');
                $.formUtils._selectedSuggestion = null;
                $.formUtils._previousTypedVal = null;
                $('.jquery-form-suggestion-'+suggestionId).fadeOut('fast');
            };

            $element
                .valAttr('suggestion-nr', this._numSuggestionElements)
                .bind('focus', function() {
                    $(this).trigger('keyup');
                    $.formUtils._selectedSuggestion = null;
                })
                .bind('keyup', function() {
                    var $input = $(this);
                    var foundSuggestions = [];
                    var val = $.trim($input.val()).toLocaleLowerCase();
                    if(val == $.formUtils._previousTypedVal) {
                        return;
                    }
                    else {
                        $.formUtils._previousTypedVal = val;
                    }

                    var hasTypedSuggestion = false;
                    var suggestionId = $input.valAttr('suggestion-nr');
                    var $suggestionContainer = $('.jquery-form-suggestion-'+suggestionId);
                    $suggestionContainer.scrollTop(0);

                    // Find the right suggestions
                    if(val != '') {
                        $.each(suggestions, function(i, v) {
                            if(v.toLocaleLowerCase().indexOf(val) === 0) {
                                foundSuggestions.push(v);
                            }
                        });

                        if(foundSuggestions.length == 1 && foundSuggestions[0].length == val.length)
                            hasTypedSuggestion = true;
                    }

                    // Hide suggestion container
                    if(hasTypedSuggestion || (foundSuggestions.length == 0 && $suggestionContainer.length > 0)) {
                        $suggestionContainer.hide();
                    }

                    // Create suggestion container if not already exists
                    else if(foundSuggestions.length > 0 && $suggestionContainer.length == 0) {
                        $suggestionContainer = $('<div></div>').css(config.css).appendTo('body');
                        $suggestionContainer.addClass('jquery-form-suggestions');
                        $suggestionContainer.addClass('jquery-form-suggestion-'+suggestionId);
                    }

                    // Show hidden container
                    else if(foundSuggestions.length > 0 && !$suggestionContainer.is(':visible')) {
                        $suggestionContainer.show();
                    }

                    // add suggestions
                    if(foundSuggestions.length > 0 && val.length != foundSuggestions[0].length) {

                        // put container in place every time, just in case
                        var offset = $input.offset();
                        $suggestionContainer.css({
                            width : $input.outerWidth(),
                            left : offset.left + 'px',
                            top : (offset.top + $input.outerHeight()) +'px'
                        });

                        // Add suggestions HTML to container
                        $suggestionContainer.html('');
                        $.each(foundSuggestions, function(i, s) {
                            $('<div></div>')
                                .text(s)
                                .addClass('form-suggest-element')
                                .appendTo($suggestionContainer)
                                .click(function() {
                                    $input.focus();
                                    $input.val( $(this).text() );
                                    onSelectSuggestion($input);
                                });
                        });
                    }
                })
                .bind('keydown', function(e) {
                    var code = (e.keyCode ? e.keyCode : e.which),
                        suggestionId,
                        $suggestionContainer,
                        $input = $(this);

                    if(code == 13 && $.formUtils._selectedSuggestion !== null) {
                        suggestionId = $input.valAttr('suggestion-nr');
                        $suggestionContainer = $('.jquery-form-suggestion-'+suggestionId);
                        if($suggestionContainer.length > 0) {
                            var newText = $suggestionContainer.find('div').eq($.formUtils._selectedSuggestion).text();
                            $input.val(newText);
                            onSelectSuggestion($input);
                            e.preventDefault();
                        }
                    }
                    else {
                        suggestionId = $input.valAttr('suggestion-nr');
                        $suggestionContainer = $('.jquery-form-suggestion-'+suggestionId);
                        var $suggestions = $suggestionContainer.children();
                        if($suggestions.length > 0 && $.inArray(code, [38,40]) > -1) {
                            if(code == 38) { // key up
                                if($.formUtils._selectedSuggestion === null)
                                    $.formUtils._selectedSuggestion = $suggestions.length-1;
                                else
                                    $.formUtils._selectedSuggestion--;
                                if($.formUtils._selectedSuggestion < 0)
                                    $.formUtils._selectedSuggestion = $suggestions.length-1;
                            }
                            else if(code == 40) { // key down
                                if($.formUtils._selectedSuggestion === null)
                                    $.formUtils._selectedSuggestion = 0;
                                else
                                    $.formUtils._selectedSuggestion++;
                                if($.formUtils._selectedSuggestion > ($suggestions.length-1))
                                    $.formUtils._selectedSuggestion = 0;

                            }

                            // Scroll in suggestion window
                            var containerInnerHeight = $suggestionContainer.innerHeight();
                            var containerScrollTop = $suggestionContainer.scrollTop();
                            var suggestionHeight = $suggestionContainer.children().eq(0).outerHeight();
                            var activeSuggestionPosY = suggestionHeight * ($.formUtils._selectedSuggestion);
                            if( activeSuggestionPosY < containerScrollTop || activeSuggestionPosY > (containerScrollTop+containerInnerHeight)) {
                                $suggestionContainer.scrollTop( activeSuggestionPosY );
                            }

                            $suggestions
                                .removeClass('active-suggestion')
                                .css('background', 'none')
                                .eq($.formUtils._selectedSuggestion)
                                    .addClass('active-suggestion')
                                    .css(config.activeSuggestionCSS);

                            e.preventDefault();
                            return false;
                        }
                    }
                })
                .bind('blur', function() {
                    onSelectSuggestion($(this));
                });

            return $element;
        },

       /**
        * Error dialogs
        *
        * @var {Object}
        */
        LANG : {
            errorTitle : 'Form submission failed!',
            requiredFields : 'You have not answered all required fields',
            badTime : 'You have not given a correct time',
            badEmail : 'You have not given a correct e-mail address',
            badTelephone : 'You have not given a correct phone number',
            badSecurityAnswer : 'You have not given a correct answer to the security question',
            badDate : 'You have not given a correct date',
            toLongStart : 'You have given an answer longer than ',
            toLongEnd : ' characters',
            toShortStart : 'You have given an answer shorter than ',
            toShortEnd : ' characters',
            badLength : 'You have to give an answer between ',
            notConfirmed : 'Values could not be confirmed',
            badDomain : 'Incorrect domain value',
            badUrl : 'Incorrect url value',
            badFloat : 'Incorrect float value',
            badCustomVal : 'You gave an incorrect answer',
            badInt : 'Incorrect integer value',
            badSecurityNumber : 'Your social security number was incorrect',
            badUKVatAnswer : 'Incorrect UK VAT Number',
            badStrength : 'The password isn\'t strong enough',
            badNumberOfSelectedOptionsStart : 'You have to choose at least ',
            badNumberOfSelectedOptionsEnd : ' answers'
        }
    };


    /* * * * * * * * * * * * * * * * * * * * * *
      CORE VALIDATORS
    * * * * * * * * * * * * * * * * * * * * */


    /*
    * Validate email
    */
    $.formUtils.addValidator({
        name : 'validate_email',
        validate : function(email) {
            var emailFilter = /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(emailFilter.test(email)) {
               var parts = email.split('@');
               if(parts.length == 2) {
                   return $.formUtils.validators.validate_domain.validate(parts[1]);
               }
            }
            return false;
        },
        errorMessage : '',
        errorMessageKey : 'badEmail'
    });

    /*
    * Validate domain name
    */
    $.formUtils.addValidator({
        name : 'validate_domain',
        validate : function(val, $input) {

            // Clean up
            val = val.replace('ftp://', '').replace('https://', '').replace('http://', '').replace('www.', '');
            if(val.substr(-1) == '/')
                val = val.substr(0, val.length-1);

            var arr = new Array('.com', '.net', '.org', '.biz', '.coop', '.info', '.museum', '.name', '.pro',
                                '.edu', '.gov', '.int', '.mil', '.ac', '.ad', '.ae', '.af', '.ag', '.ai', '.al',
                                '.am', '.an', '.ao', '.aq', '.ar', '.as', '.at', '.au', '.aw', '.az', '.ba', '.bb',
                                '.bd', '.be', '.bf', '.bg', '.bh', '.bi', '.bj', '.bm', '.bn', '.bo', '.br', '.bs',
                                '.bt', '.bv', '.bw', '.by', '.bz', '.ca', '.cc', '.cd', '.cf', '.cg', '.ch', '.ci',
                                '.ck', '.cl', '.cm', '.cn', '.co', '.cr', '.cu', '.cv', '.cx', '.cy', '.cz', '.de',
                                '.dj', '.dk', '.dm', '.do', '.dz', '.ec', '.ee', '.eg', '.eh', '.er', '.es', '.et',
                                '.fi', '.fj', '.fk', '.fm', '.fo', '.fr', '.ga', '.gd', '.ge', '.gf', '.gg', '.gh',
                                '.gi', '.gl', '.gm', '.gn', '.gp', '.gq', '.gr', '.gs', '.gt', '.gu', '.gv', '.gy',
                                '.hk', '.hm', '.hn', '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.im', '.in', '.io',
                                '.iq', '.ir', '.is', '.it', '.je', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki',
                                '.km', '.kn', '.kp', '.kr', '.kw', '.ky', '.kz', '.la', '.lb', '.lc', '.li', '.lk',
                                '.lr', '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.mg', '.mh', '.mk',
                                '.ml', '.mm', '.mn', '.mo', '.mp', '.mq', '.mr', '.ms', '.mt', '.mu', '.mv', '.mw',
                                '.mx', '.my', '.mz', '.na', '.nc', '.ne', '.nf', '.ng', '.ni', '.nl', '.no', '.np',
                                '.nr', '.nu', '.nz', '.om', '.pa', '.pe', '.pf', '.pg', '.ph', '.pk', '.pl', '.pm',
                                '.pn', '.pr', '.ps', '.pt', '.pw', '.py', '.qa', '.re', '.ro', '.rw', '.ru', '.sa',
                                '.sb', '.sc', '.sd', '.se', '.sg', '.sh', '.si', '.sj', '.sk', '.sl', '.sm', '.sn',
                                '.so', '.sr', '.st', '.sv', '.sy', '.sz', '.tc', '.td', '.tf', '.tg', '.th', '.tj',
                                '.tk', '.tm', '.tn', '.to', '.tp', '.tr', '.tt', '.tv', '.tw', '.tz', '.ua', '.ug',
                                '.uk', '.um', '.us', '.uy', '.uz', '.va', '.vc', '.ve', '.vg', '.vi', '.vn', '.vu',
                                '.ws', '.wf', '.ye', '.yt', '.yu', '.za', '.zm', '.zw', '.me', '.mobi', '.xxx');

            var dot = val.lastIndexOf('.');
            var domain = val.substring(0, dot);
            var ext = val.substring(dot, val.length);
            var hasTopDomain = false;

            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === ext) {
                    if(ext==='.uk') {
                        //Run Extra Checks for UK Domain Names
                        var domainParts = val.split('.');
                        var tld2 = domainParts[domainParts.length-2];
                        var ukarr = new Array('co', 'me', 'ac', 'gov', 'judiciary',
                        'ltd', 'mod', 'net', 'nhs', 'nic', 'org', 'parliament',
                        'plc', 'police', 'sch', 'bl', 'british-library', 'jet',
                        'nls');

                        for(var j = 0; j < ukarr.length; j++) {
                            if(ukarr[j] === tld2) {
                                hasTopDomain = true;
                                break;
                            }
                        }

                        if(hasTopDomain)
                            break;

                    } else {
                        hasTopDomain = true;
                        break;
                    }
                }
            }

            if (!hasTopDomain) {
                return false;
            } else if (dot < 2 || dot > 57) {
                return false;
            } else {
                var firstChar = domain.substring(0, 1);
                var lastChar = domain.substring(domain.length - 1, domain.length);

                if (firstChar === '-' || firstChar === '.' || lastChar === '-' || lastChar === '.') {
                    return false;
                }
                if (domain.split('.').length > 3 || domain.split('..').length > 1) {
                    return false;
                }
                if (domain.replace(/[0-9a-z\.\-]/g, '') !== '') {
                    return false;
                }
            }

            // It's valid, lets update input with trimmed value perhaps??
            if(typeof $input !== 'undefined') {
                $input.val(val);
            }

            return true;
        },
        errorMessage : '',
        errorMessageKey: 'badDomain'
    });

    /*
    * Validate required
    */
    $.formUtils.addValidator({
        name : 'validate_required',
        validate : function(val) {
            return val !== '';
        },
        errorMessage : '',
        errorMessageKey: 'requiredFields'
    });

    /*
    * Validate length range
    */
    $.formUtils.addValidator({
        name : 'validate_length',
        validate : function(value, $el, config, language) {
            var len = $el.valAttr('length');
            if(len == undefined) {
                var elementType = $el.get(0).nodeName;
                alert('Please add attribute "data-validation-length" to '+elementType+' named '+$el.attr('name'));
                return true;
            }

            var range = len.split('-');

            // range
            if(range.length == 2 && (value.length < parseInt(range[0],10) || value.length > parseInt(range[1],10))) {
                this.errorMessage = language.badLength + len + language.toLongEnd;
                return false;
            }
            // min
            else if(len.indexOf('min') === 0) {
                var minLength = parseInt(len.substr(3),10);
                if(minLength > value.length) {
                    this.errorMessage = language.toShortStart + minLength + language.toShortEnd;
                    return false;
                }
            }
            // max
            else if(len.indexOf('max') === 0) {
                var maxLength = parseInt(len.substr(3),10);
                if(maxLength < value.length) {
                    this.errorMessage = language.toLongStart + maxLength + language.toLongEnd;
                    return false;
                }
            }

            return true;
        },
        errorMessage : '',
        errorMessageKey: ''
    });

    /*
    * Validate url
    */
    $.formUtils.addValidator({
        name : 'validate_url',
        validate : function(url) {
            // written by Scott Gonzalez: http://projects.scottsplayground.com/iri/ but added support for arrays in the url ?arg[]=sdfsdf
            var urlFilter = /^(https|http|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|\[|\]|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
            if(urlFilter.test(url)) {
                var domain = url.split(/^https|^http|^ftp/i)[1].replace('://', '');
                var domainSlashPos = domain.indexOf('/');
                if(domainSlashPos > -1)
                    domain = domain.substr(0, domainSlashPos);

                return $.formUtils.validators.validate_domain.validate(domain); // todo: add support for IP-addresses
            }
            return false;
        },
        errorMessage : '',
        errorMessageKey: 'badUrl'
    });

    /*
    * Validate number (floating or integer)
    */
    $.formUtils.addValidator({
        name : 'validate_number',
        validate : function(val, $el) {
            if(val !== '') {
                var allowing = $el.valAttr('allowing');
                if(allowing === undefined)
                    allowing = 'number';

                if(allowing.indexOf('negative') > -1 && val.indexOf('-') === 0)
                    val = val.substr(1);

                if(allowing.indexOf('number') > -1 && val.replace(/[0-9]/g, '') === '') {
                    return true;
                }
                if(allowing.indexOf('float') > -1 && val.match(/^([0-9]+)\.([0-9]+)$/) !== null) {
                    return true;
                }
            }
            return false;
        },
        errorMessage : '',
        errorMessageKey: 'badInt'
    });

    /*
    * Validate against regexp
    */
    $.formUtils.addValidator({
        name : 'validate_custom',
        validate : function(val, $el, config) {
            var regexp = new RegExp($el.valAttr('regexp'));
            return regexp.test(val);
        },
        errorMessage : '',
        errorMessageKey: 'badCustomVal'
    });

    /*
    * Validate date
    */
    $.formUtils.addValidator({
        name : 'validate_date',
        validate : function(date, $el, conf) {
            var dateFormat = 'yyyy-mm-dd';
            if($el.attr('data-format')) {
                dateFormat = $el.attr('data-format');
            }
            else if(typeof conf.dateFormat != 'undefined') {
                dateFormat = conf.dateFormat;
            }

            return $.formUtils.parseDate(date, dateFormat) !== false;
        },
        errorMessage : '',
        errorMessageKey: 'badDate'
    });

})(jQuery);