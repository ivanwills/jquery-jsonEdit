(function($) {

    var depth   = 0;
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
                var data    = this.data('jsonEdit');
                var context = data.context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-null">null</span>' );
            },
        },
        "boolean" : {
            is   : function(a) { return a === true || a === false },
            view : function(a) {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                data._json = a;

                context.html( '<span class="jsedit jsedit-data jsedit-data-bool jsedit-data-bool-' + a + '">' + a + '</span>' );
                if (data.edit)
                    context.click(function() { types.boolean.edit.call(self) });
            },
            edit : function() {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                if (data.editing) return;
                console.log('editing', this);
                data.editing = true;

                var check_true  =  data.json ? ' checked="checked"' : '';
                var check_false = !data.json ? ' checked="checked"' : '';

                context.html( '<label><input type="radio" name="boolean" value="true"' + check_true + '/> TRUE</label>' +
                    '<label><input type="radio" name="boolean" value="false"' + check_false + '/> FALSE</label>'
                );
                $('input', context).click( function(evt) { return types.boolean.save.call(self, evt) } );
            },
            save : function(evt) {
                console.log('saving', this);
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                var new_value = $('input', context).get(0).checked ? true : false;

                if ( data.json !== new_value ) data.chenged = true;
                data.json = new_value;
                data.editing = false;
                types.boolean.view.call(self, new_value);
                evt.preventDefault();
                return false;
            }
        },
        number : {
            is   : function(a) { return a === a * 1 },
            view : function(a) {
                var data    = this.data('jsonEdit');
                var context = data.context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-number" title="number">' + a + '</span>' );
                if (data.edit)
                    context.click(function() { types.number.edit.call(self) });
            },
            edit : function() {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                if (data.editing) return;
                console.log('editing', this);
                data.editing = true;

                context.html( '<input type="number" name="number" title="number" value="' + data.json + '"/>' );
                $('input', context).blur(     function(evt) { return types.number.save.call(self, evt) } );
                $('input', context).keypress( function(evt) { return types.number.save.call(self, evt, true) } );
            },
            save : function(evt) {
                console.log('saving', this);
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                var new_value = $('input', context).val() * 1;

                if ( data.json !== new_value ) data.chenged = true;
                data.json = new_value;
                data.editing = false;
                types.number.view.call(self, new_value);
                evt.preventDefault();
                return false;
            }
        },
        string : {
            is   : function(a) { return a === a + '' },
            view : function(a) {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-string" title="string">' + a + '</span>' );
                if (data.edit)
                    context.click(function() { types.string.edit.call(self) });
            },
            edit : function() {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                if (data.editing) return;
                console.log('editing', this);
                data.editing = true;

                context.html( '<input type="text" name="string" title="string" value="' + data.json + '"/>' );
                $('input', context).blur(     function(evt) { return types.string.save.call(self, evt) } );
                $('input', context).keypress( function(evt) { return types.string.save.call(self, evt, true) } );
            },
            save : function(evt, key) {
                if (key &&  ( evt.charCode != 13 || evt.ctrlKey) ) return;
                console.log('saving', this);
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                var new_value = $('input', context).val();

                if ( data.json !== new_value ) data.chenged = true;
                data.json = new_value;
                data.editing = false;
                types.string.view.call(self, new_value);
                evt.preventDefault();
                return false;
            }
        },
        date : {
            is   : function(a) { return a instanceof Date },
            view : function(a) {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;
                context.html( '<span class="jsedit jsedit-data jsedit-data-date" title="date">' + a.toLocalString() + '</span>' );
                if (data.edit)
                    context.click(function() { types.date.edit.call(self) });
            },
            edit : function() {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                if (data.editing) return;
                console.log('editing', this);
                data.editing = true;

                context.html( '<input type="date" name="date" title="date" value="' + data.json + '"/>' );
                $('input', context).blur(     function(evt) { return types.date.save.call(self, evt) } );
                $('input', context).keypress( function(evt) { return types.date.save.call(self, evt, true) } );
            },
            save : function(evt) {
                console.log('saving', this);
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                var new_value = new Date($('input', context).val());

                if ( data.json != new_value ) data.chenged = true;
                data.json = new_value;
                data.editing = false;
                types.date.view.call(self, new_value);
                evt.preventDefault();
                return false;
            }
        },
        array : {
            is   : function(a) { return typeof a == 'object' && a instanceof Array },
            view : function(a) {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                context.append( '<div class="jsedit jsedit-array jsedit-array-open">[<span class="collapsed"> ... </span></div>' );
                $('.jsedit-array-open', context).click(function(evt) { return types.array.toggle.call(self, evt) });

                for ( var key in a ) {
                    // if this isn't a plain array ignore inherited properties
                    if ( !a.hasOwnProperty(key) ) continue;

                    context.append('<div class="jsedit jsedit-array jsedit-array-value" title="['+key+']"></div>');
                    var value_div = $( $('.jsedit-array-value', context).get(-1) );
                    value_div.text('');
                    value_div.jsonEdit({ json : a[key], edit : data.edit, depth : data.depth + 1, max_depth : data.max_depth });
                }

                context.append( '<div class="jsedit jsedit-array jsedit-array-close">]</div>' );
            },
            toggle : function(a) {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;
                context.toggleClass('collapse');
            }
        },
        object : {
            is   : function(a) { return typeof a == 'object' && !( a instanceof Array ) },
            view : function(a) {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;

                context.append( '<div class="jsedit jsedit-object jsedit-object-open">{<span class="collapsed"> ... </span></div>' );
                $('.jsedit-object-open', context).click(function(evt) { return types.object.toggle.call(self, evt) });

                for ( var key in a ) {
                    // if this isn't a plain object ignore inherited properties
                    if ( !a.hasOwnProperty(key) ) continue;
                    if ( !data._json[key] ) data._json[key] = {};

                    context.append('<div class="jsedit jsedit-object jsedit-object-key  "></div>');
                    var key_div = $( $('.jsedit-object-key', context).get(-1) );
                    key_div.text(key);
                    data._json[key].key_div = key_div;
                    data._json[key].key = key;

                    context.append('<div class="jsedit jsedit-object jsedit-object-value"></div>');
                    var value_div = $( $('.jsedit-object-value', context).get(-1) );
                    value_div.text('');
                    value_div.jsonEdit({ json : a[key], edit : data.edit, depth : data.depth + 1, max_depth : data.max_depth });
                    data._json[key].value_div = value_div;
                    data._json[key].value = a[key];
                }

                context.append( '<div class="jsedit jsedit-object jsedit-object-close">}</div>' );
                types.object.adjust.call(this);
            },
            toggle : function(a) {
                var self    = this;
                var data    = this.data('jsonEdit');
                var context = data.context;
                context.toggleClass('collapse');
            },
            adjust : function() {
                var self    = this;
                var data = this.data('jsonEdit');
                var max_width = 0;

                for ( var key in data._json ) {
                    if ( data._json.hasOwnProperty(key) ) {
                        data._json[key].key_div.css('width', 'auto');
                        var width = data._json[key].key_div.width();
                        //console.log(key, width, data._json[key]);
                        if ( width > max_width ) max_width = width;
                    }
                }

                for ( var key in data._json ) {
                    if ( data._json.hasOwnProperty(key) ) {
                        data._json[key].key_div.css('width', max_width + 'px');
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
     *  - json      : the data to display
     *  - edit      : Turn on editing of the JSON
     *  - max_depth : Any arrays or objects with which are this value or greater
     *                will by default closed up (hidden)
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

                if ( !data || !data.type ) {
                    var div = '<div class="jsedit jsedit-top"></div>';
                    self.append(div);
                    self.data(
                        'jsonEdit',
                        $.extend({
                            context   : $('.jsedit-top', this),
                            edit      : false,
                            depth     : 1,
                            max_depth : false,
                            _json     : {}
                        }, options)
                    );

                    data = self.data('jsonEdit');
                }

                if ( data.depth > 100 ) {
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

                if ( data.max_depth && data.depth > data.max_depth ) {
                    if ( types[ data.type ].toggle )
                        types[ data.type ].toggle.call( self );
                }

            });

            return this;
        },
        adjust : function() {
        },
        json : function() {
        },
        toggle : function() {
        },
        clear : function() {
            this.each( function() {
                var self = $(this);
                var data = self.data('jsonEdit');

                for ( var key in data ) {
                    if ( !data.hasOwnProperty(key) ) continue;
                    data[key] = null;
                }
            });
            this.html('');
        }
    };

    $.fn.jsonEdit = function(method) {
        if ( methods[method] ) {
            //console.log('method', method);
            var res = methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
            return res;
        }
        else if ( typeof method === 'object' || !method ) {
            return methods.init.apply( this, arguments );
        }
        else {
            $.error('The method "' + method + '" in unknown for jQuery.jsonEdit!');
        }
    };

})(jQuery);

