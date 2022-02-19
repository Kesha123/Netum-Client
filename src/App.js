import React, { useEffect, useState } from 'react';
import { CompactPicker } from 'react-color'
import './App.css';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

const api = 'https://netum-api.herokuapp.com/api/person';

function App() {

  // Vars for customization
  const [query, setQuery] = useState(api);
  const [person, setPerson] = useState({firstname:'', lastname:'', age:0});
  const [people, setPeople] = useState([]);
  const [cellColor, setCellColor] = useState('');
  const [headCellColor, setHeadCellColor] = useState('');
  const [border, setBorder] = useState('');
  const [headTextColor, setHeadTextColor] = useState('');
  const [cellTextColor, setCellTextColor] = useState('');

  // Handlers
  const inputPerson = (event) => {setPerson({...person, [event.target.name]: event.target.value});}
  const handleHeadTextColor = (color) => {setHeadTextColor({ background: color.hex });};
  const handleCellTextColor = (color) => {setCellTextColor({ background: color.hex });};
  const handleCellColor = (color) => {setCellColor({ background: color.hex });};
  const handleHeadColor = (color) => {setHeadCellColor({ background: color.hex });};
  const handleBorderSize = () => {setBorder(document.getElementById('size').value);}

  // Fetch data for the table
   useEffect(() => {
     fetch(query)
     .then(response => response.json())
     .then(data => setPeople(data))
   })

  // Queries:
  const addPerson = () => {
    fetch(api, {
      method: 'POST',      
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({firstname:person.firstname, lastname:person.lastname, age:person.age}),})
      .then(response => response.text())
    setPerson({firstname:'', lastname:'', age:0});
  }

  const deletePerson = (id) => {
    fetch(`${api}/${id}`, {
      method: 'DELETE',}).then(response => response.text())
  }

  const editPerson = (id, person) => {
    let firstname = prompt('Please enter first name:', person.firstname);
    let lastname = prompt('Please enter last name:', person.lastname);
    let age = prompt('Please enter age:', person.age);
    fetch(`${api}/${id}`, {
      method: 'PUT',      
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({firstname:firstname, lastname:lastname, age:Number(age)}),})
      .then(response => response.text())
  }

  // Change query to get sorted data
  const sort = (column, order) => {
    setQuery(`${api}/${column}/${order}`)
  }
  
  // Customize table layout
  const changeBorder = () => {
    let head = document.getElementsByClassName('Head');
    let cell = document.getElementsByClassName('Cell')
    for (let h = 0; h < head.length; h++) {
      head[h].style.border = border + "px solid";      
    }
    for (let c = 0; c < cell.length; c++) {
      cell[c].style.border = border + "px solid";      
    }
  }

  const changeHead = () => {
    let head = document.getElementById('head');
    head.style.backgroundColor = headCellColor.background;
  }

  const changeCell = () => {
    let cells = document.getElementsByClassName('Cell');
    for (let c = 0; c < cells.length; c++) {      
      cells[c].style.backgroundColor = cellColor.background;
    }    
  }

  const changeHeadText = () => {
    let text = document.getElementsByClassName('headText');
    for (let i = 0; i < text.length; i++) {
      text[i].style.color = headTextColor.background;      
    }
  }

  const changeCellText = () => {
    let text = document.getElementsByClassName('cellText');
    for (let i = 0; i < text.length; i++) {
      text[i].style.color = cellTextColor.background;      
    }
  }

  return (
    <div className="App">
      <br></br>
      <input placeholder="First name:" name="firstname" value={person.firstname} onChange={inputPerson} />
      <input placeholder="Last name:" name="lastname" value={person.lastname} onChange={inputPerson}/>
      <input placeholder="Age:" name="age" value={person.age} onChange={inputPerson}/>
      <button onClick={addPerson}>Add person</button><br></br>     
      <br></br> 
      <table id='content'>
        <tbody>
          <tr id='head'>
            <th className='Head'> <font className='headText' color={headTextColor}>First name <button onClick={() => sort('firstname','ASC')}>↑</button> <button onClick={() => sort('firstname','DESC')}>↓</button> </font></th> 
            <th className='Head'> <font className='headText' color={headTextColor}>Last name <button onClick={() => sort('lastname','ASC')}>↑</button> <button onClick={() => sort('lastname','DESC')}>↓</button> </font ></th> 
            <th className='Head'> <font className='headText' color={headTextColor}>Age <button onClick={() => sort('age','ASC')}>↑</button> <button onClick={() => sort('age','DESC')}>↓</button> </font></th>
          </tr>
            {
              people.map((person, index) => 
                <tr key={index}>
                  <td className='Cell'> <font className='cellText' color={cellTextColor}>{person.firstname}</font></td>
                  <td className='Cell'> <font className='cellText' color={cellTextColor}>{person.lastname}</font> </td>
                  <td className='Cell'> <font className='cellText' color={cellTextColor}>{person.age}</font></td>
                  <button onClick={() => deletePerson(person.id)}>Delete</button>
                  <button onClick={() => editPerson(person.id, person)}>Edit</button>
                </tr>)
            }
        </tbody>
      </table>
      <br></br>
      <br></br>
      <div className='ChangeBox'>
        <table>
          <tbody>
            <tr><p>Table head text color:</p> <CompactPicker color={ headTextColor.background } onChangeComplete={ handleHeadTextColor }></CompactPicker> <button onClick={changeHeadText}>Apply</button> </tr>
            <tr><p>Table cells text color:</p> <CompactPicker color={ cellTextColor.background } onChangeComplete={ handleCellTextColor }></CompactPicker> <button onClick={changeCellText}>Apply</button> </tr>
            <tr><p>Table borders width:</p> <input id='size' type="range" min="0" max="5" list="rangeList" onChange={handleBorderSize}/> <button onClick={changeBorder}>Apply</button></tr>
            <tr><p>Head cells color:</p> <CompactPicker color={ headCellColor.background } onChangeComplete={ handleHeadColor } ></CompactPicker> <button onClick={changeHead}>Apply</button> </tr>
            <tr><p>Cells color:</p> <CompactPicker color={ cellColor.background } onChangeComplete={ handleCellColor }></CompactPicker> <button onClick={changeCell}>Apply</button> </tr>
          </tbody>
        </table>                         
      </div>
    </div>
  );
}




export default App;
