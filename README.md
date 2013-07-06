**jQuery Form Validator** is a feature rich jQuery plugin that makes it easy to validate user input while keeping your
 HTML markup clean from javascript code. Even though this plugin has **a wide range of validation functions**
it's designed to require as little bandwidth as possible. This is achieved by grouping together validation functions
in "modules", making it possible for the programmer to load **only those functions that's needed** to validate a
particular form.

**Form demos and full documentations is available at http://formvalidator.net/**

*Usage example*

```html
<html>
<head>
  <script src="js/jquery.min.js"></script>
  <script src="js/form-validator/jquery.form-validator.min.js"></script>
  <script>
  	$.formUtils.loadModules('date,security');
  </script>
</head>
<form action="" onsubmit="return $(this).validate();">
  <p>
    Name (4 characters minimum):
    <input name="user" data-validation="length" data-validation-length="min4" />
  </p>
  <p>
    Birthdate (yyyy-mm-dd):
    <input name="birth" data-validation="birthdate" />
  </p>
  <p>
    Website:
    <input name="website" data-validation="url" />
  </p>
  <p>
    <input type="submit" />
  </p>
</form>
...
```

### Moving up to version 2.0

So what has changed since version 1.x?

 * A whole bunch of validation functions have been added (see below)
 * A modular design have been introduced, which means that some validation functions is default and others is
 part of a module.
 * You no longer need to prefix the validation rules with "validate_"


### Default validators and features (no module needed)
 * **url**
 * **email**
 * **domain** — *domain.com*
 * **number** — *float/negative/positive*
 * **date** — *yyyy-mm-dd (format can be customized, more information below)*
 * **length** — *min/max/range*
 * **required** — *no validation except that a value has to be given*
 * **custom** — *Validate value against regexp*
 * **num_answers** — *Validate that a select element has the required number of selected options (num_answers num5)*
 * Show help information automatically when input is focused
 * Validate given values immediately when input looses focus.
 * Make validation dependent on another input of type checkbox being checked by adding attribute data-validation-if-checked="name of checkbox input"
 * Make validation optional by adding attribute data-validation-optional="true" to the element. This means
 that the validation defined in data-validation only will take place in case a value is given.
 * Make validation dependent on another input of type checkbox being checked by adding attribute
 data-validation-if-checked="name of checkbox input"
 * Create input suggestions with ease, no jquery-ui needed

### Module: security
 * **spamcheck**
 * **confirmation**
 * **strength** — *Validate the strength of a password (strength strength3)*
 * **backend** — *Validate value of input on backend*

### Module: date
 * **time** — *hh:mm*
 * **birthdate** — *yyyy-mm-dd, not allowing dates in the future or dates that's older than 122 years (format can be customized, more information below)*

### Module: location
 * **country**
 * **federatestate**
 * **longlat**
 * Suggest countries (english only)
 * Suggest states in the US

### Module: sweden
 * **swemob** — *validate that the value is a swedish mobile telephone number*
 * **swesec** — *validate swedish social security number*
 * **county** - *validate that the value is an existing county in Sweden*
 * **municipality** - *validate that the value is an existing municipality in Sweden*
 * Suggest county
 * Suggest municipality

### Module: ukvat
 * **ukvatnumber**


## Writing a custom validator
You can use the function `$.formUtils.addValidator()` to add your own validation function. Here's an example of a validator
that checks if the input contains an even number.

```html
<html>
<head>
  <script src="js/jquery.min.js"></script>
  <script src="js/formvalidator/jquery.formvalidator.min.js"></script>
  <script>
    $.formUtils.addValidator({
        name : 'even',
        validate : function(value, $el, config, language, $form) {
            return parseInt(value, 10) % 2 === 0;
        },
        errorMessage : 'You have to answer an even number',
        errorMessageKey: 'badEvenNumber'
    });
  </script>
</head>
<body>
 ...
 <form action="" method="post" onsubmit="return $(this).validate();">
 <p>
   <input type="text" data-validation="even" />
 ...
```

### Required properties passed into $.formUtils.addValidator

*name* - The name of the validator, which is used in the validation attribute of the input element.

*validate* - Callback function that validates the input. Should return a boolean telling if the value is considered valid or not.

*errorMessageKey* - Name of language property that is used in case the value of the input is invalid.

*errorMessage* - An alternative error message that is used if errorMessageKey is left with an empty value or isn't defined
in the language object. Note that you also can use [inline error messages](#localization) in your form.


The validation function takes these five arguments:
- value — the value of the input thats being validated
- $el — jQuery object referring to the input element being validated
- config — Object containing the configuration of this form validation
- language — Object with error dialogs
- $form — jQuery object referring to the form element being validated

## Creating a custom module

A "module" is basically a javascript file containing one or more calls to [$.formUtils.addValidator()](#writing-a-custom-validator). The module file
should either have the file extension *.js* (as an ordinary javascript file) or *.dev.js*.

Using the file extension **.dev.js** will tell *$.formUtils.loadModules* to always append a timestamp to the end of the
URL, so that the browser never caches the file. You should of course never use *.dev.js* on a production website.

### Loading your module ###

```html
<html>
<head>
    <script src="js/formvalidator/jquery.formvalidator.min.js"></script>
    <script>
        $.formUtils.loadModules('mymodule.dev', 'js/validation-modules/');
    </script>
</head>
</html>
...
```

The first argument of $.formUtils.loadModules is a comma separated string with names of module files, without
file extension (add .dev if the file name is for example mymodule.dev.js, this will insure that the browser never
caches the javascript).

The second argument is the path where the module files is located. This argument is optional, if not given
the module files has to be located in the same directory as the core modules shipped together with this jquery plugin
(js/formvalidator/)

## Validate inputs on blur
It is possible to show that the value of an input is incorrect immediately when the input gets blurred.

```html
<form action="" onsubmit="return $(this).validate();" id="my_form">
  <p>
	  <strong>Website:</strong>
	  <input type="text" name="website" data-validation="url" />
	</p>
	...
</form>
<script>
	$('#my_form').validateOnBlur();
</script>
```

## Show help information
It is possible to display help information for each input. The information will fade in when input is focused and fade out when input looses focus.

```html
<form action="" onsubmit="return $(this).validate();" id="my_form">
	<p>
	  <strong>Why not:</strong>
	  <textarea name="why" data-validation-help="Please give us some more information" data-validation="required"></textarea>
	</p>
	...
</form>
<script>
	$('#my_form').showHelpOnFocus();
</script>
```

## Fully customizable
```javascript
var myConf = {
	// Name of element attribute holding the validation rules (default is data-validation)
	validationRuleAttribute : 'class',

	// Names of inputs not to be validated even though the element attribute containing
	// the validation rules tells us to
	ignore : ['som-name', 'other-name'],

	// Class that will be put on elements which value is invalid (default is 'error')
	errorElementClass : 'error',

	// Border color of elements which value is invalid, empty string to leave border
	// color as it is
	borderColorOnError : '#FFF',

	// Class of div container showing error messages (defualt is 'error_message')
	errorMessageClass : 'error_message',

	// Position of error messages. Set the value to "top" if you want the error messages
	// to be displayed in the top of the form. Otherwise you can set the value to
	// "element", each error message will then be displayed beside the input field that
	// it is refering to (default is 'top')
	errorMessagePosition : 'element',

	// Date format used when validating dates and birthdate. (default is yyyy-mm-dd)
	dateFormat : 'dd/mm/yyyy',

	// Window automatically scrolls to the top of the form when submitted data is
	// invalid (default is true)
	scrollToTopOnError : false,

	// Name of the element attribute containing the error message that will be
	// displayed instead of the error dialog that the validation function
	// referrs to (default is data-validation-error-msg)
	validationErrorMsgAttribute : 'data-error'
};

var myLang = {
	errorTitle : 'Något gick fel',
	requiredFields : 'Du fyllde inte i alla fält markerade med *'
};

$('#my_form')
  .showHelpOnFocus()
  .validateOnBlur(myLang, myConf)
  .submit(function() {
    return $(this).validate(myLang, myConf);
  });
```

## Localization
This plugin contains a set of error dialogs. In case you don't define an inline error message the plugin
will fall back on one of the dialogs below. You can how ever add the attribute *data-validation-error-msg* to an
element, and that message will be displayed instead. All error dialogs can be overwritten by passing an
object into the validation function.

```javascript
var enErrorDialogs = {
    errorTitle : 'Form submission failed!',
    requiredFields : 'You have not answered all required fields',
    badTime : 'You have not given a correct time',
    badEmail : 'You have not given a correct e-mail address',
    badTelephone : 'You have not given a correct phone number',
    badSecurityAnswer : 'You have not given a correct answer to the security question',
    badDate : 'You have not given a correct date',
    tooLongStart : 'You have given an answer longer than ',
    tooLongEnd : ' characters',
    tooShortStart : 'You have given an answer shorter than ',
    tooShortEnd : ' characters',
    badLength : 'You have to give an answer between ',
    notConfirmed : 'Values could not be confirmed',
    badDomain : 'Incorrect domain value',
    badUrl : 'Incorrect url value',
    badFloat : 'Incorrect float value',
    badCustomVal : 'You gave an incorrect answer',
    badInt : 'Incorrect integer value',
    badSecurityNumber : 'Your social security number was incorrect',
    badUKVatAnswer : 'Incorrect UK VAT Number',
    badNumberOfSelectedOptionsStart : 'You have to choose at least ',
    badNumberOfSelectedOptionsEnd : ' answers'
};
```

```html
<html>
<head>
    <script src="scripts/jquery.formvalidator.min.js"></script>
    <script src="scripts/locale.en.js"></script>
    ...
<head>
<body>
    ...
    <form action="script.php" onsubmit="return $(this).validate(enErrorDialogs);">
    ...
```

Inline error messages is also possible. If you add attribute data-validation-error-msg to an element the value of that attribute will be displayed instead of the error dialog that the validation function refers to.

## Simple captcha example
```php
<?php
session_start();
if( isset($_POST['captcha']) && isset($_SESSION['captcha'])) {
  if($_POST['captcha'] != ($_SESSION['captcha'][0]+$_SESSION['captcha'][1]))
    die('Invalid captcha answer');  // client does not have javascript enabled
}

$_SESSION['captcha'] = array( mt_rand(0,9), mt_rand(1, 9) );

?>
<html>
....
<form action="" onsubmit="return $(this).validate();">
  <p>
    What is the sum of <?=$_SESSION['captcha'][0]?> + <?=$_SESSION['captcha'][1]?>? (security question)
    <input name="captcha" data-validation="spamcheck captcha<?=( $_SESSION['capthca'][0] + $_SESSION['captcha'][1] )?>"
  </p>
  <p><input type="submit" /></p>
</form>
...
</html>
```

## Input length restriction
```html
<p>
  History (<span id="maxlength">50</span> characters left)
  <textarea rows="3" id="area"></textarea>
</p>
<script type="text/javascript">
  $('#area').restrictLength($('#maxlength'));
</script>
```

## Password confirmation example
```html
  <p>Password: <input type="password" name="pass" data-validation="confirmation" /></p>
  <p>Confirm password: <input type="password" name="pass_confirmation" /></p>
```

## Changelog

#### 2.0
 * [min|max]_length is removed (now merged with length)
 * number, int, float is merged together, all three variants is now validated by number
 * phone moved to "sweden" module and renamed to swephone
 * The attribute to be used when defining the regular expression for custom is now moved to its own attribute (data-validation-regexp)
 * length now looks at attribute data-validation-length to find out how long or short the value must be
 * The validation rule no longer needs to be prefixed with ""
 * Some validation functions is moved to modules (see function reference in top of this document)

## Maintainer

[Victor Jonsson](https://github.com/victorjonsson)

## Contributors
[Joel Sutherland](https://github.com/robamaton) (contributor)<br />
[Steve Wasiura](https://github.com/stevewasiura) (contributor)<br />
[Matt Clements](https://github.com/mattclements) (contributor)<br />
[dfcplc](https://github.com/dfcplc) (contributor)<br />
[Darren Mason](http://www.mypocket-technologies.com) (Password strength meter)<br />
[Scott Gonzales](http://projects.scottsplayground.com/iri/) (URL regexp)
