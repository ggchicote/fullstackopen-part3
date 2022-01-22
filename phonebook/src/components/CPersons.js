import React from "react";
import CPerson from "./CPerson";

const CPersons = ({ persons, handleClick }) => {

  return (
    <>
      {persons.map((person) => (
        <CPerson key={person.id} name={person.name} number={person.number} deletePerson={()=>handleClick(person.id,person.name)}/>
      ))}
    </>
  );
};

export default CPersons;


