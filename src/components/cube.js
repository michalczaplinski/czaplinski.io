import React, { useState } from "react"
import classNames from "classnames"

function Cube() {
  const [rotating, setRotating] = useState(false)
  const [rotateOnce, _] = useState(true) //eslint-disable-line

  return (
    <div
      onMouseEnter={() => setRotating(true)}
      onMouseLeave={() => setRotating(false)}
    >
      <div
        className={classNames({
          "cube-container": true,
          "cube-container-rotating": rotating,
          "cube-container-rotate-once": rotateOnce,
        })}
      >
        <div className="cube loc-1">
          {/* <!-- <div className="face front"></div> --> */}
          <div className="face back" />
          <div className="face left" />
          <div className="face right" />
          <div className="face top" />
          <div className="face bottom" />
        </div>
        <div className="cube loc-2">
          {/* <!-- <div className="face front"></div> --> */}
          {/* <!-- <div className="face back"></div> --> */}
          <div className="face left" />
          <div className="face right" />
          <div className="face top" />
          <div className="face bottom" />
        </div>
        <div className="cube loc-3">
          {/* <!-- <div className="face front"></div> --> */}
          {/* <!-- <div className="face back"></div> --> */}
          <div className="face left" />
          <div className="face right" />
          <div className="face top" />
          <div className="face bottom" />
        </div>
        <div className="cube loc-4">
          {/* <!-- <div className="face front"></div> --> */}
          {/* <!--  <div className="face back"></div> --> */}
          <div className="face left" />
          <div className="face right" />
          <div className="face top" />
          <div className="face bottom" />
        </div>
        <div className="cube loc-5">
          <div className="face front" />
          {/* <!-- <div className="face back"></div> --> */}
          <div className="face left" />
          <div className="face right" />
          {/* <!-- <div className="face top"></div> --> */}
          <div className="face bottom" />
        </div>
        <div className="cube loc-6">
          <div className="face front" />
          <div className="face back" />
          <div className="face left" />
          <div className="face right" />
          {/* <!-- <div className="face top"></div> --> */}
          {/* <!-- <div className="face bottom"></div> --> */}
        </div>
        <div className="cube loc-7">
          <div className="face front" />
          <div className="face back" />
          <div className="face left" />
          <div className="face right" />
          {/* <!-- <div className="face top"></div> --> */}
          {/* <!-- <div className="face bottom"></div> --> */}
        </div>
        <div className="cube loc-8">
          <div className="face front" />
          <div className="face back" />
          <div className="face left" />
          <div className="face right" />
          {/* <!-- <div className="face top"></div> --> */}
          {/* <!-- <div className="face bottom"></div> --> */}
        </div>
        <div className="cube loc-9">
          <div className="face front" />
          <div className="face back" />
          <div className="face left" />
          {/* <!-- <div className="face right"></div> --> */}
          <div className="face top" />
          {/* <!-- <div className="face bottom"></div> --> */}
        </div>
        <div className="cube loc-10">
          <div className="face front" />
          <div className="face back" />
          {/* <!-- <div className="face left"></div> --> */}
          {/* <!-- <div className="face right"></div> --> */}
          <div className="face top" />
          <div className="face bottom" />
        </div>
        <div className="cube loc-11">
          <div className="face front" />
          <div className="face back" />
          {/* <!-- <div className="face left"></div> --> */}
          {/* <!-- <div className="face right"></div> --> */}
          <div className="face top" />
          <div className="face bottom" />
        </div>
        <div className="cube loc-12 clipped">
          <div className="face front" />
          <div className="face back" />
          {/* <!-- <div className="face left"></div> --> */}
          <div className="face right" />
          <div className="face top" />
          <div className="face bottom" />
        </div>
      </div>
    </div>
  )
}

export default Cube
