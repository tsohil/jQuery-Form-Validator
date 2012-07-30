/**
 * jQuery Form Validator Module: Security
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 * Documentation and issue tracking on Github <https://github.com/victorjonsson/jQuery-Form-Validator/>
 *
 * This form validation module adds validators typically used on
 * websites in the UK. This module adds the following validators:
 *  - validate_ukvatnumber
 *
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @version 1.9.7
 */$.formUtils.addValidator({name:"validate_ukvatnumber",validate:function(a){a=a.replace(/[^0-9]/g,"");if(a.length<9)return!1;var b=!1,c=[];c=a.split("");var d=Number(c[7]+c[8]),e=c[0],f=c[1];if(e==0&&f>0)return!1;var g=0;for(var h=0;h<7;h++)g+=c[h]*(8-h);var i=0,h=0;for(var j=8;j>=2;j--)i+=c[h]*j,h++;while(g>0)g-=97;return g=Math.abs(g),d==g&&(b=!0),b||(g%=97,g>=55?g-=55:g+=42,g==d&&(b=!0)),b},errorMessage:"",errorMessageKey:"badUKVatAnswer"});