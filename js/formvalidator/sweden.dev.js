/**
 * jQuery Form Validator Module: Security
 * ------------------------------------------
 * Created by Victor Jonsson <http://www.victorjonsson.se>
 * Documentation and issue tracking on Github <https://github.com/victorjonsson/jQuery-Form-Validator/>
 *
 * This form validation module adds validators typically used on swedish
 * websites. This module adds the following validators:
 *  - validate_swesec (Social security number)
 *  - validate_swemobile
 *  - validate_validate_municipality
 *  - validate_county
 *
 * @license Dual licensed under the MIT or GPL Version 2 licenses
 * @version 1.9.1
 */
(function($) {

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

    $.formUtils.addValidator({
        name : 'validate_county',
        validate : function(str) {
            return $.inArray(str, this.counties) > -1;
        },
        errorMessage: '',
        errorMessageKey: 'badCustomVal',
        counties : ['Västra Götalands län','Västra Götalands län','Kronobergs län','Jönköpings län','Västmanlands län','Norrbottens län','Norrbottens län','Värmlands län','Örebro län','Dalarnas län','Västra Götalands län','Jämtlands län','Västerbottens län','Skåne län','Norrbottens län','Västra Götalands län','Gävleborgs län','Kalmar län','Bor län','Dalarnas län','Västra Götalands län','Stockholms län','Östergötlands län','Skåne län','Jämtlands län','Skåne län','Skåne län','Västra Götalands län','Stockholms län','Örebro län','Västerbottens län','Värmlands län','Stockholms län','Jönköpings län','Kalmar län','Uppsala län','Södermanlands län','Skåne län','Västra Götalands län','Västmanlands län','Hallands län','Västra Götalands län','Dalarnas län','Värmlands län','Östergötlands län','Södermanlands län','Värmlands län','Västra Götalands län','Dalarnas län','Jönköpings län','Södermanlands län','Jönköpings län','Gotlands län','Värmlands län','Västra Götalands län','Västra Götalands län','Norrbottens län','Gävleborgs län','Västra Götalands län','Västra Götalands län','Jönköpings län','Värmlands län','Örebro län','Västmanlands län','Hallands län','Värmlands län','Stockholms län','Norrbottens län','Uppsala län','Dalarnas län','Skåne län','Västra Götalands län','Västra Götalands län','Gävleborgs län','Stockholms län','Gävleborgs län','Kalmar län','Hallands län','Uppsala län','Örebro län','Jämtlands län','Västernorrlands län','Västra Götalands län','Skåne län','Skåne län','Kalmar län','Skåne län','Skåne län','Norrbottens län','Stockholms län','Jönköpings län','Norrbottens län','Kalmar län','Västra Götalands län','Blekinge län','Örebro län','Blekinge län','Värmlands län','Södermanlands län','Värmlands län','Östergötlands län','Norrbottens län','Skåne län','Uppsala län','Västernorrlands län','Skåne län','Värmlands län','Jämtlands län','Örebro län','Hallands län','Västmanlands län','Västra Götalands län','Skåne län','Västmanlands län','Hallands län','Skåne län','Örebro län','Örebro län','Dalarnas län','Västra Götalands län','Kronobergs län','Stockholms län','Västra Götalands län','Västra Götalands län','Örebro län','Östergötlands län','Kronobergs län','Gävleborgs län','Örebro län','Skåne län','Dalarnas län','Norrbottens län','Skåne län','Västerbottens län','Västra Götalands län','Skåne län','Dalarnas län','Västerbottens län','Västra Götalands län','Västra Götalands län','Kronobergs län','Västra Götalands län','Östergötlands län','Dalarnas län','Östergötlands län','Jönköpings län','Västra Götalands län','Värmlands län','Västra Götalands län','Kalmar län','Kalmar län','Stockholms län','Örebro län','Västmanlands län','Gävleborgs län','Västerbottens län','Östergötlands län','Stockholms län','Västerbottens län','Kalmar län','Stockholms län','Södermanlands län','Stockholms län','Jönköpings län','Gävleborgs län','Blekinge län','Dalarnas län','Västra Götalands län','Skåne län','Kalmar län','Gävleborgs län','Södermanlands län','Norrbottens län','Västra Götalands län','Skåne län','Norrbottens län','Jämtlands län','Västerbottens län','Blekinge län','Dalarnas län','Västmanlands län','Stockholms län','Gävleborgs län','Stockholms län','Skåne län','Skåne län','Västra Götalands län','Västerbottens län','Västmanlands län','Skåne län','Västra Götalands län','Dalarnas län','Västernorrlands län','Stockholms län','Stockholms län','Västerbottens län','Västra Götalands län','Skåne län','Västra Götalands län','Stockholms län','Värmlands län','Västerbottens län','Södermanlands län','Västra Götalands län','Jämtlands län','Stockholms län','Västernorrlands län','Värmlands län','Västmanlands län','Skåne län','Skåne län','Västra Götalands län','Värmlands län','Dalarnas län','Jönköpings län','Gävleborgs län','Östergötlands län','Stockholms län','Blekinge län','Västra Götalands län','Västra Götalands län','Västra Götalands län','Uppsala län','Västernorrlands län','Kronobergs län','Västra Götalands län','Skåne län','Värmlands län','Kalmar län','Västra Götalands län','Jönköpings län','Skåne län','Västra Götalands län','Södermanlands län','Stockholms län','Stockholms län','Västra Götalands län','Västra Götalands län','Västra Götalands län','Västerbottens län','Stockholms län','Stockholms län','Uppsala län','Kronobergs län','Östergötlands län','Jönköpings län','Östergötlands län','Stockholms län','Dalarnas län','Västra Götalands län','Hallands län','Stockholms län','Skåne län','Jönköpings län','Västerbottens län','Kalmar län','Västerbottens län','Södermanlands län','Västra Götalands län','Västra Götalands län','Västerbottens län','Stockholms län','Jönköpings län','Kalmar län','Västmanlands län','Kronobergs län','Östergötlands län','Skåne län','Västra Götalands län','Västernorrlands län','Jämtlands län','Värmlands län','Västerbottens län','Skåne län','Östergötlands län','Kronobergs län','Dalarnas län','Uppsala län','Norrbottens län','Skåne län','Västra Götalands län','Östergötlands län','Örebro län','Skåne län','Västernorrlands län','Jämtlands län','Stockholms län','Uppsala län','Skåne län','Norrbottens län']
    });

    $.formUtils.addValidator({
        name : 'validate_municipality',
        validate : function(str) {
            return $.inArray(str, this.municipalities) > -1;
        },
        errorMessage : '',
        errorMessageKey: 'badCustomVal',
        municipalities : ['Ale','Alingsås','Alvesta','Aneby','Arboga','Arjeplogs','Arvidsjaurs','Arvika','Askersunds','Avesta','Bengtsfors','Bergs','Bjurholms','Bjuvs','Bodens','Bollebygds','Bollnäs','Borgholms','Borlänge','Borås','Botkyrka','Boxholms','Bromölla','Bräcke','Burlövs','Båstads','Dals-Eds','Danderyds','Degerfors','Dorotea','Eda','Ekerö','Eksjö','Emmaboda','Enköpings','Eskilstuna','Eslövs','Essunga','Fagersta','Falkenbergs','Falköpings','Falu','Filipstads','Finspångs','Flens','Forshaga','Färgelanda','Gagnefs','Gislaveds','Gnesta','Gnosjö','Gotlands','Grums','Grästorps','Gullspångs','Gällivare','Gävle','Göteborgs','Götene','Habo','Hagfors','Hallsbergs','Hallstahammars','Halmstads','Hammarö','Haninge','Haparanda','Heby','Hedemora','Helsingborgs','Herrljunga','Hjo','Hofors','Huddinge','Hudiksvalls','Hultsfreds','Hylte','Håbo','Hällefors','Härjedalens','Härnösands','Härryda','Hässleholms','Höganäs','Högsby','Hörby','Höörs','Jokkmokks','Järfälla','Jönköpings','Kalix','Kalmar','Karlsborgs','Karlshamns','Karlskoga','Karlskrona','Karlstads','Katrineholms','Kils','Kinda','Kiruna','Klippans','Knivsta','Kramfors','Kristianstads','Kristinehamns','Krokoms','Kumla','Kungsbacka','Kungsörs','Kungälvs','Kävlinge','Köpings','Laholms','Landskrona','Laxå','Lekebergs','Leksands','Lerums','Lessebo','Lidingö','Lidköpings','Lilla Edets','Lindesbergs','Linköpings','Ljungby','Ljusdals','Ljusnarsbergs','Lomma','Ludvika','Luleå','Lunds','Lycksele','Lysekils','Malmö','Malung-Sälens','Malå','Mariestads','Marks','Markaryds','Melleruds','Mjölby','Mora','Motala','Mullsjö','Munkedals','Munkfors','Mölndals','Mönsterås','Mörbylånga','Nacka','Nora','Norbergs','Nordanstigs','Nordmalings','Norrköpings','Norrtälje','Norsjö','Nybro','Nykvarns','Nyköpings','Nynäshamns','Nässjö','Ockelbo','Olofströms','Orsa','Orusts','Osby','Oskarshamns','Ovanåkers','Oxelösunds','Pajala','Partille','Perstorps','Piteå','Ragunda','Robertsfors','Ronneby','Rättviks','Sala','Salems','Sandvikens','Sigtuna','Simrishamns','Sjöbo','Skara','Skellefteå','Skinnskattebergs','Skurups','Skövde','Smedjebackens','Sollefteå','Sollentuna','Solna','Sorsele','Sotenäs','Staffanstorps','Stenungsunds','Stockholms','Storfors','Storumans','Strängnäs','Strömstads','Strömsunds','Sundbybergs','Sundsvalls','Sunne','Surahammars','Svalövs','Svedala','Svenljunga','Säffle','Säters','Sävsjö','Söderhamns','Söderköpings','Södertälje','Sölvesborgs','Tanums','Tibro','Tidaholms','Tierps','Timrå','Tingsryds','Tjörns','Tomelilla','Torsby','Torsås','Tranemo','Tranås','Trelleborgs','Trollhättans','Trosa','Tyresö','Täby','Töreboda','Uddevalla','Ulricehamns','Umeå','Upplands Väsby','Upplands-Bro','Uppsala','Uppvidinge','Vadstena','Vaggeryds','Valdemarsviks','Vallentuna','Vansbro','Vara','Varbergs','Vaxholms','Vellinge','Vetlanda','Vilhelmina','Vimmerby','Vindelns','Vingåkers','Vårgårda','Vänersborgs','Vännäs','Värmdö','Värnamo','Västerviks','Västerås','Växjö','Ydre','Ystads','Åmåls','Ånge','Åre','Årjängs','Åsele','Åstorps','Åtvidabergs','Älmhults','Älvdalens','Älvkarleby','Älvsbyns','Ängelholms','Öckerö','Ödeshögs','Örebro','Örkelljunga','Örnsköldsviks','Östersunds','Österåkers','Östhammars','Östra Göinge','Överkalix','Övertorneå']
    });

})(jQuery);