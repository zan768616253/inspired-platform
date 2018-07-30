import React from 'react'

export default class Gallery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isEdit: false
        }
    }

    handleEditButtonOnClick() {
        this.setState({
            isEdit: !this.state.isEdit
        })
    }

    render () {
        const galleryToolClass = this.state.isEdit ? ' display' : ''
        return (
            <li>
                <div className='gallery-container'>
                    <div className={'gallery-tools' + galleryToolClass}>
                        <a className='gallery-tool edit' onClick={() => this.handleEditButtonOnClick()}>
                            {this.state.isEdit ?
                                <i className="fa fa-floppy-o" aria-hidden="true"/>:
                                <i className="fa fa-pencil" aria-hidden="true"/>
                            }
                        </a>
                        <a className='gallery-tool delete'>
                            <i className="fa fa-minus-circle" aria-hidden="true" />
                        </a>
                    </div>
                    <div className='gallery-thumbnail'>
                        <img src='inspired_logo_big.png' />
                    </div>
                    <div className='gallery-title'>
                        this is the title!!!this is the title!!!
                    </div>
                </div>
            </li>
        )
    }
}