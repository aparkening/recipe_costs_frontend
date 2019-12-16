class App{

  // Initialize
  constructor(){
    this.initBindingsandEventListeners()
    this.renderPage(new PageTypeSpecificClass(this.pageContainer))
  }

  // Bindings and Listeners
  initBindingsandEventListeners(){
    this.container = document.querySelector('#container')
    this.navbarContainer = document.querySelector('#navbar-container')
    this.pageContainer = document.querySelector('#page-container')
    this.alertsContainer = document.querySelector('#alerts-container')


  }

  // Renderer
  renderPage(page){
    page.render()

  }

}