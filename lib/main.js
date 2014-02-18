(function () {
    function endsWith(s, v) {
        if (s === undefined || v === undefined) return false;
        if (s === null || v === null) return false;
        if (s.length < v.length) return false;
        if (s.substr(s.length - v.length, v.length) === v) return true;
        return false;
    }

    function IdlAttr() {
        this.Name = '';
        this.Type = 0;
        this.Values = [];
        return this;
    }

    IdlAttr.prototype.clone = function _cloneAttribute() {
        var newattr = new IdlAttr();
        newattr.Name = this.Name;
        newattr.Type = this.Type;
        newattr.Values = this.Values.concat([]);
        return newattr;
    }

    function IdlType() {
        this.Name = '';
        this.Types = [];
        return this;
    }
    IdlType.prototype.clone = function _cloneType() {
        var newtype = new IdlType();
        newtype.Name = this.Name;
        for (var i = 0; i < this.Types.length; ++i) {
            var typ = this.Types[i];
            newtype.Types.push(typ.clone());
        }
        return newtype;
    }

    function IdlParam() {
        this.Name = '';
        this.Type = new IdlType();
        this.Modifiers = [];
        this.Mandatory = false;
        return this;
    }
    IdlParam.prototype.clone = function _cloneParam() {
        var newparam = new IdlParam();
        newparam.Name = this.Name;
        newparam.Type = this.Type.clone();
        newparam.Modifiers = this.Modifiers.concat([]);
        newparam.Mandatory = this.Mandatory;
        return newparam;
    }

    function IdlOps() {
        this.Name = '';
        this.Return = new IdlType();
        this.Parameters = {};
        this.Attributes = [];
        this.Exceptions = [];
        this.BaseTypes = [];
        this.IsAsync = false;
        this.type = '';
        return this;
    }
    IdlOps.prototype.getAttribute = function _getAttribute(name) {
        for (i = 0; i < this.Attributes.length; ++i) {
            var attr = this.Attributes[i];
            if (attr.Name == name) {
                return attr;
            }
        }
        return null;
    }
    IdlOps.prototype.getDescription = function _getDescription() {
        var attr = this.getAttribute('description');
        if (attr) {
            return attr.Values[0];
        }
        return null;
    }

    IdlOps.prototype.clone = function _cloneOps() {
        var i;
        var newops = new IdlOps();
        newops.Name = this.Name;
        newops.Return = this.Return.clone();
        for (var pn in this.Parameters) {
            var prm = this.Parameters[pn];
            newops.Parameters[prm.Name] = prm.clone();
        }
        for (i = 0; i < this.Attributes.length; ++i) {
            var attr = this.Attributes[i];
            newops.Attributes.push(attr.clone());
        }
        newops.Exceptions = this.Exceptions.concat([]);
        newops.BaseTypes = this.BaseTypes.concat([]);
        newops.IsAsync = this.IsAsync;
        newops.type = this.type;
        return newops;
    }


    function IdlIntf() {
        this.Name = '';
        this.Service = ''
        this.Attributes = [];
        this.Operations = []
        this.Types = [];
        this.Enumerations = [];
        this.Exceptions = [];
        this.Events = [];
        return this;
    }
    IdlIntf.prototype.clone = function _cloneInterface() {
        var i;
        var newintf = new IdlIntf();
        newintf.Name = this.Name;
        newintf.Service = this.Service;
        for (i = 0; i < this.Attributes.length; ++i) {
            var attr = this.Attributes[i];
            newintf.Attributes.push(attr.clone());
        }
        for (i = 0; i < this.Operations.length; ++i) {
            var op = this.Operations[i];
            newintf.Operations.push(op.clone());
        }
        for (i = 0; i < this.Types.length; ++i) {
            var typ = this.Types[i];
            newintf.Types.push(typ.clone());
        }
        for (i = 0; i < this.Enumerations.length; ++i) {
            var enm = this.Enumerations[i];
            newintf.Enumerations.push(enm.clone());
        }
        for (i = 0; i < this.Exceptions.length; ++i) {
            var ex = this.Exceptions[i];
            newintf.Exceptions.push(ex.clone());
        }
        for (i = 0; i < this.Events.length; ++i) {
            var evt = this.Events[i];
            newintf.Events.push(evt.clone());
        }
        return newintf;
    }

    function IdlModel() {
        this.Attributes = [];
        this.Types = [];
        this.Enumerations = [];
        this.Exceptions = [];
        this.Events = [];
        this.Interfaces = {};
        this.Service = '';
        return this;
    }

    IdlModel.prototype.clone = function _cloneModel() {
        var i;
        var newmodel = new IdlModel();
        newmodel.Service = this.Service;

        for (i = 0; i < this.Attributes.length; ++i) {
            var newattr = this.Attributes[i].clone();
            newmodel.Attributes.push(newattr);
        }
        for (i = 0; i < this.Types.length; ++i) {
            var typ = this.Types[i];
            newmodel.Types.push(typ.clone());
        }
        for (i = 0; i < this.Enumerations.length; ++i) {
            var enm = this.Enumerations[i];
            newmodel.Enumerations.push(enm.clone());
        }
        for (i = 0; i < this.Exceptions.length; ++i) {
            var ex = this.Exceptions[i];
            newmodel.Exceptions.push(ex.clone());
        }
        for (i = 0; i < this.Events.length; ++i) {
            var evt = this.Events[i];
            newmodel.Events.push(evt.clone());
        }
        for (var inf in this.Interfaces) {
            var newintf = this.Interfaces[inf].clone();
            newmodel.Interfaces[inf] = newintf;
        }
        return newmodel;
    }

    var HttpVerbsMapping = [
        ["calculate", "GET", "", ""],
        ["getFrom", "GET", "", ""],
        ["getby", "GET", "", ""],
        ["get", "GET", "", ""],
        ["searchby", "GET", "", "search"],
        ["search", "GET", "search", ""],
        ["retrieve", "POST", "", "retrieve"],
        ["deleteFrom", "DELETE", "", ""],
        ["delete", "DELETE", "", ""],
        ["update", "PUT", "", ""],
        ["revoke", "PUT", "", "revoke"],
        ["rename", "PUT", "", "rename"],
        ["extend", "PUT", "", "extend"],
        ["unlockAccountBy", "PUT", "unlockaccount", ""],
        ["validate", "GET", "validate", ""],
        ["createOrUpdate", "POST", "", ""],
        ["create", "POST", "", ""],
        ["open", "POST", "", ""],
        ["issue", "POST", "issue", ""],
        ["reserve", "POST", "", "reserve"],
        ["confirm", "POST", "", "confirm"],
        ["unreserve", "POST", "", "unreserve"],
        ["redeem", "POST", "", "redeem"],
        ["restore", "POST", "", "restore"],
        ["activate", "POST", "", "activate"],
        ["deactivate", "POST", "", "deactivate"],
        ["approve", "POST", "", "approve"],
        ["reject", "POST", "", "reject"],
        ["add", "POST", "", ""],
        ["adjust", "POST", "adjust", ""],
        ["move", "POST", "move", ""],
        ["remove", "DELETE", "", ""],
        ["cancel", "DELETE", "", ""],
        ["close", "DELETE", "", ""]
    ];
    function FormatRoute(route) {
        //Clean the route structure before returning it
        route = route.replace("//", "/");
        route = route[0] == "/" ? route.substr(1) : route;
        return endsWith(route, "/") ? route.substr(0, route.length - 1) : route;
    }

    var AnnotationAttribute_UrlRouteTemplate = "urlTemplate";
    var AnnotationAttribute_UrlRouteTemplate = "urlTemplate";
    var AnnotationAttribute_HttpMethod = "method";
    var AnnotationAttribute_BodyParameterName = "bodyParam";
    var AnnotationAttribute_HttpStatus = "statusCode";
    var FromBody_Suffix = "FromBody";

    function ReadOperationAttributeFromAnnontationFile(op, intfAnno, attributeName) {
        var value = '';

        if (intfAnno != null && intfAnno.Operations != null && intfAnno.Operations.length > 0) {
            var aop = null;
            for (var opi in intfAnno.Operations) {
                aop = intfAnno.Operations[opi];
                if (aop.Name == op.Name) {
                    break;
                }
                aop = null;
            }
            if (aop == null) {
                return null;
            }
            //Check if the current operation has an custom attribute value specified in the annontated file
            var urlAttrib = aop.getAttribute(AnnotationAttribute_UrlRouteTemplate);

            if ((attributeName == AnnotationAttribute_UrlRouteTemplate) && urlAttrib != null) {
                value = urlAttrib.Values[0];
            }

            var methodAttrib = opa.getAttribute(AnnotationAttribute_HttpMethod);
            if ((attributeName == AnnotationAttribute_HttpMethod) && methodAttrib != null) {
                value = methodAttrib.Values[0];
            }

            var bodyAttrib = opAttributesGroup.Attributes.Get(AnnotationAttribute_BodyParameterName).FirstOrDefault();
            if ((attributeName == AnnotationAttribute_BodyParameterName) && bodyAttrib != null) {
                value = bodyAttrib.Values[0];
            }
        }

        return value;
    }
    function GetPostMethods(op, intfAnno) {
        //Check if method override exists in annotation file
        var method = ReadOperationAttributeFromAnnontationFile(op, intfAnno, AnnotationAttribute_HttpMethod);
        var bodyParam = ReadOperationAttributeFromAnnontationFile(op, intfAnno, AnnotationAttribute_BodyParameterName);

        var i = 0;
        var h = null;
        if (method == null || method == '') {
            for (i = 0; i < HttpVerbsMapping.length; ++i) {
                var o = HttpVerbsMapping[i];
                if (op.Name.toLowerCase().indexOf(o[0].toLowerCase()) == 0) {
                    h = o;
                    break;
                }
            }

        }

        method = (h != null) ? h[1] : "GET";
        if (method == "GET" || method == "DELETE") {
            if (bodyParam && bodyParam != '') {
                method = 'POST';
            }
            for (var p in op.Parameters) {
                if (endsWith(p, "FromBody")) {
                    method = "POST";
                }
            }
        }
        return method;
    }

    function GetParam(p) {
        return (endsWith(p.Name, "FromBody") ? p.Name.substr(0, p.Name.length - 8) : p.Name);
    }

    function ExcludeParameterFromQuerystring(p, route, bodyParam) {
        //Parameters passed via HTTP method body are excluded from querystring
        if ((bodyParam == null || bodyParam == undefined || bodyParam == '') && endsWith(p.Name, FromBody_Suffix)) return true;
        if (!(bodyParam == null || bodyParam == undefined || bodyParam == '') && p.Name == bodyParam) return true;

        if ((route == null || route == undefined || route == ''))
            //Mandatory parameters except of type set or list, are excluded from querystring (since they are part of route)
            if (p.Mandatory && !((p.Type.Name.indexOf("set") == 0) || (p.Type.Name.indexOf("list") == 0))) return true;
            else
                //If the route is provided via annonation file, then route parameters are excluded from querystring
                if (route.indexOf('{' + p.Name + '}') > 0) return true;

        return false;
    }
    function GetQueryString(op, intfAnno) {
        //Check if method override exists in annotation file
        var route = ReadOperationAttributeFromAnnontationFile(op, intfAnno, AnnotationAttribute_UrlRouteTemplate);
        var bodyParam = ReadOperationAttributeFromAnnontationFile(op, intfAnno, AnnotationAttribute_BodyParameterName);

        var isf = true;
        var sb = '';
        for (var pn in op.Parameters) {
            var p = op.Parameters[pn];
            if (ExcludeParameterFromQuerystring(p, route, bodyParam)) continue;
            if (isf) { sb += "?"; isf = false; } else { sb += "&"; }
            sb += (GetParam(p) + "={" + GetParam(p) + "...}");
        }
        return sb;
    }


    function GetHttpRoute(op, intf, intfAnno) {
        var route = ReadOperationAttributeFromAnnontationFile(op, intfAnno, AnnotationAttribute_UrlRouteTemplate);
        if (route && route != '') {
            return FormatRoute(route);
        }

        var i = 0;
        var h = null;
        for (i = 0; i < HttpVerbsMapping.length; ++i) {
            var o = HttpVerbsMapping[i];
            if (op.Name.toLowerCase().indexOf(o[0].toLowerCase()) == 0) {
                h = o;
                break;
            }
        }
        route = (h != null) ? h[2] : "";
        var opn = op.Name;
        if (endsWith(op.Name, "Feed")) { route += "feed"; opn = opn.substr(0, opn.length - 4); }
        if (endsWith(op.Name.toLowerCase(), intf.Name.toLowerCase())) { opn = opn.substr(0, opn.length - intf.Name.length); }
        var roppart = "";

        if (h != null && (h[0].length != opn.length)) {
            roppart = "/" + opn.substr(h[0].length).toLowerCase();
        };

        var qp = "";
        var isf = true;
        for (var pn in op.Parameters) {
            var p = op.Parameters[pn];
            if (p.Mandatory && !endsWith(p.Name, "FromBody") && (p.Type.Name != "set") && (p.Type.Name != "list")) {
                if (endsWith(roppart.toLowerCase(), "by" + p.Name.toLowerCase()) || endsWith(roppart.toLowerCase(), "to" + p.Name.toLowerCase())) {
                    var s = "/{" + p.Name.toLowerCase() + "}" + roppart.substr(0, roppart.length - (p.Name.length + 2));
                    roppart = s;
                }
                else if (endsWith(roppart.toLowerCase(), "from" + p.Name.toLowerCase())) {
                    var s = "/{" + p.Name.toLowerCase() + "}" + roppart.substr(0, roppart.length - (p.Name.length + 4));
                    roppart = s;
                }
                else if (endsWith(roppart.toLowerCase(), p.Name.toLowerCase())) {
                    roppart = "/{" + p.Name.toLowerCase() + "}";
                }
                else {
                    qp += "/{" + p.Name.toLowerCase() + "}";
                }
            }
        }
        route += roppart;
        if (h != null && !(h[3] == null || h[3] == '')) {
            route += "/" + h[3];
        }
        else if (h != null && (h[3] == null || h[3] == '') && h[1] != GetPostMethods(op)) {
            route += "/" + h[0];
        }
        else if (h == null && endsWith(opn.toLowerCase(), intf.Name.toLowerCase())) {
            route += "/" + opn.toLowerCase().substr(0, opn.length - intf.Name.length);
        }

        route += qp;
        return FormatRoute(route);
    }

    IdlIntf.prototype.Version = function () {
        var v = { Major: 0, Minor: 0, Build: 0 };

        for (i = 0; i < this.Attributes.length; ++i) {
            if (this.Attributes[i].Name == 'version') {
                var d = this.Attributes[i].Values[0].split('.');
                v.Major = d[0];
                v.Minor = d[1];
                v.Build = d[2];
                break;
            }
        }
        return v;
    }

    IdlModel.prototype.updateEndpoints = function () {
        var idlModel = this;
        var i;
        for (var infn in idlModel.Interfaces) {
            var intf = idlModel.Interfaces[infn];
            for (var opi in intf.Operations) {
                var op = intf.Operations[opi];
                var restendpoint = null;
                for (i = 0; i < op.Attributes.length; ++i) {
                    if (op.Attributes[i].Name == 'restendpoint') {
                        restendpoint = op.Attributes[i];
                        break;
                    }
                }
                if (restendpoint == null) {
                    restendpoint = new IdlAttr();
                    restendpoint.Name = "restendpoint";
                    //,Type = IdlAttr.IdlAttrType.String

                    op.Attributes.push(restendpoint);
                }
                else {
                    restendpoint.Values = [];
                }
                restendpoint.Values.push(GetPostMethods(op));
                restendpoint.Values.push("v" + intf.Version().Major + "/" + intf.Name.toLowerCase() + "/" + GetHttpRoute(op, intf));
                restendpoint.Values.push(GetQueryString(op));

            }
        }
    };

   var tidl = {
        IdlModel: IdlModel,
        IdlAttr: IdlAttr,
        IdlIntf: IdlIntf,
        IdlOps: IdlOps,
        IdlType: IdlType,
        IdlParam: IdlParam,

        Messages: {
            '1000': 'Unknown error'
            , '1001': "Unsupported attribute: Expecting 'tidl' attribute."
            , '1002': "Unused value: Will be ignored."
            , '1003': "Unsupported attribute: Expecting one of 'description', 'owner', 'version', 'revision', 'author', 'reviewer', 'organisation', 'namespacePrefix', 'organisationDomainName'."
            , '1004': "Duplicate: Will be ignored."
            , '1005': "Unsupported in tidl 1.x.x files, please change the tidl version to 2.0.0;"
            , '1006': "Unsupported attribute: Expecting one of 'description', 'owner', 'organisation', 'namespacePrefix', 'organisationDomainName'."
            , '1007': "Unsupported attribute: Expecting one of 'description', 'parameter', 'since','revision', 'exception', 'return','value','seealso'."

            , '2001': "Unexpected character: Expecting an attribute type like description, parameter etc,."
            , '2002': "Unexpected character: Expecting an attribute or a interface definition."
            , '2003': "Unexpected character: Bad syntax."
            , '2004': "Unexpected character: Expecting an ID as the first value for the attributes 'parameter', 'exception' or 'value'."
            , '2005': "Unexpected character: Expecting an n.n.n version as the first value for the attributes 'tidl', 'version', 'since' or 'revision'."
            , '2006': "Unexpected character: Expecting a string as the first value for the attribute."
            , '2007': ""
            , '2008': ""
            , '2009': ""
            , '2010': "Unexpected character: Expected a valid interface name."
            , '2011': "Unexpected character: Expected 'exposes' keyword."

            , '3001': "Standards: Suggested to start with a capital letter."

        }
    }


    if (this.CodeMirror||false) {
        CodeMirror.defineMode("tidl", _createParser);
        tidl.StringStream = CodeMirror.StringStream;
        tidl.splitLines = CodeMirror.splitLines;
    }
    else {
        // from CodeMirror
        // STRING STREAM

        // Fed to the mode parsers, provides helper functions to make
        // parsers more succinct.

        // The character stream used by a mode's parser.
        function StringStream(string, tabSize) {
            this.pos = this.start = 0;
            this.string = string;
            this.tabSize = tabSize || 8;
            this.lastColumnPos = this.lastColumnValue = 0;
        }

        StringStream.prototype = {
            eol: function () { return this.pos >= this.string.length; },
            sol: function () { return this.pos == 0; },
            peek: function () { return this.string.charAt(this.pos) || undefined; },
            next: function () {
                if (this.pos < this.string.length)
                    return this.string.charAt(this.pos++);
            },
            eat: function (match) {
                var ch = this.string.charAt(this.pos);
                if (typeof match == "string") var ok = ch == match;
                else var ok = ch && (match.test ? match.test(ch) : match(ch));
                if (ok) { ++this.pos; return ch; }
            },
            eatWhile: function (match) {
                var start = this.pos;
                while (this.eat(match)) { }
                return this.pos > start;
            },
            eatSpace: function () {
                var start = this.pos;
                while (/[\s\u00a0]/.test(this.string.charAt(this.pos)))++this.pos;
                return this.pos > start;
            },
            skipToEnd: function () { this.pos = this.string.length; },
            skipTo: function (ch) {
                var found = this.string.indexOf(ch, this.pos);
                if (found > -1) { this.pos = found; return true; }
            },
            backUp: function (n) { this.pos -= n; },
            column: function () {
                if (this.lastColumnPos < this.start) {
                    this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
                    this.lastColumnPos = this.start;
                }
                return this.lastColumnValue;
            },
            indentation: function () { return countColumn(this.string, null, this.tabSize); },
            match: function (pattern, consume, caseInsensitive) {
                if (typeof pattern == "string") {
                    var cased = function (str) { return caseInsensitive ? str.toLowerCase() : str; };
                    var substr = this.string.substr(this.pos, pattern.length);
                    if (cased(substr) == cased(pattern)) {
                        if (consume !== false) this.pos += pattern.length;
                        return true;
                    }
                } else {
                    var match = this.string.slice(this.pos).match(pattern);
                    if (match && match.index > 0) return null;
                    if (match && consume !== false) this.pos += match[0].length;
                    return match;
                }
            },
            current: function () { return this.string.slice(this.start, this.pos); }
        };
        tidl.StringStream = StringStream;

        // See if "".split is the broken IE version, if so, provide an
        // alternative way to split lines.
        var splitLines = "\n\nb".split(/\n/).length != 3 ? function (string) {
            var pos = 0, result = [], l = string.length;
            while (pos <= l) {
                var nl = string.indexOf("\n", pos);
                if (nl == -1) nl = string.length;
                var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
                var rt = line.indexOf("\r");
                if (rt != -1) {
                    result.push(line.slice(0, rt));
                    pos += rt + 1;
                } else {
                    result.push(line);
                    pos = nl + 1;
                }
            }
            return result;
        } : function (string) { return string.split(/\r\n?|\n/); };
        tidl.splitLines = splitLines;
    }

 
    function _createParser(config, parserConfig) {
        var ID = /^[a-zA-Z][a-zA-Z0-9_]*/;
        var builtintypes = ["boolean", "byte", "short", "int", "long", "float", "double", "decimal", "string", "datetime", "list", "set", "map"];
        function contains(items, item) {
            for (var i = 0; i < items.length; i++) {
                if (typeof item == 'function') {
                    var res = item(items[i], i);
                    if (res) return items[i];
                }
                else if (items[i] == item) {
                    return item;
                }
            }
            return false;
        }

        function tokenString(quote, col) {
            return function _tokenString(stream, state) {
                var data = "", next, end = false, escaped = false;
                while ((next = stream.next()) != null) {
                    if (next === quote && !escaped) {
                        end = true;
                        break;
                    }
                    data += next;
                    escaped = !escaped && next === '\\';
                }
                if (end) {
                    state.tokenizers.shift();
                }
                var token = (quote === '`' || quote === ')' ? 'quote' : 'string');
                state.lastToken = 'v';
                var attribute = state.context[0];
                if (attribute) {
                    try {
                        attribute.Values[attribute.Values.length - 1] = attribute.Values[attribute.Values.length - 1] + data + (end ? '' : '\n');
                    }
                    catch (ex) {
                    }
                    return token + state.ec;
                }
                return token;
            };
        };

        function tokenComment() {
            return function _tokenComment(stream, state) {
                var next, end = false;
                while ((next = stream.next()) != null) {
                    if (next + stream.peek() === "*/") {
                        stream.next();
                        end = true;
                        break;
                    }
                }
                if (end) {
                    state.tokenizers.shift();
                }
                var token = 'comment';
                return token;
            };
        };

        function tokenizeIDList() {
            return function _tokenizeIDList(stream, state) {
                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }
                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var matches;
                var array = state.context[0];

                if (state.lastToken == '' || state.lastToken == ',') {
                    if (matches = stream.match(ID)) {
                        state.lastToken = 'i';
                        array.push(matches[0]);
                        if (contains(builtintypes, matches[0])) {
                            return "builtin";
                        }
                        return "variable-2";
                    }
                }
                else if (state.lastToken == 'i') {
                    if (stream.eat(',')) {
                        state.lastToken = ',';
                        return null;
                    }
                    else if (stream.eat('{')) {
                        state.context.shift();
                        state.tokenizers.shift();
                        state.lastToken = '';
                        state.tokenizers.unshift(tokenizeIobjBody());
                        return 'bracket';
                    }
                }

                stream.next();
                return "error error-mark m-2003";
            }
        };

        function tokenizeType() {
            return function _tokenizeType(stream, state) {
                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }
                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var matches;
                var type = state.context[0];
                var parent = state.context[1];

                if (type.Name == '') {
                    if (matches = stream.match(ID)) {
                        type.Name = matches[0];
                        state.lastToken = 't';
                        if (contains(builtintypes, matches[0])) {
                            return "builtin";
                        }
                        return "variable-2";
                    }
                }
                else if (stream.peek() == '<') {
                    stream.next();
                    state.lastToken = '<';
                    state.context.unshift([]);
                    state.tokenizers.unshift(tokenizeTypeList());
                    return "operator";
                }
                else {
                    if (parent instanceof (Array)) {
                        parent.push(type);
                    }
                    state.context.shift();
                    state.tokenizers.shift();
                    return tokenize(stream, state);
                }
            }
        };

        function tokenizeTypeList() {
            return function _tokenizeTypeList(stream, state) {
                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var matches;
                var typeList = state.context[0];
                var type = state.context[1];

                if (state.lastToken == '<' || state.lastToken == ',') {
                    if (matches = stream.match(ID, false)) {
                        state.context.unshift(new tidl.IdlType());
                        state.tokenizers.unshift(tokenizeType());
                        return tokenize(stream, state);
                    }
                }
                else if (state.lastToken == 't') {
                    if (stream.eat(',')) {
                        state.lastToken = ',';
                        return null;
                    }
                    else if (stream.eat('>')) {
                        state.lastToken = '>';
                        type.Types = typeList.concat([]);
                        state.context.shift();
                        state.tokenizers.shift();
                        return "operator";
                    }
                }
                if (stream.eat(',')) {
                    return null;
                }
                else if (stream.eat('<')) {
                    var t = obj.parameters[obj.parameters.length - 1];
                    state.context.unshift(t);
                    state.tokenizers.unshift(tokenizeTypeList());
                    return "operator";
                }
                else if (matches = stream.match(ID)) {
                    var t = { name: matches[0], type: 'dataType', parameters: [] }
                    obj.parameters.push(t);
                    if (contains(builtintypes, matches[0])) {
                        return "builtin";
                    }
                    return "variable-2";
                }

                if (stream.eat('>')) {
                    state.context.shift();
                    state.tokenizers.shift();
                    return "operator";
                }

                stream.skipToEnd();
                state.tokenizers.shift();
                state.context.shift();
                return "error";
            };
        };

        function tokenizeParam() {
            return function _tokenPList(stream, state) {
                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }
                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }


                var matches;
                var param = state.context[0];
                var obj = state.context[1];


                if (matches = stream.match(ID, false)) {
                    if (matches[0] == 'mandatory' && obj.type != 'enumeration' && param.Mandatory == false) {
                        stream.match(ID);
                        param.Modifiers.push(matches[0]);
                        param.Mandatory = true;
                        return 'keyword';
                    }
                    else if (obj.type == 'enumeration') {
                        stream.match(ID);
                        param.Name = matches[0];
                        state.lastToken = 'p';
                        obj.Parameters[param.Name] = param;
                        state.context.shift();
                        state.tokenizers.shift();
                        obj.Parameters[matches[0]] = param;
                        return 'variable';
                    }
                    else if (param.Type.Name == '') {
                        state.context.unshift(param.Type);
                        state.tokenizers.unshift(tokenizeType());
                        return tokenize(stream, state);
                    }
                    else {
                        stream.match(ID);
                        param.Name = matches[0];
                        state.lastToken = 'p';
                        obj.Parameters[param.Name] = param;
                        state.context.shift();
                        state.tokenizers.shift();
                        obj[matches[0]] = param;
                        return 'variable';
                    }
                }

                stream.next();
                return "error error-mark m-2003";
            }
        };

        function tokenPList() {
            return function _tokenPList(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }
                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }


                var matches;
                var obj = state.context[0];
                var parentScope = state.context[1];

                if (state.lastToken == '(') {
                    if (matches = stream.match(ID, false)) {
                        var param = new tidl.IdlParam();
                        state.context.unshift(param);
                        state.tokenizers.unshift(tokenizeParam());
                        return tokenize(stream, state);
                    }
                }
                else if (state.lastToken == 'p') {
                    if (stream.eat(',')) {
                        state.lastToken = ',';
                        var param = new tidl.IdlParam();
                        state.context.unshift(param);
                        state.tokenizers.unshift(tokenizeParam());
                        return null;
                    }
                }
                if (stream.eat(')') === ')') {
                    state.lastToken = ')';
                    state.tokenizers.shift();
                    return null;
                }

                stream.next();
                if (state.inError()) {
                    return "error" + state.ec;
                }
                else {
                    return "error error-mark m-2003";
                }
            };
        };

        function tokenizeIobjBody() {
            return function _tokenizeIobjBody(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var obj = state.context[0];
                var parentScope = state.context[1];

                if (stream.peek() == '@') {
                    stream.next();
                    var attribute = new tidl.IdlAttr();
                    if (matches = stream.match(ID, true)) {
                        attribute.Name = matches[0];
                        if (contains(['description', 'parameter', 'since',
                            'revision', 'exception', 'return', 'value', 'seealso'], attribute.Name) == false) {
                            state.setWarn(1007);
                        }
                        state.context.unshift(attribute);
                        state.tokenizers.unshift(tokenizeAttribute());
                        return "attribute em" + state.ec;
                    }
                    else {
                        stream.skipToEnd();
                        state.ec = '';
                        return 'error error-mark m-2003';
                    }
                }
                else if (stream.peek() == '}') {
                    state.tokenizers.shift();
                    return 'bracket';
                }
                stream.skipToEnd();
                state.tokenizers.shift();
                return "error error-mark m-2003";
            }
        };

        function tokenizeIobj() {
            return function _tokenizeIobj(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var obj = state.context[0];
                var parentScope = state.context[1];
                var matches;

                if (obj.Name == '') {
                    if (matches = stream.match(ID)) {
                        state.lastToken = 'i';
                        obj.Name = matches[0];
                        if (obj.type == 'operation') {
                            return 'def strong';
                        }
                        else {
                            return 'variable-2 strong';
                        }
                    }
                }
                else if (state.lastToken == 'i' && stream.peek() == '(') {
                    state.tokenizers.unshift(tokenPList());
                    stream.next();
                    state.lastToken = '(';
                    return null;
                }
                else if (state.lastToken == ')') {
                    if (matches = stream.match(ID, false)) {
                        if (matches == 'throws') {
                            if (obj.type == 'operation') {
                                state.lastToken = '';
                                state.context.unshift(obj.Exceptions);
                                state.tokenizers.unshift(tokenizeIDList());
                                stream.match(ID);
                                return 'keyword';
                            }
                        }
                        else if (matches == 'extends') {
                            if (obj.type == 'type') {
                                state.lastToken = '';
                                state.context.unshift(obj.BaseTypes);
                                state.tokenizers.unshift(tokenizeIDList());
                                stream.match(ID);
                                return 'keyword';
                            }
                        }
                    }
                    else if (stream.eat('{')) {
                        state.lastToken = '';
                        state.tokenizers.unshift(tokenizeIobjBody());
                        return 'bracket';
                    }
                }
                else if (stream.eat('}')) {
                    state.lastToken = '';
                    try {
                        parentScope[obj.type.toUpperCase()[0] + obj.type.substr(1) + 's'].push(obj);
                    }
                    catch (e) {
                    }
                    state.context.shift();
                    state.tokenizers.shift();
                    return 'bracket';
                }

                stream.skipToEnd();
                state.tokenizers.shift();
                return "error error-mark m-2003";
            };
        };

        function tokenizeInterfaceBody() {
            return function _tokenizeInterfaceBody(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var interface = state.context[0];
                var parentScope = state.context[1];
                var matches;

                if (stream.peek() == '}') {
                    stream.next();
                    state.context.shift();
                    state.tokenizers.shift();
                    if (!state.inError()) {
                        try {
                            parentScope.Interfaces[interface.Name] = interface;
                        }
                        catch (e) {
                        }
                    }
                    return 'bracket';
                }

                if (stream.peek() == '@') {
                    stream.next();
                    var attribute = new tidl.IdlAttr();
                    if (matches = stream.match(ID, true)) {
                        attribute.Name = matches[0];
                        if (contains(['description', 'owner', 'version',
                            'revision', 'author', 'reviewer', 'organisation',
                            'namespacePrefix', 'organisationDomainName'], attribute.Name) == false) {
                            state.setWarn(1003);
                        }
                        state.context.unshift(attribute);
                        state.tokenizers.unshift(tokenizeAttribute());
                        return "attribute em" + state.ec;
                    }
                    else {
                        stream.skipToEnd();
                        state.ec = '';
                        return 'error error-mark m-2003';
                    }
                }

                if (matches = stream.match(ID, false)) {
                    if (contains(['type', 'event', 'exception', 'enumeration'], matches[0])) {
                        stream.match(ID);
                        var ob = new tidl.IdlOps();
                        ob.type = matches[0];
                        ob.Return = new tidl.IdlType();
                        ob.Return.Name = matches[0];
                        state.context.unshift(ob);
                        state.tokenizers.unshift(tokenizeIobj());
                        return "keyword";
                    }
                    else {
                        var rc = '';
                        var ob = new tidl.IdlOps();
                        ob.type = "operation";
                        if (matches[0] === 'async') {
                            stream.match(ID);
                            ob.IsAsync = true;
                            rc = 'keyword';
                        }
                        else {
                            ob.IsAsync = false;
                            //ob.Return.Name = matches[0];
                            //rc = 'variable-2';
                            //if (contains(builtintypes, matches[0])) {
                            //    rc = "builtin";
                            //}
                        }
                        state.context.unshift(ob);
                        state.context.unshift(ob.Return);
                        state.tokenizers.unshift(tokenizeIobj());
                        state.tokenizers.unshift(tokenizeType());
                        if (rc != '') {
                            return rc;
                        }

                        return tokenize(stream, state);
                    }
                }

                stream.skipToEnd();
                state.context.shift();
                state.tokenizers.shift();
                if (!state.inError()) {
                    state.setError(2003);
                }
                return "error" + state.ec;
            }
        };

        function tokenizeInterface() {
            return function _tokenizeInterface(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var interface = state.context[0];
                var parentScope = state.context[1];
                var sname = parentScope.Service;
                var matches;

                if (interface.Service == '') {
                    if (matches = stream.match(ID)) {
                        if (interface.Name != '') {
                            if (state.lastToken == 'k') {
                                interface.Service = matches[0];
                                state.ec = '';
                                if (interface.Service.toUpperCase()[0] != interface.Service[0]) {
                                    return "def info-mark m-3001";
                                }
                                return 'def';
                            }
                            else if (matches[0] === 'exposes') {
                                state.lastToken = 'k';
                                state.ec = '';
                                return 'keyword';
                            }
                            else {
                                state.setError(2011);
                            }
                        }
                        else {
                            interface.Name = matches[0];
                            state.ec = '';
                            state.lastToken = 'd';
                            if (interface.Name.toUpperCase()[0] != interface.Name[0]) {
                                return "def info-mark m-3001";
                            }
                            return 'def'
                        }
                    }
                    else {
                        state.setError(2010);
                    }
                }

                if ((interface.Service != '' || sname != undefined) && stream.peek() == '{') {
                    if (interface.Service == '') {
                        interface.Service = sname;
                    }
                    stream.next();
                    state.tokenizers.shift();
                    state.tokenizers.unshift(tokenizeInterfaceBody());
                    return 'bracket';
                }

                stream.skipToEnd();
                state.context.shift();
                state.tokenizers.shift();
                if (!state.inError()) {
                    state.setError(2003);
                }
                return "error" + state.ec;
            };
        };

        function tokenizeServiceBody() {
            return function _tokenizeServiceBody(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var model = state.context[0];
                var parentScope = state.context[1];
                var matches;

                if (stream.peek() == '}') {
                    stream.next();
                    state.context.shift();
                    state.tokenizers.shift();
                    return 'bracket';
                }

                if (stream.peek() == '@') {
                    stream.next();
                    var attribute = new tidl.IdlAttr();
                    if (matches = stream.match(ID, true)) {
                        attribute.Name = matches[0];
                        if (contains(['description', 'owner', 'organisation',
                            'namespacePrefix', 'organisationDomainName'], attribute.Name) == false) {
                            state.setWarn(1006);
                        }
                        state.context.unshift(attribute);
                        state.tokenizers.unshift(tokenizeAttribute());
                        return "attribute em" + state.ec;
                    }
                    else {
                        stream.skipToEnd();
                        state.ec = '';
                        return 'error error-mark m-2003';
                    }
                }
                if (matches = stream.match(/^interface\s/)) {
                    var interface = new tidl.IdlIntf();
                    state.ec = '';
                    state.context.unshift(interface);
                    state.tokenizers.unshift(tokenizeInterface());
                    return "keyword";
                }

                if (matches = stream.match(ID, false)) {
                    if (contains(['type', 'event', 'exception', 'enumeration'], matches[0])) {
                        stream.match(ID);
                        var ob = new tidl.IdlOps();
                        ob.type = matches[0];
                        ob.Return = new tidl.IdlType();
                        ob.Return.Name = matches[0];
                        state.context.unshift(ob);
                        state.tokenizers.unshift(tokenizeIobj());
                        return "keyword";
                    }
                }

                stream.skipToEnd();
                state.context.shift();
                state.tokenizers.shift();
                if (!state.inError()) {
                    state.setError(2003);
                }
                return "error" + state.ec;
            }
        };

        function tokenizeService() {
            return function _tokenizeService(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var model = state.context[0];
                var parentScope = state.context[1];
                var matches;

                if (model.Service == '') {
                    if (matches = stream.match(ID)) {
                        model.Service = matches[0];
                        state.ec = '';
                        if (model.Service.toUpperCase()[0] != model.Service[0]) {
                            return "def info-mark m-3001";
                        }
                        return 'def'
                    }
                }

                if (model.Service != '' && stream.peek() == '{') {
                    stream.next();
                    state.tokenizers.shift();
                    state.tokenizers.unshift(tokenizeServiceBody());
                    return 'bracket';
                }

                stream.skipToEnd();
                state.context.shift();
                state.tokenizers.shift();
                if (!state.inError()) {
                    state.setError(2003);
                }
                return "error" + state.ec;
            };
        };

        function tokenizeAttribute() {

            return function _tokenizeAttribute(stream, state) {

                if (stream.eatSpace()) {
                    return null;
                }

                if (stream.match("//")) {
                    stream.skipToEnd();
                    return 'comment';
                }

                if (stream.match("/*")) {
                    state.tokenizers.unshift(tokenComment());
                    return tokenize(stream, state);
                }

                var attribute = state.context[0];
                var parentScope = state.context[1];
                var ch = stream.peek();

                if (ch === ';') {
                    stream.next();
                    state.context.shift();
                    state.tokenizers.shift();

                    if (state.lastToken != 'v') {
                        state.lastToken = '';
                        state.ec = '';
                        return 'error error-mark m-2003';
                    }
                    state.lastToken = '';

                    try {
                        if (!state.inError()) {
                            parentScope.Attributes.push(attribute);
                        }
                    }
                    catch (e) {
                    }
                    state.ec = '';
                    return null;
                }

                var matches;
                if (attribute.Values.length == 0) {
                    if (contains(['parameter', 'exception', 'value'], attribute.Name)) {
                        if (matches = stream.match(ID)) {
                            attribute.Values.push(matches[0]);
                            state.lastToken = 'v';
                            return "variable " + state.ec;
                        }
                        else if (!state.inError()) {
                            state.setError(2004);
                        }
                    }
                    else if (contains(['tidl', 'version', 'since', 'revision'], attribute.Name)) {
                        if (matches = stream.match(/\d+\.\d+.\d+(\-[0-9a-zA-Z]+(\.[0-9a-zA-Z]+)*)?(\+[0-9a-zA-Z]+(\.[0-9a-zA-Z]+)*)?/, true)) {
                            attribute.Values.push(matches[0]);
                            state.lastToken = 'v';
                            return "number " + state.ec;
                        }
                        else if (!state.inError()) {
                            state.setError(2005);
                        }
                    }
                    else if (ch != '"' && ch != "'") {
                        if (!state.inError()) {
                            state.setError(2006);
                        }
                    } else {
                        state.lastToken = 'v';
                        attribute.Values.push('');
                        state.tokenizers.unshift(tokenString(stream.next(), stream.column()));
                        return tokenize(stream, state);
                    }
                }

                if (ch == ',') {
                    stream.next();
                    if (state.lastToken != 'v') {
                        state.setError(2003);
                        state.lastToken = ',';
                        return "error" + state.ec;
                    }
                    state.lastToken = ',';
                    return null;
                }

                if (ch == '"' || ch == "'") {
                    if (state.lastToken != ',') {
                        state.setError(2003);
                    }
                    if (attribute.Name == "tidl" && state.ec == '') {
                        state.setWarn(1002);
                    }
                    state.tokenizers.unshift(tokenString(stream.next(), stream.column()));
                    return tokenize(stream, state);
                }


                stream.next();
                //state.tokenizers.shift();
                return "error error-mark m-2003";
            }
        };

        function defaultTokenizer(stream, state) {
            var matches;

            if (stream.eatSpace()) {
                return null;
            }

            if (stream.match('//')) {
                stream.skipToEnd();
                return 'comment';
            }

            if (stream.match('/*')) {
                state.tokenizers.unshift(tokenComment());
                return tokenize(stream, state);
            }

            var model = state.context[0];

            if (stream.eat('@')) {
                var attribute = new tidl.IdlAttr();
                state.ec = '';
                if (matches = stream.match(ID, true)) {
                    attribute.Name = matches[0];
                    if (contains(['tidl'], attribute.Name) == false) {
                        state.setWarn(1001);
                    }
                    else {
                        try {
                            if (contains(model.Attributes, function (a) { return a.Name == 'tidl'; })) {
                                state.setWarn(1004);
                            }
                        }
                        catch (e) {
                        }
                    }
                    state.context.unshift(attribute);
                    state.tokenizers.unshift(tokenizeAttribute());
                    return "attribute em" + state.ec;
                }
                else {
                    stream.skipToEnd();
                    return 'error error-mark m-2001';
                }
            }
            if (matches = stream.match(/^service\s/)) {
                var tidlAttr = contains(model.Attributes, function (a) { return a.Name == 'tidl'; });
                if (tidlAttr == false || tidlAttr.Values[0].charAt(0) != '2') {
                    stream.skipToEnd();
                    return 'error error-mark m-1005';
                }
                state.ec = '';
                state.context.unshift(model);
                state.tokenizers.unshift(tokenizeService());
                return "keyword";
            }
            if (matches = stream.match(/^interface\s/)) {
                var interface = new tidl.IdlIntf();
                state.ec = '';
                state.context.unshift(interface);
                state.tokenizers.unshift(tokenizeInterface());
                return "keyword";
            }
            else {
                stream.next();
                return 'error error-mark m-2002';
            }
        };

        function tokenize(stream, state) {
            return (state.tokenizers[0] || defaultTokenizer)(stream, state);
        };

        return {
            token: function _token(stream, state) {
                if (state.context.length === 0) {
                    state.context.push(state.model);
                }

                if (stream.eol()) {
                    return null;
                }
                return tokenize(stream, state);
            },
            startState: function _startState() {
                return {
                    tokenizers: [],
                    context: [],
                    lastToken: '',
                    ec: '',
                    model: (config.model == undefined ? new tidl.IdlModel() : config.model),
                    inError: function () {
                        return (this.ec.indexOf('error-mark') !== -1)
                    },
                    setError: function (errNo) {
                        this.ec = ' error-mark m-' + errNo;
                    },
                    setWarn: function (warnNo) {
                        this.ec = ' warning-mark m-' + warnNo;
                    },
                    setInfo: function (infoNo) {
                        this.ec = ' info-mark m-' + infoNo;
                    }
                };
            },
            copyState: function _copyState(state) {
                if (state === true) return state;
                var nstate = {};
                var i;
                for (var n in state) {
                    var val = state[n];
                    if (val != undefined) {
                        if (val instanceof Array) {
                            var newval = [];
                            for (i = 0; i < val.length; ++i) {
                                var v = val[i];
                                if (v.clone && (typeof v.clone == 'function')) {
                                    newval.push(v.clone());
                                }
                                else {
                                    newval.push(v);
                                }
                            }
                            val = newval;
                        }
                        else if (val.clone && (typeof val.clone == 'function')) {
                            val = val.clone();
                        }
                    }
                    nstate[n] = val;
                }
                return nstate;
            },
            electricChars: "}",
            blockCommentStart: "/*",
            blockCommentEnd: "*/",
            fold: "brace"
        };
    }

    tidl.createParser = _createParser;


    // global on the server, window in the browser 
    var root = this, previous_tidl = root.tidl;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = tidl;
    }
    else {
        root.tidl = tidl;
    }

    tidl.noConflict = function () {
        root.tidl = previous_tidl;
        return tidl;
    };
})();