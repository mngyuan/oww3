// @flow
//
import * as React from 'react';
import Tone from 'tone';

const okf = o => Object.keys(o).filter(k => o[k]);
const cnf = cno => okf(cno).join(' ');

Tone.context.lookAhead = 0;

const SineIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <path d="M3.3,12c0,0,4.1-9.3,8.7,0s8.7,0,8.7,0" />
    </g>
  </svg>
);

const SquareIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <polyline points="20.7,7.7 20.7,16.3 12,16.3 12,7.7 3.3,7.7 3.3,16.3 		" />
    </g>
  </svg>
);

const TriangleIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <polyline points="3.3,16.3 12,7.7 20.7,16.3 		" />
    </g>
  </svg>
);

const SawIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <polyline points="3.3,16.3 20.7,7.7 20.7,16.3 	" />
    </g>
  </svg>
);

const HarmonicIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <path d="M3.3,12c0,0,4.1-9.3,8.7,0s8.7,0,8.7,0" />
      <path d="M20.7,12c0,0-2.1,9.3-4.3,0c-2.3-9.3-4.3,0-4.3,0s-2.1,9.3-4.3,0s-4.3,0-4.3,0" />
    </g>
  </svg>
);

const TuneIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <line x1="12" y1="18.5" x2="12" y2="13" />
      <path d="M10,11c0,1.1,0.9,2,2,2s2-0.9,2-2" />
      <line x1="10" y1="11" x2="10" y2="5.5" />
      <line x1="14" y1="11" x2="14" y2="5.5" />
    </g>
  </svg>
);

const LinkIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <polyline points="6.3,17.2 11.5,12 6.3,6.8 " />
      <line x1="11.5" y1="12" x2="17.7" y2="12" />
    </g>
  </svg>
);

const NoiseIcon = props => (
  <svg viewBox="0 0 24 24" width="24px" height="24px" className="icon">
    <g>
      <polyline points="5,16 8,8 11,16 12,12 15,16 17,8 19,16 " />
    </g>
  </svg>
);

const TYPING_MAP = {
  a: 'A3',
  s: 'B3',
  d: 'C4',
  f: 'D4',
  g: 'E4',
  h: 'F4',
  j: 'G4',
  k: 'A4',
  l: 'B4',
  ';': 'C5',
  q: 'G#3',
  w: 'Bb3',
  r: 'C#4',
  t: 'D#4',
  u: 'F#4',
  i: 'G#4',
  o: 'Bb4',
  A: 'A4',
  S: 'B4',
  D: 'C5',
  F: 'D5',
  G: 'E5',
  H: 'F5',
  J: 'G5',
  K: 'A5',
  L: 'B5',
  ':': 'C5',
  Q: 'G#4',
  W: 'Bb4',
  R: 'C#5',
  T: 'D#5',
  U: 'F#5',
  I: 'G#5',
  O: 'Bb5',
};

const Oscilloscope = props => <div className="oscilloscope"></div>;

const RadioBankOption = props => (
  <div>
    <input
      id={`${props.name}${props.value}`}
      type="radio"
      name={props.name}
      value={props.value}
      checked={props.checked}
      onChange={props.handleChange}
    />
    <label htmlFor={`${props.name}${props.value}`}>{props.label}</label>
  </div>
);

class RadioBank extends React.PureComponent {
  state = {
    selected: this.props.options[0].value,
  };

  render() {
    return (
      <form className="col f-initial j-between margin-r-8">
        {this.props.options.map(option => (
          <RadioBankOption
            name={this.props.name}
            key={option.value}
            label={option.label}
            value={option.value}
            checked={this.state.selected === option.value}
            handleChange={e => this.setState({selected: e.target.value})}
          />
        ))}
      </form>
    );
  }
}

class Slider extends React.PureComponent {
  state = {
    val: this.props.min || 0,
  };

  render() {
    return (
      <label
        className={`slider col a-center f-initial ${this.props.className}`}
      >
        {this.props.label}
        <input
          type="range"
          orient="vertical"
          onChange={e => this.setState({val: e.target.value})}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          value={this.state.val}
        />
      </label>
    );
  }
}

class Knob extends React.PureComponent {
  state = {
    deg: -60,
    val: 0,
    minAngle: -60,
    maxAngle: 60,
  };

  startDrag = e => {
    e.preventDefault();
    const knob = e.target.getBoundingClientRect();
    const [cX, cY] = [knob.left + knob.width / 2, knob.top + knob.height / 2];
    const handleMove = e => {
      const deg = this.getDeg(e.clientX, e.clientY, cX, cY);
      const val =
        (deg - this.state.minAngle) /
        (this.state.maxAngle - this.state.minAngle);
      this.setState({deg, val});
      this.props.onChange(val);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', e => {
      document.removeEventListener('mousemove', handleMove);
    });
  };

  getDeg = (aX, aY, bX, bY) => {
    const x = bX - aX;
    const y = bY - aY;
    let deg = (Math.atan(y / x) * 180) / Math.PI;
    if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
      deg += 90;
    } else {
      deg -= 90;
    }
    return deg > this.state.maxAngle
      ? deg > this.state.maxAngle - this.state.minAngle + 180
        ? this.state.minAngle
        : this.state.maxAngle
      : deg < this.state.minAngle
      ? this.state.minAngle
      : deg;
  };

  render() {
    return (
      <label>
        {this.props.label}
        <div
          className={cnf({
            'knob-outer': true,
            'knob-small': this.props.small,
            'knob-medium': this.props.medium,
          })}
          onMouseDown={this.startDrag}
        >
          <div
            className="knob"
            style={{transform: `rotate(${this.state.deg}deg)`}}
          >
            <div className="knob-notch" />
          </div>
        </div>
      </label>
    );
  }
}

class Toggle extends React.PureComponent {
  state = {
    val: false,
  };
  render() {
    return;
  }
}

class Dropdown extends React.PureComponent {
  state = {
    val: false,
  };
  render() {
    return;
  }
}

class App extends React.PureComponent {
  state = {
    synth1: new Tone.PolySynth(6, Tone.Synth).toMaster(),
    synth2: new Tone.PolySynth(6, Tone.Synth, {
      oscillator: {type: 'pwm'},
    }).toMaster(),
    playing: [],
  };

  handleKeyDown = e => {
    const note = TYPING_MAP[e.key];
    if (!this.state.playing.includes(note)) {
      this.state.synth1.triggerAttack(note);
      this.state.synth2.triggerAttack(note);
      this.setState(prevState => ({playing: [...prevState.playing, note]}));
    }
  };
  handleKeyUp = e => {
    const note = TYPING_MAP[e.key];
    this.state.synth1.triggerRelease(note);
    this.state.synth2.triggerRelease(note);
    this.setState(prevState => ({
      playing: prevState.playing.filter(n => n !== note),
    }));
  };

  render() {
    return (
      <div
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        tabIndex={0}
        className="synth row"
      >
        <div className="col col-1 margin-l-col-1">
          <Oscilloscope />
        </div>
        <div className="col col-3">
          <div className="row margin-t-96 margin-b-row-3">
            <RadioBank
              options={[
                {label: <SineIcon />, value: 'sine'},
                {label: <SquareIcon />, value: 'square'},
                {label: <TriangleIcon />, value: 'triangle'},
                {label: <SawIcon />, value: 'saw'},
              ]}
              name="osc1-wave"
            />
            <Slider min={0} max={100} step="any" label="A" />
            <Slider min={0} max={100} step="any" label="S" />
            <Slider min={0} max={100} step="any" label="D" />
            <Slider
              min={0}
              max={100}
              step="any"
              label="R"
              className="margin-r-8"
            />
            <div className="col f-initial a-center j-between">
              <Knob small onChange={() => {}} />
              <TuneIcon />
              <Knob small onChange={() => {}} />
              <HarmonicIcon />
            </div>
          </div>
          <div className="row margin-b-96">
            <RadioBank
              options={[
                {label: <SineIcon />, value: 'sine'},
                {label: <SquareIcon />, value: 'square'},
                {label: <TriangleIcon />, value: 'triangle'},
                {label: <SawIcon />, value: 'saw'},
              ]}
              name="osc2-wave"
            />
            <Slider min={0} max={100} step="any" label="A" />
            <Slider min={0} max={100} step="any" label="S" />
            <Slider min={0} max={100} step="any" label="D" />
            <Slider
              min={0}
              max={100}
              step="any"
              label="R"
              className="margin-r-8"
            />
            <div className="col f-initial a-center j-between">
              <Knob small onChange={() => {}} />
              <TuneIcon />
              <Knob small onChange={() => {}} />
              <HarmonicIcon />
            </div>
          </div>
        </div>
        <div className="col col-4 j-center margin-l-col-1">
          <div className="row a-center">
            <div className="col f-initial margin-r-16">
              <LinkIcon />
            </div>
            <div className="col f-initial margin-r-32">
              <Knob onChange={() => {}} />
            </div>
            <div className="col f-initial a-center j-between">
              <Knob medium onChange={() => {}} />
              <NoiseIcon />
            </div>
            <div className="col"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
