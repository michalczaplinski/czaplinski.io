import React, { Component } from 'react';
import './App.css';
import classNames from 'classnames';

class App extends Component {

  constructor(props) {
    super(props)

    this.startAnimation = this.startAnimation.bind(this)
    this.endAnimation = this.endAnimation.bind(this)
    this.showEmail = this.showEmail.bind(this)
    this.transitionEmail = this.transitionEmail.bind(this)

    this.state = {
      rotating: false,
      rotateOnce: true,
      showEmail: false,
      transition: false
    }
  }

  componentDidMount() {
    this.setState({
      rotateOnce: true,
    });

    setTimeout(() => {
      this.setState({
        rotateOnce: false,
      })
    }, 2100);
  }

  startAnimation() {
    this.setState({ rotating: true })
  }

  endAnimation() {
    this.setState({ rotating: false })
  }

  showEmail() {
    this.setState({ showEmail: true })

    setTimeout(this.transitionEmail, 100)
  }

  transitionEmail() {
    this.setState({ transition: true } )
  }

  render() {
    return (
      <div className="App">
        <div className="App-header-container">
          <header
            id="img"
            className="App-header"
            onMouseEnter={this.startAnimation}
            onMouseLeave={this.endAnimation}
          >
            <div className={classNames({
              'cube-container': true,
              'cube-container-rotating': this.state.rotating,
              'cube-container-rotate-once': this.state.rotateOnce
            })}
            >
              <div className="cube loc-1">
                {/* <!-- <div className="face front"></div> --> */}
                <div className="face back"></div>
                <div className="face left"></div>
                <div className="face right"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
              <div className="cube loc-2">
                {/* <!-- <div className="face front"></div> --> */}
                {/* <!-- <div className="face back"></div> --> */}
                <div className="face left"></div>
                <div className="face right"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
              <div className="cube loc-3">
                {/* <!-- <div className="face front"></div> --> */}
                {/* <!-- <div className="face back"></div> --> */}
                <div className="face left"></div>
                <div className="face right"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
              <div className="cube loc-4">
                {/* <!-- <div className="face front"></div> --> */}
                {/* <!--  <div className="face back"></div> --> */}
                <div className="face left"></div>
                <div className="face right"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
              <div className="cube loc-5">
                <div className="face front"></div>
                {/* <!-- <div className="face back"></div> --> */}
                <div className="face left"></div>
                <div className="face right"></div>
                {/* <!-- <div className="face top"></div> --> */}
                <div className="face bottom"></div>
              </div>
              <div className="cube loc-6">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face left"></div>
                <div className="face right"></div>
                {/* <!-- <div className="face top"></div> --> */}
                {/* <!-- <div className="face bottom"></div> --> */}
              </div>
              <div className="cube loc-7">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face left"></div>
                <div className="face right"></div>
                {/* <!-- <div className="face top"></div> --> */}
                {/* <!-- <div className="face bottom"></div> --> */}
              </div>
              <div className="cube loc-8">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face left"></div>
                <div className="face right"></div>
                {/* <!-- <div className="face top"></div> --> */}
                {/* <!-- <div className="face bottom"></div> --> */}
              </div>
              <div className="cube loc-9">
                <div className="face front"></div>
                <div className="face back"></div>
                <div className="face left"></div>
                {/* <!-- <div className="face right"></div> --> */}
                <div className="face top"></div>
                {/* <!-- <div className="face bottom"></div> --> */}
              </div>
              <div className="cube loc-10">
                <div className="face front"></div>
                <div className="face back"></div>
                {/* <!-- <div className="face left"></div> --> */}
                {/* <!-- <div className="face right"></div> --> */}
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
              <div className="cube loc-11">
                <div className="face front"></div>
                <div className="face back"></div>
                {/* <!-- <div className="face left"></div> --> */}
                {/* <!-- <div className="face right"></div> --> */}
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
              <div className="cube loc-12 clipped">
                <div className="face front"></div>
                <div className="face back"></div>
                {/* <!-- <div className="face left"></div> --> */}
                <div className="face right"></div>
                <div className="face top"></div>
                <div className="face bottom"></div>
              </div>
            </div>
          </header>
        </div>
        <div className="App-name">
          Michal Czaplinski
        </div>
        <div className="App-container">
          <div className="App-links">
            <a href="https://medium.com/@czapla" className="App-link">
              <div>BLOG</div>
            </a>
            <a href="https://github.com/michalczaplinski" className="App-link">
              <div>GITHUB</div>
            </a>
            <a href="https://twitter.com/C_Z_A_P_L_A" className="App-link">
              <div>TWITTER</div>
            </a>
            <span
              onClick={this.showEmail}
              className={`App-link${this.state.showEmail ? '-email' : ''}`}
            >
              {
                this.state.showEmail
                ? <div className="App-email">
                    <div className={classNames({
                      'App-email-left': true,
                      'App-email-left-transition': this.state.transition
                    })}>mmczaplinski</div>
                    <div className={classNames({
                      'App-email-right': true,
                      'App-email-right-transition': this.state.transition
                    })}>@gmail.com</div>
                  </div>
                : <div>EMAIL</div>
              }
            </span>
            <a href="https://github.com/michalczaplinski/michalczaplinski.github.io/raw/master/michal_czaplinski_cv_2017.pdf" className="App-link">
              <div>RESUME</div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
