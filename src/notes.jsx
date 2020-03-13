import React, { useReducer, useContext, useState } from 'react'
import { CountContext } from './App'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Scrollbars } from 'react-custom-scrollbars'
import EditorJs from 'react-editor-js';
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'



function Notes(props) {
  const { state, dispatch } = useContext(CountContext)
  
  let newState = state.notes.map(el =>
    <div onClick={() => dispatch({ type: 'setToggle', id: el.id })} className={`notesName${el.toggle ? '-active' : ''}`} >
      <div className='notestitle'>
        <span> {el.name} </span>
       
        <i onClick={() => {  dispatch({ type: 'deleteNote', id: el.id }); setTimeout(() => {dispatch({ type: 'autoSetToggle' })
        }, 0,1);   } }class="material-icons">delete</i>
      </div>
      <span className='unnderText'>{el.unnderText} </span>
    </div>)
  console.log(props.idsaver)


  let rightBar = state.notes.map(el =>
    <div >
      {el.toggle
        ?
        <div className='bigNote'>
          <div className='rightBarTitle'>
            <span>
              <i class="material-icons">border_color</i>
              <input type="text" onChange={e => dispatch({ type: 'changeTitle', text: e.target.value, id: el.id })} value={el.name} />
            </span>
          </div>

          <CKEditor className='editor'
            onChange={(e, editor) => dispatch({ type: 'setValue', Text: editor.getData(), id: el.id })}
            data={el.text}
            editor={ClassicEditor}
          />

        </div>
        : null}  </div>)

  return (


    <div className='main'>

      <Scrollbars style={{ width: 300, height: 820 }}>
        <div className='mininote'>

          {state.toggleInput ? <Button onClick={() => dispatch({ type: 'getInput' })} className='button' variant="primary">New Note</Button> : <div> <Button onClick={() => dispatch({ type: 'getInput' })} className='button' variant="primary">CANCEL</Button>  <input onChange={e => dispatch({ type: 'setTitle', text: e.target.value })} placeholder='Enter note title' className='button' type="text" />   <Button onClick={() =>{ dispatch({ type: 'setToggle', id:'s' }); dispatch({ type: 'AddNewNote' })}} className='button' variant="outline-success">SUBMIT NOTE</Button> </div>}

          {newState}

        </div>
      </Scrollbars>


      <div className='biginote'>
        {rightBar}

      </div>
    </div>
  )

}

export default Notes
