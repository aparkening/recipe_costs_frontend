class Router{

  // Set dynamic routes as stringId: pageManager
  constructor(kvpairs){
    this.routes = kvpairs
  }

  // Set main page
  set rootPage(rootPageKey){
    this.rootPage = this.routes[rootPageKey]
  }

  // Render page via the pageManager's render method
  render(page, obj){
    this.routes[page].render()
    
    // Render nav with each page if it exists
    if(this.navbar){ this.navbar.render() }
    // console.log("Router.js navbar rendered")

    // If object param, set currentObj
    if(obj){this.routes[page].currentObj = obj}

    // Track currentPage for navbar
    this.currentPage = page

    // console.log(`Router.js currentPage set to ${this.currentPage}`)
  }
  
  // Set callbacks for use in redirects, alerts, etc.
  assignCallback(callback, name){
    // For each key in route's kvpair, set callback
    for(let route in this.routes){
        this.routes[route][name] = callback
    }
    if(this.navbar){ this.navbar.redirect = callback }
  }

  // Define redirects via assignCallback()
  assignRedirect(callback){
    this.assignCallback(callback, 'redirect')
  }

  // Define alerts via assignCallback()
  assignAlertHandler(callback){
    this.assignCallback(callback, 'handleAlert')
  }

  // Define navbar for each page
  assignNavbar(navbar){
    this.navbar = navbar
    
    // Track currentPage for navbar manager
    this.navbar.currentPage = () => {
        return this.currentPage
    }
  }

}