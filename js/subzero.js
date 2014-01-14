/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.9 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.9',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value !== 'string') {
                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; ary[i]; i += 1) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (getOwn(config.pkgs, baseName)) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        normalizedBaseParts = baseParts = [baseName];
                    } else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    }

                    name = normalizedBaseParts.concat(name.split('/'));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //'main' module name, so normalize for that.
                    pkgConfig = getOwn(config.pkgs, (pkgName = name[0]));
                    name = name.join('/');
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                    }
                } else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
                }
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }

                    if (foundMap) {
                        break;
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            return name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        normalizedName = normalize(name, parentName, applyMap);
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length - 1, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return mod.exports;
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            var c,
                                pkg = getOwn(config.pkgs, mod.map.id);
                            // For packages, only support config targeted
                            // at the main module.
                            c = pkg ? getOwn(config.config, mod.map.id + '/' + pkg.main) :
                                      getOwn(config.config, mod.map.id);
                            return  c || {};
                        },
                        exports: defined[mod.map.id]
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var map, modId, err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                map = mod.map;
                modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            if (this.map.isDefine) {
                                //If setting exports via 'module' is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                cjsModule = this.module;
                                if (cjsModule &&
                                        cjsModule.exports !== undefined &&
                                        //Make sure it is not already the exports value
                                        cjsModule.exports !== this.exports) {
                                    exports = cjsModule.exports;
                                } else if (exports === undefined && this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths and packages since they require special processing,
                //they are additive.
                var pkgs = config.pkgs,
                    shim = config.shim,
                    objs = {
                        paths: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (prop === 'map') {
                            if (!config.map) {
                                config.map = {};
                            }
                            mixin(config[prop], value, true, true);
                        } else {
                            mixin(config[prop], value, true);
                        }
                    } else {
                        config[prop] = value;
                    }
                });

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                        location = pkgObj.location;

                        //Create a brand new object on pkgs, since currentPackages can
                        //be passed in again, and config.pkgs is the internal transformed
                        //state for all package configs.
                        pkgs[pkgObj.name] = {
                            name: pkgObj.name,
                            location: location || pkgObj.name,
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            main: (pkgObj.main || 'main')
                                  .replace(currDirRegExp, '')
                                  .replace(jsSuffixRegExp, '')
                        };
                    });

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overriden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    parentPath;

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    pkgs = config.pkgs;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        pkg = getOwn(pkgs, parentModule);
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        } else if (pkg) {
                            //If module name is just the package name, then looking
                            //for the main module.
                            if (moduleName === pkg.name) {
                                pkgPath = pkg.location + '/' + pkg.main;
                            } else {
                                pkgPath = pkg.location;
                            }
                            syms.splice(0, i, pkgPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                 //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
define('sge/class',[],function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };

  return Class
});

define('sge/observable',[
    './class'
    ],
    function(Class){
        /**
         * Base class for all observable objects utilizing event system.
         *
         */
        var Observable = Class.extend({
            init: function(){
                this._lisenters = {};
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
            on: function(eventName, callback, options){
                options = options || {};
                if (this._lisenters[eventName]==undefined){
                    this._lisenters[eventName]=[];
                }
                this._lisenters[eventName].push([callback, options]);
            },

            /**
             * Removed a registered callback and returns the callback.
             * @param  {String}   eventName
             * @param  {Function} callback
             * @param  {Object}   options
             * @return {Function}
             */
            off: function(eventName, callback, options){
                if (this._lisenters[eventName]==undefined){
                    this._lisenters[eventName]=[];
                }
                this._lisenters[eventName] = this._lisenters[eventName].filter(function(data){
                    return data[0]!=callback;
                });
            },

            /**
             * Trigger the named event.
             * @param  {String} eventName
             * 
             */
            trigger: function(){
                var args = Array.prototype.slice.call(arguments);
                var eventName = args.shift();
                if (this._lisenters[eventName]==undefined){
                    return;
                }
                var callbacks = this._lisenters[eventName];
                this._lisenters[eventName] = this._lisenters[eventName].filter(function(data){
                    data[0].apply(this, args);
                    if (data[1].once){
                        return false;
                    }
                    return true;
                })
            }
        });

        return Observable;
    }
);
define('sge/Observable',[
    './class'
    ],
    function(Class){
        /**
         * Base class for all observable objects utilizing event system.
         *
         */
        var Observable = Class.extend({
            init: function(){
                this._lisenters = {};
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
            on: function(eventName, callback, options){
                options = options || {};
                if (this._lisenters[eventName]==undefined){
                    this._lisenters[eventName]=[];
                }
                this._lisenters[eventName].push([callback, options]);
            },

            /**
             * Removed a registered callback and returns the callback.
             * @param  {String}   eventName
             * @param  {Function} callback
             * @param  {Object}   options
             * @return {Function}
             */
            off: function(eventName, callback, options){
                if (this._lisenters[eventName]==undefined){
                    this._lisenters[eventName]=[];
                }
                this._lisenters[eventName] = this._lisenters[eventName].filter(function(data){
                    return data[0]!=callback;
                });
            },

            /**
             * Trigger the named event.
             * @param  {String} eventName
             * 
             */
            trigger: function(){
                var args = Array.prototype.slice.call(arguments);
                var eventName = args.shift();
                if (this._lisenters[eventName]==undefined){
                    return;
                }
                var callbacks = this._lisenters[eventName];
                this._lisenters[eventName] = this._lisenters[eventName].filter(function(data){
                    data[0].apply(this, args);
                    if (data[1].once){
                        return false;
                    }
                    return true;
                })
            }
        });

        return Observable;
    }
);
define(
    'sge/input',['./Observable'],
function(Observable){
    var KEYMAP = {
        "B1" : "space",
        "B2" : "enter"
    }
    var KEYCODES = {
        "backspace" : 8,
        "tab" : 9,
        "enter" : 13,
        "shift" : 16,
        "ctrl" : 17,
        "alt" : 18,
        "pause" : 19,
        "capslock" : 20,
        "escape" : 27,
        "space" : 32,
        "pageup" : 33,
        "pagedown" : 34,
        "end" : 35,
        "home" : 36,
        "left" : 37,
        "up" : 38,
        "right" : 39,
        "down" : 40,
        "insert" : 45,
        "delete" : 46,
        "0" : 48,
        "1" : 49,
        "2" : 50,
        "3" : 51,
        "4" : 52,
        "5" : 53,
        "6" : 54,
        "7" : 55,
        "8" : 56,
        "9" : 57,
        "A" : 65,
        "B" : 66,
        "C" : 67,
        "D" : 68,
        "E" : 69,
        "F" : 70,
        "G" : 71,
        "H" : 72,
        "I" : 73,
        "J" : 74,
        "K" : 75,
        "L" : 76,
        "M" : 77,
        "N" : 78,
        "O" : 79,
        "P" : 80,
        "Q" : 81,
        "R" : 82,
        "S" : 83,
        "T" : 84,
        "U" : 85,
        "V" : 86,
        "W" : 87,
        "X" : 88,
        "Y" : 89,
        "Z" : 90,
        "left-window-key" : 91,
        "right-window-key" : 92,
        "select" : 93,
        "numpad0" : 96,
        "numpad1" : 97,
        "numpad2" : 98,
        "numpad3" : 99,
        "numpad4" : 100,
        "numpad5" : 101,
        "numpad6" : 102,
        "numpad7" : 103,
        "numpad8" : 104,
        "numpad9" : 105,
        "multiply" : 106,
        "add" : 107,
        "subtract" : 109,
        "decimal-point" : 110,
        "divide" : 111,
        "F1" : 112,
        "F2" : 113,
        "F3" : 114,
        "F4" : 115,
        "F5" : 116,
        "F6" : 117,
        "F7" : 118,
        "F8" : 119,
        "F9" : 120,
        "F10" : 121,
        "F11" : 122,
        "F12" : 123,
        "numlock" : 144,
        "scrolllock" : 145,
        "semi-colon" : 186,
        "equals" : 187,
        "comma" : 188,
        "dash" : 189,
        "period" : 190,
        "slash" : 191,
        "accent" : 192,
        "lbracket" : 219,
        "backslash" : 220,
        "rbraket" : 221,
        "singlequote" : 222
    };

    var REVERSE_KEYCODES = {};
    var keys = Object.keys(KEYCODES);
    for (var i=0; i<keys.length; i++){
        var key = keys[i];
        var value = KEYCODES[key];
        REVERSE_KEYCODES[value] = key;
    }

    var InputProxy = Observable.extend({
        init: function(input){
            this._super();
            this._input = input
            this.enable = false;
            this.joystick = input.joystick;
            this._dpad = []
        },
        trigger: function(){
            var args = Array.prototype.slice.call(arguments);
            if (this.enable){
                this._super.apply(this, args);
            }
        },
        isPressed: function(keyCode){
            return this._input.isPressed(keyCode);
        },
        isDown: function(keyCode){
            return this._input.isDown(keyCode);
        },
        dpad: function(){
            var xaxis = 0;
            var yaxis = 0;
            if (this.joystick){
                if (this.joystick.down()){
                    yaxis++;
                }
                if (this.joystick.up()){
                    yaxis--;
                }
                if (this.joystick.right()){
                    xaxis++;
                }
                if (this.joystick.left()){
                    xaxis--;
                }
            } else {
                if (this.isDown('down')){
                    yaxis++;
                }
                if (this.isDown('up')){
                    yaxis--;
                }
                if (this.isDown('right')){
                    xaxis++;
                }
                if (this.isDown('left')){
                    xaxis--;
                }
            }
            this._dpad[0] = xaxis;
            this._dpad[1] = yaxis;
            return this._dpad;
        }
    });

    var Input = Observable.extend({
        init: function(elem){
            this._elem = document.body
            this._super()
            this._isNewKeyDown = {}
            this._isKeyDown = {};
            this._proxies = [];
            this._events = [];
            this.joystick = null;
            this._isKeyPress = {};

            if ('ontouchstart' in window){
                    
                    var isUp = false;
                    var isDown = false;
                    var isLeft = false;
                    var isRight = false;

                    var joystickStartX, joystickStartY;
                    var joystickIndex = -1;

                    elem.addEventListener('touchstart', function(evt){
                        for (var i = 0; i < evt.changedTouches.length; i++) {
                            var touch = evt.changedTouches[i];
                            if (touch.pageX < (window.innerWidth/4)){
                                
                                joystickIndex = touch.identifier;
                                joystickStartX = touch.pageX;
                                joystickStartY = touch.pageY;
                            } else {
                                this.tapCallback()
                            }
                        }
                    }.bind(this))

                    elem.addEventListener('touchmove', function(evt){
                        for (var i = 0; i < evt.changedTouches.length; i++) {
                            var touch = evt.changedTouches[i];
                            if (touch.identifier==joystickIndex){
                                var deltaX = joystickStartX - touch.pageX;
                                var deltaY = joystickStartY - touch.pageY;
                                if (deltaY>12){
                                    if (!isUp){
                                        this.keyDownCallback({keyCode: KEYCODES['up']});
                                        isUp = true;
                                    }
                                } else {
                                    if (isUp){
                                        isUp = false;
                                        this.keyUpCallback({keyCode: KEYCODES['up']});
                                    }
                                    
                                }

                                if (deltaY<-12){
                                    if (!isDown){
                                        this.keyDownCallback({keyCode: KEYCODES['down']});
                                        isDown = true;
                                    }
                                } else {
                                    if (isDown){
                                        isDown = false;
                                        this.keyUpCallback({keyCode: KEYCODES['down']});
                                    }
                                    
                                }

                                if (deltaX<-12){
                                    if (!isRight){
                                        this.keyDownCallback({keyCode: KEYCODES['right']});
                                        isRight = true;
                                    }
                                } else {
                                    if (isRight){
                                        isRight = false;
                                        this.keyUpCallback({keyCode: KEYCODES['right']});
                                    }
                                    
                                }

                                if (deltaX>12){
                                    if (!isLeft){
                                        this.keyDownCallback({keyCode: KEYCODES['left']});
                                        isLeft = true;
                                    }
                                } else {
                                    if (isLeft){
                                        isLeft = false;
                                        this.keyUpCallback({keyCode: KEYCODES['left']});
                                    }
                                    
                                }
                            }
                        }
                    }.bind(this))

                    elem.addEventListener('touchend', function(evt){
                        for (var i = evt.changedTouches.length - 1; i >= 0; i--) {
                            var touch = evt.changedTouches[i];
                            if (touch.identifier==joystickIndex){

                                if (isUp){
                                    isUp=false;
                                    this.keyUpCallback({keyCode: KEYCODES['up']});
                                }
                                if (isDown){
                                    isDown=false;
                                    this.keyUpCallback({keyCode: KEYCODES['down']});
                                }
                                if (isRight){
                                    isRight=false;
                                    this.keyUpCallback({keyCode: KEYCODES['right']});
                                }
                                if (isLeft){
                                    isLeft=false;
                                    this.keyUpCallback({keyCode: KEYCODES['left']});
                                }
                                joystickIndex=-1;
                            
                            }
                        }
                    }.bind(this))
                        
                        
            } 
            if ('onkeydown' in window) {
                window.onkeydown = this.keyDownCallback.bind(this);
                window.onkeyup = this.keyUpCallback.bind(this);
            }
            //
        },
        tapCallback : function(e){
            this._events.push('tap');
            this.keyDownCallback({keyCode: 32});
            setTimeout(function(){
                this.keyUpCallback({keyCode: 32});
            }.bind(this), 100)
        },
        keyDownCallback : function(e){
            //console.log('keydown:' + REVERSE_KEYCODES[e.keyCode]);
            if (!this._isKeyDown[e.keyCode]){
                this._isNewKeyDown[e.keyCode] = true;
            }
        },
        keyUpCallback : function(e){
            //console.log('keyup:' + REVERSE_KEYCODES[e.keyCode]);
            delete this._isNewKeyDown[e.keyCode];
            this._isKeyDown[e.keyCode] = undefined;
        },
        isPressed : function(keyCode){
            return (this._isKeyPress[KEYCODES[keyCode]] === true);
        },
        isDown : function(keyCode){
            return (this._isKeyDown[KEYCODES[keyCode]] === true);
        },
        tick : function(delta){
           this._isKeyPress = {};
           keys = Object.keys(this._isNewKeyDown);
           
           for (var i = keys.length - 1; i >= 0; i--) {
                var keyCode = keys[i];
                this._isKeyDown[keyCode] = true;
                this._isKeyPress[keyCode] = true;
                delete this._isNewKeyDown[keyCode];
                this.trigger('keydown:' + REVERSE_KEYCODES[keyCode])
           }

           for (var j = this._events.length - 1; j >= 0; j--) {
               this.trigger(this._events[j]);
           }
           this._events = [];
        },
        createProxy: function(){
            var proxy = new InputProxy(this);
            this._proxies.push(proxy);
            return proxy;
        },
        trigger: function(){
            var args = Array.prototype.slice.call(arguments);
            this._super.apply(this, args);
            var proxies = this._proxies.filter(function(p){return p.enable});
            for (var i = proxies.length - 1; i >= 0; i--) {
                proxies[i].trigger.apply(proxies[i], args);
            };
        },
    });

    return Input
})
;
define('sge/game',[
		'./class',
		'./input'
	], 
	function(Class, Input){

		var Game =  Class.extend({
			init: function(options){
				this.options = {
					width:  720,
					height: 405,
					fps:    60
				};
				var canvas = document.createElement('canvas'); 
				if (navigator.isCocoonJS || true){      
	                canvas.style.cssText="idtkscale:ScaleAspectFill;";
	                canvas.width= window.innerWidth;
	                canvas.height= window.innerHeight;
	                document.body.appendChild(canvas);
	            	this.width = canvas.width;
	            	this.height = canvas.height;
	            } else {
	            	canvas.width= this.options.width;
	                canvas.height= this.options.height;
	            	this.width = canvas.width;
	            	this.height = canvas.height;
	            }

				this.renderer = null;

				this._nextState = null;
				this._states = {};
				this._stateClassMap = {};
				this._currentState = null;
				this.renderer = PIXI.autoDetectRenderer(this.width, this.height, canvas);
				this.input = new Input(canvas);
			},
			start: function(data){
				this.data = data || {};
				document.body.appendChild(this.renderer.view);
				this.run();
				requestAnimFrame(this.render.bind(this))
			},

			run: function(fps) {
				if (fps==undefined){
					fps = 30.0;
				};
				this._lastTick = Date.now();
				this._interval = setInterval(this.tickCallback.bind(this), 1000.0 / this.options.fps);
			},

			stop: function(){
				clearInterval(this._interval);
				this._interval = null;
			},

			tickCallback: function(){
				var now = Date.now();
				var delta = now - this._lastTick;
				this._lastTick = now;
				this.input.tick(delta);
				this.tick(delta/1000);
			},

			tick: function(delta){
				if (this._currentState){
					this._currentState.tick(delta);
				}
				if (this._nextState!=null){
					this._changeState(this._nextState);
					this._nextState=null;
				}
			},

			render: function(){
				requestAnimFrame(this.render.bind(this));
				if (this._currentState){
					this._currentState.render();
				}
			},


			setStateClass: function(name, klass){
				this._stateClassMap[name] = klass;
			},
			getState: function(name){
				return this._states[name];
			},

			createState: function(name){
				if (this._stateClassMap[name]===undefined){
					console.error('No state defined for ' + name);
				}
				var state = new this._stateClassMap[name](this);
				this._states[name] = state;
				return state;
			},

			changeState: function(name){
				this._nextState = name;
			},

			_changeState: function(name){
				if (this._currentState){
					this._currentState.endState();
				}
				this._currentState = this.getState(name);
				this._currentState.startState();
			},


			resizeCallback: function(){},
			loseFocusCallback: function(){},
			endFocusCallback: function(){}

			
		});

		return Game;
	}
);
define('sge/gamestate',[
		'./class'
	], 
	function(Class){

		var GameState =  Class.extend({
			init: function(game, options){
				this.game = game;
				this._time = 0;
				this.input = game.input.createProxy();
			},
			startState: function(){},
			endState: function(){},
			tick: function(delta){
			    this._time += delta;
			},
		    getTime: function(){
		        return this._time;
		    }
		});



		return GameState;
	}
);
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author Brian Cavalier
 * @author John Hann
 * @version 2.4.0
 */
(function(define, global) { 
define('sge/when',['require'],function (require) {

	// Public API

	when.promise   = promise;    // Create a pending promise
	when.resolve   = resolve;    // Create a resolved promise
	when.reject    = reject;     // Create a rejected promise
	when.defer     = defer;      // Create a {promise, resolver} pair

	when.join      = join;       // Join 2 or more promises

	when.all       = all;        // Resolve a list of promises
	when.map       = map;        // Array.map() for promises
	when.reduce    = reduce;     // Array.reduce() for promises
	when.settle    = settle;     // Settle a list of promises

	when.any       = any;        // One-winner race
	when.some      = some;       // Multi-winner race

	when.isPromise = isPromiseLike;  // DEPRECATED: use isPromiseLike
	when.isPromiseLike = isPromiseLike; // Is something promise-like, aka thenable

	/**
	 * Register an observer for a promise or immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
	 *   rejected.
	 * @param {function?} [onProgress] callback to be called when progress updates
	 *   are issued for promiseOrValue.
	 * @returns {Promise} a new {@link Promise} that will complete with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
		// Get a trusted promise for the input promiseOrValue, and then
		// register promise handlers
		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Trusted Promise constructor.  A Promise created from this constructor is
	 * a trusted when.js promise.  Any other duck-typed promise is considered
	 * untrusted.
	 * @constructor
	 * @param {function} sendMessage function to deliver messages to the promise's handler
	 * @param {function?} inspect function that reports the promise's state
	 * @name Promise
	 */
	function Promise(sendMessage, inspect) {
		this._message = sendMessage;
		this.inspect = inspect;
	}

	Promise.prototype = {
		/**
		 * Register handlers for this promise.
		 * @param [onFulfilled] {Function} fulfillment handler
		 * @param [onRejected] {Function} rejection handler
		 * @param [onProgress] {Function} progress handler
		 * @return {Promise} new Promise
		 */
		then: function(onFulfilled, onRejected, onProgress) {
			/*jshint unused:false*/
			var args, sendMessage;

			args = arguments;
			sendMessage = this._message;

			return _promise(function(resolve, reject, notify) {
				sendMessage('when', args, resolve, notify);
			}, this._status && this._status.observed());
		},

		/**
		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		otherwise: function(onRejected) {
			return this.then(undef, onRejected);
		},

		/**
		 * Ensures that onFulfilledOrRejected will be called regardless of whether
		 * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
		 * receive the promises' value or reason.  Any returned value will be disregarded.
		 * onFulfilledOrRejected may throw or return a rejected promise to signal
		 * an additional error.
		 * @param {function} onFulfilledOrRejected handler to be called regardless of
		 *  fulfillment or rejection
		 * @returns {Promise}
		 */
		ensure: function(onFulfilledOrRejected) {
			return this.then(injectHandler, injectHandler)['yield'](this);

			function injectHandler() {
				return resolve(onFulfilledOrRejected());
			}
		},

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @return {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		'yield': function(value) {
			return this.then(function() {
				return value;
			});
		},

		/**
		 * Runs a side effect when this promise fulfills, without changing the
		 * fulfillment value.
		 * @param {function} onFulfilledSideEffect
		 * @returns {Promise}
		 */
		tap: function(onFulfilledSideEffect) {
			return this.then(onFulfilledSideEffect)['yield'](this);
		},

		/**
		 * Assumes that this promise will fulfill with an array, and arranges
		 * for the onFulfilled to be called with the array as its argument list
		 * i.e. onFulfilled.apply(undefined, array).
		 * @param {function} onFulfilled function to receive spread arguments
		 * @return {Promise}
		 */
		spread: function(onFulfilled) {
			return this.then(function(array) {
				// array may contain promises, so resolve its contents.
				return all(array, function(array) {
					return onFulfilled.apply(undef, array);
				});
			});
		},

		/**
		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected)
		 * @deprecated
		 */
		always: function(onFulfilledOrRejected, onProgress) {
			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
		}
	};

	/**
	 * Returns a resolved promise. The returned promise will be
	 *  - fulfilled with promiseOrValue if it is a value, or
	 *  - if promiseOrValue is a promise
	 *    - fulfilled with promiseOrValue's value after it is fulfilled
	 *    - rejected with promiseOrValue's reason after it is rejected
	 * @param  {*} value
	 * @return {Promise}
	 */
	function resolve(value) {
		return promise(function(resolve) {
			resolve(value);
		});
	}

	/**
	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
	 * promise will be rejected with:
	 * - promiseOrValue, if it is a value, or
	 * - if promiseOrValue is a promise
	 *   - promiseOrValue's value after it is fulfilled
	 *   - promiseOrValue's reason after it is rejected
	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
	 * @return {Promise} rejected {@link Promise}
	 */
	function reject(promiseOrValue) {
		return when(promiseOrValue, rejected);
	}

	/**
	 * Creates a {promise, resolver} pair, either or both of which
	 * may be given out safely to consumers.
	 * The resolver has resolve, reject, and progress.  The promise
	 * has then plus extended promise API.
	 *
	 * @return {{
	 * promise: Promise,
	 * resolve: function:Promise,
	 * reject: function:Promise,
	 * notify: function:Promise
	 * resolver: {
	 *	resolve: function:Promise,
	 *	reject: function:Promise,
	 *	notify: function:Promise
	 * }}}
	 */
	function defer() {
		var deferred, pending, resolved;

		// Optimize object shape
		deferred = {
			promise: undef, resolve: undef, reject: undef, notify: undef,
			resolver: { resolve: undef, reject: undef, notify: undef }
		};

		deferred.promise = pending = promise(makeDeferred);

		return deferred;

		function makeDeferred(resolvePending, rejectPending, notifyPending) {
			deferred.resolve = deferred.resolver.resolve = function(value) {
				if(resolved) {
					return resolve(value);
				}
				resolved = true;
				resolvePending(value);
				return pending;
			};

			deferred.reject  = deferred.resolver.reject  = function(reason) {
				if(resolved) {
					return resolve(rejected(reason));
				}
				resolved = true;
				rejectPending(reason);
				return pending;
			};

			deferred.notify  = deferred.resolver.notify  = function(update) {
				notifyPending(update);
				return update;
			};
		}
	}

	/**
	 * Creates a new promise whose fate is determined by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @returns {Promise} promise whose fate is determine by resolver
	 */
	function promise(resolver) {
		return _promise(resolver, monitorApi.PromiseStatus && monitorApi.PromiseStatus());
	}

	/**
	 * Creates a new promise, linked to parent, whose fate is determined
	 * by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @param {Promise?} status promise from which the new promise is begotten
	 * @returns {Promise} promise whose fate is determine by resolver
	 * @private
	 */
	function _promise(resolver, status) {
		var self, value, consumers = [];

		self = new Promise(_message, inspect);
		self._status = status;

		// Call the provider resolver to seal the promise's fate
		try {
			resolver(promiseResolve, promiseReject, promiseNotify);
		} catch(e) {
			promiseReject(e);
		}

		// Return the promise
		return self;

		/**
		 * Private message delivery. Queues and delivers messages to
		 * the promise's ultimate fulfillment value or rejection reason.
		 * @private
		 * @param {String} type
		 * @param {Array} args
		 * @param {Function} resolve
		 * @param {Function} notify
		 */
		function _message(type, args, resolve, notify) {
			consumers ? consumers.push(deliver) : enqueue(function() { deliver(value); });

			function deliver(p) {
				p._message(type, args, resolve, notify);
			}
		}

		/**
		 * Returns a snapshot of the promise's state at the instant inspect()
		 * is called. The returned object is not live and will not update as
		 * the promise's state changes.
		 * @returns {{ state:String, value?:*, reason?:* }} status snapshot
		 *  of the promise.
		 */
		function inspect() {
			return value ? value.inspect() : toPendingState();
		}

		/**
		 * Transition from pre-resolution state to post-resolution state, notifying
		 * all listeners of the ultimate fulfillment or rejection
		 * @param {*|Promise} val resolution value
		 */
		function promiseResolve(val) {
			if(!consumers) {
				return;
			}

			value = coerce(val);
			scheduleConsumers(consumers, value);
			consumers = undef;

			if(status) {
				updateStatus(value, status);
			}
		}

		/**
		 * Reject this promise with the supplied reason, which will be used verbatim.
		 * @param {*} reason reason for the rejection
		 */
		function promiseReject(reason) {
			promiseResolve(rejected(reason));
		}

		/**
		 * Issue a progress event, notifying all progress listeners
		 * @param {*} update progress event payload to pass to all listeners
		 */
		function promiseNotify(update) {
			if(consumers) {
				scheduleConsumers(consumers, progressed(update));
			}
		}
	}

	/**
	 * Creates a fulfilled, local promise as a proxy for a value
	 * NOTE: must never be exposed
	 * @param {*} value fulfillment value
	 * @returns {Promise}
	 */
	function fulfilled(value) {
		return near(
			new NearFulfilledProxy(value),
			function() { return toFulfilledState(value); }
		);
	}

	/**
	 * Creates a rejected, local promise with the supplied reason
	 * NOTE: must never be exposed
	 * @param {*} reason rejection reason
	 * @returns {Promise}
	 */
	function rejected(reason) {
		return near(
			new NearRejectedProxy(reason),
			function() { return toRejectedState(reason); }
		);
	}

	/**
	 * Creates a near promise using the provided proxy
	 * NOTE: must never be exposed
	 * @param {object} proxy proxy for the promise's ultimate value or reason
	 * @param {function} inspect function that returns a snapshot of the
	 *  returned near promise's state
	 * @returns {Promise}
	 */
	function near(proxy, inspect) {
		return new Promise(function (type, args, resolve) {
			try {
				resolve(proxy[type].apply(proxy, args));
			} catch(e) {
				resolve(rejected(e));
			}
		}, inspect);
	}

	/**
	 * Create a progress promise with the supplied update.
	 * @private
	 * @param {*} update
	 * @return {Promise} progress promise
	 */
	function progressed(update) {
		return new Promise(function (type, args, _, notify) {
			var onProgress = args[2];
			try {
				notify(typeof onProgress === 'function' ? onProgress(update) : update);
			} catch(e) {
				notify(e);
			}
		});
	}

	/**
	 * Coerces x to a trusted Promise
	 *
	 * @private
	 * @param {*} x thing to coerce
	 * @returns {*} Guaranteed to return a trusted Promise.  If x
	 *   is trusted, returns x, otherwise, returns a new, trusted, already-resolved
	 *   Promise whose resolution value is:
	 *   * the resolution value of x if it's a foreign promise, or
	 *   * x if it's a value
	 */
	function coerce(x) {
		if (x instanceof Promise) {
			return x;
		}

		if (!(x === Object(x) && 'then' in x)) {
			return fulfilled(x);
		}

		return promise(function(resolve, reject, notify) {
			enqueue(function() {
				try {
					// We must check and assimilate in the same tick, but not the
					// current tick, careful only to access promiseOrValue.then once.
					var untrustedThen = x.then;

					if(typeof untrustedThen === 'function') {
						fcall(untrustedThen, x, resolve, reject, notify);
					} else {
						// It's a value, create a fulfilled wrapper
						resolve(fulfilled(x));
					}

				} catch(e) {
					// Something went wrong, reject
					reject(e);
				}
			});
		});
	}

	/**
	 * Proxy for a near, fulfilled value
	 * @param {*} value
	 * @constructor
	 */
	function NearFulfilledProxy(value) {
		this.value = value;
	}

	NearFulfilledProxy.prototype.when = function(onResult) {
		return typeof onResult === 'function' ? onResult(this.value) : this.value;
	};

	/**
	 * Proxy for a near rejection
	 * @param {*} reason
	 * @constructor
	 */
	function NearRejectedProxy(reason) {
		this.reason = reason;
	}

	NearRejectedProxy.prototype.when = function(_, onError) {
		if(typeof onError === 'function') {
			return onError(this.reason);
		} else {
			throw this.reason;
		}
	};

	/**
	 * Schedule a task that will process a list of handlers
	 * in the next queue drain run.
	 * @private
	 * @param {Array} handlers queue of handlers to execute
	 * @param {*} value passed as the only arg to each handler
	 */
	function scheduleConsumers(handlers, value) {
		enqueue(function() {
			var handler, i = 0;
			while (handler = handlers[i++]) {
				handler(value);
			}
		});
	}

	function updateStatus(value, status) {
		value.then(statusFulfilled, statusRejected);

		function statusFulfilled() { status.fulfilled(); }
		function statusRejected(r) { status.rejected(r); }
	}

	/**
	 * Determines if x is promise-like, i.e. a thenable object
	 * NOTE: Will return true for *any thenable object*, and isn't truly
	 * safe, since it may attempt to access the `then` property of x (i.e.
	 *  clever/malicious getters may do weird things)
	 * @param {*} x anything
	 * @returns {boolean} true if x is promise-like
	 */
	function isPromiseLike(x) {
		return x && typeof x.then === 'function';
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * howMany of the supplied promisesOrValues have resolved, or will reject when
	 * it becomes impossible for howMany to resolve, for example, when
	 * (promisesOrValues.length - howMany) + 1 input promises reject.
	 *
	 * @param {Array} promisesOrValues array of anything, may contain a mix
	 *      of promises and values
	 * @param howMany {number} number of promisesOrValues to resolve
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to an array of howMany values that
	 *  resolved first, or will reject with an array of
	 *  (promisesOrValues.length - howMany) + 1 rejection reasons.
	 */
	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

		return when(promisesOrValues, function(promisesOrValues) {

			return promise(resolveSome).then(onFulfilled, onRejected, onProgress);

			function resolveSome(resolve, reject, notify) {
				var toResolve, toReject, values, reasons, fulfillOne, rejectOne, len, i;

				len = promisesOrValues.length >>> 0;

				toResolve = Math.max(0, Math.min(howMany, len));
				values = [];

				toReject = (len - toResolve) + 1;
				reasons = [];

				// No items in the input, resolve immediately
				if (!toResolve) {
					resolve(values);

				} else {
					rejectOne = function(reason) {
						reasons.push(reason);
						if(!--toReject) {
							fulfillOne = rejectOne = identity;
							reject(reasons);
						}
					};

					fulfillOne = function(val) {
						// This orders the values based on promise resolution order
						values.push(val);
						if (!--toResolve) {
							fulfillOne = rejectOne = identity;
							resolve(values);
						}
					};

					for(i = 0; i < len; ++i) {
						if(i in promisesOrValues) {
							when(promisesOrValues[i], fulfiller, rejecter, notify);
						}
					}
				}

				function rejecter(reason) {
					rejectOne(reason);
				}

				function fulfiller(val) {
					fulfillOne(val);
				}
			}
		});
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * any one of the supplied promisesOrValues has resolved or will reject when
	 * *all* promisesOrValues have rejected.
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to the value that resolved first, or
	 * will reject with an array of all rejected inputs.
	 */
	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

		function unwrapSingleResult(val) {
			return onFulfilled ? onFulfilled(val[0]) : val[0];
		}

		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
	}

	/**
	 * Return a promise that will resolve only once all the supplied promisesOrValues
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the promisesOrValues.
	 * @memberOf when
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise}
	 */
	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
		return _map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Joins multiple promises into a single returned promise.
	 * @return {Promise} a promise that will fulfill when *all* the input promises
	 * have fulfilled, or will reject when *any one* of the input promises rejects.
	 */
	function join(/* ...promises */) {
		return _map(arguments, identity);
	}

	/**
	 * Settles all input promises such that they are guaranteed not to
	 * be pending once the returned promise fulfills. The returned promise
	 * will always fulfill, except in the case where `array` is a promise
	 * that rejects.
	 * @param {Array|Promise} array or promise for array of promises to settle
	 * @returns {Promise} promise that always fulfills with an array of
	 *  outcome snapshots for each input promise.
	 */
	function settle(array) {
		return _map(array, toFulfilledState, toRejectedState);
	}

	/**
	 * Promise-aware array map function, similar to `Array.prototype.map()`,
	 * but input array may contain promises or values.
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function map(array, mapFunc) {
		return _map(array, mapFunc);
	}

	/**
	 * Internal map that allows a fallback to handle rejections
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @param {function?} fallback function to handle rejected promises
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function _map(array, mapFunc, fallback) {
		return when(array, function(array) {

			return _promise(resolveMap);

			function resolveMap(resolve, reject, notify) {
				var results, len, toResolve, i;

				// Since we know the resulting length, we can preallocate the results
				// array to avoid array expansions.
				toResolve = len = array.length >>> 0;
				results = [];

				if(!toResolve) {
					resolve(results);
					return;
				}

				// Since mapFunc may be async, get all invocations of it into flight
				for(i = 0; i < len; i++) {
					if(i in array) {
						resolveOne(array[i], i);
					} else {
						--toResolve;
					}
				}

				function resolveOne(item, i) {
					when(item, mapFunc, fallback).then(function(mapped) {
						results[i] = mapped;
						notify(mapped);

						if(!--toResolve) {
							resolve(results);
						}
					}, reject);
				}
			}
		});
	}

	/**
	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
	 * input may contain promises and/or values, and reduceFunc
	 * may return either a value or a promise, *and* initialValue may
	 * be a promise for the starting value.
	 *
	 * @param {Array|Promise} promise array or promise for an array of anything,
	 *      may contain a mix of promises and values.
	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
	 *      where total is the total number of items being reduced, and will be the same
	 *      in each call to reduceFunc.
	 * @returns {Promise} that will resolve to the final reduced value
	 */
	function reduce(promise, reduceFunc /*, initialValue */) {
		var args = fcall(slice, arguments, 1);

		return when(promise, function(array) {
			var total;

			total = array.length;

			// Wrap the supplied reduceFunc with one that handles promises and then
			// delegates to the supplied.
			args[0] = function (current, val, i) {
				return when(current, function (c) {
					return when(val, function (value) {
						return reduceFunc(c, value, i, total);
					});
				});
			};

			return reduceArray.apply(array, args);
		});
	}

	// Snapshot states

	/**
	 * Creates a fulfilled state snapshot
	 * @private
	 * @param {*} x any value
	 * @returns {{state:'fulfilled',value:*}}
	 */
	function toFulfilledState(x) {
		return { state: 'fulfilled', value: x };
	}

	/**
	 * Creates a rejected state snapshot
	 * @private
	 * @param {*} x any reason
	 * @returns {{state:'rejected',reason:*}}
	 */
	function toRejectedState(x) {
		return { state: 'rejected', reason: x };
	}

	/**
	 * Creates a pending state snapshot
	 * @private
	 * @returns {{state:'pending'}}
	 */
	function toPendingState() {
		return { state: 'pending' };
	}

	//
	// Internals, utilities, etc.
	//

	var reduceArray, slice, fcall, nextTick, handlerQueue,
		setTimeout, funcProto, call, arrayProto, monitorApi,
		cjsRequire, undef;

	cjsRequire = require;

	//
	// Shared handler queue processing
	//
	// Credit to Twisol (https://github.com/Twisol) for suggesting
	// this type of extensible queue + trampoline approach for
	// next-tick conflation.

	handlerQueue = [];

	/**
	 * Enqueue a task. If the queue is not currently scheduled to be
	 * drained, schedule it.
	 * @param {function} task
	 */
	function enqueue(task) {
		if(handlerQueue.push(task) === 1) {
			nextTick(drainQueue);
		}
	}

	/**
	 * Drain the handler queue entirely, being careful to allow the
	 * queue to be extended while it is being processed, and to continue
	 * processing until it is truly empty.
	 */
	function drainQueue() {
		var task, i = 0;

		while(task = handlerQueue[i++]) {
			task();
		}

		handlerQueue = [];
	}

	// capture setTimeout to avoid being caught by fake timers
	// used in time based tests
	setTimeout = global.setTimeout;

	// Allow attaching the monitor to when() if env has no console
	monitorApi = typeof console != 'undefined' ? console : when;

	// Prefer setImmediate or MessageChannel, cascade to node,
	// vertx and finally setTimeout
	/*global setImmediate,MessageChannel,process*/
	if (typeof setImmediate === 'function') {
		nextTick = setImmediate.bind(global);
	} else if(typeof MessageChannel !== 'undefined') {
		var channel = new MessageChannel();
		channel.port1.onmessage = drainQueue;
		nextTick = function() { channel.port2.postMessage(0); };
	} else if (typeof process === 'object' && process.nextTick) {
		nextTick = process.nextTick;
	} else {
		try {
			// vert.x 1.x || 2.x
			nextTick = cjsRequire('vertx').runOnLoop || cjsRequire('vertx').runOnContext;
		} catch(ignore) {
			nextTick = function(t) { setTimeout(t, 0); };
		}
	}

	//
	// Capture/polyfill function and array utils
	//

	// Safe function calls
	funcProto = Function.prototype;
	call = funcProto.call;
	fcall = funcProto.bind
		? call.bind(call)
		: function(f, context) {
			return f.apply(context, slice.call(arguments, 2));
		};

	// Safe array ops
	arrayProto = [];
	slice = arrayProto.slice;

	// ES5 reduce implementation if native not available
	// See: http://es5.github.com/#x15.4.4.21 as there are many
	// specifics and edge cases.  ES5 dictates that reduce.length === 1
	// This implementation deviates from ES5 spec in the following ways:
	// 1. It does not check if reduceFunc is a Callable
	reduceArray = arrayProto.reduce ||
		function(reduceFunc /*, initialValue */) {
			/*jshint maxcomplexity: 7*/
			var arr, args, reduced, len, i;

			i = 0;
			arr = Object(this);
			len = arr.length >>> 0;
			args = arguments;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if(args.length <= 1) {
				// Skip to the first real element in the array
				for(;;) {
					if(i in arr) {
						reduced = arr[i++];
						break;
					}

					// If we reached the end of the array without finding any real
					// elements, it's a TypeError
					if(++i >= len) {
						throw new TypeError();
					}
				}
			} else {
				// If initialValue provided, use it
				reduced = args[1];
			}

			// Do the actual reduce
			for(;i < len; ++i) {
				if(i in arr) {
					reduced = reduceFunc(reduced, arr[i], i, arr);
				}
			}

			return reduced;
		};

	function identity(x) {
		return x;
	}

	return when;
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }, this);

define('sge/loader',[
        './class',
        './when'
    ], function(Class, when){
        var ajax = function(url, callback, failure){
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open('get', url, true);
            xmlHttp.send(null);
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        callback(xmlHttp.responseText, xmlHttp);
                    } else {
                        failure(xmlHttp);
                    }
                } else {
                  //still loading
                }
            }
        }



        var Loader = Class.extend({
            init: function(){},
            loadJSON: function(url){
                var defered = new when.defer();
                ajax(url, function(text){
                    var data = JSON.parse(text);
                    defered.resolve(data);
                }, function(xmlHttp){
                    defered.reject(xmlHttp);
                });
                return defered.promise;
            },
            loadJS: function(url, that, locals) {
                var defered = new when.defer();
                console.log('Src', url)
                ajax(url, function(text){
                    var sandbox = this.createSandbox(text, that, locals);
                    defered.resolve(sandbox);
                }.bind(this), function(xmlHttp){
                    defered.reject(xmlHttp);
                });
                return defered.promise;
            },
            loadFont: function(url){
                var defered = new when.defer();
                var loader = new PIXI.AssetLoader([url]);
                loader.onComplete = function(){
                    defered.resolve();
                }
                loader.load();
                return defered.promise;
            },
            loadTexture: function(url, textureName){
                var defered = new when.defer();
                var tex = new PIXI.ImageLoader(url);
                tex.addEventListener("loaded", function(event){
                    PIXI.TextureCache[textureName] = new PIXI.Texture(tex.texture.baseTexture);
                    defered.resolve(tex);
                });
                tex.load();
                return defered.promise;
            },
            loadSpriteFrames: function(url, textureName, width, height){
                var defered = new when.defer();
                var tex = new PIXI.ImageLoader(url);
                tex.addEventListener("loaded", function(event){
                    var xcount = Math.floor(tex.texture.width/width);
                    var ycount = Math.floor(tex.texture.height/height);
                    var frame = 0;
                    var texture;
                    for (var y=0;y<ycount;y++){
                        for(var x=0;x<xcount;x++){
                            texture = new PIXI.Texture(tex.texture, {x: x*width, y: y*height, width: width, height: height});
                            PIXI.TextureCache[textureName+'-'+frame] = texture;
                            frame++;
                            
                        }
                    }
                    defered.resolve(tex);
                });
                tex.load();
                return defered.promise;
            },
            createSandbox: function(code, that, locals) {
                that = that || Object.create(null);
                locals = locals || {};
                var params = []; // the names of local variables
                var args = []; // the local variables

                for (var param in locals) {
                    if (locals.hasOwnProperty(param)) {
                        args.push(locals[param]);
                        params.push(param);
                    }
                }

                var context = Array.prototype.concat.call(that, params, code); // create the parameter list for the sandbox
                var sandbox = new (Function.prototype.bind.apply(Function, context)); // create the sandbox function
                context = Array.prototype.concat.call(that, args); // create the argument list for the sandbox

                return Function.prototype.bind.apply(sandbox, context); // bind the local variables to the sandbox
            },
        })

        return Loader
    }
);
define('sge/main',[
		'./class',
		'./observable',
		'./game',
		'./gamestate',
		'./loader',
		'./when'
	], function(Class, Observable, Game, GameState, Loader, When){
		return {
			Class : Class,
			Observable : Observable,
			Game : Game,
			GameState : GameState,
			Loader : Loader,
			When : When
		}
	}
);
define('sge', ['sge/main'], function (main) { return main; });

define('subzero/config',[], function(){
	return {
		colors : {
			primaryBright:    '0x0B61A4',
			primaryMid:       '0x25567B',
			primaryDark: 	  '0x033E6B',
			primaryAlt1:      '0x3F92D2',
			primaryAlt2:      '0x66A3D2', 
			complementBright: '0xFF9200',
			complementMid:    '0xBF8230',
			complementDark:   '0xA65F00',
			complementAlt1:   '0xFFAD40',
			complementAlt2:   '0xFFC373'
		}
	}
});
define('subzero/tilemap',[
		'sge'
	], function(sge){
		var Tile = sge.Class.extend({
			init: function(){
				this.layers = {};
				this.data = {};
			}
		});

		var TileMap = sge.Class.extend({
			init: function(width, height, renderer){
				this.renderer = renderer;
				this.width = width;
				this.height = height;
				this.tileSize = 32;
				this._tileTextures = [];

				this.tiles = [];
				this._chunkSize = 1024;
				this.chunk = {};
				this.chunkBase = {};
				this.chunkCanopy = {};
				this._ready = false;
				this.container = new PIXI.DisplayObjectContainer();
				this.container.position.x=this.container.position.y=0;

				this.containerBase = new PIXI.DisplayObjectContainer();
				this.containerBase.position.x=this.containerBase.position.y=0;

				this.containerCanopy = new PIXI.DisplayObjectContainer();
				this.containerCanopy.position.x=this.containerCanopy.position.y=0;

				for (var i = (width * height) -1; i >= 0; i--) {
					var tile = new Tile();
					tile.layers.base = 0;
					this.tiles.push(tile);
				};
			},
	        getIndex : function(x, y){
	            var index = (y * this.width) + x;
	            if (x > this.width-1 || x < 0){
	                return null;
	            }
	            if (y > this.height-1 || y < 0){
	                return null;
	            }
	            return index;
	        },
	        getTile : function(x, y){
	            return this.tiles[this.getIndex(x, y)] || null;
	        },
	        getTileAtPos : function(x, y){
	        	return this.getTile(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize))
	        },
	        getTiles: function(){
	        	return this.tiles.slice(0);
	        },
			render: function(){
				if (!this._ready){
					return
				}
				var pixelWidth = this.width * this.tileSize;
				var pixelHeight = this.height * this.tileSize;
				var chunks = [Math.ceil(pixelWidth/this._chunkSize),Math.ceil(pixelHeight/this._chunkSize)];
				var startX = -this.container.position.x;
				var startY = -this.container.position.y;
				var endX = startX + this.renderer.width;
				var endY = startY + this.renderer.height;
				var scx = Math.floor(startX/this._chunkSize);
				var sex = Math.ceil(endX/this._chunkSize);
				var scy = Math.floor(startY/this._chunkSize);
				var sey = Math.ceil(endY/this._chunkSize);
				for (var x=0; x<chunks[0]; x++){
					for (var y=0; y<chunks[1]; y++){
						if ((x>=scx) && (x<= sex) &&  y>= scy && y<=sey){
							if (this.container.children.indexOf(this.chunk[x+'.'+y])<0){
								this.container.addChild(this.chunk[x+'.'+y]);
							}
						} else {
							if (this.container.children.indexOf(this.chunk[x+'.'+y])>=0){
								this.container.removeChild(this.chunk[x+'.'+y])
							}
						}
					}
				}
			},
			preRender : function(){
				var pixelWidth = this.width * this.tileSize;
				var pixelHeight = this.height * this.tileSize;
				var chunks = [Math.ceil(pixelWidth/this._chunkSize),Math.ceil(pixelHeight/this._chunkSize)];
				
				for (var x=0; x<chunks[0]; x++){
					for (var y=0; y<chunks[1]; y++){
						this.preRenderChunk(x, y);
					}
				}

				this._ready = true;
				this.render();

			},
			preRenderChunk: function(cx, cy){

				var startX = cx * this._chunkSize;
				var startY = cy * this._chunkSize;
				var endX = Math.min((cx + 1) * (this._chunkSize), this.width * this.tileSize);
				var endY = Math.min((cy + 1) * (this._chunkSize), this.height * this.tileSize);

				var chunkStartX = Math.floor(startX / this.tileSize);
				var chunkStartY = Math.floor(startY / this.tileSize);

				var chunkEndX = Math.ceil(endX / this.tileSize);
				var chunkEndY = Math.ceil(endY / this.tileSize);

				var chunk = new PIXI.DisplayObjectContainer();


				for (var x=chunkStartX; x<chunkEndX; x++){
					for (var y=chunkStartY; y<chunkEndY; y++){
						var tile = this.getTile(x, y);
						if (tile){
							if (tile.layers.base!==undefined){
								var sprite = new PIXI.Sprite(this._tileTextures[tile.layers.base]);

								sprite.position.x = (x*this.tileSize) - startX;
								sprite.position.y = (y*this.tileSize) - startY;
								chunk.addChild(sprite);
							}
							name='layer0'
							if (tile.layers[name]!==undefined){
								var sprite = new PIXI.Sprite(this._tileTextures[tile.layers[name]]);
								sprite.position.x = (x*this.tileSize) - startX;
								sprite.position.y = (y*this.tileSize) - startY;
								chunk.addChild(sprite);
							}
						}
					}
				}

				// render the tilemap to a render texture
				var texture = new PIXI.RenderTexture(endX-startX, endY-startY);
				texture.render(chunk);
				// create a single background sprite with the texture
				var background = new PIXI.Sprite(texture, {x: 0, y: 0, width: this._chunkSize, heigh:this._chunkSize});
				background.position.x = cx * this._chunkSize;
				background.position.y = cy * this._chunkSize;
				this.chunk[cx+'.'+cy] = chunk;
			}

		});

		return TileMap;
	}
);
define('subzero/tiledlevel',[
		'sge'
	], function(sge){
		var deepExtend = function(destination, source) {
          for (var property in source) {
            if (source[property] && source[property].constructor &&
             source[property].constructor === Object) {
              destination[property] = destination[property] || {};
              arguments.callee(destination[property], source[property]);
            } else {
              destination[property] = source[property];
            }
          }
          return destination;
        };
        
		var TiledLevel = function(state, map, levelData){
			var defered = new sge.When.defer();
			var tileset = new PIXI.ImageLoader('content/tiles/base_tiles.png', false);
			tileset.addEventListener("loaded", function(event){

				var layerData = {};

				levelData.layers.forEach(function(layer){
					layerData[layer.name] = layer;
					if (layer.type=='tilelayer'){
						var layerName = layer.name;
						var xTileCount = levelData.tilesets[0].imagewidth / levelData.tilesets[0].tilewidth;
						var yTileCount = levelData.tilesets[0].imageheight / levelData.tilesets[0].tileheight;
						for (var i = 0; i < (xTileCount * yTileCount); i++) {
							var tex = new PIXI.Texture(tileset.texture.baseTexture, {x: (i % xTileCount) * 32 , y: Math.floor(i / xTileCount) * 32, width:32, height: 32});
							map._tileTextures.push(tex);
						};
						for (var i = layer.data.length - 1; i >= 0; i--) {
							var tileIdx = layer.data[i]-1;
							if (layerName=='terrain'){
								map.tiles[i].data.passable = (tileIdx<0)
							} else {
								if (tileIdx>=0){
									map.tiles[i].layers[layerName] = tileIdx;
								}
							}
						};
					}
				}.bind(this));
				
				var regionLayer = layerData['regions'];
				if (regionLayer){
					for (var i = regionLayer.objects.length - 1; i >= 0; i--) {
						var regionData = regionLayer.objects[i];
						var tx = regionData.x;
						var ty = regionData.y;
						var width = regionData.width;
						var height = regionData.height;

						//Create Region
						
						if (regionData.properties.spawn){
							spawnData = regionData.properties.spawn.split(':');
							var count = parseInt(spawnData[1])
							for (var j=0;j<count;j++){
								var spawnX = tx + (Math.random()*width);
								var spawnY = ty + (Math.random()*height);
								var e= state.factory.create(spawnData[0], {xform: {tx: spawnX, ty: spawnY}});
								state.addEntity(e);
							}
						}



						if (regionData.properties.socialValue){
							socialValue = parseInt(regionData.properties.socialValue);
							var startX = Math.floor(tx/map.tileSize);
							var startY = Math.floor(ty/map.tileSize);
							for (var x=0;x<width/32;x++){
								for (var y=0;y<height/32;y++){
									map.getTile(x, y).data.socialValue = socialValue;
								}
							}

						}
					};
				}

				var entityLayer = layerData['entities']
				if (entityLayer){
					for (var i = entityLayer.objects.length - 1; i >= 0; i--) {
						var entityData = entityLayer.objects[i];
						if (state.factory.has(entityData.type)){
							var eData = {};
							var decorators = []
							var keys = Object.keys(entityData.properties);
							keys.forEach(function(key){
								
								var subpaths = key.split('.');
								var pointer = eData;
								var val = entityData.properties[key];

								while (subpaths.length){
									var sp = subpaths.shift();
									if (pointer[sp]==undefined){
										pointer[sp]={}
									}
									if (subpaths.length==0){
										pointer[sp] = val;
									} else {
										pointer = pointer[sp];
									}
								}
								

							}.bind(this));
							eData = deepExtend(eData, {xform: {tx: entityData.x+16, ty: entityData.y-32+16}}); //-32 for tiled hack.
							
							var spawn = true;
							if (eData.meta!==undefined){
								if (eData.meta.spawn!==undefined){
									spawn = Boolean(eData.meta.spawn);
								}
							}
							var entity = state.factory.create(entityData.type, eData);
							entity.name = entityData.name;

							if (spawn){
								state.addEntity(entity);	
							} else {
								state._unspawnedEntities[entity.name] = entity;
							}
							state._entity_name[entityData.name] = entity;
						} else {
							console.error('Missing:', entityData.type);
						}
					}

				}
				//*/

				defered.resolve();
			})
			tileset.load();

			return defered.promise;
		}
		return TiledLevel
	}
);
define('subzero/component',[
		'sge'
	], function(sge){
		var Component = sge.Class.extend({
			init: function(entity, data){
				this.entity = entity;
				this._callbacks = [];
				this.enabled = data.enabled!==undefined ? Boolean(data.enabled) : true;
			},
			get: function(attr){
				return this.entity.get(attr)
			},
			set: function(attr, value){
				return this.entity.set(attr, value);
			},
			register: function(state){
				this.state = state
			},
			deregister: function(){

			},
			on: function(evt, cb, options){
				if (this._callbacks[cb]===undefined){
					this._callbacks[cb] = cb.bind(this);
				}
				this.entity.on(evt, this._callbacks[cb], options);
			},
			off: function(evt, cb){
				this.entity.off(evt, this._callbacks[cb]);
			}
		})

		Component._classMap = {};

		Component.add = function(type, data){
			klass = Component.extend(data);
			Component._classMap[type] = klass;
			return klass;
		}

		Component.Create = function(entity, type, data){
			if (Component._classMap[type]==undefined){
				console.error('Missing Component:', type);
				return null;
			}
			comp = new Component._classMap[type](entity, data);
			return comp;
		}

		Component.add('xform', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('xform.tx', data.tx || 0);
				this.set('xform.ty', data.ty || 0);
			}
		});

		Component.add('sprite', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('sprite.width', data.width || 64);
				this.set('sprite.height', data.height || 64);

				this.set('sprite.offsetx', data.offsetx || 0);
				this.set('sprite.offsety', data.offsety || 0);

				
				this.set('sprite.src', data.src || 'man_a');
				this.set('sprite.frame', data.frame || 1);

				this.set('sprite.container', data.container || 'stage');
				this._sprite = new PIXI.Sprite.fromFrame(this.get('sprite.src') + '-' + this.get('sprite.frame'));


			},

			register: function(state){
				this._super(state);
				this.parent = state.containers[this.get('sprite.container')];
				this.parent.addChild(this._sprite);
				this._sprite.position.x = this.get('xform.tx');
				this._sprite.position.y = this.get('xform.ty');
				this._test_a = this.get('xform.ty');
				this._test_b = Math.random() * 2 * Math.PI;
				var idx = this.parent.children.indexOf(this._sprite);
				
				var next = this.parent.children[idx-1];
				
				if (next){
					while (next.position.y>this._sprite.position.y){
						this.parent.swapChildren(this._sprite, next);
						idx--;
						if (idx<=0){
							break;
						}
						next = this.parent.children[idx-1];
					}
				}
			},


			render: function(){
				
				var dx = this.get('xform.tx') - this._sprite.position.x;
				var dy = this.get('xform.ty') - this._sprite.position.y;
				if (dx != 0 || dy != 0){
					//*
					if (dy>0){
						var idx = this.parent.children.indexOf(this._sprite);
						var next = this.parent.children[idx+1];
						if (next){
							if (next.position.y<this.get('xform.ty')){
								this.parent.swapChildren(this._sprite, next);
							}
						}
					} else if(dy<0){
						var idx = this.parent.children.indexOf(this._sprite);
						var next = this.parent.children[idx-1];
						if (next){
							if (next.position.y>this.get('xform.ty')){
								this.parent.swapChildren(this._sprite, next);
							}
						}
					}
					//*/
					this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
				}
				this._sprite.setTexture(PIXI.TextureCache[this.get('sprite.src') + '-' + this.get('sprite.frame')])
			}
		});

		return Component;
	}
);
define('subzero/entity',[
		'sge',
		'./component',
	], function(sge, Component){
		var Entity = sge.Observable.extend({
			init: function(){
				this._super();
				this.id = null
				this.data = {};
				this.components = {};
				this.tags = [];
				this._tick_funcs = [];
				this._render_funcs = [];
			},
			get: function(attr){
				return this.data[attr]
			},
			set: function(attr, value){
				this.data[attr] = value;
				return value
			},
			tick: function(delta){
				for (var i = this._tick_funcs.length - 1; i >= 0; i--) {
					this._tick_funcs[i](delta);
				};
			},
			render: function(delta){
				for (var i = this._render_funcs.length - 1; i >= 0; i--) {
					this._render_funcs[i]();
				};
			},
			register: function(state){
				var keys = Object.keys(this.components);
				keys.forEach(function(key){
					this.components[key].register(state);
					if (this.components[key].render){
						this._render_funcs.push(this.components[key].render.bind(this.components[key]))
					}
					if (this.components[key].tick){
						this._tick_funcs.push(function(delta){
							if (this.components[key].enabled){
								this.components[key].tick(delta)
							}
						}.bind(this));
					}
				}.bind(this));
			},
			deregister: function(state){
				var keys = Object.keys(this.components);
				keys.forEach(function(key){
					this.components[key].deregister(state);
				}.bind(this));
			}
		})

		Entity.Factory = function(data){
			var entity = new Entity();
			Object.keys(data).forEach(function(comp){
				var compData = data[comp];
				var c = Component.Create(entity, comp, compData);
				if (c){
					entity.components[comp] = c;
				}
			});
			return entity;
		}

		return Entity;
	}
);
// Version 0.2 - Copyright 2013 -  Jim Riecken <jimr@jimr.ca>
//
// Released under the MIT License - https://github.com/jriecken/sat-js
//
// A simple library for determining intersections of circles and
// polygons using the Separating Axis Theorem.
/** @preserve SAT.js - Version 0.2 - Copyright 2013 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

/*global define: false, module: false*/
/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true, 
  eqeqeq:true, bitwise:true, strict:true, undef:true, 
  curly:true, browser:true */

// Create a UMD wrapper for SAT. Works in:
//
//  - Plain browser via global SAT variable
//  - AMD loader (like require.js)
//  - Node.js
//
// The quoted properties all over the place are used so that the Closure Compiler
// does not mangle the exposed API in advanced mode.
/**
 * @param {*} root - The global scope
 * @param {Function} factory - Factory that creates SAT module
 */
(function (root, factory) {
  
  if (typeof define === 'function' && define['amd']) {
    define('subzero/sat',factory);
  } else if (typeof exports === 'object') {
    module['exports'] = factory();
  } else {
    root['SAT'] = factory();
  }
}(this, function () {
  

  var SAT = {};

  //
  // ## Vector
  //
  // Represents a vector in two dimensions with `x` and `y` properties.


  // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
  // a coordinate is not specified, it will be set to `0`
  /** 
   * @param {?number=} x The x position.
   * @param {?number=} y The y position.
   * @constructor
   */
  function Vector(x, y) {
    this['x'] = x || 0;
    this['y'] = y || 0;
  }
  SAT['Vector'] = Vector;
  // Alias `Vector` as `V`
  SAT['V'] = Vector;


  // Copy the values of another Vector into this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['copy'] = Vector.prototype.copy = function(other) {
    this['x'] = other['x'];
    this['y'] = other['y'];
    return this;
  };

  // Change this vector to be perpendicular to what it was before. (Effectively
  // roatates it 90 degrees in a clockwise direction)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['perp'] = Vector.prototype.perp = function() {
    var x = this['x'];
    this['x'] = this['y'];
    this['y'] = -x;
    return this;
  };

  // Rotate this vector (counter-clockwise) by the specified angle (in radians).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Vector} This for chaining.
   */
  Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {
    var x = this['x'];
    var y = this['y'];
    this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
    this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
    return this;
  };

  // Reverse this vector.
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reverse'] = Vector.prototype.reverse = function() {
    this['x'] = -this['x'];
    this['y'] = -this['y'];
    return this;
  };
  

  // Normalize this vector.  (make it have length of `1`)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['normalize'] = Vector.prototype.normalize = function() {
    var d = this.len();
    if(d > 0) {
      this['x'] = this['x'] / d;
      this['y'] = this['y'] / d;
    }
    return this;
  };
  
  // Add another vector to this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['add'] = Vector.prototype.add = function(other) {
    this['x'] += other['x'];
    this['y'] += other['y'];
    return this;
  };
  
  // Subtract another vector from this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaiing.
   */
  Vector.prototype['sub'] = Vector.prototype.sub = function(other) {
    this['x'] -= other['x'];
    this['y'] -= other['y'];
    return this;
  };
  
  // Scale this vector. An independant scaling factor can be provided
  // for each axis, or a single scaling factor that will scale both `x` and `y`.
  /**
   * @param {number} x The scaling factor in the x direction.
   * @param {?number=} y The scaling factor in the y direction.  If this
   *   is not specified, the x scaling factor will be used.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['scale'] = Vector.prototype.scale = function(x,y) {
    this['x'] *= x;
    this['y'] *= y || x;
    return this; 
  };
  
  // Project this vector on to another vector.
  /**
   * @param {Vector} other The vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['project'] = Vector.prototype.project = function(other) {
    var amt = this.dot(other) / other.len2();
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };
  
  // Project this vector onto a vector of unit length. This is slightly more efficient
  // than `project` when dealing with unit vectors.
  /**
   * @param {Vector} other The unit vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['projectN'] = Vector.prototype.projectN = function(other) {
    var amt = this.dot(other);
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };
  
  // Reflect this vector on an arbitrary axis.
  /**
   * @param {Vector} axis The vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflect'] = Vector.prototype.reflect = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.project(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };
  
  // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
  // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
  /**
   * @param {Vector} axis The unit vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflectN'] = Vector.prototype.reflectN = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.projectN(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };
  
  // Get the dot product of this vector and another.
  /**
   * @param {Vector}  other The vector to dot this one against.
   * @return {number} The dot product.
   */
  Vector.prototype['dot'] = Vector.prototype.dot = function(other) {
    return this['x'] * other['x'] + this['y'] * other['y'];
  };
  
  // Get the squared length of this vector.
  /**
   * @return {number} The length^2 of this vector.
   */
  Vector.prototype['len2'] = Vector.prototype.len2 = function() {
    return this.dot(this);
  };
  
  // Get the length of this vector.
  /**
   * @return {number} The length of this vector.
   */
  Vector.prototype['len'] = Vector.prototype.len = function() {
    return Math.sqrt(this.len2());
  };
  
  // ## Circle
  //
  // Represents a circle with a position and a radius.

  // Create a new circle, optionally passing in a position and/or radius. If no position
  // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
  // have a radius of `0`.
  /**
   * @param {Vector=} pos A vector representing the position of the center of the circle
   * @param {?number=} r The radius of the circle
   * @constructor
   */
  function Circle(pos, r) {
    this['pos'] = pos || new Vector();
    this['r'] = r || 0;
  }
  SAT['Circle'] = Circle;

  // ## Polygon
  //
  // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
  //
  // The edges/normals of the polygon will be calculated on creation and stored in the
  // `edges` and `normals` properties. If you change the polygon's points, you will need
  // to call `recalc` to recalculate the edges/normals.

  // Create a new polygon, passing in a position vector, and an array of points (represented
  // by vectors relative to the position vector). If no position is passed in, the position
  // of the polygon will be `(0,0)`.
  /**
   * @param {Vector=} pos A vector representing the origin of the polygon. (all other
   *   points are relative to this one)
   * @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @constructor
   */
  function Polygon(pos, points) {
    this['pos'] = pos || new Vector();
    this['points'] = points || [];
    this.recalc();
  }
  SAT['Polygon'] = Polygon;
  
  // Recalculates the edges and normals of the polygon. This **must** be called
  // if the `points` array is modified at all and the edges or normals are to be
  // accessed.
  /**
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['recalc'] = Polygon.prototype.recalc = function() {
    // The edges here are the direction of the `n`th edge of the polygon, relative to
    // the `n`th point. If you want to draw a given edge from the edge value, you must
    // first translate to the position of the starting point.
    this['edges'] = [];
    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
    // to the position of the `n`th point. If you want to draw an edge normal, you must first
    // translate to the position of the starting point.
    this['normals'] = [];
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      var p1 = points[i]; 
      var p2 = i < len - 1 ? points[i + 1] : points[0];
      var e = new Vector().copy(p2).sub(p1);
      var n = new Vector().copy(e).perp().normalize();
      this['edges'].push(e);
      this['normals'].push(n);
    }
    return this;
  };

  // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
  //
  // Note: You do **not** need to call `recalc` after rotation.
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['rotate'] = Polygon.prototype.rotate = function(angle) {
    var i;
    var points = this['points'];
    var edges = this['edges'];
    var normals = this['normals'];
    var len = points.length;
    for (i = 0; i < len; i++) {
      points[i].rotate(angle);
      edges[i].rotate(angle);
      normals[i].rotate(angle);
    }
    return this;
  };

  // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
  // system* (i.e. `pos`).
  //
  // This is most useful to change the "center point" of a polygon.
  //
  // Note: You do **not** need to call `recalc` after translation.
  /**
   * @param {number} x The horizontal amount to translate.
   * @param {number} y The vertical amount to translate.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {
    var i;
    var points = this['points'];
    var len = points.length;
    for (i = 0; i < len; i++) {
      points[i].x += x;
      points[i].y += y;
    }
    return this;
  };

  // ## Box
  //
  // Represents an axis-aligned box, with a width and height.


  // Create a new box, with the specified position, width, and height. If no position
  // is given, the position will be `(0,0)`. If no width or height are given, they will
  // be set to `0`.
  /**
   * @param {Vector=} pos A vector representing the top-left of the box.
   * @param {?number=} w The width of the box.
   * @param {?number=} h The height of the box.
   * @constructor
   */
  function Box(pos, w, h) {
    this['pos'] = pos || new Vector();
    this['w'] = w || 0;
    this['h'] = h || 0;
  }
  SAT['Box'] = Box;

  // Returns a polygon whose edges are the same as this box.
  /**
   * @return {Polygon} A new Polygon that represents this box.
   */
  Box.prototype['toPolygon'] = Box.prototype.toPolygon = function() {
    var pos = this['pos'];
    var w = this['w'];
    var h = this['h'];
    return new Polygon(new Vector(pos['x'], pos['y']), [
     new Vector(), new Vector(w, 0), 
     new Vector(w,h), new Vector(0,h)
    ]);
  };
  
  // ## Response
  //
  // An object representing the result of an intersection. Contains:
  //  - The two objects participating in the intersection
  //  - The vector representing the minimum change necessary to extract the first object
  //    from the second one (as well as a unit vector in that direction and the magnitude
  //    of the overlap)
  //  - Whether the first object is entirely inside the second, and vice versa.
  /**
   * @constructor
   */  
  function Response() {
    this['a'] = null;
    this['b'] = null;
    this['overlapN'] = new Vector();
    this['overlapV'] = new Vector();
    this.clear();
  }
  SAT['Response'] = Response;

  // Set some values of the response back to their defaults.  Call this between tests if
  // you are going to reuse a single Response object for multiple intersection tests (recommented
  // as it will avoid allcating extra memory)
  /**
   * @return {Response} This for chaining
   */
  Response.prototype['clear'] = Response.prototype.clear = function() {
    this['aInB'] = true;
    this['bInA'] = true;
    this['overlap'] = Number.MAX_VALUE;
    return this;
  };

  // ## Object Pools

  // A pool of `Vector` objects that are used in calculations to avoid
  // allocating memory.
  /**
   * @type {Array.<Vector>}
   */
  var T_VECTORS = [];
  for (var i = 0; i < 10; i++) { T_VECTORS.push(new Vector()); }
  
  // A pool of arrays of numbers used in calculations to avoid allocating
  // memory.
  /**
   * @type {Array.<Array.<number>>}
   */
  var T_ARRAYS = [];
  for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }

  // ## Helper Functions

  // Flattens the specified array of points onto a unit vector axis,
  // resulting in a one dimensional range of the minimum and
  // maximum value on that axis.
  /**
   * @param {Array.<Vector>} points The points to flatten.
   * @param {Vector} normal The unit vector axis to flatten on.
   * @param {Array.<number>} result An array.  After calling this function,
   *   result[0] will be the minimum value,
   *   result[1] will be the maximum value.
   */
  function flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++ ) {
      // The magnitude of the projection of the point onto the normal
      var dot = points[i].dot(normal);
      if (dot < min) { min = dot; }
      if (dot > max) { max = dot; }
    }
    result[0] = min; result[1] = max;
  }
  
  // Check whether two convex polygons are separated by the specified
  // axis (must be a unit vector).
  /**
   * @param {Vector} aPos The position of the first polygon.
   * @param {Vector} bPos The position of the second polygon.
   * @param {Array.<Vector>} aPoints The points in the first polygon.
   * @param {Array.<Vector>} bPoints The points in the second polygon.
   * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
   *   will be projected onto this axis.
   * @param {Response=} response A Response object (optional) which will be populated
   *   if the axis is not a separating axis.
   * @return {boolean} true if it is a separating axis, false otherwise.  If false,
   *   and a response is passed in, information about how much overlap and
   *   the direction of the overlap will be populated.
   */
  function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();
    // The magnitude of the offset between the two polygons
    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
      T_VECTORS.push(offsetV); 
      T_ARRAYS.push(rangeA); 
      T_ARRAYS.push(rangeB);
      return true;
    }
    // This is not a separating axis. If we're calculating a response, calculate the overlap.
    if (response) {
      var overlap = 0;
      // A starts further left than B
      if (rangeA[0] < rangeB[0]) {
        response['aInB'] = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) { 
          overlap = rangeA[1] - rangeB[0];
          response['bInA'] = false;
        // B is fully inside A.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      // B starts further left than A
      } else {
        response['bInA'] = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) { 
          overlap = rangeA[0] - rangeB[1];
          response['aInB'] = false;
        // A is fully inside B.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      }
      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
      var absOverlap = Math.abs(overlap);
      if (absOverlap < response['overlap']) {
        response['overlap'] = absOverlap;
        response['overlapN'].copy(axis);
        if (overlap < 0) {
          response['overlapN'].reverse();
        }
      }      
    }
    T_VECTORS.push(offsetV); 
    T_ARRAYS.push(rangeA); 
    T_ARRAYS.push(rangeB);
    return false;
  }
  
  // Calculates which Vornoi region a point is on a line segment.
  // It is assumed that both the line and the point are relative to `(0,0)`
  //
  //            |       (0)      |
  //     (-1)  [S]--------------[E]  (1)
  //            |       (0)      |
  /**
   * @param {Vector} line The line segment.
   * @param {Vector} point The point.
   * @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region, 
   *          MIDDLE_VORNOI_REGION (0) if it is the middle region, 
   *          RIGHT_VORNOI_REGION (1) if it is the right region.
   */
  function vornoiRegion(line, point) {
    var len2 = line.len2();
    var dp = point.dot(line);
    // If the point is beyond the start of the line, it is in the
    // left vornoi region.
    if (dp < 0) { return LEFT_VORNOI_REGION; }
    // If the point is beyond the end of the line, it is in the
    // right vornoi region.
    else if (dp > len2) { return RIGHT_VORNOI_REGION; }
    // Otherwise, it's in the middle one.
    else { return MIDDLE_VORNOI_REGION; }
  }
  // Constants for Vornoi regions
  /**
   * @const
   */
  var LEFT_VORNOI_REGION = -1;
  /**
   * @const
   */
  var MIDDLE_VORNOI_REGION = 0;
  /**
   * @const
   */
  var RIGHT_VORNOI_REGION = 1;
  
  // ## Collision Tests

  // Check if two circles collide.
  /**
   * @param {Circle} a The first circle.
   * @param {Circle} b The second circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   the circles intersect.
   * @return {boolean} true if the circles intersect, false if they don't. 
   */
  function testCircleCircle(a, b, response) {
    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    var differenceV = T_VECTORS.pop().copy(b['pos']).sub(a['pos']);
    var totalRadius = a['r'] + b['r'];
    var totalRadiusSq = totalRadius * totalRadius;
    var distanceSq = differenceV.len2();
    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
      T_VECTORS.push(differenceV);
      return false;
    }
    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) { 
      var dist = Math.sqrt(distanceSq);
      response['a'] = a;
      response['b'] = b;
      response['overlap'] = totalRadius - dist;
      response['overlapN'].copy(differenceV.normalize());
      response['overlapV'].copy(differenceV).scale(response['overlap']);
      response['aInB']= a['r'] <= b['r'] && dist <= b['r'] - a['r'];
      response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];
    }
    T_VECTORS.push(differenceV);
    return true;
  }
  SAT['testCircleCircle'] = testCircleCircle;
  
  // Check if a polygon and a circle collide.
  /**
   * @param {Polygon} polygon The polygon.
   * @param {Circle} circle The circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonCircle(polygon, circle, response) {
    // Get the position of the circle relative to the polygon.
    var circlePos = T_VECTORS.pop().copy(circle['pos']).sub(polygon['pos']);
    var radius = circle['r'];
    var radius2 = radius * radius;
    var points = polygon['points'];
    var len = points.length;
    var edge = T_VECTORS.pop();
    var point = T_VECTORS.pop();
    
    // For each edge in the polygon:
    for (var i = 0; i < len; i++) {
      var next = i === len - 1 ? 0 : i + 1;
      var prev = i === 0 ? len - 1 : i - 1;
      var overlap = 0;
      var overlapN = null;
      
      // Get the edge.
      edge.copy(polygon['edges'][i]);
      // Calculate the center of the circle relative to the starting point of the edge.
      point.copy(circlePos).sub(points[i]);
      
      // If the distance between the center of the circle and the point
      // is bigger than the radius, the polygon is definitely not fully in
      // the circle.
      if (response && point.len2() > radius2) {
        response['aInB'] = false;
      }
      
      // Calculate which Vornoi region the center of the circle is in.
      var region = vornoiRegion(edge, point);
      // If it's the left region:
      if (region === LEFT_VORNOI_REGION) { 
        // We need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
        edge.copy(polygon['edges'][prev]);
        // Calculate the center of the circle relative the starting point of the previous edge
        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
        region = vornoiRegion(edge, point2);
        if (region === RIGHT_VORNOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos); 
            T_VECTORS.push(edge);
            T_VECTORS.push(point); 
            T_VECTORS.push(point2);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        T_VECTORS.push(point2);
      // If it's the right region:
      } else if (region === RIGHT_VORNOI_REGION) {
        // We need to make sure we're in the left region on the next edge
        edge.copy(polygon['edges'][next]);
        // Calculate the center of the circle relative to the starting point of the next edge.
        point.copy(circlePos).sub(points[next]);
        region = vornoiRegion(edge, point);
        if (region === LEFT_VORNOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos); 
            T_VECTORS.push(edge); 
            T_VECTORS.push(point);
            return false;              
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
      // Otherwise, it's the middle region:
      } else {
        // Need to check if the circle is intersecting the edge,
        // Change the edge into its "edge normal".
        var normal = edge.perp().normalize();
        // Find the perpendicular distance between the center of the 
        // circle and the edge.
        var dist = point.dot(normal);
        var distAbs = Math.abs(dist);
        // If the circle is on the outside of the edge, there is no intersection.
        if (dist > 0 && distAbs > radius) {
          // No intersection
          T_VECTORS.push(circlePos); 
          T_VECTORS.push(normal); 
          T_VECTORS.push(point);
          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          overlapN = normal;
          overlap = radius - dist;
          // If the center of the circle is on the outside of the edge, or part of the
          // circle is on the outside, the circle is not fully inside the polygon.
          if (dist >= 0 || overlap < 2 * radius) {
            response['bInA'] = false;
          }
        }
      }
      
      // If this is the smallest overlap we've seen, keep it. 
      // (overlapN may be null if the circle was in the wrong Vornoi region).
      if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
        response['overlap'] = overlap;
        response['overlapN'].copy(overlapN);
      }
    }
    
    // Calculate the final overlap vector - based on the smallest overlap.
    if (response) {
      response['a'] = polygon;
      response['b'] = circle;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    T_VECTORS.push(circlePos); 
    T_VECTORS.push(edge); 
    T_VECTORS.push(point);
    return true;
  }
  SAT['testPolygonCircle'] = testPolygonCircle;
  
  // Check if a circle and a polygon collide.
  //
  // **NOTE:** This is slightly less efficient than polygonCircle as it just
  // runs polygonCircle and reverses everything at the end.
  /**
   * @param {Circle} circle The circle.
   * @param {Polygon} polygon The polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testCirclePolygon(circle, polygon, response) {
    // Test the polygon against the circle.
    var result = testPolygonCircle(polygon, circle, response);
    if (result && response) {
      // Swap A and B in the response.
      var a = response['a'];
      var aInB = response['aInB'];
      response['overlapN'].reverse();
      response['overlapV'].reverse();
      response['a'] = response['b'];
      response['b'] = a;
      response['aInB'] = response['bInA'];
      response['bInA'] = aInB;
    }
    return result;
  }
  SAT['testCirclePolygon'] = testCirclePolygon;
  
  // Checks whether polygons collide.
  /**
   * @param {Polygon} a The first polygon.
   * @param {Polygon} b The second polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonPolygon(a, b, response) {
    var aPoints = a['points'];
    var aLen = aPoints.length;
    var bPoints = b['points'];
    var bLen = bPoints.length;
    // If any of the edge normals of A is a separating axis, no intersection.
    for (var i = 0; i < aLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {
        return false;
      }
    }
    // If any of the edge normals of B is a separating axis, no intersection.
    for (var i = 0;i < bLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {
        return false;
      }
    }
    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
    // final overlap vector.
    if (response) {
      response['a'] = a;
      response['b'] = b;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    return true;
  }
  SAT['testPolygonPolygon'] = testPolygonPolygon;

  return SAT;
}));
define('subzero/physics',[
	'sge',
	'./sat'
	], function(sge, sat){
		var Physics = sge.Class.extend({
			init: function(){
				this.entities = [];
				this.map = null;
			},
			tick: function(delta){
				this.entities.forEach(function(entity){
					this.move(entity, delta);
				}.bind(this));
				this.detectCollision();
			},
			_collisionHash: function(a, b){
				if (a.id>b.id){
					return b.id + '.' + a.id;
				} else {
					return a.id + '.' + b.id;
				}
			},
			detectCollision: function(){
				var e, ep, aRect, bRect;
				var response = new sat.Response();
				var testEntities = this.entities.filter(function(q){
					return q.get('physics.type')==0;
				});
				var testHashes = [];
				var collisionHashes = [];
				for (var i = testEntities.length - 1; i >= 0; i--) {
					e = testEntities[i];
					tx = e.get('xform.tx');
					ty = e.get('xform.ty');
					
					aRect = new sat.Box(new sat.Vector(tx, ty), e.get('physics.width'), e.get('physics.height'));
					potential = this.state.findEntities(tx,ty, 32).filter(function(q){return q.components.physics!=null && q!=e});
					for (var k = potential.length - 1; k >= 0; k--) {
						var hash = this._collisionHash(e, potential[k])
						if (testHashes.indexOf(hash)<0){
							testHashes.push(hash);
							ep = potential[k];
							if (ep.get('physics.type')==2){
								continue;
							}
							bRect = new sat.Box(new sat.Vector(ep.get('xform.tx'),ep.get('xform.ty')), ep.get('physics.width'), ep.get('physics.height'));
							collided = sat.testPolygonPolygon(aRect.toPolygon(), bRect.toPolygon(), response)
							if (collided){
								if (ep.get('physics.type')==2||e.get('physics.type')==2){
									
								} if (ep.get('physics.type')==1){
									this.move(e, 0, -response.overlapV.x, -response.overlapV.y);
								} else {
									this.move(e, 0, -0.5*response.overlapV.x, -0.5*response.overlapV.y);
									this.move(ep, 0, 0.5*response.overlapV.x,  0.5*response.overlapV.y);
								}
								
								response.clear();
							}
							
						}
					};
				};
			},
			move: function(entity, delta, vx, vy){

				if (vx==undefined){
					vx = entity.get('movement.vx') * delta * 64;
					vy = entity.get('movement.vy') * delta * 64;
				}

				var tx = entity.get('xform.tx');
				var ty = entity.get('xform.ty');

				

				var ptx = tx + vx;
				var pty = ty + vy;

				
				if (this.map){
					var testPoints = [
							[entity.get('physics.width')/2, entity.get('physics.height')/2],
							[entity.get('physics.width')/2, -entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, -entity.get('physics.height')/2]
						]
						var horzMove = true;
						var vertMove = true;
						for (var i = testPoints.length - 1; i >= 0; i--) {
							testPoints[i];
							var newTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx, testPoints[i][1]+vy+ty);
							if (newTile){
							    if (!newTile.data.passable){
									if (horzMove){
									    horzTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx, testPoints[i][1]+ty);
										if (horzTile){
										    if (!horzTile.data.passable){
											    horzMove=false;
										    }
										}
									}
									if (vertMove){
									    vertTile = this.map.getTileAtPos(testPoints[i][0]+tx, testPoints[i][1]+vy+ty);
										if (vertTile){
										    if (!vertTile.data.passable){
											    vertMove=false;
										    }
										}
									}
							    }
							}
							if (!horzMove){
								ptx=tx;
							}
							if (!vertMove){
								pty=ty;
							}
						};
						
				}
				if (tx!=ptx||ty!=pty){
					entity.trigger('entity.moved', entity, ptx, pty, ptx-tx, pty-ty);
					entity.set('xform.tx', ptx);
					entity.set('xform.ty', pty);
				}
			},
			setMap: function(state){
				this.state = state;
				this.map = state.map;
			}
		});

		return Physics;
	}
);
define('subzero/components/sprite',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('sprite', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('sprite.width', data.width || 64);
				this.set('sprite.height', data.height || 64);

				this.set('sprite.offsetx', data.offsetx || 0);
				this.set('sprite.offsety', data.offsety || 0);

				this.set('sprite.scalex', data.scalex || 1);
				this.set('sprite.scaley', data.scaley || 1);

				
				this.set('sprite.src', data.src || 'man_a');
				this.set('sprite.frame', data.frame== undefined ? 0 : data.frame);

				this.set('sprite.visible', true);

				this.set('sprite.container', data.container || 'stage');
				this._sprite = new PIXI.Sprite.fromFrame(this.get('sprite.src') + '-' + this.get('sprite.frame'));


			},

			show: function(){
				this.set('sprite.visible', true);
				this.parent.addChild(this._sprite);
			},

			hide: function(){
				this.set('sprite.visible', false);
				if (this.parent.children.indexOf(this._sprite)>=0){
					this.parent.removeChild(this._sprite);
				}
			},

			deregister: function(state){
				this.hide();
				this.off('sprite.show', this.show);
				this.off('sprite.hide', this.hide);
				this._super(state);
			},

			register: function(state){
				this._super(state);
				this.parent = state.containers[this.get('sprite.container')];
				
				this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
				this._test_a = this.get('xform.ty');
				this._test_b = Math.random() * 2 * Math.PI;
				var idx = this.parent.children.indexOf(this._sprite);
				
				var next = this.parent.children[idx-1];
				
				if (next){
					while (next.position.y>this._sprite.position.y){
						this.parent.swapChildren(this._sprite, next);
						idx--;
						if (idx<=0){
							break;
						}
						next = this.parent.children[idx-1];
					}
				}
				this.on('sprite.show', this.show);
				this.on('sprite.hide', this.hide);
				if (this.get('sprite.visible')){
					this.show();
				}
			},
			render: function(){
				if (this.get('sprite.visible')){
					this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
					this._sprite.scale.x = this.get('sprite.scalex');
					this._sprite.scale.y = this.get('sprite.scaley');
					this._sprite.setTexture(PIXI.TextureCache[this.get('sprite.src') + '-' + this.get('sprite.frame')])
				}
			}
		});
	}
);
define('subzero/components/rpgcontrols',[
	'sge',
	'../component'
	], function(sge, Component){
		var ControlComponent = Component.add('controls', {
			init: function(entity, data){
				this._super(entity, data);
			},
			tick: function(){
				var dpad = this.input.dpad();
				this.set('movement.vx', dpad[0]);
				this.set('movement.vy', dpad[1]);

				if (this.input.isDown('X')){
					this.set('movement.vx', dpad[0]*2);
					this.set('movement.vy', dpad[1]*2);
				}

				if (this.input.isDown('Z')){
					this.state.openInventory();
				}

				if (this.input.isPressed('enter')){
					this.entity.trigger('interact');
				}
				
				if (this.input.isPressed('space')){
					this.entity.trigger('item.use');
				}
			},
			register: function(state){
				this._super(state);
				this.input = state.input;
			}
		});
	}
);
define('subzero/components/chara',[
	'sge',
	'../component'
	], function(sge, Component){
		var CharaComponent = Component.add('chara', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('chara.dir', 'down');
				this.set('sprite.frame', 16);
				this.set('movement.vx', 0);
				this.set('movement.vy', 0);
				this._anim = null;
				this._animTimeout = 0;
				this._walkcycleFrames = {
	                "walk_down" : [19,20,21,22,23,24,25,26],
	                "walk_up" : [1,2,3,4,5,6,7,8],
	                "walk_left" : [10,11,12,13,14,15,16,17],
	                "walk_right" : [28,29,30,31,32,33,34,35],
	                "stand_down" : [18],
	                "stand_up" : [0],
	                "stand_right" : [27],
	                "stand_left" : [9]
	            }
	            this.setAnim('stand_' + this.get('chara.dir'));
			},
			setAnim: function(anim){
				this.entity.trigger('anim.set', anim);
			},
			setDirection: function(dir){
				if (this.get('chara.dir')!=dir){
					this.set('chara.dir', dir)
				}
			},
			tick: function(delta){
				if (this.get('movement.vx')<0){
					this.setDirection('left');
				}

				if (this.get('movement.vx')>0){
					this.setDirection('right');
				}

				if (this.get('movement.vy')<0){
					this.setDirection('up');
				}

				if (this.get('movement.vy')>0){
					this.setDirection('down');
				}

				if (this.get('movement.vx')!=0||this.get('movement.vy')!=0){
					this.setAnim('walk_' + this.get('chara.dir'));
				} else {
					this.setAnim('stand_' + this.get('chara.dir'));
				}
			}
		});
	}
);
define('subzero/behaviour',[
		'sge'
	], function(sge){
		var Behaviour = sge.Class.extend({
			init: function(ai, data){
				data = data || {};
				this.comp = ai;
				this.entity = ai.entity;
				this.state = ai.state;
				this.running = false;
				this.importance = data.importance || 3;
			},
			start: function(){
				this.running = true;
			},
			stop: function(){
				this.running = false;
				this.comp.next();
			}
		});

		Behaviour._classMap = {};

		Behaviour.add = function(type, data){
			klass = Behaviour.extend(data);
			Behaviour._classMap[type] = klass;
			return klass;
		}

		Behaviour.Create = function(entity, data){
			if (Behaviour._classMap[data.xtype]==undefined){
				console.error('Missing Behaviour:', data.xtype);
				return null;
			}
			comp = new Behaviour._classMap[data.xtype](entity, data);
			return comp;
		}

		Behaviour.add('idle', {
			start: function(){
				this._timeout = this.state.getTime() + Math.random() + 0.5;
				this.entity.set('movement.vx', Math.random() * 2 - 1);
				this.entity.set('movement.vy', Math.random() * 2 - 1);
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this.stop();
				}
			}
		})

		Behaviour.add('goto', {
			init: function(comp, data){
				this._super(comp, data);
				this.target = data.target;
				this.distance = data.distance || 64;
			},
			start: function(){
				this._timeout = 0;

			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				var speed = this.importance >= 7 ? 1.35 : 1;
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this.target.get('xform.tx');
				var targety = this.target.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist<this.distance){
					this.stop();
				}
				this.entity.set('movement.vx', -dx/dist * speed);
				this.entity.set('movement.vy', -dy/dist * speed);

			}
		})

		Behaviour.add('goaway', {
			init: function(comp, data){
				this._super(comp, data);
				this.target = data.target;
				this._timeout = data.timeout || 0;
			},
			start: function(){
				if (this._timeout>0){
					this._timeout = this.state.getTime() + this._timeout;
				}
			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				var speed = this.importance >= 7 ? 2 : 1;
				if (this._timeout>0 && this._timeout<this.state.getTime()){
					this.stop();
				}
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this.target.get('xform.tx');
				var targety = this.target.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist>1024){
					this.stop();
				}
				this.entity.set('movement.vx', dx/dist * speed);
				this.entity.set('movement.vy', dy/dist * speed);

			}
		})

		Behaviour.add('wait', {
			init: function(comp, data){
				this._super(comp, data);
				this._timeout = data.timeout || -1;
			},
			start: function(){
				if (this._timeout>0){
					this._timeout += this.state.getTime();
				}
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				if (this._timeout>0 && this.state.getTime()>this._timeout){
					this.stop()
				} else {
					this.entity.set('movement.vx', 0);
					this.entity.set('movement.vy', 0);
				}
				return true;
			}
		})

		Behaviour.add('social', {
			start: function(){
				this._timeout = 0;
			},
			isSatisfied: function(){
				var tile = this.entity.get('map.tile');
				if (!tile){
					return true;
				}
				return (tile.data.socialValue>=0.9)
			},
			tick: function(delta){
				var tile = this.entity.get('map.tile');
				if (tile){
					if (tile.data.socialValue<1){
						this.entity.set('movement.vx', tile.data.socialVector[0]);
						this.entity.set('movement.vy', tile.data.socialVector[1]);
					}
				}
			}
		});

		Behaviour.add('sell', {
			start: function(){
				this._timeout = 0;
				this._moveTimeout = this.state.getTime() + 5;
				this._selling = false;
				this.entity.on('merchant.sell', this.startSell.bind(this));
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
			},
			isSatisfied: function(){
				if (this._selling){
					this.entity.set('movement.vx', 0);
					this.entity.set('movement.vy', 0);
				}
				return (this._selling)
			},
			tick: function(delta){
				if (this.state.getTime()>this._moveTimeout){
					var tx = this.entity.get('xform.tx');
					var ty = this.entity.get('xform.ty');
					var entities = this.state.findEntities(tx, ty, 512);
					var avg = [0,0];
					var count = 0;
					entities.forEach(function(e){
						avg = [avg[0]+e.get('xform.tx'),avg[1]+e.get('xform.ty')];
						count++;
					});
					var targetx = avg[0]/count;
					var targety = avg[0]/count;
					var dx = tx - targetx;
					var dy = ty - targety;
					var dist = Math.sqrt(dx*dx+dy*dy);
					if (dist<64){
						this.stop();
					}
					this.entity.set('movement.vx', -dx/dist);
					this.entity.set('movement.vy', -dy/dist);
					this._moveTimeout += 3
					return
				}
				if (this.state.getTime()>this._timeout){
					this._timeout = this.state.getTime()+1+Math.random();
					this.entity.trigger('sound.emit', {
						type: 0,
						instructions: [{
							xtype: "goto",
							target: this.entity
						},{
							xtype: "event.trigger",
							event: "merchant.sell",
							entity: this.entity
						},{
							xtype: "wait",
							timeout: 2
						}]
					})
				}

			},
			startSell: function(){
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
				this._moveTimeout = this.state.getTime() + 3;
			},
		});
		Behaviour.add('event.trigger', {
			init: function(comp, data){
				this._super(comp, data);
				this._eventName = data.event;
				this._entity = data.entity;
			},
			tick: function(){
				this._entity.trigger(this._eventName);
				this.stop();
			}
		})
		return Behaviour;
	}
);
define('subzero/ai',[
	'sge',
	'./behaviour'
	], function(sge, Behaviour){
		var AI = {blueprints: {}};
		AI.load = function(allData){
			var data = allData.ai;
			for (var prop in data) {
		      // important check that this is objects own property 
		      // not from prototype prop inherited
		      if(data.hasOwnProperty(prop)){
		        AI.blueprints[prop] = data[prop];
		      }
		   }

		}
		AI.has = function(typ){
			return (AI.blueprints[typ]!==undefined);
		}
		AI.Create = function(type, entity){
			var behaviourData = AI.blueprints[type];
			if (behaviourData==undefined){
				console.error('No Behavour Data for ' + type);
				return;
			}
			var behavoiurs = [];
			for (var i=0; i<behaviourData.objectives.length;i++){
				var bd = behaviourData.objectives[i];
				var n = Behaviour.Create(bd.behaviour, entity, bd);
				behavoiurs.push(n);
			}
			return behavoiurs;
		}

		return AI;
	}
);
define('subzero/components/ai',[
	'sge',
	'../component',
	'../behaviour',
	'../ai'
	], function(sge, Component, Behaviour, AI){
		var proxyTarget = function(tx, ty){
			this.data = {
				'xform.tx': tx,
				'xform.ty': ty
			}
			this.get = function(attr){
				return this.data[attr];
			}
		}

		var Planner = sge.Observable.extend({
			init: function(comp){
				this.comp = comp;
				this.entity = comp.entity;
				this.state = comp.state;
				this._interupt = false;
				this._instructions=[];
				this._ignoreList=[];
			},
			interupt: function(){
				if (this._interupt){
					this._interupt=false;
					this.comp.next();
					return true;
				}
				return false;
			},
			next: function(){
				return {xtype: 'idle'}
			}
		});

		var CitizenPlanner = Planner.extend({
			init: function(comp){
				this._super(comp);
				this.entity.on('sound.hear', this.soundCallback.bind(this));
				this._instructions = [];
				this._ignoreList = [];
				this._interupt=false;
			},
			soundCallback: function(tx, ty, sound){
				if (sound.type==0){
					if (this._ignoreList.indexOf(sound.entity)<0){
						this._ignoreList.push(sound.entity)
						this._instructions = sound.instructions;
						this._interupt=true;
					}
				}
				if (sound.type==1){
					if (this._ignoreList.indexOf(sound.entity)<0){
						this._ignoreList.push(sound.entity)
						this._instructions = [{xtype: 'goaway', importance: sound.importance, target: new proxyTarget(tx, ty), timeout: sound.volume/64, importance: 8}];
						this._interupt=true;
					}
				}
			},
			interupt: function(){
				if (this._super()){
					return true;
				}
				if (this.comp.behaviour.importance>=6){
					return false;
				}
				var tile = this.entity.get('map.tile');
				if (tile){
					if (tile.data.socialValue<0.8){
						this.entity.set('movement.vx', tile.data.socialVector[0]);
						this.entity.set('movement.vy', tile.data.socialVector[1]);
						return true;
					}
				}
				if (this._interupt){
					this._interupt=false;
					this.comp.next();
					return true;
				}
				return false;
			},
			next: function(){
				if (this._instructions.length){
					return this._instructions.shift();
				}
				return {xtype: 'idle'}
			}
		});

		var MerchantPlanner = Planner.extend({
			interupt: function(){
				
					var tile = this.entity.get('map.tile');
					if (tile){
						if (tile.data.socialValue<0.8){
							this.entity.set('movement.vx', tile.data.socialVector[0]);
							this.entity.set('movement.vy', tile.data.socialVector[1]);
							return true;
						}
					}
				
				return false;
			},
			next: function(){
				return {xtype: 'sell'}
			}
		});

		var GuardPlanner = Planner.extend({
			init: function(comp){
				this._super(comp);
				this.entity.on('sound.hear', this.soundCallback.bind(this));
				this._home = new proxyTarget(this.entity.get('xform.tx'),this.entity.get('xform.ty'))
				
			},
			soundCallback: function(tx, ty, sound){
				if (sound.type==1){
						this._ignoreList.push(sound.entity);
						var instructions = [{xtype: 'goto', distance: 32, importance: sound.importance, target: new proxyTarget(tx, ty)},{xtype:'wait', timeout:5, importance: sound.importance}];
						if (sound.importance>=this.comp.behaviour.importance){
							this._instructions = instructions;
							this._interupt=true;
						} else {
							this._instructions = this._instructions.concat(instructions);
						}
						this.entity.trigger('emote.msg', 'What the hell?');
				}
			},
			next: function(){
				if (this._instructions.length>0){
					return this._instructions.shift();
				}
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this._home.get('xform.tx');
				var targety = this._home.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist<16){
					this.entity.set('chara.dir', 'down')
					return {xtype: 'wait'}
				}
				return {xtype: 'goto', target: this._home};
			}
		});

		PLANNER = {
			'citizen' : CitizenPlanner,
			'merchant' : MerchantPlanner,
			'guard' : GuardPlanner
		}

		Component.add('ai', {
			init: function(entity, data){
				this._super(entity, data);
			    this.set('ai.planner', data.planner || 'citizen');
			    this._timeout = 0;
			    this.behaviour = null;

			},
			register: function(state){
				this._super(state);
				this.planner = new PLANNER[this.get('ai.planner')](this)
				this.next();
			},
			next : function(){
				this.changeBehaviour(this.planner.next());
			},
			changeBehaviour: function(data){
				if (this.behaviour && this.behaviour.running){
					this.behaviour.stop();
				}
				this.behaviour = Behaviour.Create(this, data);
				this.behaviour.start()
			},
			tick: function(delta){
				//Check planning for interupt.
				if (this.planner.interupt()){
					return;
				}
				
				//Tick current behaviour.
				this.behaviour.tick(delta);
			}
		});		
	}
);
define('subzero/components/physics',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('physics', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('physics.type', data.type!=undefined ? data.type : 0);
				this.set('physics.width', data.width || 24);
				this.set('physics.height', data.height || 24);
				
			},
			register: function(state){
				this._super(state);
				if (this.get('physics.type')==0){
				    state.physics.entities.push(this.entity);   
				}
			},
			deregister: function(state){
			},
		});		
	}
);
define('subzero/components/sound',[
	'sge',
	'../component'
	], function(sge, Component){
		var extend = function(destination, source)
        {
            for (var property in source)
            {
                if (destination[property] && (typeof(destination[property]) == 'object')
                        && (destination[property].toString() == '[object Object]') && source[property])
                    extend(destination[property], source[property]);
                else
                    destination[property] = source[property];
            }
            return destination;
        }

		Component.add('sound', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this.on('sound.emit', this.emit);
			},
			emit: function(sound){
				sound = extend({
					importance: 3,
					entity: this.entity
				}, sound)
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				sound.entity = this.entity;
				var found = this.state.findEntities(
						tx, 
						ty,
						sound.volume || 128
					)
				for (var i = found.length - 1; i >= 0; i--) {
					found[i].trigger('sound.hear', tx, ty, sound)
				};
			}
		});		
	}
);
define('subzero/components/bomb',[
		'sge',
		'../component'
	], function(sge, Component){
		Component.add('explosion', {
			register: function(state){
				this._super(state);
				this._frame= 0;
				this._anim = 0
			},
			tick: function(delta){
				if (this._anim<=0){
					this._anim = (1/30);
					this.set('sprite.frame', this._frame++);
					if (this._frame>=16){
						this.state.removeEntity(this.entity);
					}
				} else {
					this._anim -= delta;
				}
			}
	})

		Component.add('bomb', {
			register: function(state){
				this._super(state);
				this._timeout = state.getTime() + 3;
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this.entity.trigger('sound.emit', {
						type: 1,
						volume: 1024,
						importance: 6
					})
					
					
					for (var i = 0; i < 3; i++) {
						var scale = (Math.random()*2-1)*0.5 + 1;
						var explo = this.state.factory.create('explosion', {
							xform: {
								tx: this.get('xform.tx') + (Math.random()*2-1)*32,
								ty: this.get('xform.ty') + (Math.random()*2-1)*32
							},
							"sprite" : {
					            "src" : "explosion",
					            "container": "glow",
					            "offsetx" : -32,
					            "offsety" : -32,
								scalex: scale,
								scaley: scale
							}
						})
						this.state.addEntity(explo);
						
					}
					this.state.removeEntity(this.entity);

				}
			}
		})
	}
);
define('subzero/components/emote',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('emote', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this._visible = false;
				this.text = new PIXI.BitmapText("", {font: "20px 8bit"});
				this.text.position.x = 300;
				this.text.position.y = 300;
				this._timeout = -1;
				this.on('emote.msg', this.emote);
			},
			emote: function(msg){
				if (!this._visible){
					this.text.setText(msg);
					this.state.containers.overhead.addChild(this.text);
					this._timeout = this.state.getTime() + 1;
					this._visible = true;
				}
			},
			clear: function(){
				this._timeout = -1;
				this.state.containers.overhead.removeChild(this.text);
				this._visible = false;
			},
			tick: function(){
				if(this._timeout>0 && this._timeout<this.state.getTime()){
					this.clear()
				}
			},
			render: function(){
				if (this._visible){
					this.text.position.x = this.get('xform.tx');
					this.text.position.y = this.get('xform.ty')-64;
				}
			}
		});		
	}
);
define('subzero/components/guardpost',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('guardpost', {
			init: function(entity, data){
				this._super(entity, data);
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.active = null;
				this._alarm = false;
				this._timeout  = 0;
			},
			update: function(active){
				this.active = active;
				this.indicater.clear();
				if (this._alarm){
					var radius = 16 + (8 * Math.sin(this.state.getTime()*4))
					this.indicater.beginFill('0xFF0000');
					this.indicater.drawCircle(0,0,radius);
				} else  if (active){
					this.indicater.beginFill('0x00FF00');
					this.indicater.drawCircle(0,0,24);
				} else {
					this.indicater.beginFill('0xFFFF00');
					this.indicater.drawCircle(0,0,24);
				}
			},
			tick: function(delta){
				var nearby = this.state.findEntities(this.get('xform.tx'),
														this.get('xform.ty'),
														64);
				var guards = nearby.filter(function(e){return e.tags.indexOf('guard')>=0});
				var pcs = nearby.filter(function(e){return e.tags.indexOf('pc')>=0});
				
				if (pcs.length>0 && this.active){
					if (!this._alarm){
						this.alarm();
					}
					if (this._timeout<this.state.getTime()){
						this.state.loseGame();
					}
				} else {
					this._alarm = false;
				}
				this.update(guards.length>0);
			},
			register: function(state){
				this._super(state);
				this.state.containers.underfoot.addChild(this.indicater)
			},
			render: function(){
				this.indicater.position.x = this.get('xform.tx');
				this.indicater.position.y = this.get('xform.ty');
			},
			alarm: function(){
				this._alarm = true;
				this.entity.trigger('sound.emit', {
					type: 1,
					volume: 96,
					importance: 9
				});
				this._timeout = this.state.getTime() + 1.5;
			}
		});		
	}
);
define('subzero/components/goalpost',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('goalpost', {
			tick: function(delta){
				var nearby = this.state.findEntities(this.get('xform.tx'),
														this.get('xform.ty'),
														12);
				var pcs = nearby.filter(function(e){return e.tags.indexOf('pc')>=0});
				
				if (pcs.length>0){
					this.state.winGame();
				}
			},
		});		
	}
);
define('subzero/components/door',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('door', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.map = state.map;
				this.update();
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			update: function(){
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty'));
				tile.data.passable = this._open;
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-32);
				tile.data.passable = this._open;
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-64);
				tile.data.passable = this._open;
			},
			toggle: function(){
				if (this._open){
					this._open = false;
					this.entity.trigger('sprite.show');
				} else {
					this._open = true;
					this.entity.trigger('sprite.hide');
				}
				this.update();
			}
		});		
	}
);
define('subzero/components/interact',[
	'sge',
	'../component'
	], function(sge, Component){
		var InteractComponent = Component.add('interact', {
			
		});

		var InteractControlComponent = Component.add('interact.control', {
			init: function(entity, data){
				this._super(entity, data);
				this._current = null;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(){
				if (this._current){
					this._current.trigger('interact', this.entity);
				}
			},
			tick: function(delta){
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				var targets = this.state.findEntities(tx, ty, 32).filter(function(e){
					return e.components.interact!=undefined && e.components.interact.enabled;
				});
				targets.sort(function(a,b){return b._findDist-a._findDist});
				if (this._current!=targets[0]){
					if (this._current){
						this._current.trigger('highlight.off');
						this._current = null;
					}
					this._current=targets[0];
					if (this._current){
						this._current.trigger('highlight.on');
					}
				}
			}
		});
	}
);
define('subzero/components/highlight',[
	'sge',
	'../component'
	], function(sge, Component){

		var HighlightComponent = Component.add('highlight', {
			init: function(entity, data){
				this._super(entity, data);
				this._radius = data.radius || 16;
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.indicater.beginFill('0x00FFF0');
				this.indicater.drawCircle(0,0, this._radius);
				this.indicater.endFill();
				this._active = false;
			},
			register: function(state){
				this._super(state);
				this.on('highlight.on', this.turnOn);
				this.on('highlight.off', this.turnOff);
			},
			deregister: function(state){
				this._super(state);
				this.off('highlight.on', this.turnOn);
				this.off('highlight.off', this.turnOff);
				this.turnOff();
			},
			turnOn: function(){
				this._active = true;
				this.state.containers.underfoot.addChild(this.indicater);
			},
			turnOff: function(){
				this._active = false;
				if (this.state.containers.underfoot.children.indexOf(this.indicater)){
					this.state.containers.underfoot.removeChild(this.indicater);
				}
			},
			render: function(){
				if (this._active){
					this.indicater.position.x = this.get('xform.tx');
					this.indicater.position.y = this.get('xform.ty');
				}
			}
		});
	}
);
define('subzero/components/container',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('container', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			toggle: function(){
				this.set('sprite.frame', 1)
			}
		});		
	}
);
define('subzero/components/computer',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('computer', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			toggle: function(){
				this.entity.trigger('anim.set', 'on');
				this.on('anim.done', function(){
					this.state.startCutscene();
					cutsceneState = this.state.game.getState('cutscene');
					cutsceneState.setDialog('Computer: 00101100110100110101001');
					this.entity.trigger('anim.set', 'off');
				}.bind(this), { once: true })
			}
		});		
	}
);
define('subzero/components/anim',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('anim', {
			init: function(entity, data){
				this._super(entity, data);
				this._tracks = data.tracks;
				this._currentTrack = null
				this._index=0;
				this._animTimeout = 0;
			},
			register: function(state){
				this._super(state);
				this.on('anim.set', this.setAnim);
			},
			deregister: function(state){
				this._super(state);
				this.off('anim.set', this.setAnim);
			},
			setAnim: function(anim){
				this._currentTrack = this._tracks[anim];
			},
			tick: function(delta){
				if (this._currentTrack!=null){
					this._animTimeout-=delta;
					if (this._animTimeout<=0){
						this._animTimeout=1/30;
						this._index++;
						if (this._index>=this._currentTrack.frames.length){
							if (this._currentTrack.once){
								this._index=0;
								this._currentTrack = null;
								this.entity.trigger('anim.done');
								return;
							} else {
								this._index = 0;
							}
						}
						this.set('sprite.frame', this._currentTrack.frames[this._index]);
					}
				}
				
			}
		});		
	}
);
define('subzero/components/inventory',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('inventory', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('inventory.items', {});
				if (data.items){
					data.items.split(',').forEach(function(item){
						this.addItem(item);
					}.bind(this));
				}
			},
			register: function(state){
				this._super(state);
			},
			addItem: function(item){
				var inv = this.get('inventory.items');
				if (inv[item]==undefined){
					inv[item]=1;
				} else {
					inv[item]++;
				}
				this.set('inventory.items', inv);
			}
		});		
	}
);
define('subzero/components/item',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('item', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('item.item', data.item);
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(e){
				if (e.components.inventory){
					e.components.inventory.addItem(this.get('item.item'));
				}
				this.state.removeEntity(this.entity);
			},
			tick: function(delta){

			}
		});		
	}
);
define('subzero/components/equipable',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('equipable', {
			init: function(entity, data){
				this._super(entity, data);
				this._equiped = null;
			},
			register: function(state){
				this._super(state);
				this.on('item.equip', this.itemEquip)
				this.on('item.use', this.itemUse)
			},
			deregister: function(state){
				this._super(state);
				this.off('item.equip', this.itemEquip);
				this.off('item.use', this.itemUse)
			},
			itemEquip: function(item){
				this._equiped = item;
				this.entity.trigger('item.equiped', this._equiped);
			},
			itemUse: function(){
				if (this._equiped){
					inv = this.get('inventory.items');
					if (inv[this._equiped]>0){
						inv[this._equiped]--;
						//TODO: Replace with real item used code.
						var bomb = this.state.factory.create(this._equiped, {
							xform: {
								tx: this.get('xform.tx'),
								ty: this.get('xform.ty')
							}
						})
						this.state.addEntity(bomb);
						if (inv[this._equiped]<=0){
							this.itemEquip(null);
						}
					}
				}
			}

		});		
	}
);
define('subzero/components/switch',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('switch', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('switch.on', data.on || false);
				this.set('switch.entity', data.entity);
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(){
				this.set('switch.on', !this.get('switch.on'));
				this.update();
				var entityName = this.get('switch.entity');
				if (entityName){
					var entity = this.state.getEntity(entityName);
					console.log(entityName, entity);
					if (entity){
						entity.trigger('interact');
					}
				}
			},
			update: function(){
				this.set('sprite.frame', this.get('switch.on') ? 1 : 0);
			}
		});		
	}
);
define('subzero/factory',[
	'sge',
	'./entity',
	'./components/sprite',
	'./components/rpgcontrols',
	'./components/chara',
	'./components/ai',
	'./components/physics',
	'./components/sound',
	'./components/bomb',
	'./components/emote',
	'./components/guardpost',
	'./components/goalpost',
	'./components/door',
	'./components/interact',
	'./components/highlight',
	'./components/container',
	'./components/computer',
	'./components/anim',
	'./components/inventory',
	'./components/item',
	'./components/equipable',
	'./components/switch'
	],function(sge, Entity){
		var deepExtend = function(destination, source) {
          for (var property in source) {
            if (source[property] && source[property].constructor &&
             source[property].constructor === Object) {
              destination[property] = destination[property] || {};
              arguments.callee(destination[property], source[property]);
            } else {
              destination[property] = source[property];
            }
          }
          return destination;
        };

		var _Factory = sge.Class.extend({
			init: function(){
				this.blueprints = {}
			},
			load: function(data){
				for (var prop in data) {
			      // important check that this is objects own property 
			      // not from prototype prop inherited
			      if(data.hasOwnProperty(prop)){
			        this.blueprints[prop] = data[prop];
			      }
			   }
			},
			has: function(typ){
				return (this.blueprints[typ]!==undefined);
			},
			create: function(typ, data){
				var tags = [];
				if (data===undefined){
					data = {}
				}

				if (this.blueprints[typ]==undefined){
					return;
				}

				var entityData = deepExtend({}, this.blueprints[typ]);

				if (data.meta!==undefined){
					if (data.meta.tag){
						tags = tags.concat(data.meta.tag);
					}
				}
				if (entityData.meta!==undefined){
					if (entityData.meta.tagsBase){
						tags = tags.concat(entityData.meta.tagsBase);
					}

					if (entityData.meta.inherit!==undefined){
						var inherit = entityData.meta.inherit;
						var bases = [typ, inherit];
						while (inherit!=null){
							baseData = this.blueprints[inherit];
							inherit = null;
							if (baseData.meta!==undefined){
								if (baseData.meta.tags){
									tags = tags.concat(baseData.meta.tags);
								}
								if (baseData.meta.inherit){
									inherit = baseData.meta.inherit;
									bases.push(inherit);
								}
							}
						}
						entityData = {};
						bases.reverse();
						while (bases.length){
							base = bases.shift();
							entityData = deepExtend(entityData, this.blueprints[base]);
						}
					}

				}
				
				entityData = deepExtend(entityData, data);
				

				if (entityData['meta']!==undefined){
					delete entityData['meta'];
				}
				var entity = Entity.Factory(entityData);
				entity.tags = entity.tags.concat(tags);
				return entity;
			}
		})
		Factory = new _Factory();
		return Factory;
});
define('subzero/social',[
	'sge',
	], function(sge){
		var SocialSystem = sge.Class.extend({
			init: function(){
				this._socialMap = [];
			},
			setMap : function(map){
				this.map = map;
				/*
				this.map.getTiles().forEach(function(t){
						return t.data.socialValue = t.layers.base==16 ? 1 : 0;
				});
				*/
				for (var i = this.map.width - 1; i >= 0; i--) {
					this.map.getTile(i,0).data.socialValue=-1;
					this.map.getTile(i,0).data.socialVector = [0, -1];
					this.map.getTile(i,this.map.height-1).data.socialValue=-1;
					this.map.getTile(i,0).data.socialVector = [0, 1];
				};
				for (var i=0; i<2;i++){
					this.diffuseMap();
				}
				this.calcGradient();
			},
			diffuseMap: function(){
				var origMap = this.map.getTiles().map(function(x){return x.data.socialValue});
				for (var x = 0; x<this.map.width; x++){
					for (var y=0; y<this.map.height; y++){

						var value = 0;
						var count = 0;

						for (var j=-1;j<2;j++){
							for(var k=-1;k<2;k++){
								var amt = this.getData(x+j,y+k, origMap);
								if (amt!=undefined){
									value += amt;
									count++;
								}
							}
						}
						this.map.getTile(x, y).data.socialValue = Math.max((value/count),this.getData(x,y, origMap));
					}
				}
			},
			calcGradient : function(){
				for (var x = 1; x<this.map.width-1; x++){

					for (var y=1; y<this.map.height-1; y++){
						
						var ax = x-1;
						var bx = x+1;

						var amtAx = this.map.getTile(ax,y).data.socialValue;
						var amtBx = this.map.getTile(bx,y).data.socialValue;
						
						var dx = (amtBx - amtAx) / 2;

						var ay = y-1;
						var by = y+1;

						var amtAy = this.map.getTile(x,ay).data.socialValue;
						var amtBy = this.map.getTile(x,by).data.socialValue;
						
						var dy = (amtBy - amtAy) / 2;

						var dist = Math.sqrt((dx*dx)+(dy*dy));
						if (dist==0){
							this.map.getTile(x,y).data.socialVector=[0,0];
						} else {
							this.map.getTile(x,y).data.socialVector=[dx/dist,dy/dist];
						}
					}
				}
			},
			getIndex : function(x, y){
	            var index = (y * this.map.width) + x;
	            if (x > this.map.width-1 || x < 0){
	                return null;
	            }
	            if (y > this.map.height-1 || y < 0){
	                return null;
	            }
	            return index;
	        },
	        getData : function(x, y, arr){
	            return arr[this.getIndex(x, y)];
	        },
	        getTileAtPos : function(x, y){
	        	return this.getTile(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize))
	        },
		})

		return SocialSystem;
	}
);
define('subzero/hud',[
	'sge'
	], function(sge){
		var PlayerHUD = sge.Class.extend({
			init: function(state){
				this.pc = null;
				this.state = state;
				this.container = new PIXI.DisplayObjectContainer	();
			},
			setPC: function(pc){
				this.pc = pc;
				this.createDisplay();
				this.state.containers.hud.addChild(this.container);
				this.pc.on('item.equiped', this.updateItem.bind(this));
			},
			updateItem: function(item){
				console.log(item);
				this._equiped.setText('Equiped:' + item);
			},
			createDisplay: function(){
				this._equiped = new PIXI.BitmapText('Equiped: null', {font: '16px 8bit'});
				this.container.addChild(this._equiped);
			}
		})

		return PlayerHUD
	}
);
define('subzero/subzerostate',[
		'sge',
		'./tilemap',
		'./tiledlevel',
		'./entity',
		'./physics',
		'./factory',
		'./social',
		'./ai',
		'./hud'
	], function(sge, TileMap, TiledLevel, Entity, Physics, Factory, Social, AI, HUD){
		var SubzeroState = sge.GameState.extend({
			init: function(game){
				this._super(game);
				this._entities = {};
				this._entity_ids = [];
				this._entity_name = {};

				this._entity_spatial_hash = {}
				this._unspawnedEntities={}


				this.stage = new PIXI.Stage(0x000000);
				this.container = new PIXI.DisplayObjectContainer();
				this._scale = 2;
				//if (navigator.isCocoonJS){
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				//}
				this.container.scale.x *= this._scale;
				this.container.scale.y *= this._scale
				this.containers={};
				this.containers.entities = new PIXI.DisplayObjectContainer();
				this.containers.map = new PIXI.DisplayObjectContainer();
				this.containers.overhead = new PIXI.DisplayObjectContainer();
				this.containers.underfoot = new PIXI.DisplayObjectContainer();
				this.containers.glow = new PIXI.DisplayObjectContainer();
				this.containers.hud = new PIXI.DisplayObjectContainer();
				this.container.addChild(this.containers.map);
				this.container.addChild(this.containers.hud);
				
				this.physics = new Physics();
				this.factory = Factory;
				this.social = new Social();
				this.hud = new HUD(this);
				var loader = new sge.Loader();
				loader.loadJSON('content/manifest.json').then(this.loadManifest.bind(this));
			},
			winGame: function(){
				this.game.changeState('win');
			},
			openInventory: function(){
				this.game.changeState('inventory');
			},
			loseGame: function(){
				this.game.changeState('lose');
			},
			startCutscene: function(){
				this.game.changeState('cutscene');
			},
			loadManifest: function(manifest){
				console.log('Loaded Manifest')
				var loader = new sge.Loader();
				var promises = [];
				if (manifest.sprites){
					manifest.sprites.forEach(function(data){
						promises.push(loader.loadSpriteFrames('content/sprites/' + data[0] +'.png',data[0], data[1][0],data[1][1]));
					})
				}
				if (manifest.fonts){
					manifest.fonts.forEach(function(data){
						promises.push(loader.loadFont('content/font/' + data + '.fnt'));
					}.bind(this))
				}
				if (manifest.images){
					manifest.images.forEach(function(data){
						promises.push(loader.loadTexture('content/' + data + '.png', data));
					}.bind(this))
				}
				if (manifest.entities){
					manifest.entities.forEach(function(data){
						promises.push(loader.loadJSON('content/entities/' + data +'.json').then(Factory.load.bind(Factory)));
					}.bind(this))
				}
				if (manifest.ai){
					manifest.ai.forEach(function(data){
						promises.push(loader.loadJSON('content/ai/' + data +'.json').then(AI.load.bind(AI)));
					}.bind(this))
				}

				sge.When.all(promises).then(function(){
					console.log('Loaded Assets');
					loader.loadJSON('content/levels/' + this.game.data.map + '.json').then(function(data){
						this.loadLevel(data);
					}.bind(this))
				}.bind(this));
			},
			loadLevel : function(levelData){
				this.background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
				this.stage.addChild(this.background);
				this.stage.addChild(this.container);
				this.map = new TileMap(levelData.width, levelData.height, this.game.renderer);
				TiledLevel(this, this.map, levelData).then(function(){
					this.social.setMap(this.map);
					this.map.preRender();
					this.physics.setMap(this);
					var loader = new sge.Loader();
					loader.loadJS('content/levels/' + this.game.data.map + '.js', null, {state : this}).then(this.loadLevelEvents.bind(this), this.initGame.bind(this));
				}.bind(this), 500);
			},
			loadLevelEvents: function(sandbox){
				sandbox();
				this.initGame();
			},
			initGame: function(){

				var pc = this.getEntity('pc');
				this.pc = pc;
				if (this.pc){
					this.hud.setPC(pc);
				}

				var mask = new PIXI.Graphics();
				mask.beginFill()
				mask.drawRect(32, 96, 800, 480);
				mask.endFill();

				this.containers.underfoot.mask = mask;
				this.containers.map.addChild(mask);

				var mask = new PIXI.Graphics();
				mask.beginFill()
				mask.drawRect(32, 32, 800, 480+64);
				mask.endFill();

				this.containers.entities.mask = mask;
				this.containers.map.addChild(mask);

				this.containers.map.addChild(this.map.container);
				this.containers.map.addChild(this.containers.underfoot);
				this.containers.map.addChild(this.containers.entities);
				this.containers.map.addChild(this.containers.overhead);
				this.containers.map.addChild(this.containers.glow);
				this.containers.map.position.x = this.game.width/(2*this._scale)-(this.map.width*this.map.tileSize*0.5);
				this.containers.map.position.y = this.game.height/(2*this._scale)-(this.map.height*this.map.tileSize*0.5);
				console.log('Starting Game')
				this.game.changeState('game');

			},
			tick: function(delta){
			    this._super(delta);
				
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.tick(delta);
				};
				this.physics.tick(delta);

				if (this.pc){
					this.containers.map.position.x = -this.pc.get('xform.tx')+this.game.width/(2*this._scale);
					this.containers.map.position.y = 32-this.pc.get('xform.ty')+this.game.height/(2*this._scale);
				}
				
				this.map.render();
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.render();
				};
				this.spriteSort(this.containers.entities);
				//this.background.position.x = (this.containers.map.position.x/10) - 128;
				//this.background.position.y = (this.containers.map.position.y/10) - 128;
				
			},

			spriteSort: function(parent) {
				var sortMe = parent.children;
			    for (var i = 0, j, tmp; i < sortMe.length; ++i) {
			      tmp = sortMe[i];
			      for (j = i - 1; j >= 0 && sortMe[j].position.y > tmp.position.y; --j)
			         parent.swapChildren(sortMe[j + 1], sortMe[j]);

			      sortMe[j + 1] = tmp;
			   }
			},

			render: function(){
				this.game.renderer.render(this.stage);
				//console.log(this.game.renderer.batchs.length)
			},


			addEntity : function(e){
				var id = 0;
				while (this._entities[id]!==undefined){
					id++;
				}
				e.id = id;
				this._entity_ids.push(e.id);
				this._entities[e.id] = e;
				e.register(this);

				tx = e.get('xform.tx');
				ty = e.get('xform.ty');
				e.on('entity.moved', this._updateHash.bind(this));
				this._updateHash(e, tx, ty);
				return e;
			},
			removeEntity: function(e){
				e.deregister(this);
				var id = e.id;
				var idx = this._entity_ids.indexOf(e.id);
				this._entity_ids.splice(idx,1);
				tile = e.get('map.tile');
				if (tile){
					idx = tile.data.entities.indexOf(e);
					tile.data.entities.splice(idx, 1);
				}
				delete this._entities[id];
			},
			_updateHash: function(e, tx, ty){
				if (!e){
					return;
				}
				var hx = Math.floor(tx/32);
				var hy = Math.floor(ty/32);
				var hash = e.get('map.hash');
				var tile = null;
				
				if (hash != hx + '.' + hy){
					
					tile = e.get('map.tile');
					if (tile){
						idx = tile.data.entities.indexOf(e);
						tile.data.entities.splice(idx, 1);
					}
					e.set('map.hash', hx + '.' + hy)
					tile = this.map.getTile(hx, hy);
					if (tile){
						e.set('map.tile', tile);
						if (tile.data.entities==undefined){
							tile.data.entities=[];
						}
						tile.data.entities.push(e);
					}	
				}
			},
			findEntities: function(tx, ty, radius){
				var hx = Math.floor(tx/32);
				var hy = Math.floor(ty/32);
				var tileRad = Math.max(Math.ceil(radius/32),1);
				var sqrRad = (radius*radius);
				var tile = null;
				var entities = [];
				var dx, dy, es;
				for (var j=hx-tileRad;j<tileRad+1+hx;j++){
					for(var k=hy-tileRad;k<tileRad+1+hy;k++){
						tile = this.map.getTile(j,k);
						if (tile){
							es = (tile.data.entities || []).filter(function(e){
								dx = (e.get('xform.tx')-tx);
								dy = (e.get('xform.ty')-ty);
								e._findDist = (dx*dx)+(dy*dy);
								return ((dx*dx)+(dy*dy)<=sqrRad);
							});
							if (es){
								entities = entities.concat(es);
							}
						}
					}
				}
				return entities;
			},
			getEntity: function(name){
				return this._entity_name[name.replace(/@/,'')];
			},
			getEntities: function(query){

			}
		})

		return SubzeroState
	}
);
define('subzero/main',[
		'sge',
		'./config',
		'./subzerostate',
	], function(sge, config, SubzeroState){
		var MenuItem = sge.Class.extend({
			init: function(data){
				this._text = data[0];
				this._count = data[1];
				this._callback = data[2];
				this.container = new PIXI.DisplayObjectContainer();
				this.background = new PIXI.Graphics();
				this.background.lineStyle(4, config.colors.primaryDark, 1);
				this.background.drawRect(0,0, 250, 32);
				this.text = new PIXI.BitmapText(this._text, {font: '24px 8bit'});
				this.text.position.y = 4;
				this.text.position.x = 8;
				
				this.container.addChild(this.background);
				this.container.addChild(this.text);

				if (this._count!==undefined&&this._count!==null){
					this.count = new PIXI.BitmapText('x' + this._count, {font: '24px 8bit'});
					this.count.position.y = 4;
					this.count.position.x = 210;
					this.container.addChild(this.count);
				}
			},
			select: function(){
				this._selected = true
			},
			unselect: function(){
				this._selected = false
			},
			update: function(){
				if (this._selected){
					this.container.position.x = 24;
					this.background.lineStyle(4, config.colors.complementBright, 1);
					this.background.drawRect(0,0, 250, 32);
				} else {
					this.container.position.x = 0;
					this.background.lineStyle(4, config.colors.primaryDark, 1);
					this.background.drawRect(0,0, 250, 32);
				}
			},
			callback: function(){
				this._callback();
			}
		});

		return {
			SubzeroState: SubzeroState,
			CutsceneState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x000000);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;

					this.background = new PIXI.Graphics();
					this.background.beginFill('0x000000');
					this.background.drawRect(0,0,game.width,game.height);
					this.background.endFill()
					this.background.alpha = 0.65;
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('game');
	        		}
	        	},
	        	startState: function(){
	        		this.gameState = this.game.getState('game');
	        		this.gameState.stage.addChild(this.container);
	        	},
	        	endState: function(){
	        		this.gameState.stage.removeChild(this.container);
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.gameState.stage);
	        	},
	        	setDialog: function(dialog){
	        		while (this.container.children.length){
	        			this.container.removeChild(this.container.children[0]);
	        		}
	        		var text = new PIXI.BitmapText(dialog, {font: '32px 8bit'});
	        		text.position.y = this.game.height / (2*this._scale);
	        		text.position.x = 32;
	        		this.container.addChild(this.background)
	        		this.container.addChild(text);
	        	}
	        }),
			InventoryState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x000000);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;

					this.background = new PIXI.Graphics();
					this.background.beginFill('0x000000');
					this.background.drawRect(0,0,game.width,game.height);
					this.background.endFill()
					this.background.alpha = 0.65;
	        	
	        		this.container.addChild(this.background);

	        		this._index = 0;
					this.menuContainer = new PIXI.DisplayObjectContainer();
					this.menuContainer.position.x = this.menuContainer.position.y = 64;
					this.container.addChild(this.menuContainer);
					this._itemText = ['','','','',''];
					this.items = [];
					this.createMenu();
	        	},

	        	createMenu: function(){
	        		while (this.menuContainer.children.length){
	        			this.menuContainer.removeChild(this.menuContainer.children[0]);
	        		};
	        		this.items = [];
	        		for (var i=0;i<this._itemText.length;i++){
	        			var item = new MenuItem(this._itemText[i]);
	        			item.container.position.y = i * 40;
	        			this.menuContainer.addChild(item.container);
	        			this.items.push(item);
	        		}
	        		var item = new MenuItem(['Quit', null, function(){
	        			this.quit();
	        		}.bind(this)]);
        			item.container.position.y = i * 40;
        			this.menuContainer.addChild(item.container);
        			this.items.push(item);
					this.updateMenu();
	        	},
	        	quit: function(){
	        		this.game.changeState('game');
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('up')){
	        			this.up();
	        		}

	        		if (this.input.isPressed('down')){
	        			this.down();
	        		}

	        		if (this.input.isPressed('enter') || this.input.isPressed('space')){
	        			this.items[this._index].callback();
	        		}
	        	},

	        	up: function(){
	        		this._index--;
	        		if (this._index<0){
	        			this._index=0;
	        		}
	        		this.updateMenu();
	        	},

	        	down: function(){
	        		this._index++;
	        		if (this._index>=this.items.length){
	        			this._index=this.items.length-1;
	        		}
	        		this.updateMenu();
	        	},

	        	updateMenu: function(){
					this.items.forEach(function(i){i.unselect()});
        			this.items[this._index].select();
        			this.items.forEach(function(i){i.update()});
	        	},

	        	startState: function(){
	        		this.gameState = this.game.getState('game');
	        		this.gameState.stage.addChild(this.container);

	        		var pc = this.gameState.getEntity('pc');
	        		if (pc){
	        			var inv = pc.get('inventory.items');
	        			var keys = Object.keys(inv);
	        			this._itemText = keys.map(function(key){
	        				return [key, inv[key], function(){
	        					pc.trigger('item.equip', key);
	        					this.quit();
	        				}.bind(this)];
	        			}.bind(this));
	        		}
	        		this.createMenu();
	        	},
	        	endState: function(){
	        		this.gameState.stage.removeChild(this.container);
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.gameState.stage);
	        	}
	        }),
			PausedState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_a');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Paused', {font: '96px 8bit'});
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('game');
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        }),

		MenuState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Subzero', {font: '96px 8bit', align: 'center'});
					text.position.x = game.renderer.width / 2;
					text.position.y = game.renderer.height / 2;
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.createState('game');
	        			return;
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        }),
		WinState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_d');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Win', {font: '96px 8bit', align: 'center'});
					text.position.x = game.renderer.width / 2;
					text.position.y = game.renderer.height / 2;
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('menu');
	        			return;
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        }),
		LoseState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_e');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Lose', {font: '96px 8bit', align: 'center'});
					text.position.x = game.renderer.width / 2;
					text.position.y = game.renderer.height / 2;
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('menu');
	        			return;
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        }),
		}
	}
);
define('subzero', ['subzero/main'], function (main) { return main; });
