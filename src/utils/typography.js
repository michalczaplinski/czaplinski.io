import Typography from "typography"
import Wordpress2016 from "typography-theme-wordpress-2016"

Wordpress2016.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
    a: {
      color: "#ff4f4b",
    },
  }
}

delete Wordpress2016.googleFonts

Wordpress2016.fontFamily = "Catamaran"
Wordpress2016.headerFontFamily = ["Catamaran", "Georgia", "serif"]
Wordpress2016.bodyFontFamily = ["Catamaran", "Georgia", "serif"]
Wordpress2016.color = `#ff4f4b`

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
