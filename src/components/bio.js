import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 85,
              }}
            />
            <p>
              <div>
                🌴 I'm a freelance web engineer who loves great UX{' '}
              </div>
              <div>
                🇵🇪 Originally from Poland, currently living in Lima, Peru
                </div>
              ☀️
              <a href={`https://twitter.com/${social.twitter}`}>
                {' '} Follow me on Twitter
              </a>
            </p>
          </div>
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
