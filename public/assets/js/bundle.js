(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

'use strict';

/**
 * Zig Loader
 * @since ZigLoader 0.1
 */

require('./styles/main.scss');
require('./scripts/index');
});
___scope___.file("styles/main.scss", function(exports, require, module, __filename, __dirname){


require("~/assets/css/main.css")
});
___scope___.file("scripts/index.js", function(exports, require, module, __filename, __dirname){

'use strict';

var _hello = require('./hello');

var _hello2 = _interopRequireDefault(_hello);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var zig = new _hello2.default(); // Zig

zig.hi();
});
___scope___.file("scripts/hello.js", function(exports, require, module, __filename, __dirname){

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Zig = function () {
  function Zig() {
    _classCallCheck(this, Zig);
  }

  _createClass(Zig, [{
    key: 'hi',
    value: function hi() {
      console.log('Hey Ziggest -)');
    }
  }]);

  return Zig;
}();

exports.default = Zig;
});
___scope___.file("assets/css/main.css", function(exports, require, module, __filename, __dirname){

require("fuse-box-css")("assets/css/main.css");
});
});
FuseBox.pkg("fusebox-hot-reload", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
/**
 * @module listens to `source-changed` socket events and actions hot reload
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Client = require('fusebox-websocket').SocketClient;
exports.connect = function (port, uri) {
    if (FuseBox.isServer) {
        return;
    }
    port = port || window.location.port;
    var client = new Client({
        port: port,
        uri: uri,
    });
    client.connect();
    client.on('source-changed', function (data) {
        console.info("%cupdate \"" + data.path + "\"", 'color: #237abe');
        /**
         * If a plugin handles this request then we don't have to do anything
         **/
        for (var index = 0; index < FuseBox.plugins.length; index++) {
            var plugin = FuseBox.plugins[index];
            if (plugin.hmrUpdate && plugin.hmrUpdate(data)) {
                return;
            }
        }
        if (data.type === 'js') {
            FuseBox.flush();
            FuseBox.dynamic(data.path, data.content);
            if (FuseBox.mainFile) {
                try {
                    FuseBox.import(FuseBox.mainFile);
                }
                catch (e) {
                    if (typeof e === 'string') {
                        if (/not found/.test(e)) {
                            return window.location.reload();
                        }
                    }
                    console.error(e);
                }
            }
        }
        if (data.type === 'css' && __fsbx_css) {
            __fsbx_css(data.path, data.content);
        }
    });
    client.on('error', function (error) {
        console.log(error);
    });
};

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("fusebox-websocket", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require('events');
var SocketClient = (function () {
    function SocketClient(opts) {
        opts = opts || {};
        var port = opts.port || window.location.port;
        var protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
        var domain = location.hostname || 'localhost';
        this.url = opts.host || "" + protocol + domain + ":" + port;
        if (opts.uri) {
            this.url = opts.uri;
        }
        this.authSent = false;
        this.emitter = new events.EventEmitter();
    }
    SocketClient.prototype.reconnect = function (fn) {
        var _this = this;
        setTimeout(function () {
            _this.emitter.emit('reconnect', { message: 'Trying to reconnect' });
            _this.connect(fn);
        }, 5000);
    };
    SocketClient.prototype.on = function (event, fn) {
        this.emitter.on(event, fn);
    };
    SocketClient.prototype.connect = function (fn) {
        var _this = this;
        console.log('%cConnecting to fusebox HMR at ' + this.url, 'color: #237abe');
        setTimeout(function () {
            _this.client = new WebSocket(_this.url);
            _this.bindEvents(fn);
        }, 0);
    };
    SocketClient.prototype.close = function () {
        this.client.close();
    };
    SocketClient.prototype.send = function (eventName, data) {
        if (this.client.readyState === 1) {
            this.client.send(JSON.stringify({ event: eventName, data: data || {} }));
        }
    };
    SocketClient.prototype.error = function (data) {
        this.emitter.emit('error', data);
    };
    /** Wires up the socket client messages to be emitted on our event emitter */
    SocketClient.prototype.bindEvents = function (fn) {
        var _this = this;
        this.client.onopen = function (event) {
            console.log('%cConnected', 'color: #237abe');
            if (fn) {
                fn(_this);
            }
        };
        this.client.onerror = function (event) {
            _this.error({ reason: event.reason, message: 'Socket error' });
        };
        this.client.onclose = function (event) {
            _this.emitter.emit('close', { message: 'Socket closed' });
            if (event.code !== 1011) {
                _this.reconnect(fn);
            }
        };
        this.client.onmessage = function (event) {
            var data = event.data;
            if (data) {
                var item = JSON.parse(data);
                _this.emitter.emit(item.type, item.data);
                _this.emitter.emit('*', item);
            }
        };
    };
    return SocketClient;
}());
exports.SocketClient = SocketClient;

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("events", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
if (FuseBox.isServer) {
    module.exports = global.require("events");
} else {
    function EventEmitter() {
        this._events = this._events || {};
        this._maxListeners = this._maxListeners || undefined;
    }
    module.exports = EventEmitter;

    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function(n) {
        if (!isNumber(n) || n < 0 || isNaN(n))
            throw TypeError("n must be a positive number");
        this._maxListeners = n;
        return this;
    };

    EventEmitter.prototype.emit = function(type) {
        var er, handler, len, args, i, listeners;

        if (!this._events)
            this._events = {};

        // If there is no 'error' event listener then throw.
        if (type === "error") {
            if (!this._events.error ||
                (isObject(this._events.error) && !this._events.error.length)) {
                er = arguments[1];
                if (er instanceof Error) {
                    throw er; // Unhandled 'error' event
                }
                throw TypeError("Uncaught, unspecified \"error\" event.");
            }
        }

        handler = this._events[type];

        if (isUndefined(handler))
            return false;

        if (isFunction(handler)) {
            switch (arguments.length) {
                // fast cases
                case 1:
                    handler.call(this);
                    break;
                case 2:
                    handler.call(this, arguments[1]);
                    break;
                case 3:
                    handler.call(this, arguments[1], arguments[2]);
                    break;
                    // slower
                default:
                    args = Array.prototype.slice.call(arguments, 1);
                    handler.apply(this, args);
            }
        } else if (isObject(handler)) {
            args = Array.prototype.slice.call(arguments, 1);
            listeners = handler.slice();
            len = listeners.length;
            for (i = 0; i < len; i++)
                listeners[i].apply(this, args);
        }

        return true;
    };

    EventEmitter.prototype.addListener = function(type, listener) {
        var m;

        if (!isFunction(listener))
            throw TypeError("listener must be a function");

        if (!this._events)
            this._events = {};

        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (this._events.newListener)
            this.emit("newListener", type,
                isFunction(listener.listener) ?
                listener.listener : listener);

        if (!this._events[type])
        // Optimize the case of one listener. Don't need the extra array object.
            this._events[type] = listener;
        else if (isObject(this._events[type]))
        // If we've already got an array, just append.
            this._events[type].push(listener);
        else
        // Adding the second element, need to change to array.
            this._events[type] = [this._events[type], listener];

        // Check for listener leak
        if (isObject(this._events[type]) && !this._events[type].warned) {
            if (!isUndefined(this._maxListeners)) {
                m = this._maxListeners;
            } else {
                m = EventEmitter.defaultMaxListeners;
            }

            if (m && m > 0 && this._events[type].length > m) {
                this._events[type].warned = true;
                console.error("(node) warning: possible EventEmitter memory " +
                    "leak detected. %d listeners added. " +
                    "Use emitter.setMaxListeners() to increase limit.",
                    this._events[type].length);
                if (typeof console.trace === "function") {
                    // not supported in IE 10
                    console.trace();
                }
            }
        }

        return this;
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.once = function(type, listener) {
        if (!isFunction(listener))
            throw TypeError("listener must be a function");

        var fired = false;

        function g() {
            this.removeListener(type, g);

            if (!fired) {
                fired = true;
                listener.apply(this, arguments);
            }
        }

        g.listener = listener;
        this.on(type, g);

        return this;
    };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener = function(type, listener) {
        var list, position, length, i;

        if (!isFunction(listener))
            throw TypeError("listener must be a function");

        if (!this._events || !this._events[type])
            return this;

        list = this._events[type];
        length = list.length;
        position = -1;

        if (list === listener ||
            (isFunction(list.listener) && list.listener === listener)) {
            delete this._events[type];
            if (this._events.removeListener)
                this.emit("removeListener", type, listener);

        } else if (isObject(list)) {
            for (i = length; i-- > 0;) {
                if (list[i] === listener ||
                    (list[i].listener && list[i].listener === listener)) {
                    position = i;
                    break;
                }
            }

            if (position < 0)
                return this;

            if (list.length === 1) {
                list.length = 0;
                delete this._events[type];
            } else {
                list.splice(position, 1);
            }

            if (this._events.removeListener)
                this.emit("removeListener", type, listener);
        }

        return this;
    };

    EventEmitter.prototype.removeAllListeners = function(type) {
        var key, listeners;

        if (!this._events)
            return this;

        // not listening for removeListener, no need to emit
        if (!this._events.removeListener) {
            if (arguments.length === 0)
                this._events = {};
            else if (this._events[type])
                delete this._events[type];
            return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
            for (key in this._events) {
                if (key === "removeListener") continue;
                this.removeAllListeners(key);
            }
            this.removeAllListeners("removeListener");
            this._events = {};
            return this;
        }

        listeners = this._events[type];

        if (isFunction(listeners)) {
            this.removeListener(type, listeners);
        } else if (listeners) {
            // LIFO order
            while (listeners.length)
                this.removeListener(type, listeners[listeners.length - 1]);
        }
        delete this._events[type];

        return this;
    };

    EventEmitter.prototype.listeners = function(type) {
        var ret;
        if (!this._events || !this._events[type])
            ret = [];
        else if (isFunction(this._events[type]))
            ret = [this._events[type]];
        else
            ret = this._events[type].slice();
        return ret;
    };

    EventEmitter.prototype.listenerCount = function(type) {
        if (this._events) {
            var evlistener = this._events[type];

            if (isFunction(evlistener))
                return 1;
            else if (evlistener)
                return evlistener.length;
        }
        return 0;
    };

    EventEmitter.listenerCount = function(emitter, type) {
        return emitter.listenerCount(type);
    };

    function isFunction(arg) {
        return typeof arg === "function";
    }

    function isNumber(arg) {
        return typeof arg === "number";
    }

    function isObject(arg) {
        return typeof arg === "object" && arg !== null;
    }

    function isUndefined(arg) {
        return arg === void 0;
    }
}

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("fuse-box-css", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

/**
 * Listens to 'async' requets and if the name is a css file
 * wires it to `__fsbx_css`
 */
if (typeof FuseBox !== "undefined" && FuseBox.isBrowser) {
    FuseBox.on('async', function(name) {
        if (FuseBox.isServer) {
            return;
        }
        if (/\.css$/.test(name)) {
            __fsbx_css(name);
            return false;
        }
    });
}

module.exports = function(__filename, contents) {
    if (!FuseBox.isServer) {
        var styleId = __filename.replace(/[\.\/]+/g, '-');
        if (styleId.charAt(0) === '-') styleId = styleId.substring(1);
        var exists = document.getElementById(styleId);
        if (!exists) {
            //<link href="//fonts.googleapis.com/css?family=Covered+By+Your+Grace" rel="stylesheet" type="text/css">
            var s = document.createElement(contents ? 'style' : 'link');
            s.id = styleId;
            s.type = 'text/css';
            if (contents) {
                s.innerHTML = contents;
            } else {
                s.rel = 'stylesheet';
                s.href = __filename;
            }
            document.getElementsByTagName('head')[0].appendChild(s);
        } else {
            if (contents) {
                exists.innerHTML = contents;
            }
        }
    }
}
});
return ___scope___.entry = "index.js";
});
FuseBox.import("fusebox-hot-reload").connect(8000, "")

FuseBox.import("default/index.js");
FuseBox.main("default/index.js");
})
((function(__root__){
if (__root__["FuseBox"]) return __root__["FuseBox"];
var $isBrowser = typeof window !== "undefined" && window.navigator;
var g = $isBrowser ? window : global;
if ($isBrowser) {
    g["global"] = window;
}
__root__ = !$isBrowser || typeof __fbx__dnm__ !== "undefined" ? module.exports : __root__;
var $fsbx = $isBrowser ? (window["__fsbx__"] = window["__fsbx__"] || {})
    : g["$fsbx"] = g["$fsbx"] || {};
if (!$isBrowser) {
    g["require"] = require;
}
var $packages = $fsbx.p = $fsbx.p || {};
var $events = $fsbx.e = $fsbx.e || {};
function $getNodeModuleName(name) {
    var n = name.charCodeAt(0);
    var s = name.charCodeAt(1);
    if (!$isBrowser && s === 58) {
        return;
    }
    if (n >= 97 && n <= 122 || n === 64) {
        if (n === 64) {
            var s_1 = name.split("/");
            var target = s_1.splice(2, s_1.length).join("/");
            return [s_1[0] + "/" + s_1[1], target || undefined];
        }
        var index = name.indexOf("/");
        if (index === -1) {
            return [name];
        }
        var first = name.substring(0, index);
        var second = name.substring(index + 1);
        return [first, second];
    }
}
;
function $getDir(filePath) {
    return filePath.substring(0, filePath.lastIndexOf("/")) || "./";
}
;
function $pathJoin() {
    var string = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        string[_i] = arguments[_i];
    }
    var parts = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        parts = parts.concat(arguments[i].split("/"));
    }
    var newParts = [];
    for (var i = 0, l = parts.length; i < l; i++) {
        var part = parts[i];
        if (!part || part === ".")
            continue;
        if (part === "..") {
            newParts.pop();
        }
        else {
            newParts.push(part);
        }
    }
    if (parts[0] === "")
        newParts.unshift("");
    return newParts.join("/") || (newParts.length ? "/" : ".");
}
;
function $ensureExtension(name) {
    var matched = name.match(/\.(\w{1,})$/);
    if (matched) {
        if (!matched[1]) {
            return name + ".js";
        }
        return name;
    }
    return name + ".js";
}
;
function $loadURL(url) {
    if ($isBrowser) {
        var d = document;
        var head = d.getElementsByTagName("head")[0];
        var target;
        if (/\.css$/.test(url)) {
            target = d.createElement("link");
            target.rel = "stylesheet";
            target.type = "text/css";
            target.href = url;
        }
        else {
            target = d.createElement("script");
            target.type = "text/javascript";
            target.src = url;
            target.async = true;
        }
        head.insertBefore(target, head.firstChild);
    }
}
;
function $loopObjKey(obj, func) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            func(key, obj[key]);
        }
    }
}
;
function $serverRequire(path) {
    return { server: require(path) };
}
;
function $getRef(name, o) {
    var basePath = o.path || "./";
    var pkgName = o.pkg || "default";
    var nodeModule = $getNodeModuleName(name);
    if (nodeModule) {
        basePath = "./";
        pkgName = nodeModule[0];
        if (o.v && o.v[pkgName]) {
            pkgName = pkgName + "@" + o.v[pkgName];
        }
        name = nodeModule[1];
    }
    if (name) {
        if (name.charCodeAt(0) === 126) {
            name = name.slice(2, name.length);
            basePath = "./";
        }
        else {
            if (!$isBrowser && (name.charCodeAt(0) === 47 || name.charCodeAt(1) === 58)) {
                return $serverRequire(name);
            }
        }
    }
    var pkg = $packages[pkgName];
    if (!pkg) {
        if ($isBrowser && FuseBox.target !== "electron") {
            throw "Package not found " + pkgName;
        }
        else {
            return $serverRequire(pkgName + (name ? "/" + name : ""));
        }
    }
    name = name ? name : "./" + pkg.s.entry;
    var filePath = $pathJoin(basePath, name);
    var validPath = $ensureExtension(filePath);
    var file = pkg.f[validPath];
    var wildcard;
    if (!file && validPath.indexOf("*") > -1) {
        wildcard = validPath;
    }
    if (!file && !wildcard) {
        validPath = $pathJoin(filePath, "/", "index.js");
        file = pkg.f[validPath];
        if (!file) {
            validPath = filePath + ".js";
            file = pkg.f[validPath];
        }
        if (!file) {
            file = pkg.f[filePath + ".jsx"];
        }
        if (!file) {
            validPath = filePath + "/index.jsx";
            file = pkg.f[validPath];
        }
    }
    return {
        file: file,
        wildcard: wildcard,
        pkgName: pkgName,
        versions: pkg.v,
        filePath: filePath,
        validPath: validPath,
    };
}
;
function $async(file, cb, o) {
    if (o === void 0) { o = {}; }
    if ($isBrowser) {
        if (o && o.ajaxed === file) {
            return console.error(file, 'does not provide a module');
        }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var contentType = xmlhttp.getResponseHeader("Content-Type");
                    var content = xmlhttp.responseText;
                    if (/json/.test(contentType)) {
                        content = "module.exports = " + content;
                    }
                    else {
                        if (!/javascript/.test(contentType)) {
                            content = "module.exports = " + JSON.stringify(content);
                        }
                    }
                    var normalized = $pathJoin("./", file);
                    FuseBox.dynamic(normalized, content);
                    cb(FuseBox.import(file, { ajaxed: file }));
                }
                else {
                    console.error(file, 'not found on request');
                    cb(undefined);
                }
            }
        };
        xmlhttp.open("GET", file, true);
        xmlhttp.send();
    }
    else {
        if (/\.(js|json)$/.test(file))
            return cb(g["require"](file));
        return cb("");
    }
}
;
function $trigger(name, args) {
    var e = $events[name];
    if (e) {
        for (var i in e) {
            var res = e[i].apply(null, args);
            if (res === false) {
                return false;
            }
        }
        ;
    }
}
;
function $import(name, o) {
    if (o === void 0) { o = {}; }
    if (name.charCodeAt(4) === 58 || name.charCodeAt(5) === 58) {
        return $loadURL(name);
    }
    var ref = $getRef(name, o);
    if (ref.server) {
        return ref.server;
    }
    var file = ref.file;
    if (ref.wildcard) {
        var safeRegEx = new RegExp(ref.wildcard
            .replace(/\*/g, "@")
            .replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
            .replace(/@@/g, ".*")
            .replace(/@/g, "[a-z0-9$_-]+"), "i");
        var pkg_1 = $packages[ref.pkgName];
        if (pkg_1) {
            var batch = {};
            for (var n in pkg_1.f) {
                if (safeRegEx.test(n)) {
                    batch[n] = $import(ref.pkgName + "/" + n);
                }
            }
            return batch;
        }
    }
    if (!file) {
        var asyncMode_1 = typeof o === "function";
        var processStopped = $trigger("async", [name, o]);
        if (processStopped === false) {
            return;
        }
        return $async(name, function (result) { return asyncMode_1 ? o(result) : null; }, o);
    }
    var pkg = ref.pkgName;
    if (file.locals && file.locals.module)
        return file.locals.module.exports;
    var locals = file.locals = {};
    var path = $getDir(ref.validPath);
    locals.exports = {};
    locals.module = { exports: locals.exports };
    locals.require = function (name, optionalCallback) {
        return $import(name, {
            pkg: pkg,
            path: path,
            v: ref.versions,
        });
    };
    if ($isBrowser || !g["require"].main) {
        locals.require.main = { filename: "./", paths: [] };
    }
    else {
        locals.require.main = g["require"].main;
    }
    var args = [locals.module.exports, locals.require, locals.module, ref.validPath, path, pkg];
    $trigger("before-import", args);
    file.fn.apply(0, args);
    $trigger("after-import", args);
    return locals.module.exports;
}
;
var FuseBox = (function () {
    function FuseBox() {
    }
    FuseBox.global = function (key, obj) {
        if (obj === undefined)
            return g[key];
        g[key] = obj;
    };
    FuseBox.import = function (name, o) {
        return $import(name, o);
    };
    FuseBox.on = function (n, fn) {
        $events[n] = $events[n] || [];
        $events[n].push(fn);
    };
    FuseBox.exists = function (path) {
        try {
            var ref = $getRef(path, {});
            return ref.file !== undefined;
        }
        catch (err) {
            return false;
        }
    };
    FuseBox.remove = function (path) {
        var ref = $getRef(path, {});
        var pkg = $packages[ref.pkgName];
        if (pkg && pkg.f[ref.validPath]) {
            delete pkg.f[ref.validPath];
        }
    };
    FuseBox.main = function (name) {
        this.mainFile = name;
        return FuseBox.import(name, {});
    };
    FuseBox.expose = function (obj) {
        var _loop_1 = function (k) {
            var alias = obj[k].alias;
            var xp = $import(obj[k].pkg);
            if (alias === "*") {
                $loopObjKey(xp, function (exportKey, value) { return __root__[exportKey] = value; });
            }
            else if (typeof alias === "object") {
                $loopObjKey(alias, function (exportKey, value) { return __root__[value] = xp[exportKey]; });
            }
            else {
                __root__[alias] = xp;
            }
        };
        for (var k in obj) {
            _loop_1(k);
        }
    };
    FuseBox.dynamic = function (path, str, opts) {
        this.pkg(opts && opts.pkg || "default", {}, function (___scope___) {
            ___scope___.file(path, function (exports, require, module, __filename, __dirname) {
                var res = new Function("__fbx__dnm__", "exports", "require", "module", "__filename", "__dirname", "__root__", str);
                res(true, exports, require, module, __filename, __dirname, __root__);
            });
        });
    };
    FuseBox.flush = function (shouldFlush) {
        var def = $packages["default"];
        for (var fileName in def.f) {
            if (!shouldFlush || shouldFlush(fileName)) {
                delete def.f[fileName].locals;
            }
        }
    };
    FuseBox.pkg = function (name, v, fn) {
        if ($packages[name])
            return fn($packages[name].s);
        var pkg = $packages[name] = {};
        pkg.f = {};
        pkg.v = v;
        pkg.s = {
            file: function (name, fn) { return pkg.f[name] = { fn: fn }; },
        };
        return fn(pkg.s);
    };
    FuseBox.addPlugin = function (plugin) {
        this.plugins.push(plugin);
    };
    FuseBox.packages = $packages;
    FuseBox.isBrowser = $isBrowser;
    FuseBox.isServer = !$isBrowser;
    FuseBox.plugins = [];
    return FuseBox;
}());
if (!$isBrowser) {
    g["FuseBox"] = FuseBox;
}

return __root__["FuseBox"] = FuseBox; } )(this))