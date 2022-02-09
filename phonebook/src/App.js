import React, {useState, useEffect} from 'react'
import CPersonForm from './components/CPersonForm'
import CFilter from './components/CFilter'
import CPersons from './components/CPersons'
import personService from './services/persons'
import CNotification from './components/CNotification.js'
import './index.css'

const App = () => {

  const [persons, setPersons ] = useState([])

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [personFiltered, setPersonFiltered] = useState("")
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const personsToShow = 
    (personFiltered === "") ?
    persons :
    persons.filter(person => person.name.toLowerCase().includes(personFiltered.toLowerCase()) )


  const initializeInputs = () => {
    setNewName('')
    setNewNumber('')
  }

  const updatePerson = person => {
    const id = person.id
    const changedPerson = {...person,number:newNumber}
    
    personService.update(id,changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person=>person.id !== id ? person : returnedPerson ))
        handleMessage(`Updated ${newName}'s phone number`)
      })
      .catch(error => {
        const message = error.response.data.error
        return handleMessage(message,'error')
        //handleMessage(`Information of ${newName} has already been removed from server`,'error')
      }) 
    

  }

  const addPerson = (event) => {
    event.preventDefault()
    
    if (persons.some(person => person.name === newName)) {
      const oldPerson = persons.find(person => person.name === newName)
      if (oldPerson.number !== newNumber) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`))
          updatePerson(oldPerson)   
      }else{
        alert(`${newName} is already added to phonebook`)
        return
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService.addPerson(personObject)
        .then(data => {
          setPersons(persons.concat(data))
          initializeInputs()
          handleMessage(`Added ${newName}`)
        })
        .catch(error => {
          const message = error.response.data.error
          return handleMessage(message,'error')
        })
    }
  }



  const handleMessage = (content,type='success') => {
    setMessage({content,type})
    setTimeout(()=>{setMessage(null)},5000)
  }

  const deletePerson = (id,name) => {
    const result= window.confirm(`Delete ${name}?`)
    if (result) {
      personService
      .deletePerson(id)
      .then(data => {
          setPersons(persons.filter(person => person.id !== id))
        }
      )
      .catch(error => {
        handleMessage(`Information of ${newName} has already been removed from server`,'error')
      })      
    }

  }
  
  const handleNameInput = (event) => setNewName(event.target.value)
  const handleNumberInput = (event) => setNewNumber(event.target.value)
  const handleShownPersonsInput = (event ) => setPersonFiltered(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <CNotification message={message} />
      <CFilter value = {personFiltered} onChange = {handleShownPersonsInput}/>
      <h3>add a new person</h3>
      <CPersonForm 
        onSubmit = {addPerson}
        name = {newName}
        onChangeName = {handleNameInput}
        number = {newNumber}
        onChangeNumber = {handleNumberInput}
      />
      <h3>Numbers</h3>
      <CPersons persons={personsToShow} handleClick={deletePerson}/>
    </div>

  )

}

export default App