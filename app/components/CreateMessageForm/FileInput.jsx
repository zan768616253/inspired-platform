import React from 'react'

export default class FileInput extends React.Component {


    render() {
        return(
            <div className='file-input-container'>
                <svg>
                    <use xlinkHref="index.svg#attach" />
                </svg>
                <input
                    className='file-input' type="file"
                    onChange={e => {

                    }}
                />
            </div>
        )
    }
}