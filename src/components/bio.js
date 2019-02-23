import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from "styled-components"

import { rhythm } from "../utils/typography"

const ProfileImage = styled.div`
  @media screen and (max-width: 450px) {
    justify-content: center;
    width: 100%;
  }
`

const BioWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media screen and (max-width: 450px) {
    margin-top: 0px;
    margin-bottom: 30px;
  }

  margin-top: 28px;
  margin-bottom: 35px;
`

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <BioWrapper>
            <ProfileImage>
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  marginRight: 20,
                  marginBottom: rhythm(1),
                  minWidth: 85,
                  borderRadius: `50%`,
                }}
              />
            </ProfileImage>
            <div style={{ paddingLeft: `1.5rem`, textIndent: `-1.6rem` }}>
              <div style={{ marginBottom: 6 }}>
                <span role="img" aria-label="palm">
                  🌴
                </span>{" "}
                I'm a freelance web engineer who loves great UX.{" "}
              </div>
              <div style={{ marginBottom: 6 }}>
                <span role="img" aria-label="peru">
                  🇵🇪
                </span>{" "}
                Originally from Poland, currently living in Lima, Peru.
              </div>
              <div style={{ marginBottom: 6 }}>
                <span role="img" aria-label="sun">
                  ☀️
                </span>
                <a href={`https://twitter.com/${social.twitter}`}>
                  {" "}
                  Follow me on Twitter
                </a>
              </div>
            </div>
          </BioWrapper>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/michal.jpg/" }) {
      childImageSharp {
        fixed(width: 85, height: 85) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
