import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

import { rhythm } from "../utils/typography"
import Cube from "../components/cube"

const Layout = ({ slug, title, children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            siteUrl
          }
        }
      }
    `}
    render={data => (
      <>
        <Helmet title={data.site.siteMetadata.title}>
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:image"
            content={`${data.site.siteMetadata.siteUrl}${slug}twitter-card.jpg`}
          />
        </Helmet>
        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(24),
            padding: `${rhythm(1)} ${rhythm(3 / 4)}`,
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "center",
              height: `auto`,
            }}
          >
            <Link
              to="/blog"
              style={{ boxShadow: "none", marginRight: 20, height: 80 }}
            >
              <Cube />
            </Link>
            <h3
              style={{
                fontFamily: `Montserrat, system-ui, sans-serif`,
                marginTop: 33,
              }}
            >
              <Link
                style={{
                  boxShadow: `none`,
                  textDecoration: `none`,
                  color: `inherit`,
                }}
                to={`/blog`}
              >
                {title}
              </Link>
            </h3>
          </header>
          <main>{children}</main>
          <footer>
            © {new Date().getFullYear()}
            {` `} Michal Czaplinski
          </footer>
        </div>
      </>
    )}
  />
)

export default Layout
