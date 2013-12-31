define([
    './class'
    ],
    function(Class){
        /**
         * Base class for all observable objects utilizing event system.
         *
         */
        var Observable = Class.extend({
            init: function(){

            },
            /**
             * Register a `callback` with this observable, for the given `eventName`. The option 'once'
             * be set to true, for the callback to be removed automatically after the event is fired the first time.
             * 
             * @param  {String}   eventName
             * @param  {Function} callback
             * @param  {Object}   options
             * @return {Function}
             * 
             */
            on: function(eventName, callback, options){},

            /**
             * Removed a registered callback and returns the callback.
             * @param  {String}   eventName
             * @param  {Function} callback
             * @param  {Object}   options
             * @return {Function}
             */
            off: function(eventName, callback, options){},

            /**
             * Trigger the named event.
             * @param  {String} eventName
             * 
             */
            trigger: function(eventName){}
        });

        return Observable;
    }
)