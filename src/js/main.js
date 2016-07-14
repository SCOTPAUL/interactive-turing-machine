import {TuringMachine} from './machine';
import * as tape from './tape';
import * as state_machine from './state-machine'

var machine = new TuringMachine("1");

machine.addTerminalState(0, state_machine.TerminalStateType.FAILURE);
machine.addState(1);
machine.addTerminalState(2, state_machine.TerminalStateType.SUCCESS);

machine.addTransition(1, 0, tape.Direction.STATIONARY, '', '0');
machine.addTransition(1, 2, tape.Direction.STATIONARY, '', '1');

machine.run(1);
