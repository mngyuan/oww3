// @flow
//
import * as React from 'react';
import Tone from 'tone';

// from core-js
function mathscale(x, inLow, inHigh, outLow, outHigh) {
  if (
    arguments.length === 0 ||
    /* eslint-disable no-self-compare */
    x != x ||
    inLow != inLow ||
    inHigh != inHigh ||
    outLow != outLow ||
    outHigh != outHigh
    /* eslint-enable no-self-compare */
  )
    return NaN;
  if (x === Infinity || x === -Infinity) return x;
  return ((x - inLow) * (outHigh - outLow)) / (inHigh - inLow) + outLow;
}

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
  A: 'A2',
  S: 'B2',
  D: 'C3',
  F: 'D3',
  G: 'E3',
  H: 'F3',
  J: 'G3',
  K: 'A3',
  L: 'B3',
  ':': 'C3',
  Q: 'G#2',
  W: 'Bb2',
  R: 'C#3',
  T: 'D#3',
  U: 'F#3',
  I: 'G#3',
  O: 'Bb3',
};

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
    selected: this.props.defaultValue || this.props.options[0].value,
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
            handleChange={e => {
              this.setState({selected: e.target.value});
              this.props.onChange(e.target.value);
            }}
          />
        ))}
      </form>
    );
  }
}

class Slider extends React.PureComponent {
  state = {
    val: this.props.initialValue || this.props.min || 0,
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
          onChange={e => {
            const v = parseFloat(e.target.value);
            this.setState({val: v});
            this.props.onChange(v);
          }}
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
  constructor(props) {
    super(props);
    const {minAngle = -60, maxAngle = 60, defaultValue = 0} = this.props;
    this.state = {
      deg: (maxAngle - minAngle) * defaultValue + minAngle,
      val: this.props.defaultValue,
      minAngle,
      maxAngle,
    };
  }

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
      ? deg > (this.state.maxAngle + this.state.minAngle) / 2 + 180
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

class Oscilloscope extends React.PureComponent {
  canvas = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      waveform: new Tone.Waveform(256),
    };
  }

  componentDidMount() {
    Tone.Master.connect(this.state.waveform);
    this.loop(this.canvas.current);
  }

  loop = canvas => {
    requestAnimationFrame(() => this.loop(canvas));
    const {width, height} = canvas;
    const context = canvas.getContext('2d');
    const analysis = this.state.waveform.getValue();

    const margin = height * 0.2;

    context.clearRect(0, 0, width, height);
    context.beginPath();

    let firstValue;
    for (let i = 0, len = analysis.length; i < len; i++) {
      const x = mathscale(i, 0, len - 1, 0, width);
      const y = mathscale(analysis[i], -1, 1, height - margin, margin);
      if (i === 0) {
        firstValue = y;
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.lineTo(0, firstValue);
    context.lineCap = 'round';
    // context.stroke();
    context.fillStyle = '#f99e1c';
    context.fill();
  };

  render() {
    return (
      <div className={`oscilloscope ${this.props.className}`}>
        <canvas ref={this.canvas} width="64px" height="64px" />
      </div>
    );
  }
}

class App extends React.PureComponent {
  constructor(props) {
    super(props);
    const noiseEnv = new Tone.AmplitudeEnvelope({
      attack: 0.5,
      decay: 0.1,
      sustain: 1,
    });
    this.state = {
      synth1: new Tone.PolySynth(6, Tone.Synth, {
        oscillator: {type: 'sine'},
      }).toMaster(),
      synth2: new Tone.PolySynth(6, Tone.Synth, {
        oscillator: {type: 'triangle'},
      }).toMaster(),
      noise: new Tone.Noise({
        type: 'brown',
        volume: -45,
      }).chain(noiseEnv, Tone.Master),
      noiseEnv,
      playing: [],
    };
  }

  handleKeyDown = e => {
    const note = TYPING_MAP[e.key];
    if (note && !this.state.playing.includes(note)) {
      this.state.synth1.triggerAttack(note);
      this.state.synth2.triggerAttack(note);
      this.state.noiseEnv.triggerAttack();
      this.state.noise.start();
      this.setState(prevState => ({playing: [...prevState.playing, note]}));
    }
  };
  handleKeyUp = e => {
    const note = TYPING_MAP[e.key];
    const playing = this.state.playing.filter(n => n !== note);
    this.state.synth1.triggerRelease(note);
    this.state.synth2.triggerRelease(note);
    if (playing.length === 0) {
      this.state.noiseEnv.triggerRelease();
    }
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
          <Oscilloscope className="margin-t-96" />
        </div>
        <div className="col col-3 margin-l-24">
          <div className="row margin-t-96 margin-b-row-3">
            <RadioBank
              options={[
                {label: <SineIcon />, value: 'sine'},
                {label: <SquareIcon />, value: 'square'},
                {label: <TriangleIcon />, value: 'triangle'},
                {label: <SawIcon />, value: 'sawtooth'},
              ]}
              name="osc1-wave"
              onChange={oscType =>
                this.state.synth1.set({
                  oscillator: {
                    type: oscType,
                  },
                })
              }
            />
            <Slider
              min={0}
              max={1}
              step="any"
              label="A"
              onChange={v =>
                this.state.synth1.voices.forEach(
                  synth => (synth.envelope.attack = v),
                )
              }
              initialValue={this.state.synth1.voices[0].envelope.attack}
            />
            <Slider
              min={0}
              max={1}
              step="any"
              label="D"
              onChange={v =>
                this.state.synth1.voices.forEach(
                  synth => (synth.envelope.decay = v),
                )
              }
              initialValue={this.state.synth1.voices[0].envelope.decay}
            />
            <Slider
              min={0}
              max={1}
              step="any"
              label="S"
              onChange={v =>
                this.state.synth1.voices.forEach(
                  synth => (synth.envelope.sustain = v),
                )
              }
              initialValue={this.state.synth1.voices[0].envelope.sustain}
            />
            <Slider
              min={0.005}
              max={3}
              step="any"
              label="R"
              className="margin-r-8"
              onChange={v =>
                this.state.synth1.voices.forEach(
                  synth => (synth.envelope.release = v),
                )
              }
              initialValue={this.state.synth1.voices[0].envelope.release}
            />
            <div className="col f-initial a-center j-between">
              <Knob
                small
                onChange={() => {}}
                defaultValue={0.5}
                minAngle={-120}
                maxAngle={120}
                onChange={v =>
                  this.state.synth1.set({
                    detune: (Math.round(24 * v) - 12) * 100,
                  })
                }
              />
              <TuneIcon />
              <Knob
                small
                onChange={v =>
                  this.state.synth1.set({
                    oscillator: {
                      partials: [1, v ** 2, v ** 3, v ** 4, v ** 5, v ** 6],
                    },
                  })
                }
              />
              <HarmonicIcon />
            </div>
          </div>
          <div className="row margin-b-96">
            <RadioBank
              options={[
                {label: <SineIcon />, value: 'sine'},
                {label: <SquareIcon />, value: 'square'},
                {label: <TriangleIcon />, value: 'triangle'},
                {label: <SawIcon />, value: 'sawtooth'},
              ]}
              name="osc2-wave"
              onChange={oscType =>
                this.state.synth2.set({
                  oscillator: {
                    type: oscType,
                  },
                })
              }
              defaultValue="triangle"
            />
            <Slider
              min={0}
              max={1}
              step="any"
              label="A"
              onChange={v =>
                this.state.synth2.voices.forEach(
                  synth => (synth.envelope.attack = v),
                )
              }
              initialValue={this.state.synth2.voices[0].envelope.attack}
            />
            <Slider
              min={0}
              max={1}
              step="any"
              label="D"
              onChange={v =>
                this.state.synth2.voices.forEach(
                  synth => (synth.envelope.decay = v),
                )
              }
              initialValue={this.state.synth2.voices[0].envelope.decay}
            />
            <Slider
              min={0}
              max={1}
              step="any"
              label="S"
              onChange={v =>
                this.state.synth2.voices.forEach(
                  synth => (synth.envelope.sustain = v),
                )
              }
              initialValue={this.state.synth2.voices[0].envelope.sustain}
            />
            <Slider
              min={0.005}
              max={3}
              step="any"
              label="R"
              className="margin-r-8"
              onChange={v =>
                this.state.synth2.voices.forEach(
                  synth => (synth.envelope.release = v),
                )
              }
              initialValue={this.state.synth2.voices[0].envelope.release}
            />
            <div className="col f-initial a-center j-between">
              <Knob
                small
                minAngle={-120}
                maxAngle={120}
                onChange={() => {}}
                defaultValue={0.5}
                onChange={v =>
                  this.state.synth1.set({
                    detune: (Math.round(24 * v) - 12) * 100,
                  })
                }
              />
              <TuneIcon />
              <Knob
                small
                onChange={v =>
                  this.state.synth2.set({
                    oscillator: {
                      partials: [1, v ** 2, v ** 3, v ** 4, v ** 5, v ** 6],
                    },
                  })
                }
              />
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
              <Knob
                onChange={val => {
                  this.state.synth1.volume.value = -25 + val * 25;
                  this.state.synth2.volume.value = val * -25;
                }}
                minAngle={-180}
                maxAngle={0}
                defaultValue={0.5}
              />
            </div>
            <div className="col f-initial a-center j-between">
              <Knob
                medium
                onChange={v =>
                  this.state.noise.set({volume: -25 * (1 - v) - 10})
                }
              />
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
