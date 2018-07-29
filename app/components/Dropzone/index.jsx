/* eslint prefer-template: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import {
    supportMultiple,
    fileAccepted,
    allFilesAccepted,
    fileMatchSize,
    onDocumentDragOver,
    getDataTransferItems,
    isIeOrEdge
} from './utils'

class Dropzone extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.composeHandlers = this.composeHandlers.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onDocumentDrop = this.onDocumentDrop.bind(this)
        this.onDragEnter = this.onDragEnter.bind(this)
        this.onDragLeave = this.onDragLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onDragStart = this.onDragStart.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onFileDialogCancel = this.onFileDialogCancel.bind(this)
        this.onInputElementClick = this.onInputElementClick.bind(this)

        this.setRef = this.setRef.bind(this)
        this.setRefs = this.setRefs.bind(this)

        this.isFileDialogActive = false

        this.state = {
            draggedFiles: [],
            acceptedFiles: [],
            rejectedFiles: []
        }
    }

    componentDidMount() {
        const { preventDropOnDocument } = this.props
        this.dragTargets = []

        if (preventDropOnDocument) {
            document.addEventListener('dragover', onDocumentDragOver, false)
            document.addEventListener('drop', this.onDocumentDrop, false)
        }
        this.fileInputEl.addEventListener('click', this.onInputElementClick, false)
        window.addEventListener('focus', this.onFileDialogCancel, false)
    }

    componentWillUnmount() {
        const { preventDropOnDocument } = this.props
        if (preventDropOnDocument) {
            document.removeEventListener('dragover', onDocumentDragOver)
            document.removeEventListener('drop', this.onDocumentDrop)
        }
        if (this.fileInputEl != null) {
            this.fileInputEl.removeEventListener('click', this.onInputElementClick, false)
        }
        window.removeEventListener('focus', this.onFileDialogCancel, false)
    }

    composeHandlers(handler) {
        if (this.props.disabled) {
            return null
        }

        return handler
    }

    onDocumentDrop(evt) {
        if (this.node && this.node.contains(evt.target)) {
            // if we intercepted an event for our instance, let it propagate down to the instance's onDrop handler
            return
        }
        evt.preventDefault()
        this.dragTargets = []
    }

    onDragStart(evt) {
        if (this.props.onDragStart) {
            this.props.onDragStart.call(this, evt)
        }
    }

    onDragEnter(evt) {
        evt.preventDefault()

        // Count the dropzone and any children that are entered.
        if (this.dragTargets.indexOf(evt.target) === -1) {
            this.dragTargets.push(evt.target)
        }

        this.setState({
            isDragActive: true, // Do not rely on files for the drag state. It doesn't work in Safari.
            draggedFiles: getDataTransferItems(evt)
        })

        if (this.props.onDragEnter) {
            this.props.onDragEnter.call(this, evt)
        }
    }

    onDragOver(evt) {
        // eslint-disable-line class-methods-use-this
        evt.preventDefault()
        evt.stopPropagation()
        try {
            // The file dialog on Chrome allows users to drag files from the dialog onto
            // the dropzone, causing the browser the crash when the file dialog is closed.
            // A drop effect of 'none' prevents the file from being dropped
            evt.dataTransfer.dropEffect = this.isFileDialogActive ? 'none' : 'copy' // eslint-disable-line no-param-reassign
        } catch (err) {
            // continue regardless of error
        }

        if (this.props.onDragOver) {
            this.props.onDragOver.call(this, evt)
        }
        return false
    }

    onDragLeave(evt) {
        evt.preventDefault()

        // Only deactivate once the dropzone and all children have been left.
        this.dragTargets = this.dragTargets.filter(el => el !== evt.target && this.node.contains(el))
        if (this.dragTargets.length > 0) {
            return
        }

        // Clear dragging files state
        this.setState({
            isDragActive: false,
            draggedFiles: []
        })

        if (this.props.onDragLeave) {
            this.props.onDragLeave.call(this, evt)
        }
    }

    onDrop(evt) {
        const { onDrop, onDropAccepted, onDropRejected, multiple, disablePreview, accept } = this.props
        const fileList = getDataTransferItems(evt)
        const acceptedFiles = []
        const rejectedFiles = []

        // Stop default browser behavior
        evt.preventDefault()

        // Reset the counter along with the drag on a drop.
        this.dragTargets = []
        this.isFileDialogActive = false

        fileList.forEach(file => {
            if (!disablePreview) {
                try {
                    file.preview = window.URL.createObjectURL(file) // eslint-disable-line no-param-reassign
                } catch (err) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error('Failed to generate preview for file', file, err) // eslint-disable-line no-console
                    }
                }
            }

            if (
                fileAccepted(file, accept) &&
                fileMatchSize(file, this.props.maxSize, this.props.minSize)
            ) {
                acceptedFiles.push(file)
            } else {
                rejectedFiles.push(file)
            }
        })

        if (!multiple) {
            // if not in multi mode add any extra accepted files to rejected.
            // This will allow end users to easily ignore a multi file drop in "single" mode.
            rejectedFiles.push(...acceptedFiles.splice(1))
        }

        if (onDrop) {
            onDrop.call(this, acceptedFiles, rejectedFiles, evt)
        }

        if (rejectedFiles.length > 0 && onDropRejected) {
            onDropRejected.call(this, rejectedFiles, evt)
        }

        if (acceptedFiles.length > 0 && onDropAccepted) {
            onDropAccepted.call(this, acceptedFiles, evt)
        }

        // Clear files value
        this.draggedFiles = null

        // Reset drag state
        this.setState({
            isDragActive: false,
            draggedFiles: [],
            acceptedFiles,
            rejectedFiles
        })
    }

    onClick(evt) {
        const { onClick, disableClick } = this.props
        if (!disableClick) {
            evt.stopPropagation()

            if (onClick) {
                onClick.call(this, evt)
            }

            // in IE11/Edge the file-browser dialog is blocking, ensure this is behind setTimeout
            // this is so react can handle state changes in the onClick prop above above
            // see: https://github.com/react-dropzone/react-dropzone/issues/450
            if (isIeOrEdge()) {
                setTimeout(this.open.bind(this), 0)
            } else {
                this.open()
            }
        }
    }

    onInputElementClick(evt) {
        evt.stopPropagation()
        if (this.props.inputProps && this.props.inputProps.onClick) {
            this.props.inputProps.onClick()
        }
    }

    onFileDialogCancel() {
        // timeout will not recognize context of this method
        const { onFileDialogCancel } = this.props
        // execute the timeout only if the FileDialog is opened in the browser
        if (this.isFileDialogActive) {
            setTimeout(() => {
                if (this.fileInputEl != null) {
                    // Returns an object as FileList
                    const { files } = this.fileInputEl

                    if (!files.length) {
                        this.isFileDialogActive = false
                    }
                }

                if (typeof onFileDialogCancel === 'function') {
                    onFileDialogCancel()
                }
            }, 300)
        }
    }

    setRef(ref) {
        this.node = ref
    }

    setRefs(ref) {
        this.fileInputEl = ref
    }

    /**
     * Open system file upload dialog.
     *
     * @public
     */
    open() {
        this.isFileDialogActive = true
        this.fileInputEl.value = null
        this.fileInputEl.click()
    }

    renderChildren = (children, isDragActive, isDragAccept, isDragReject) => {
        if (typeof children === 'function') {
            return children({
                ...this.state,
                isDragActive,
                isDragAccept,
                isDragReject
            })
        }
        return children
    }

    render() {

    }
}