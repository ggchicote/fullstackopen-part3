import React from 'react'

const CFilter = ({value, onChange}) => {

    return (
        <div>
        filter shown with: <input value={value} onChange={onChange}/>
      </div>
    )
}

export default CFilter