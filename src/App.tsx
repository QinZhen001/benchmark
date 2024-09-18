// import { useState } from 'react'
import { State } from './types'
import Upload from "./components/upload"

import './index.css'
import { useAppSelector } from './common'




function App() {
  const state = useAppSelector(state => state.global.state)

  return (
    <div className='center-wrapper'>
      <section className='text-wrapper'>
        <div className='top-text'>Agora Demo</div>
        <div className='bottom-text'>Offline Speech-To-Text</div>
      </section>
      {state === State.Uploading ? <Upload></Upload> : null}
    </div >
  )
}

export default App
