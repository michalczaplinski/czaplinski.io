import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../utils/typography"
import Cube from "../components/cube"

class IndexLayout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/blog`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(1.2),
            marginBottom: rhythm(1.5),
            marginTop: 0,
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
        </h1>
      )
    } else {
      header = (
        <>
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
        </>
      )
    }
    return (
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
          {header}
        </header>
        <main>{children}</main>
      </div>
    )
  }
}

export default IndexLayout
