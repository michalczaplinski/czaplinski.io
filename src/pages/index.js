import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { useTrail, animated, useSpring } from "react-spring"
import styled, { css, keyframes } from "styled-components"
import classNames from "classnames"

import "../index.css"

import useEmail from "../hooks/useEmail"
import useMouse from "../hooks/useMouse"
import SEO from "../components/seo"
import Bio from "../components/bio"
import Layout from "../components/indexLayout"

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.96)
  }

  100% { 
    opacity: 1;
    transform: scale(1);
  }
`

const FadeIn = styled.div`
  animation: ${fadeIn} 400ms ease-in;
`

const QuestionMarkWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;

  @media screen and (min-width: 500px) {
    margin-top: 35px;
    justify-content: flex-start;
    margin-left: 11px;
  }
`

const QuestionMark = styled.div`
  position: relative;
  font-family: "Source Code Pro", Consolas, Monaco, "Andale Mono", "Ubuntu Mono",
    monospace;
  font-weight: 300;
  font-size: 22px;
  text-align: center;
  padding-top: 7px;
  padding-left: 15px;
  padding-right: 15px;
  background: var(--theme-left);
  cursor: pointer;

  transform: translate3d(-12px, -12px, 0);
  transition: transform 600ms;
  z-index: 10;

  ${({ showWhoAmI }) =>
    showWhoAmI &&
    css`
      transform: translate3d(-12px, -12px, 0);
    `};

  &:hover {
    transform: translate3d(-4px, -4px, 0);
  }
`

const QuestionMarkShadow = styled.div`
  width: auto;
  height: auto;
  background: rgba(49, 49, 49, 0.37);
  z-index: 5;
  transform: translate3d(6px, 0, 0) scale(1);
  transition: all 600ms;

  &:hover {
    transform: scale(1.05);
    background: rgba(49, 49, 49, 0.85);
  }
`

function randomVal() {
  let x = Math.floor(100 + Math.random() * 150)
  x = Math.random() > 0.5 ? x : -x
  return x
}

function IndexPage({ location, data }) {
  const { mergeEmail, showEmail, transition, update } = useEmail()

  const [toggle, setToggle] = useState(false)
  setTimeout(() => setToggle(true), 0)

  const [showBio, setShowBio] = useState(false)

  const [showWhoAmI, setWhoAmI] = useState(false)
  setTimeout(() => setWhoAmI(true), 1000)

  const config = { mass: 2, tension: 200, friction: 30 }
  const trail = useTrail(6, {
    config: config.wobbly,
    opacity: toggle ? 1 : 0,
    xy0: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy1: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy2: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy3: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy4: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy5: toggle ? [0, 0] : [randomVal(), randomVal()],
  })

  const { y: docY } = useMouse()
  const [{ degs }, set] = useSpring(() => ({
    degs: 20,
    config: { mass: 100, tension: 200, friction: 200 },
  }))

  if (typeof window !== `undefined`) {
    set({ degs: (docY * (165 - 20)) / window.innerHeight + 20 })
  }

  const siteTitle = data.site.siteMetadata.title

  const items = [
    <Link to="/blog" className="App-link">
      blog
    </Link>,
    <a href="https://github.com/michalczaplinski" className="App-link">
      <div>github</div>
    </a>,
    <a href="https://twitter.com/C_Z_A_P_L_A" className="App-link">
      <div>twitter</div>
    </a>,
    <div className="App-link">
      {mergeEmail ? (
        <span className="App-link-email">
          <div className="App-email">mmczaplinski@gmail.com</div>
        </span>
      ) : (
        <span
          onClick={() => update()}
          className={`App-link${showEmail ? "-email" : ""}`}
        >
          {showEmail ? (
            <div className="App-email">
              <div
                className={classNames({
                  "App-email-left": true,
                  "App-email-left-transition": transition,
                })}
              >
                mmczaplinski
              </div>
              <div
                className={classNames({
                  "App-email-right": true,
                  "App-email-right-transition": transition,
                })}
              >
                @gmail.com
              </div>
            </div>
          ) : (
            <div>email</div>
          )}
        </span>
      )}
    </div>,
    <a href="/michal_czaplinski_cv_2019.pdf" className="App-link">
      <div>resume</div>
    </a>,
    showBio ? (
      <FadeIn>
        <Bio style={{ marginTop: 40 }} />
      </FadeIn>
    ) : (
      <QuestionMarkWrapper>
        <QuestionMarkShadow>
          <QuestionMark
            showWhoAmI={showWhoAmI}
            onClick={() => setShowBio(true)}
          >
            <div>who am i?</div>
            <span role="img" aria-label="whoami">
              {" "}
              🤔{" "}
            </span>
          </QuestionMark>
        </QuestionMarkShadow>
      </QuestionMarkWrapper>
    ),
  ]

  const trans = (x, y) => `translate3d(${x}px,${y}px,0)`

  return (
    <animated.div
      style={{
        minHeight: `100vh`,
        overflow: `hidden`,
        background: degs.interpolate(
          degs =>
            `linear-gradient(${degs}deg, #8dfffb 7%,  #fffaae 20%, #fff662 70%, #ff5151 110%)`
        ),
      }}
    >
      <Layout location={location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div className="App-links">
          {trail.map(({ ...props }, index) => {
            return (
              <animated.div
                style={{
                  ...props,
                  transform: props[`xy${index}`].interpolate(trans),
                }}
                key={index}
              >
                {items[index]}
              </animated.div>
            )
          })}
        </div>
      </Layout>
    </animated.div>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default IndexPage
