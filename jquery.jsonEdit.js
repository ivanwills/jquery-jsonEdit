(function($) {

    var count   = 0;
    var key_click = function(key) {
    };
    var value_click = function(key) {
    };
    var add_click = function(key) {
    };
    var types = {
        "null" : {
            is   : function(a) { return a === null },
            view : function(a) {
                var context = this.data('jsonEdit').context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-null">null</span>' );
            },
        },
        "boolean" : {
            is   : function(a) { return a === true || a === false },
            view : function(a) {
                var context = this.data('jsonEdit').context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-bool">' + a + '</span>' );
            },
        },
        number : {
            is   : function(a) { return a === a * 1 },
            view : function(a) {
                var context = this.data('jsonEdit').context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-number">' + a + '</span>' );
            },
        },
        string : {
            is   : function(a) { return a === a + '' },
            view : function(a) {
                var context = this.data('jsonEdit').context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-string">' + a + '</span>' );
            },
        },
        date : {
            is   : function(a) { return a instanceof Date },
            view : function(a) {
                var context = this.data('jsonEdit').context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-string">' + a.toLocalString() + '</span>' );
            },
        },
        array : {
            is   : function(a) { return typeof a == 'object' && a instanceof Array },
            view : function(a) {
                var data    = this.data('jsonEdit');
                var context = data.context;

                context.append( '<div class="jsedit jsedit-array jsedit-array-open">[</div>' );

                for ( var key in a ) {
                    // if this isn't a plain array ignore inherited properties
                    if ( !a.hasOwnProperty(key) ) continue;

                    context.append('<div class="jsedit jsedit-array jsedit-array-value" title="['+key+']">...</div>');
                    var value_div = $( $('.jsedit-array-value', context).get(-1) );
                    value_div.text('');
                    value_div.jsonEdit({ json : a[key], edit : data.edit, count : data.count + 1 });
                }

                context.append( '<div class="jsedit jsedit-array jsedit-array-close">]</div>' );
            }
        },
        object : {
            is   : function(a) { return typeof a == 'object' && !( a instanceof Array ) },
            view : function(a) {
                var data    = this.data('jsonEdit');
                var context = data.context;

                context.append( '<div class="jsedit jsedit-object jsedit-object-open">{</div>' );

                for ( var key in a ) {
                    // if this isn't a plain object ignore inherited properties
                    if ( !a.hasOwnProperty(key) ) continue;

                    context.append('<div class="jsedit jsedit-object jsedit-object-key  ">---</div>');
                    var key_div = $( $('.jsedit-object-key', context).get(-1) );
                    key_div.text(key);

                    context.append('<div class="jsedit jsedit-object jsedit-object-value">...</div>');
                    var value_div = $( $('.jsedit-object-value', context).get(-1) );
                    value_div.text('');
                    value_div.jsonEdit({ json : a[key], edit : data.edit, count : data.count + 1 });
                }

                context.append( '<div class="jsedit jsedit-object jsedit-object-close">}</div>' );
                types.object.adjust.call(this);
            },
            adjust : function() {
                var data = this.data('jsonEdit');
                var max_width = 0;

                for ( var i in data._json ) {
                    if ( data._json.hasOwnProperty(i) ) {
                        data._json[i].key_div.css('width', 'auto');
                        var width = data._json[i].key_div.width();
                        //console.log(i, width, data._json[i]);
                        if ( width > max_width ) max_width = width;
                    }
                }

                for ( var i in data._json ) {
                    if ( data._json.hasOwnProperty(i) ) {
                        data._json[i].key_div.css('width', max_width + 'px');
                    }
                }

            }
        }
    };

    /**
     * @name jsonEdit
     *
     * Plugin for jQuery to allow a GUI editing of JSON objects
     *
     * A JSON object is sequentially processed for editing (Arrays and Objects
     * are recursed into to show their values)
     *
     * Options that jsonEdit takes:
     *  - json : the data to display
     *  - edit : Turn on editing of the JSON
     *
     * Supported data types
     *  * Nuill    (a === null)
     *  * Boolean  (a === true || a === false)
     *  * Number   (a === a * 1)
     *  * String   (a === a + '')
     *  * Date     (a instanceof Date)
     *  * Array    (typeof a == 'object' && a instanceof Array)
     *  * Object   (typeof a == 'object')
     *
     * Array's and Object's can be collapsed
     */
    var methods = {
        init : function(options) {

            this.each( function() {
                var self = $(this);
                var data = self.data('jsonEdit');

                if ( !data || data.type ) {
                    var div = '<div class="jsedit jsedit-top"></div>';
                    self.append(div);
                    self.data(
                        'jsonEdit',
                        $.extend({
                            context : $('.jsedit-top', this),
                            edit    : false,
                            count   : 1,
                            _json   : {}
                        }, options)
                    );

                    data = self.data('jsonEdit');
                }

                if ( data.count > 9 ) {
                    console.error('too deep', data);
                    return;
                }

                for ( var type in types ) {
                    if ( types[type].is(data.json) ) {
                        data.type = type;
                        types[type].view.call( self, data.json );
                        break;
                    }
                }

            });

            return this;
        },
        adjust : function() {
        },
        json : function() {
        },
        toggle : function() {
        }
    };

    $.fn.jsonEdit = function(method) {
        if ( methods[method] ) {
            //console.log('method', method);
            var res = methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
            return res;
        }
        else if ( typeof method === 'object' || !method ) {
            //console.log('init');
            return methods.init.apply( this, arguments );
        }
        else {
            $.error('The method "' + method + '" in unknown for jQuery.jsonEdit!');
        }
    };

})(jQuery);

