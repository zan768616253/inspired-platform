import React from "react"
import {observer} from "mobx-react/index"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import Toolbar from "../../components/ToolBar/toolbar"
import Lightbox from "../../components/Lightbox"
import MainContainer from "./MainContainer"
import getMuiTheme from "material-ui/styles/getMuiTheme"
import UIStore from '../../store/UIStore'
import ChatStore from '../../store/ChatStore'

const muiTheme = getMuiTheme();

@observer
export default class Main extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
          photoIndex: 0
      }
  }

  componentWillMount() {

  }

  render () {
      const { photoIndex } = this.state;
      const isOpenLghtbox = UIStore.openLightbox
      const images = ChatStore.images || []
      return (
          <MuiThemeProvider muiTheme={muiTheme}>
              <div style={{height: "100%"}}>
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
