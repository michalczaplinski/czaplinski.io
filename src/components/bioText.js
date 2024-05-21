import React from "react"
import styled from "styled-components"

const BioLine = styled.div`
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5rem;
`

const BioWrapper = styled.div`
  padding-left: 1.6rem;
  text-indent: -1.6rem;
`

function BioText({ twitterHandle }) {
  return (
    <BioWrapper>
      <BioLine>
        <span role="img" aria-label="palm">
          🌴
        </span>{" "}
        I'm a web engineer who loves great UX.
      </BioLine>
      <BioLine>
        <span role="img" aria-label="work">
          👨‍💻
        </span>
        Working on WordPress Core at <a href="https://automattic.com">Automattic</a>
      </BioLine>
      <BioLine>
        <span role="img" aria-label="peru">
          🇵🇪
        </span>{" "}
        Originally from Poland, currently living in Costa da Caparica, Portugal.
      </BioLine>
      <BioLine>
        <span role="img" aria-label="sun">
          ☀️
        </span>
        <a href={`https://twitter.com/${twitterHandle}`}>
          {" "}
          Follow me on Twitter
        </a>
      </BioLine>
    </BioWrapper>
  )
}

export default BioText
