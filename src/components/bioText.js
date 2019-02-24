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
        I'm a freelance web engineer who loves great UX.
      </BioLine>
      <BioLine>
        <span role="img" aria-label="peru">
          🇵🇪
        </span>{" "}
        Originally from Poland, currently living in Lima, Peru.
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
