import React from 'react'


const CPerson = ({ name, number, deletePerson }) => {
    return (
      <>
        {name} {number} <button onClick={deletePerson}>delete</button>
        <br />
      </>
    );
  };

export default CPerson