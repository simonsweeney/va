var $ = require("jquery");
require('corejs-typeahead');

var Promise = require('promise');

var countries = require('iso-3166-country-list').names;
var relevancy = require('relevancy');

module.exports = function( answers ){
    
    return new Promise( resolve => {
        
        var $buttons = $('.buttons_age-location');
        var $age = $('#age');
        var $location = $('#location');
        var $submit = $('.button_submit');
        
        $age.on('input change', validate);
        
        $buttons.removeClass('buttons_hidden');
        
        var suggestion = false;
        
        function validate () {
            
            var age = Number( $age.val() );
            var location = $location.typeahead( 'val' ) && suggestion;
            
            var valid = !isNaN(age) && location;
            
            $submit.toggleClass('button_disabled', !valid);
            
            return valid ? { age, location } : false;
            
        }
        
        var search = new relevancy.Sorter( {}, countries );
        
        $location.typeahead({}, {
            source: ( query, matches ) => {
                
                var result = search.sortBy( query )[0];
                
                var startsWith = result.toLowerCase().indexOf( query.toLowerCase() ) === 0;
                
                if ( result && startsWith ) {
                    
                    suggestion = search.sortBy( query )[0];
                    matches( [ suggestion ] );
                    
                } else {
                    
                    suggestion = false;
                    matches([]);
                    
                }
                
            }
        }).on('typeahead:idle', () => {
            
            if( suggestion && !countries.includes( $location.typeahead( 'val' ) ) ) {
                
                $location.typeahead( 'val', suggestion );
                
            }
            
        }).on('typeahead:active', () => {
            
            suggestion = false;
            
            $location.typeahead( 'val', '' );
            
        }).on('typeahead:render', () => {
            
            if( !$location.typeahead( 'val' ) ) suggestion = false;
            
            validate();
            
        });
        
        var busy = false;
        
        $submit.on('click', () => {
            
            var values = validate();
            
            if ( !busy && values ) {
                
                busy = true;
                
                $submit.addClass('button_busy');
                
                $buttons.removeClass('ask-age');
                
                values.answers = answers;
                
                resolve( values );
                
            }
            
        })
        
    })
    
}