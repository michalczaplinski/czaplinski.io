import React, { useState } from "react"
import { Link, graphql } from "gatsby"
import { useTrail, animated } from "react-spring"
import styled from "styled-components"

import "./index.css"
import classNames from "classnames"
import SEO from "../components/seo"
import Layout from "../components/indexLayout"

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fff662;
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

function IndexPage({ location, data }) {
  const { mergeEmail, showEmail, transition, update } = useEmail()

  const [toggle, setToggle] = useState(false)
  setTimeout(() => setToggle(true), 0)
  const config = { mass: 30, tension: 1000, friction: 200 }

  const trail = useTrail(5, {
    config,
    opacity: toggle ? 1 : 0,
    y: toggle ? 0 : 500,
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
  ]

  return (
    <PageWrapper>
      <Layout location={location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div className="App-links">
          {trail.map(({ y, ...props }, index) => (
            <animated.div
              style={{
                ...props,
                transform: y.interpolate(y => `translate3d(${y}px, 0, 0)`),
              }}
              key={index}
            >
              {items[index]}
            </animated.div>
          ))}
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
