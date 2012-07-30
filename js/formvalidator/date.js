/**
 * jQuery Form Validator Module: Date
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 * Documentation and issue tracking on Github <https://github.com/victorjonsson/jQuery-Form-Validator/>
 *
 * This form validation module adds validators used to validate date
 * and time values. The following validators will be added by
 * this module:
 *  - validate_time
 *  - validate_birthdate
 *
 *
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @version 1.9.7
 */(function(a){a.formUtils.addValidator({name:"validate_time",validate:function(a){if(a.match(/^(\d{2}):(\d{2})$/)===null)return!1;var b=parseInt(a.split(":")[0],10),c=parseInt(a.split(":")[1],10);return b>24||c>59||b===24&&c>0?!1:!0},errorMessage:"",errorMessageKey:"badTime"}),a.formUtils.addValidator({name:"validate_birthdate",validate:function(b,c,d){var e="yyyy-mm-dd";c.attr("data-format")?e=c.attr("data-format"):typeof d.dateFormat!="undefined"&&(e=d.dateFormat);var f=a.formUtils.parseDate(b,e);if(!f)return!1;var g=new Date,h=g.getFullYear(),i=f[0],j=f[1],k=f[2];if(i===h){var l=g.getMonth()+1;if(j===l){var m=g.getDate();return k<=m}return j<l}return i<h&&i>h-124},errorMessage:"",errorMessageKey:"badDate"})})(jQuery);