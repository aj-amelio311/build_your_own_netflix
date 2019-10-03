import React from 'react'
import { render } from 'react-dom'
import App from './components/App'


// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div')

root.id = 'root'
document.body.appendChild(root)
document.title = "FilmHub"

var meta = document.createElement('meta');
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1";
document.getElementsByTagName('head')[0].appendChild(meta);

// Now we can render our application into it
render(<App />, document.getElementById('root'))
