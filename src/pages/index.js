import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { useTrail, animated } from "react-spring"
import styled, { css } from "styled-components"

import "../index.css"
import classNames from "classnames"
import SEO from "../components/seo"
import Bio from "../components/bio"
import Layout from "../components/indexLayout"

const PageWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: #fff662;
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
  font-family: monospace;
  font-size: 25px;
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
  background: black;
  z-index: 5;
  transform: translate3d(6px, 0, 0) scale(1);
  transition: transform 600ms;

  &:hover {
    transform: scale(1.05);
  }
`

const useEmail = () => {
  const [showEmail, setShowEmail] = useState(false)
  const [transition, setTransition] = useState(false)
  const [mergeEmail, setMergeEmail] = useState(false)

  return {
    mergeEmail,
    showEmail,
    transition,
    update: () => {
      setShowEmail(true)
      setTimeout(() => setTransition(true), 100)
      setTimeout(() => setMergeEmail(true), 1500)
    },
  }
}

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
    config,
    opacity: toggle ? 1 : 0,
    xy0: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy1: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy2: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy3: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy4: toggle ? [0, 0] : [randomVal(), randomVal()],
    xy5: toggle ? [0, 0] : [randomVal(), randomVal()],
  })

  const siteTitle = data.site.siteMetadata.title

  const items = [
    <Link to="/blog" className="App-link">
      BLOG
    </Link>,
    <a href="https://github.com/michalczaplinski" className="App-link">
      <div>GITHUB</div>
    </a>,
    <a href="https://twitter.com/C_Z_A_P_L_A" className="App-link">
      <div>TWITTER</div>
    </a>,
    <div>
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
            <div>EMAIL</div>
          )}
        </span>
      )}
    </div>,
    <a href="/michal_czaplinski_cv_2019.pdf" className="App-link">
      <div>RESUME</div>
    </a>,
    showBio ? (
      <Bio />
    ) : (
      <QuestionMarkWrapper>
        <QuestionMarkShadow>
          <QuestionMark
            showWhoAmI={showWhoAmI}
            onClick={() => setShowBio(true)}
          >
            <div>Who am I ?</div>
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
    <PageWrapper>
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
    </PageWrapper>
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
