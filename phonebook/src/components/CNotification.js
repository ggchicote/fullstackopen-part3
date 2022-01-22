import React from 'react'

const CNotification = ({message}) => {
    if (message === null){
        return null
    }
    
    return (
        <div className={message.type}>
            {message.content}
        </div>
    )

}

export default CNotification