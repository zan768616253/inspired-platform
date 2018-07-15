import React from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import IconButton from "material-ui/IconButton";
import Toolbar from "../toolbar.jsx";
import { Scrollbars } from "react-custom-scrollbars";
import Avatar from "material-ui/Avatar";
import {orange500, red500} from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import UserStore from "../../store/UserStore.js";
import { observer } from "mobx-react"
import 'rc-cropping/assets/index.css';
import CropViewer from 'rc-cropping';
import Dialog from 'rc-dialog';
import Upload from 'rc-upload';

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

@observer
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isEdit: false
    };
  }

  renderEditButton = (isEdit) => {
      return (
          <IconButton
              tooltip="edit"
              onClick={() => this.handleEditButtonOnClick(isEdit)}
              tooltipPosition="bottom-center"
          >
              { isEdit ?  <svg
                  fill="#000000"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <path d="M18,9c0-3.3-2.7-6-6-6S6,5.7,6,9c-3.4,0-6.1,2.8-6,6.2C0.1,18.5,3,21,6.3,21L9,21c0.6,0,1-0.4,1-1v-3H8.8   c-0.9,0-1.3-1.1-0.7-1.7l3.2-3.2c0.4-0.4,1-0.4,1.4,0l3.2,3.2c0.6,0.6,0.2,1.7-0.7,1.7H14v3c0,0.6,0.4,1,1,1l2.7,0   c3.3,0,6.2-2.5,6.2-5.8C24.1,11.8,21.4,9,18,9z" />
                  <path d="M0 0h24v24H0z" fill="none" />
              </svg> :
              <svg
                  fill="#000000"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                  <path d="M0 0h24v24H0z" fill="none" />
              </svg>
              }
          </IconButton>
      )
  }

  handleEditButtonOnClick = (isEdit) => {
    if (isEdit) {
        this.updateUserProfile().then(response => {
            UserStore.obj.phone = response.phone
            UserStore.obj.childrennumber = response.childrennumber
            UserStore.obj.hometown = response.hometown
            UserStore.obj.expertise = response.expertise
            UserStore.obj.culture = response.culture
            UserStore.obj.belief = response.belief
            UserStore.obj.bio = response.bio
            UserStore.obj.desc = response.desc
            this.setState({ isEdit: false })
        }).catch(err => {
        })
    } else {
      this.setState({ isEdit: true })
    }
  }

  updateUserProfile = () => {
    return new Promise ((resolve, reject) => {
        const user_id = UserStore.obj.user_id
        const phone = this.refs.phone.textContent
        const childrennumber = this.refs.childrennumber.textContent
        const hometown = this.refs.hometown.textContent
        const expertise = this.refs.expertise.textContent
        const culture = this.refs.culture.textContent
        const belief = this.refs.belief.textContent
        const bio = this.refs.bio.textContent
        const desc = this.refs.desc.textContent

        const data = {
            user_id: user_id,
            phone: phone,
            childrennumber: childrennumber,
            hometown: hometown,
            expertise: expertise,
            culture: culture,
            belief: belief,
            bio: bio,
            desc: desc
        }

        $.ajax({
            type: "POST",
            url: '/api/user/updateinfo',
            data: data
        }).done(result => {
          resolve(result)
        }).fail(err => {
          reject(err)
        })
    })
  }

  beforeUpload = (file) => {
      const cropper = this.cropper;
      // file.name = UserStore.obj.user_id
      Object.defineProperty(file, 'name', {
          writable: true,
          value: UserStore.obj.user_id
      });
      return cropper.selectImage(file).then(image => {
          const formData = new FormData();
          formData.append('file', image);
          $.ajax({
              url: '/api/user/updateavatar',
              type: 'POST',
              data: formData,
              cache: false,
              processData: false,
              contentType: false,
              success: (data, textStatus, jqXHR) => {
                  UserStore.obj.avatar = data.filename
                  // $('.rc-preview-mask').click()
              },
              error: (jqXHR, textStatus, errorThrown) => {
                  console.log('ERRORS: ' + textStatus);
              }
          })
      })
  }

  render() {
    const pClassName = this.state.isEdit ? 'editable' : ''

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className='profilePage'>
          <Toolbar />
          <Scrollbars
            autoHeightMin={0}
            style={{ height: "100vh" }}
            autoHeightMax={50}
            thumbMinSize={50}
          >
            <div className='profileContainer'>
              <Avatar size={100} src={UserStore.obj.avatar ? '/api/user/avatar/' + UserStore.obj.avatar : UserStore.obj.picture} />
              <h3>{UserStore.obj.nickname}</h3>
              <div className='profile-edit-container'>
                <h3>
                  {this.renderEditButton(this.state.isEdit)}
                </h3>
              </div>
            </div>

            <div className='row profile-row-section'>
              <div className='profile-body columns medium-12 large-12'>
                <div className='profile-context'>
                  <div className='profile-box'>
                    <div className='profile-box--lcol'>
                      <div className='inner-col'>
                        <div className='docSection profile-boxhead'>
                          <h1 className='flush--bottom text--display3'>
                              <span >{UserStore.obj.name}</span>
                          </h1>
                        </div>
                        <div className='docSection'>
                          <div className='profileQuestionsSection'>
                            <div className='unit size1of3'>
                              <div className='profile-content-item'>
                                  <h4 className='flush--bottom'>Phone:</h4>
                                  <p contentEditable={this.state.isEdit} className={pClassName} ref="phone">{UserStore.obj.phone}</p>
                              </div>
                            </div>
                            <div className='unit size1of3'>
                                <div className='profile-content-item'>
                                    <h4 className='flush--bottom'>Number of Child:</h4>
                                    <p contentEditable={this.state.isEdit} className={pClassName} ref="childrennumber">{UserStore.obj.childrennumber}</p>
                                </div>
                            </div>
                            <div className='size1of3 lastUnit'>
                                <div className='profile-content-item'>
                                    <h4 className='flush--bottom'>Hometown:</h4>
                                    <p contentEditable={this.state.isEdit} className={pClassName} ref="hometown">{UserStore.obj.hometown}</p>
                                </div>
                            </div>
                          </div>
                          <div className='profileQuestionsSection'>
                              <div className='unit size1of3'>
                                  <div className='profile-content-item'>
                                      <h4 className='flush--bottom'>Expertise:</h4>
                                      <p contentEditable={this.state.isEdit} className={pClassName} ref="expertise">{UserStore.obj.expertise}</p>
                                  </div>
                              </div>
                              <div className='unit size1of3'>
                                  <div className='profile-content-item'>
                                      <h4 className='flush--bottom'>Culture:</h4>
                                      <p contentEditable={this.state.isEdit} className={pClassName} ref="culture">{UserStore.obj.culture}</p>
                                  </div>
                              </div>
                              <div className='size1of3 lastUnit'>
                                  <div className='profile-content-item'>
                                      <h4 className='flush--bottom'>Belief:</h4>
                                      <p contentEditable={this.state.isEdit} className={pClassName} ref="belief">{UserStore.obj.belief}</p>
                                  </div>
                              </div>
                          </div>
                          <div className='profile-content-item'>
                              <h4 className='flush--bottom'>Email</h4>
                              <p className={pClassName} ref="email">{UserStore.obj.email}</p>
                          </div>
                          <div className='profile-content-item'>
                              <h4 className='flush--bottom'>Bio</h4>
                              <p contentEditable={this.state.isEdit} className={pClassName} ref="bio">{UserStore.obj.bio}</p>
                          </div>
                          <div className='profile-content-item'>
                              <h4 className='flush--bottom'>Description</h4>
                              <p contentEditable={this.state.isEdit} className={pClassName} ref="desc">{UserStore.obj.desc}</p>
                          </div>
                        </div>
                        <div className='docSection'>
                          <p className='small'>
                              You aren't in any groups yet.
                          </p>
                        </div>
                        <div className='docSection'>
                            <p className='small'>
                                Looking to post a greeting? Start a conversation instead.
                            </p>
                        </div>
                      </div>
                    </div>
                    <div className='profile-box--rcol'>
                        <div className='docSection padding-bottom'>
                          <div className='profileImageContainer rounded-corner-top '>
                            <span>
                              <a href={UserStore.obj.picture} target='_new'>
                                <img src={UserStore.obj.avatar ? '/api/user/avatar/' + UserStore.obj.avatar : UserStore.obj.picture} />
                              </a>
                            </span>
                            <div>
                                {/*<a className="small">Change your photo</a>*/}
                                <Upload type="drag" beforeUpload={this.beforeUpload} ><a>Change your photo</a></Upload>
                                <CropViewer
                                    getSpinContent={() => <span>loading...</span> }
                                    renderModal={() => <Dialog />}
                                    locale="en-US"
                                    ref={ele => this.cropper = ele}
                                    square
                                />
                            </div>
                          </div>
                          <ul className='photo-nav-links pipeList rounded-corner-bottom'>
                          </ul>
                          <div className='interest-topics'>
                            <div className='rounded-corner-top clearfix'>
                              <h3 className="big flush--bottom">Interests</h3>
                              <ul className='small inlineblockList padding-none'>
                                <li>
                                  <a>Hide interests on profile</a>
                                </li>
                              </ul>
                            </div>
                            <ul className='resetList D_narrow padding-bottom topic-widget-root'>
                              <li className='small'>
                                <a>Digital Photography · Agile Project Management · JavaScript</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Scrollbars>
        </div>
      </MuiThemeProvider>
    );
  }
}