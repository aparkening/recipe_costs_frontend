class App{

  // Initialize
  constructor(){
    this.adapter = new BaseAdapter()
    this.initBindingsandEventListeners()

    // Instantiate Alert Manager
    this.alertManager = new Alert(this.alertContainer)

    // Map routes with stringId: pageManager
    this.router = new Router({
        'welcome': new WelcomePage(this.pageContainer, this.adapter),
        'recipes': new RecipePage(this.pageContainer, this.adapter),
        // 'recipe': new RecipePage(this.pageContainer, this.adapter),
        'ingredients': new IngredientPage(this.pageContainer, this.adapter)
    })

    // Instantiate Navbar
    const navbar = new Navbar(this.navbarContainer, this.adapter)

    // Assign Alert, Navbar
    this.router.assignAlertHandler(this.handleAlert.bind(this))
    this.router.assignNavbar(navbar)

    // Define redirect passed to pageManager
    this.router.assignRedirect(this.pageManagerRedirect.bind(this))

    // Render initial screen
    this.renderPage('welcome')
  }

  // Bindings and Listeners
  initBindingsandEventListeners(){
    this.container = document.querySelector('#container')
    this.navbarContainer = document.querySelector('#navbar-container')
    this.pageContainer = document.querySelector('#page-container')
    this.alertsContainer = document.querySelector('#alert-container')
  }

  // Render Alerts
  handleAlert(msg, type, timeout = 5000){
    this.alertManager.render(msg, type, timeout)
  }

  // Redirect based on router callback
  pageManagerRedirect(page){
      this.renderPage(page)
  }

  // Render page via router
  renderPage(page){
      this.router.render(page)
  }

}