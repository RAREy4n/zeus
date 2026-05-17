import './style.css'
import './menu/menu-styles.css'
import { App } from './ui/app'
import { MenuManager } from './menu/menu-manager'
import { AudioManager } from './audio/audio-manager'

const root = document.getElementById('app')
if (!root) {
  throw new Error('#app não encontrado no HTML')
}

// Lê o childId da URL (?childId=xxx) — passado pelo frontend principal
const params = new URLSearchParams(window.location.search)
const childId = params.get('childId') ?? undefined

// Inicializar sistema de áudio
const audioManager = AudioManager.getInstance()

// Criar instância do jogo passando o childId
const app = new App(childId)

// Criar gerenciador de menu com callbacks
const menuManager = new MenuManager({
  onStartGame: () => {
    app.mount(root)
  },
  onShowLeaderboard: () => {
    menuManager.showLeaderboard()
  },
  onShowSettings: () => {
    menuManager.showSettings()
  },
  onBackToMenu: () => {
    menuManager.showMainMenu()
  },
})

// Montar menu principal
menuManager.mount(root)

;(async () => {
  await audioManager.initialize()
  audioManager.playMusic('theme')

  const ensureMusic = () => {
    audioManager.playMusic('theme')
    document.removeEventListener('click', ensureMusic)
    document.removeEventListener('keydown', ensureMusic)
    document.removeEventListener('touchstart', ensureMusic)
  }
  document.addEventListener('click', ensureMusic)
  document.addEventListener('keydown', ensureMusic)
  document.addEventListener('touchstart', ensureMusic)
})()