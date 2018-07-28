import React from "react"
import {observer} from "mobx-react/index"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import Toolbar from "../../components/ToolBar/toolbar"
import Lightbox from "../../components/Lightbox"
import MainContainer from "./MainContainer"
import getMuiTheme from "material-ui/styles/getMuiTheme"
import UIStore from '../../store/UIstore'
import ChatStore from '../../store/ChatStore'
import {orange500, red500} from "material-ui/styles/colors";

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: orange500,
        accent1Color: red500
    },
    toggle: {
        thumbOnColor: "yellow",
        trackOnColor: "red",
        backgroundColor: "red"
    },
    appBar: {
        height: 50
    }
});

const style = {
  height: "100%"
};

@observer
export default class Main extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
          photoIndex: 0
      }
  }

  render () {
      const { photoIndex } = this.state;
      const isOpenLghtbox = UIStore.openLightbox
      const images = ChatStore.images || []
      return (
          <MuiThemeProvider muiTheme={muiTheme}>
              <div style={style}>
                  <Toolbar />
                  <div className='main-body'>
                      <MainContainer />
                  </div>
                  {isOpenLghtbox && (
                      <Lightbox
                          mainSrc={images[photoIndex]}
                          nextSrc={images[(photoIndex + 1) % images.length]}
                          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                          onCloseRequest={() => {UIStore.openLightbox = false}}
                          onMovePrevRequest={() =>
                              this.setState({
                                  photoIndex: (photoIndex + images.length - 1) % images.length
                              })
                          }
                          onMoveNextRequest={() =>
                              this.setState({
                                  photoIndex: (photoIndex + 1) % images.length
                              })
                          }
                      />
                  )}
              </div>

          </MuiThemeProvider>
      )
  }
}

module.exports = Main;
