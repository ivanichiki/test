import React, { useReducer, useEffect, useState } from 'react';
import './App.css';
import Notes from './notes'
import firebase from './firestore'
import debounce from 'debounce'


function removeHTMLTags(str) {
  return str.replace(/(<([^>]+)>)/gm, '')
}

function kitcut(text, limit) {
  text = text.trim();
  if (text.length <= limit) return text;

  text = text.slice(0, limit);

  return text.trim() + "...";
}

export const CountContext = React.createContext(null)

function App() {
  React.useEffect(() => {
    const fetchData = async () => {

      const db = firebase.firestore();
      const data = await db.collection('Istate').get();
      dispatch({ type: 'setIstate', value: data.docs.map(doc => ({ ...doc.data(), id: doc.id })) })

    };
    fetchData()

  }, [])

  const onUpdate = (id, toggle, name, text, unnderText) => {

    firebase.firestore().collection('Istate').doc(id).set({ id, name, toggle, text, unnderText })

  }
  const deleteNote = (id) => {
    firebase.firestore().collection('Istate').doc(id).delete()
  }

  const [idsaver, setidsaver] = useState('')

  const initialState = { notes: [{ name: '' }], toggleInput: true, title: '', idsaver: '', prevIdSaver: '' }
  const counterReducer = (state, action) => {
    switch (action.type) {

      case 'setIstate':
        console.log(action.value)
        return {
          ...state,
          notes: action.value
        }
      case 'setToggle':
        console.log(action.id)
        return {
          ...state,
          notes: state.notes.map(el => {
            if (el.id === action.id) {

              onUpdate(el.id, true, el.name, el.text, el.unnderText)
              return { ...el, toggle: true }

            }
            onUpdate(el.id, false, el.name, el.text, el.unnderText)
            return { ...el, toggle: false };
          })

        }
      case 'autoSetToggle':

        let p = 1;
        return {
          ...state,
          notes: state.notes.map(el => {
            if (p == state.notes.length) {

              return { ...el, toggle: true }
            }

            else { p++; return el }
          })
        }
      case 'getInput': {
        return {
          ...state,
          toggleInput: !state.toggleInput
        }
      }
      case 'setTitle': {
        return {
          ...state,
          title: action.text
        }
      }
      case 'changeTitle': {

        return {
          ...state,

          notes: state.notes.map(el => {

            if (el.id === action.id) {
              console.log('hui')
              let update = debounce(() => onUpdate(el.id, el.toggle, action.text, el.text, el.unnderText), 1500)
              update()
              return { ...el, name: action.text }
            }
            return el
          })
        }
      }
      case 'AddNewNote': {
        let i = String(Date.now())

        let newNote = {
          name: state.title,
          id: i,
          toggle: true,
          text: '',
          unnderText: ''

        }
        onUpdate(i, false, state.title, '', '')
        return {
          ...state,
          toggleInput: true,
          notes: [...state.notes, newNote]
        }
      }
      case 'deleteNote': {
        deleteNote(action.id)
        return {
          ...state,
          notes: state.notes.filter(el =>
            el.id !== action.id
          )
        }
      }
      case 'setValue': {
        return {
          ...state,
          notes: state.notes.map(el => {
            if (el.id === action.id) {
              let unnderText = kitcut(removeHTMLTags(action.Text), 20)
              onUpdate(el.id, el.toggle, el.name, action.Text, unnderText)
              return { ...el, text: action.Text, unnderText: unnderText }
            }
            return el
          })
        }
      }

      default:
        return state;

    }
  }

  const [state, dispatch] = useReducer(counterReducer, initialState)
  console.log(idsaver)
  return (
    <CountContext.Provider
      value={{ state, dispatch }}>
      <div className="App">

        <Notes idsaver={idsaver} />

      </div>
    </CountContext.Provider>
  );
}

export default App;
