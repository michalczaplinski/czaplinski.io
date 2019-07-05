import React from "react"
import { Link } from "gatsby"

import { rhythm } from "../utils/typography"
import Cube from "../components/cube"

class Layout extends React.Component {
  render() {
    const { title, children } = this.props
    const header = (
      <>
        <Link
          to="/blog"
          style={{ boxShadow: "none", marginRight: 20, height: 80 }}
        >
          <Cube />
        </Link>
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
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
        <footer>
          © {new Date().getFullYear()}
          {` `} Michal Czaplinski
        </footer>
      </div >
    )
  }
}

export default Layout
