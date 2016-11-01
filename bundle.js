(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var state_machine = require('./state-machine');
var tape = require('./tape');
var uievent_1 = require("./ui/uievent");
var TuringMachine = (function () {
    function TuringMachine(tape_contents) {
        if (tape_contents === void 0) { tape_contents = ""; }
        this.tapehead = new tape.TapeHead('_', tape_contents);
        this.states = [];
        this.transitions = [];
        this.state_added_event = new uievent_1.JSEvent();
        this.tape_changed_event = new uievent_1.JSEvent();
        this.current_state_changed_event = new uievent_1.JSEvent();
        this.transition_added_event = new uievent_1.JSEvent();
    }
    TuringMachine.prototype.getTransitions = function () {
        return this.transitions;
    };
    TuringMachine.prototype.getStates = function () {
        return this.states;
    };
    TuringMachine.prototype.ready = function () {
        this.state_added_event.fire(this.states.length);
        this.tape_changed_event.fire(this.getTapeElementsWithRadius(3));
        console.log("Turing machine is now ready");
    };
    TuringMachine.prototype.getTapeElementsWithRadius = function (radius) {
        return this.tapehead.getElementsWithRadius(radius);
    };
    TuringMachine.prototype.moveTapeLeft = function () {
        this.tapehead.goLeft();
        this.tape_changed_event.fire(this.tapehead.getElementsWithRadius(3));
    };
    TuringMachine.prototype.moveTapeRight = function () {
        this.tapehead.goRight();
        this.tape_changed_event.fire(this.tapehead.getElementsWithRadius(3));
    };
    TuringMachine.prototype.addCurrentStateChangeListener = function (handler) {
        this.current_state_changed_event.addEventListener(handler);
    };
    TuringMachine.prototype.addTapeChangeListener = function (handler) {
        this.tape_changed_event.addEventListener(handler);
    };
    TuringMachine.prototype.addStateListener = function (handler) {
        this.state_added_event.addEventListener(handler);
    };
    TuringMachine.prototype.addTransitionsListener = function (handler) {
        this.transition_added_event.addEventListener(handler);
    };
    TuringMachine.prototype.addState = function (id) {
        if (id === void 0) { id = this.states.length; }
        var new_state = new state_machine.State(id);
        this.states.push(new_state);
        console.log("Set state with id " + id);
        this.state_added_event.fire(this.states.length);
        return new_state;
    };
    TuringMachine.prototype.getOutTransition = function (id, tape_symbol) {
        var result = null;
        for (var _i = 0, _a = this.transitions; _i < _a.length; _i++) {
            var tmp = _a[_i];
            if (tmp.from_state.id === id && tmp.tape_symbol === tape_symbol) {
                result = tmp;
                break;
            }
        }
        return result;
    };
    TuringMachine.prototype.getState = function (id) {
        for (var _i = 0, _a = this.states; _i < _a.length; _i++) {
            var tmp = _a[_i];
            if (tmp.id === id) {
                return tmp;
            }
        }
        return null;
    };
    TuringMachine.prototype.addTerminalState = function (termination_type, id) {
        if (id === undefined) {
            id = this.states.length;
        }
        var new_state = new state_machine.State(id, termination_type);
        this.states.push(new_state);
        console.log("Set terminal state with id " + id);
        this.state_added_event.fire(this.states.length);
        return new_state;
    };
    TuringMachine.prototype.addTransition = function (from_id, to_id, direction, put_char, tape_symbol) {
        var from_state = this.getState(from_id);
        var to_state = this.getState(to_id);
        if (from_state === null || to_state === null) {
            return null;
        }
        var new_transition = new state_machine.Transition(from_state, to_state, direction, put_char, tape_symbol);
        console.log("Set transition " + new_transition);
        this.transitions.push(new_transition);
        this.transition_added_event.fire(this.transitions.length);
        return new_transition;
    };
    TuringMachine.prototype.run = function (start_id) {
        if (start_id === void 0) { start_id = 0; }
        var start_state = this.getState(start_id);
        var current_state = start_state;
        if (current_state === null) {
            return;
        }
        var delayMs = Number(document.getElementById("delay").value);
        this.step(current_state, delayMs, function (finish_state) {
            console.log(finish_state);
            var str_termtype;
            if (finish_state === null) {
                console.log("Error, invalid state transition");
                str_termtype = "Error";
            }
            else {
                if (finish_state.terminalState == state_machine.TerminalStateType.SUCCESS) {
                    str_termtype = "Success";
                }
                else {
                    str_termtype = "Failure";
                }
                console.log("Terminated with state " + str_termtype);
            }
            var resultDiv = document.getElementById("result");
            resultDiv.innerText = str_termtype;
            resultDiv.className = str_termtype.toLowerCase();
        });
    };
    TuringMachine.prototype.step = function (start_state, delay, finish_callback) {
        var _this = this;
        console.log("Starting step");
        var tape_symbol = this.tapehead.read();
        var transition = this.getOutTransition(start_state.id, tape_symbol);
        if (transition === null) {
            return null;
        }
        if (transition.tape_move === tape.Direction.LEFT) {
            this.tapehead.goLeft();
        }
        else if (transition.tape_move === tape.Direction.RIGHT) {
            this.tapehead.goRight();
        }
        this.tapehead.write(transition.put_char);
        this.tape_changed_event.fire(this.tapehead.getElementsWithRadius(3));
        console.log("Stepping to " + transition.to_state);
        this.current_state_changed_event.fire(transition);
        if (transition.to_state !== null && !transition.to_state.isTerminal()) {
            window.setTimeout(function () { return _this.step(transition.to_state, delay, finish_callback); }, delay);
        }
        else {
            console.log("Finishing up with state " + transition.to_state);
            finish_callback.call(this, transition.to_state);
        }
    };
    TuringMachine.prototype.toString = function () {
        console.log(this.states.toString() + " " + this.transitions.toString());
    };
    return TuringMachine;
}());
exports.TuringMachine = TuringMachine;

},{"./state-machine":3,"./tape":4,"./ui/uievent":8}],2:[function(require,module,exports){
"use strict";
var machine_1 = require('./machine');
var state_machine = require('./state-machine');
var managers_1 = require("./ui/managers");
function init() {
    var machine = new machine_1.TuringMachine();
    var ui_handler = new managers_1.UIHandler(machine);
    var initial_node = machine.addState(0);
    machine.ready();
    machine.addTerminalState(state_machine.TerminalStateType.SUCCESS);
}
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("Initialising Turing Machine");
    init();
});

},{"./machine":1,"./state-machine":3,"./ui/managers":5}],3:[function(require,module,exports){
"use strict";
var tape_1 = require('./tape');
(function (TerminalStateType) {
    TerminalStateType[TerminalStateType["NONTERMINAL"] = 1] = "NONTERMINAL";
    TerminalStateType[TerminalStateType["SUCCESS"] = 2] = "SUCCESS";
    TerminalStateType[TerminalStateType["FAILURE"] = 3] = "FAILURE";
})(exports.TerminalStateType || (exports.TerminalStateType = {}));
var TerminalStateType = exports.TerminalStateType;
var State = (function () {
    function State(id, terminalState) {
        if (terminalState === void 0) { terminalState = TerminalStateType.NONTERMINAL; }
        this.id = id;
        this.terminalState = terminalState;
    }
    State.prototype.isTerminal = function () {
        return this.terminalState !== TerminalStateType.NONTERMINAL;
    };
    State.prototype.toString = function () {
        return this.id;
    };
    return State;
}());
exports.State = State;
var Transition = (function () {
    function Transition(from_state, to_state, tape_move, put_char, tape_symbol) {
        this.from_state = from_state;
        this.to_state = to_state;
        this.put_char = put_char;
        this.tape_move = tape_move;
        this.tape_symbol = tape_symbol;
    }
    Transition.prototype.toString = function () {
        var direction_symbol;
        if (this.tape_move === tape_1.Direction.LEFT) {
            direction_symbol = "L";
        }
        else if (this.tape_move === tape_1.Direction.RIGHT) {
            direction_symbol = "R";
        }
        else {
            direction_symbol = "S";
        }
        return this.tape_symbol + "/" + this.put_char + "," + direction_symbol;
    };
    return Transition;
}());
exports.Transition = Transition;

},{"./tape":4}],4:[function(require,module,exports){
"use strict";
(function (Direction) {
    Direction[Direction["LEFT"] = 1] = "LEFT";
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    Direction[Direction["STATIONARY"] = 3] = "STATIONARY";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
;
var TapeNode = (function () {
    function TapeNode(left, value, right) {
        this.left = left;
        this.value = value;
        this.right = right;
    }
    TapeNode.prototype.setLeft = function (node) {
        this.left = node;
        node.right = this;
    };
    TapeNode.prototype.setRight = function (node) {
        this.right = node;
        node.left = this;
    };
    TapeNode.prototype.toString = function () {
        return this.value;
    };
    return TapeNode;
}());
exports.TapeNode = TapeNode;
var TapeHead = (function () {
    function TapeHead(blank_symbol, initial_tape_contents) {
        if (initial_tape_contents === void 0) { initial_tape_contents = ""; }
        this.blank_symbol = blank_symbol;
        this.tape_head = new TapeNode(null, blank_symbol, null);
        var temp = this.tape_head;
        for (var _i = 0, initial_tape_contents_1 = initial_tape_contents; _i < initial_tape_contents_1.length; _i++) {
            var char = initial_tape_contents_1[_i];
            this.write(char);
            this.goRight();
        }
        this.tape_head = temp;
    }
    TapeHead.prototype.read = function () {
        return this.tape_head.value;
    };
    TapeHead.prototype.write = function (tape_symbol) {
        this.tape_head.value = tape_symbol;
    };
    TapeHead.prototype.goLeft = function () {
        if (this.tape_head.left === null) {
            this.tape_head.setLeft(new TapeNode(null, this.blank_symbol, this.tape_head));
        }
        this.tape_head = this.tape_head.left;
    };
    TapeHead.prototype.goRight = function () {
        if (this.tape_head.right === null) {
            this.tape_head.setRight(new TapeNode(this.tape_head, this.blank_symbol, null));
        }
        this.tape_head = this.tape_head.right;
    };
    TapeHead.prototype.getElementsWithRadius = function (radius) {
        if (radius <= 0) {
            return [];
        }
        var orig_head = this.tape_head;
        var ret = [];
        ret.push(orig_head.value);
        for (var i = 1; i < radius; ++i) {
            this.goRight();
            ret.push(this.read());
        }
        this.tape_head = orig_head;
        for (var i = 1; i < radius; ++i) {
            this.goLeft();
            ret.unshift(this.read());
        }
        this.tape_head = orig_head;
        return ret;
    };
    return TapeHead;
}());
exports.TapeHead = TapeHead;

},{}],5:[function(require,module,exports){
"use strict";
var state_machine_1 = require("../state-machine");
var tape_1 = require("../tape");
var tape_2 = require("./tape");
var renderers_1 = require("./renderers");
var GraphManager = (function () {
    function GraphManager(machine) {
        var _this = this;
        this.machine = machine;
        this.renderer = new renderers_1.UIRenderer(machine);
        this.cyInstance = cytoscape(this.renderer.render());
        this.machine.addStateListener(function () { return _this.addElems(); });
        this.machine.addTransitionsListener(function () { return _this.cyInstance.add(_this.renderer.render()); });
        this.machine.addCurrentStateChangeListener(function (t) { return _this.updateCurrentState(t); });
    }
    GraphManager.prototype.updateCurrentState = function (trans) {
        var old_id = trans.from_state.id;
        var new_id = trans.to_state.id;
        var from_elem = this.cyInstance.getElementById(old_id);
        var to_elem = this.cyInstance.getElementById(new_id);
        from_elem.removeClass('current');
        to_elem.addClass('current');
    };
    GraphManager.prototype.addElems = function () {
        var new_elems = this.renderer.render();
        this.cyInstance.add(new_elems);
        this.cyInstance.layout({ name: 'grid' });
    };
    return GraphManager;
}());
exports.GraphManager = GraphManager;
var UIHandler = (function () {
    function UIHandler(machine) {
        this.machine = machine;
        this.trans_handler = new TransformUIHandler(machine);
        this.tape_manager = new tape_2.UITapeManager(machine);
        this.graph_manager = new GraphManager(machine);
        this.state_adding_manager = new UIStateHandler(machine);
        var delay_slider = document.getElementById("delay");
        var delay_ui = document.getElementById("delay-show");
        delay_ui.innerText = (Number(delay_slider.value) / 1000).toString() + "s";
        delay_slider.oninput = function (e) {
            delay_ui.innerText = (Number(delay_slider.value) / 1000).toString() + "s";
        };
    }
    return UIHandler;
}());
exports.UIHandler = UIHandler;
var UIStateHandler = (function () {
    function UIStateHandler(machine) {
        this.machine = machine;
        this.init();
    }
    UIStateHandler.prototype.init = function () {
        var _this = this;
        var add_nonterm_state = document.getElementById("add-nonterm-state");
        var add_success_state = document.getElementById("add-success-state");
        var add_fail_state = document.getElementById("add-failure-state");
        var run = document.getElementById("run");
        add_nonterm_state.onclick = function (e) { return _this.machine.addState(); };
        add_success_state.onclick = function (e) { return _this.machine.addTerminalState(state_machine_1.TerminalStateType.SUCCESS); };
        add_fail_state.onclick = function (e) { return _this.machine.addTerminalState(state_machine_1.TerminalStateType.FAILURE); };
        run.onclick = function (e) { return _this.machine.run(); };
    };
    return UIStateHandler;
}());
var TransformUIHandler = (function () {
    function TransformUIHandler(machine) {
        this.machine = machine;
        this.init();
    }
    TransformUIHandler.prototype.init = function () {
        var _this = this;
        var add_transition_form = document.getElementById("add_transition");
        if (add_transition_form === null) {
            return;
        }
        add_transition_form.addEventListener("submit", function (event) {
            event.preventDefault();
            var form = add_transition_form;
            var from_transition = form.children[0].value;
            var to_transition = form.children[1].value;
            var if_symbol = form.children[2].value;
            var tape_move = form.children[3].value;
            var put_symbol = form.children[4].value;
            var tape_move_direction;
            if (tape_move === "left") {
                tape_move_direction = tape_1.Direction.LEFT;
            }
            else {
                tape_move_direction = tape_1.Direction.RIGHT;
            }
            var from_transition_num = Number(from_transition);
            var to_transition_num = Number(to_transition);
            _this.machine.addTransition(from_transition_num, to_transition_num, tape_move_direction, put_symbol, if_symbol);
            add_transition_form.reset();
        }, false);
        var prev_highest_id = -1;
        this.machine.addStateListener(function (length) {
            var id = length - 1;
            if (id > prev_highest_id) {
                prev_highest_id = id;
            }
            else if (prev_highest_id >= id) {
                return;
            }
            var from_select = document.getElementById("from_transition");
            var to_select = document.getElementById("to_transition");
            if (from_select === null || to_select === null) {
                return;
            }
            var option = document.createElement('option');
            option.value = String(id);
            option.text = String(id);
            var option_clone = option.cloneNode(true);
            from_select.appendChild(option);
            to_select.appendChild(option_clone);
        });
    };
    return TransformUIHandler;
}());

},{"../state-machine":3,"../tape":4,"./renderers":6,"./tape":7}],6:[function(require,module,exports){
"use strict";
var state_machine_1 = require("../state-machine");
var UIRenderer = (function () {
    function UIRenderer(machine) {
        this.machine = machine;
        this.hasRendered = false;
    }
    UIRenderer.prototype.render = function () {
        var _this = this;
        console.log("Rendering...");
        var elements = [];
        var container = document.getElementById("cy");
        for (var _i = 0, _a = this.machine.getStates(); _i < _a.length; _i++) {
            var state = _a[_i];
            elements.push(new UIState(state).render());
        }
        console.log(this.machine.getTransitions());
        for (var _b = 0, _c = this.machine.getTransitions(); _b < _c.length; _b++) {
            var transition = _c[_b];
            console.log("Rendering transition");
            elements.push(new UITransition(transition).render());
        }
        var rendering;
        if (!this.hasRendered) {
            this.hasRendered = true;
            this.elementPrev = elements;
            rendering = {
                container: container,
                elements: elements,
                style: [
                    {
                        selector: 'node',
                        style: {
                            'label': 'data(id)'
                        }
                    },
                    {
                        selector: 'node.nonterminal',
                        style: {
                            'background-color': '#356AC3'
                        }
                    },
                    {
                        selector: 'node.failure',
                        style: {
                            'background-color': '#800000'
                        }
                    },
                    {
                        selector: 'node.success',
                        style: {
                            'background-color': '#4BC51D'
                        }
                    },
                    {
                        selector: 'node.current',
                        style: {
                            'background-color': 'yellow'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'curve-style': 'bezier',
                            'width': 5,
                            'line-color': '#4BC51D',
                            'mid-target-arrow-color': '#4BC51D',
                            'mid-target-arrow-shape': 'triangle',
                            'label': 'data(desc)',
                            'visibility': 'visible',
                            'display': 'element'
                        }
                    }
                ],
                layout: {
                    name: 'grid'
                },
                zoomingEnabled: false,
                panningEnabled: false
            };
        }
        else {
            var elem_difference = elements.filter(function (e) { return _this.elementPrev.indexOf(e) == -1; });
            rendering = elem_difference;
            this.elementPrev = elements;
        }
        console.log(rendering);
        return rendering;
    };
    return UIRenderer;
}());
exports.UIRenderer = UIRenderer;
var UIState = (function () {
    function UIState(state) {
        this.state = state;
    }
    UIState.prototype.getClass = function () {
        var terminal_state_type = this.state.terminalState;
        if (terminal_state_type == state_machine_1.TerminalStateType.NONTERMINAL) {
            return "nonterminal";
        }
        else if (terminal_state_type == state_machine_1.TerminalStateType.SUCCESS) {
            return "success";
        }
        else {
            return "failure";
        }
    };
    UIState.prototype.render = function () {
        return {
            group: "nodes",
            data: { id: this.state.id },
            classes: this.getClass(),
        };
    };
    return UIState;
}());
var UITransition = (function () {
    function UITransition(transition) {
        this.transition = transition;
    }
    UITransition.prototype.render = function () {
        UITransition.count++;
        var transition_id = this.transition + "-" +
            this.transition.from_state.id.toString() +
            this.transition.to_state.id.toString();
        return {
            group: "edges",
            data: { id: transition_id,
                source: this.transition.from_state.id.toString(),
                target: this.transition.to_state.id.toString(),
                desc: this.transition.toString()
            }
        };
    };
    UITransition.count = 0;
    return UITransition;
}());

},{"../state-machine":3}],7:[function(require,module,exports){
"use strict";
var UITapeManager = (function () {
    function UITapeManager(machine) {
        var _this = this;
        this.machine = machine;
        this.tape_nodes = document.querySelectorAll(".tape-box");
        this.tape_left_control = document.getElementById("tape-left");
        this.tape_right_control = document.getElementById("tape-right");
        this.tape_left_control.onclick = function (e) { return _this.machine.moveTapeLeft(); };
        this.tape_right_control.onclick = function (e) { return _this.machine.moveTapeRight(); };
        this.machine.addTapeChangeListener(function (nodes) { return _this.render(nodes); });
    }
    UITapeManager.prototype.render = function (tape_contents) {
        if (tape_contents === undefined) {
            return;
        }
        for (var i = 0; i < tape_contents.length; ++i) {
            var curr_str = tape_contents[i];
            var curr_node = this.tape_nodes[i];
            curr_node.innerText = curr_str;
        }
    };
    return UITapeManager;
}());
exports.UITapeManager = UITapeManager;

},{}],8:[function(require,module,exports){
"use strict";
var JSEvent = (function () {
    function JSEvent() {
        this.handlers = [];
    }
    JSEvent.prototype.addEventListener = function (handler) {
        this.handlers.push(handler);
    };
    JSEvent.prototype.fire = function (data) {
        this.handlers.forEach(function (h) { return h(data); });
    };
    return JSEvent;
}());
exports.JSEvent = JSEvent;

},{}]},{},[2]);
