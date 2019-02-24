import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import styled from "styled-components"

import { rhythm } from "../utils/typography"
import BioText from "../components/bioText"

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
                  marginRight: 28,
                  marginBottom: rhythm(1),
                  minWidth: 85,
                  borderRadius: `50%`,
                }}
              />
            </ProfileImage>
            <BioText twitterHandle={social.twitter} />
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
