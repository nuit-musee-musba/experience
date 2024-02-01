import Transition from './transition'

const transition = new Transition();

const button = document.getElementById('button')
const section1 = document.getElementById('section-1')
const section2 = document.getElementById('section-2')
const section3 = document.getElementById('section-3')

if(button){
    button.addEventListener('click', () => transition.handleTransition())
}
if(section1){
    section1.style.display = 'none'
}

if(section2){
    section2.style.display = 'none'
}

if(section3){
    section3.style.display = 'none'
}
