import React from 'react'
import './CloneButton.css'
const cloneButton = (props) => {
	return <button className="CloneButton" onClick={props.onClick}>{props.shouldClone ? 'Stop' : 'Clone'}</button>
}

export default cloneButton;