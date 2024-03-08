import { Router } from 'vue-router'
import { setupLoginGuard } from './LoginGuard'
import { setupRouteGuard } from './RouteGuard'
import { setupPageLoadingProcessGuard } from './PageLoadingProcessGuard'

export function setupGuard(router: Router) {
  setupPageLoadingProcessGuard(router)
  setupLoginGuard(router)
  setupRouteGuard(router)
}
